import { http } from "msw";

import { TASK_PRIORITY, TASK_STATUS } from "@/constants";

import type { MockTask } from "../fixtures/tasks";

import { canAccessProject, isProjectOwner, withAuth } from "../utils/auth";
import { PROJECTS_BASE_URL, TASKS_BASE_URL } from "../utils/constants";
import { delay } from "../utils/delay";
import {
  ERROR_CODES,
  ERROR_MESSAGES,
  errorResponse,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
  successResponse,
} from "../utils/responses";
import { mswStore } from "../utils/store-persistence";

/* =========================================================
   Handlers
========================================================= */

// ── GET /api/projects/:id/tasks ─────────────────────────────────────────────
const getTasksByProject = http.get(
  `${PROJECTS_BASE_URL}/:id/tasks`,
  withAuth(async ({ user, params }) => {
    await delay();

    const projectId = params.id as string;
    const project = mswStore.findProjectById(projectId);

    if (!project) {
      return errorResponse({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: ERROR_MESSAGES.PROJECT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    if (!canAccessProject(user.id, user.role, projectId)) {
      return errorResponse({
        code: ERROR_CODES.FORBIDDEN,
        message: ERROR_MESSAGES.FORBIDDEN,
        status: HTTP_STATUS.FORBIDDEN,
      });
    }

    const tasks = mswStore.getTasksByProject(projectId);

    return successResponse({
      data: tasks,
      message: SUCCESS_MESSAGES.TASKS_FETCHED,
    });
  }),
);

// ── GET /api/tasks/my ───────────────────────────────────────────────────────
const getMyTasks = http.get(
  `${TASKS_BASE_URL}/my`,
  withAuth(async ({ user }) => {
    await delay();

    const tasks = mswStore.getTasksByAssignee(user.id);

    return successResponse({
      data: tasks,
      message: SUCCESS_MESSAGES.TASKS_FETCHED,
    });
  }),
);

// ── GET /api/tasks/:id ──────────────────────────────────────────────────────
const getTask = http.get(
  `${TASKS_BASE_URL}/:id`,
  withAuth(async ({ user, params }) => {
    await delay();

    const id = params.id as string;
    const task = mswStore.findTaskById(id);

    if (!task) {
      return errorResponse({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: ERROR_MESSAGES.TASK_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    if (!canAccessProject(user.id, user.role, task.projectId)) {
      return errorResponse({
        code: ERROR_CODES.FORBIDDEN,
        message: ERROR_MESSAGES.FORBIDDEN,
        status: HTTP_STATUS.FORBIDDEN,
      });
    }

    return successResponse({
      data: task,
      message: SUCCESS_MESSAGES.TASK_FETCHED,
    });
  }),
);

// ── POST /api/tasks ─────────────────────────────────────────────────────────
const createTask = http.post(
  TASKS_BASE_URL,
  withAuth(async ({ user }, request) => {
    await delay();

    const body = await request.json() as Record<string, unknown>;
    const { projectId, title, description, status, priority, assigneeId, sprintId } = body;

    if (!projectId || !title) {
      return errorResponse({
        code: ERROR_CODES.VALIDATION_ERROR,
        message: ERROR_MESSAGES.REQUIRED_FIELDS,
        status: HTTP_STATUS.BAD_REQUEST,
      });
    }

    const project = mswStore.findProjectById(projectId as string);

    if (!project) {
      return errorResponse({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: ERROR_MESSAGES.PROJECT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    if (!isProjectOwner(user.id, user.role, projectId as string)) {
      return errorResponse({
        code: ERROR_CODES.FORBIDDEN,
        message: ERROR_MESSAGES.FORBIDDEN,
        status: HTTP_STATUS.FORBIDDEN,
      });
    }

    const taskStatus = (status as MockTask["status"]) ?? TASK_STATUS.TODO;

    // Place new task at the end of its status column
    const siblingCount = mswStore
      .getTasksByProject(projectId as string)
      .filter(t => t.status === taskStatus)
      .length;

    const now = new Date().toISOString();

    const newTask: MockTask = {
      id: `task_${crypto.randomUUID().slice(0, 6)}`,
      projectId: projectId as string,
      key: mswStore.getNextTaskKey(project.key),
      title: title as string,
      description: (description as string) ?? "",
      status: taskStatus,
      priority: (priority as MockTask["priority"]) ?? TASK_PRIORITY.MEDIUM,
      assigneeId: (assigneeId as string) ?? null,
      order: siblingCount,
      sprintId: (sprintId as string) ?? null,
      createdAt: now,
      updatedAt: now,
    };

    mswStore.addTask(newTask);

    return successResponse({
      data: newTask,
      message: SUCCESS_MESSAGES.TASK_CREATED,
      status: HTTP_STATUS.CREATED,
    });
  }),
);

// ── PATCH /api/tasks/:id ────────────────────────────────────────────────────
const updateTask = http.patch(
  `${TASKS_BASE_URL}/:id`,
  withAuth(async ({ user, params }, request) => {
    await delay();

    const id = params.id as string;
    const task = mswStore.findTaskById(id);

    if (!task) {
      return errorResponse({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: ERROR_MESSAGES.TASK_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    if (!canAccessProject(user.id, user.role, task.projectId)) {
      return errorResponse({
        code: ERROR_CODES.FORBIDDEN,
        message: ERROR_MESSAGES.FORBIDDEN,
        status: HTTP_STATUS.FORBIDDEN,
      });
    }

    const body = await request.json() as Record<string, unknown>;

    // Members/assignees can only update status and order (drag-and-drop)
    if (!isProjectOwner(user.id, user.role, task.projectId)) {
      const isAssignee = task.assigneeId === user.id;

      if (!isAssignee) {
        return errorResponse({
          code: ERROR_CODES.FORBIDDEN,
          message: ERROR_MESSAGES.FORBIDDEN,
          status: HTTP_STATUS.FORBIDDEN,
        });
      }

      // Strip all fields except status and order
      const allowed: Partial<MockTask> = {};
      if ("status" in body)
        allowed.status = body.status as MockTask["status"];
      if ("order" in body)
        allowed.order = body.order as number;

      mswStore.updateTask(id, {
        ...allowed,
        updatedAt: new Date().toISOString(),
      });

      return successResponse({
        data: mswStore.findTaskById(id)!,
        message: SUCCESS_MESSAGES.TASK_UPDATED,
      });
    }

    const allowed: Partial<MockTask> = {};
    if ("title" in body)
      allowed.title = body.title as string;
    if ("description" in body)
      allowed.description = body.description as string;
    if ("status" in body)
      allowed.status = body.status as MockTask["status"];
    if ("priority" in body)
      allowed.priority = body.priority as MockTask["priority"];
    if ("assigneeId" in body)
      allowed.assigneeId = (body.assigneeId as string) ?? null;
    if ("sprintId" in body)
      allowed.sprintId = (body.sprintId as string) ?? null;
    if ("order" in body)
      allowed.order = body.order as number;

    mswStore.updateTask(id, {
      ...allowed,
      updatedAt: new Date().toISOString(),
    });

    return successResponse({
      data: mswStore.findTaskById(id)!,
      message: SUCCESS_MESSAGES.TASK_UPDATED,
    });
  }),
);

// ── POST /api/tasks/reorder ─────────────────────────────────────────────────
const reorderTasks = http.post(
  `${TASKS_BASE_URL}/reorder`,
  withAuth(async ({ user }, request) => {
    await delay("fast");

    const { updates } = await request.json() as {
      updates: { id: string; status: string; order: number }[];
    };

    if (!Array.isArray(updates)) {
      return errorResponse({
        code: ERROR_CODES.VALIDATION_ERROR,
        message: ERROR_MESSAGES.UPDATES_ARRAY_REQUIRED,
        status: HTTP_STATUS.BAD_REQUEST,
      });
    }

    let updatedCount = 0;

    for (const update of updates) {
      const task = mswStore.findTaskById(update.id);

      if (!task)
        continue;
      if (!canAccessProject(user.id, user.role, task.projectId))
        continue;

      mswStore.updateTask(update.id, {
        status: update.status as MockTask["status"],
        order: update.order,
        updatedAt: new Date().toISOString(),
      });

      updatedCount++;
    }

    return successResponse({
      data: { updated: updatedCount },
      message: SUCCESS_MESSAGES.TASKS_REORDERED,
    });
  }),
);

// ── DELETE /api/tasks/:id ───────────────────────────────────────────────────
const deleteTask = http.delete(
  `${TASKS_BASE_URL}/:id`,
  withAuth(async ({ user, params }) => {
    await delay();

    const id = params.id as string;
    const task = mswStore.findTaskById(id);

    if (!task) {
      return errorResponse({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: ERROR_MESSAGES.TASK_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    if (!isProjectOwner(user.id, user.role, task.projectId)) {
      return errorResponse({
        code: ERROR_CODES.FORBIDDEN,
        message: ERROR_MESSAGES.FORBIDDEN,
        status: HTTP_STATUS.FORBIDDEN,
      });
    }

    mswStore.deleteTask(id);

    return successResponse({
      data: {},
      message: SUCCESS_MESSAGES.TASK_DELETED,
    });
  }),
);

export const taskHandlers = [
  getTasksByProject,
  getMyTasks,
  getTask,
  createTask,
  updateTask,
  reorderTasks,
  deleteTask,
];
