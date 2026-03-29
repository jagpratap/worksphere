import { http } from "msw";

import { SPRINT_STATUS, TASK_STATUS } from "@/constants";

import type { MockSprint } from "../fixtures/sprints";

import { canAccessProject, isProjectOwner, withAuth } from "../utils/auth";
import { PROJECTS_BASE_URL, SPRINTS_BASE_URL } from "../utils/constants";
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
   Helpers
========================================================= */

function withStats(sprint: MockSprint) {
  const tasks = mswStore.getTasks().filter(t => t.sprintId === sprint.id);
  return {
    ...sprint,
    taskCount: tasks.length,
    completedCount: tasks.filter(t => t.status === TASK_STATUS.DONE).length,
  };
}

/* =========================================================
   Handlers
========================================================= */

// ── GET /api/projects/:id/sprints ──────────────────────────────────────────
const getSprintsByProject = http.get(
  `${PROJECTS_BASE_URL}/:id/sprints`,
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

    const sprints = mswStore.getSprintsByProject(projectId).map(withStats);

    return successResponse({
      data: sprints,
      message: SUCCESS_MESSAGES.SPRINTS_FETCHED,
    });
  }),
);

// ── POST /api/sprints ──────────────────────────────────────────────────────
const createSprint = http.post(
  SPRINTS_BASE_URL,
  withAuth(async ({ user }, request) => {
    await delay();

    const body = await request.json() as Record<string, unknown>;
    const { projectId, name, goal, status, startDate, endDate } = body;

    if (!projectId || !name || !startDate || !endDate) {
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

    const sprintStatus = (status as MockSprint["status"]) ?? SPRINT_STATUS.PLANNING;

    // Enforce max 1 active sprint per project
    if (sprintStatus === SPRINT_STATUS.ACTIVE) {
      const hasActive = mswStore.getSprintsByProject(projectId as string)
        .some(s => s.status === SPRINT_STATUS.ACTIVE);
      if (hasActive) {
        return errorResponse({
          code: ERROR_CODES.VALIDATION_ERROR,
          message: ERROR_MESSAGES.ACTIVE_SPRINT_EXISTS,
          status: HTTP_STATUS.CONFLICT,
        });
      }
    }

    const now = new Date().toISOString();

    const newSprint: MockSprint = {
      id: `sprint_${crypto.randomUUID().slice(0, 6)}`,
      projectId: projectId as string,
      name: name as string,
      goal: (goal as string) ?? "",
      status: sprintStatus,
      startDate: startDate as string,
      endDate: endDate as string,
      createdAt: now,
      updatedAt: now,
    };

    mswStore.addSprint(newSprint);

    return successResponse({
      data: withStats(newSprint),
      message: SUCCESS_MESSAGES.SPRINT_CREATED,
      status: HTTP_STATUS.CREATED,
    });
  }),
);

// ── PATCH /api/sprints/:id ─────────────────────────────────────────────────
const updateSprint = http.patch(
  `${SPRINTS_BASE_URL}/:id`,
  withAuth(async ({ user, params }, request) => {
    await delay();

    const id = params.id as string;
    const sprint = mswStore.findSprintById(id);

    if (!sprint) {
      return errorResponse({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: ERROR_MESSAGES.SPRINT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    if (!isProjectOwner(user.id, user.role, sprint.projectId)) {
      return errorResponse({
        code: ERROR_CODES.FORBIDDEN,
        message: ERROR_MESSAGES.FORBIDDEN,
        status: HTTP_STATUS.FORBIDDEN,
      });
    }

    const body = await request.json() as Record<string, unknown>;

    // Enforce max 1 active sprint per project
    if ("status" in body && body.status === SPRINT_STATUS.ACTIVE && sprint.status !== SPRINT_STATUS.ACTIVE) {
      const hasActive = mswStore.getSprintsByProject(sprint.projectId)
        .some(s => s.status === SPRINT_STATUS.ACTIVE && s.id !== id);
      if (hasActive) {
        return errorResponse({
          code: ERROR_CODES.VALIDATION_ERROR,
          message: ERROR_MESSAGES.ACTIVE_SPRINT_EXISTS,
          status: HTTP_STATUS.CONFLICT,
        });
      }
    }

    const allowed: Partial<MockSprint> = {};
    if ("name" in body)
      allowed.name = body.name as string;
    if ("goal" in body)
      allowed.goal = body.goal as string;
    if ("status" in body)
      allowed.status = body.status as MockSprint["status"];
    if ("startDate" in body)
      allowed.startDate = body.startDate as string;
    if ("endDate" in body)
      allowed.endDate = body.endDate as string;

    mswStore.updateSprint(id, {
      ...allowed,
      updatedAt: new Date().toISOString(),
    });

    return successResponse({
      data: withStats(mswStore.findSprintById(id)!),
      message: SUCCESS_MESSAGES.SPRINT_UPDATED,
    });
  }),
);

// ── DELETE /api/sprints/:id ────────────────────────────────────────────────
const deleteSprint = http.delete(
  `${SPRINTS_BASE_URL}/:id`,
  withAuth(async ({ user, params }) => {
    await delay();

    const id = params.id as string;
    const sprint = mswStore.findSprintById(id);

    if (!sprint) {
      return errorResponse({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: ERROR_MESSAGES.SPRINT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    if (!isProjectOwner(user.id, user.role, sprint.projectId)) {
      return errorResponse({
        code: ERROR_CODES.FORBIDDEN,
        message: ERROR_MESSAGES.FORBIDDEN,
        status: HTTP_STATUS.FORBIDDEN,
      });
    }

    // Unset sprintId on related tasks
    const tasks = mswStore.getTasks().filter(t => t.sprintId === id);
    for (const task of tasks) {
      mswStore.updateTask(task.id, { sprintId: null });
    }

    mswStore.deleteSprint(id);

    return successResponse({
      data: {},
      message: SUCCESS_MESSAGES.SPRINT_DELETED,
    });
  }),
);

export const sprintHandlers = [
  getSprintsByProject,
  createSprint,
  updateSprint,
  deleteSprint,
];
