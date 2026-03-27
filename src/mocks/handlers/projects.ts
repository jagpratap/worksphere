import { http } from "msw";

import type { Project } from "@/types";

import { ROLES } from "@/constants";

import type { MockProject } from "../fixtures/projects";

import { sanitizeUser, withAuth, withRole } from "../utils/auth";
import { PROJECTS_BASE_URL } from "../utils/constants";
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

function withTaskCount(project: MockProject): Project {
  return {
    ...project,
    taskCount: mswStore.getTasksByProject(project.id).length,
  };
}

function canAccessProject(userId: string, role: string, project: MockProject): boolean {
  if (role === ROLES.ADMIN)
    return true;
  return project.ownerId === userId || project.memberIds.includes(userId);
}

function isProjectOwner(userId: string, role: string, project: MockProject): boolean {
  if (role === ROLES.ADMIN)
    return true;
  return project.ownerId === userId;
}

/* =========================================================
   Handlers
========================================================= */

// ── GET /api/projects ───────────────────────────────────────────────────────
const listProjects = http.get(
  PROJECTS_BASE_URL,
  withAuth(async ({ user }) => {
    await delay();

    const projects = mswStore.getProjects();

    const visible = projects.filter(p => canAccessProject(user.id, user.role, p));

    return successResponse({
      data: visible.map(withTaskCount),
      message: SUCCESS_MESSAGES.PROJECTS_FETCHED,
    });
  }),
);

// ── GET /api/projects/:id ───────────────────────────────────────────────────
const getProject = http.get(
  `${PROJECTS_BASE_URL}/:id`,
  withAuth(async ({ user, params }) => {
    await delay();

    const id = params.id as string;
    const project = mswStore.findProjectById(id);

    if (!project) {
      return errorResponse({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: ERROR_MESSAGES.PROJECT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    if (!canAccessProject(user.id, user.role, project)) {
      return errorResponse({
        code: ERROR_CODES.FORBIDDEN,
        message: ERROR_MESSAGES.FORBIDDEN,
        status: HTTP_STATUS.FORBIDDEN,
      });
    }

    const owner = mswStore.findUserById(project.ownerId);
    const members = project.memberIds
      .map(mid => mswStore.findUserById(mid))
      .filter(Boolean);

    const tasks = mswStore.getTasksByProject(project.id);

    return successResponse({
      data: {
        ...withTaskCount(project),
        owner: owner ? sanitizeUser(owner) : null,
        members: members.map(m => sanitizeUser(m!)),
        tasks,
      },
      message: SUCCESS_MESSAGES.PROJECT_FETCHED,
    });
  }),
);

// ── POST /api/projects ──────────────────────────────────────────────────────
const createProject = http.post(
  PROJECTS_BASE_URL,
  withRole([ROLES.ADMIN, ROLES.MANAGER], async ({ user }, request) => {
    await delay();

    const body = await request.json() as Record<string, unknown>;
    const { name, key, description, status, color, memberIds } = body;

    if (!name || !key) {
      return errorResponse({
        code: ERROR_CODES.VALIDATION_ERROR,
        message: ERROR_MESSAGES.REQUIRED_FIELDS,
        status: HTTP_STATUS.BAD_REQUEST,
      });
    }

    const existing = mswStore.getProjects().find(p => p.key === key);
    if (existing) {
      return errorResponse({
        code: ERROR_CODES.RESOURCE_EXISTS,
        message: ERROR_MESSAGES.PROJECT_KEY_TAKEN,
        status: HTTP_STATUS.CONFLICT,
      });
    }

    const now = new Date().toISOString();

    const newProject: MockProject = {
      id: `proj_${crypto.randomUUID().slice(0, 6)}`,
      name: name as string,
      key: (key as string).toUpperCase(),
      description: (description as string) ?? "",
      status: (status as MockProject["status"]) ?? "planning",
      color: (color as MockProject["color"]) ?? "blue",
      ownerId: user.id,
      memberIds: (memberIds as string[]) ?? [],
      createdAt: now,
      updatedAt: now,
    };

    mswStore.addProject(newProject);

    return successResponse({
      data: withTaskCount(newProject),
      message: SUCCESS_MESSAGES.PROJECT_CREATED,
      status: HTTP_STATUS.CREATED,
    });
  }),
);

// ── PATCH /api/projects/:id ─────────────────────────────────────────────────
const updateProject = http.patch(
  `${PROJECTS_BASE_URL}/:id`,
  withAuth(async ({ user, params }, request) => {
    await delay();

    const id = params.id as string;
    const project = mswStore.findProjectById(id);

    if (!project) {
      return errorResponse({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: ERROR_MESSAGES.PROJECT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    if (!isProjectOwner(user.id, user.role, project)) {
      return errorResponse({
        code: ERROR_CODES.FORBIDDEN,
        message: ERROR_MESSAGES.FORBIDDEN,
        status: HTTP_STATUS.FORBIDDEN,
      });
    }

    const body = await request.json() as Record<string, unknown>;

    // Prevent key collision on rename
    if (body.key) {
      const keyTaken = mswStore
        .getProjects()
        .find(p => p.key === (body.key as string).toUpperCase() && p.id !== id);

      if (keyTaken) {
        return errorResponse({
          code: ERROR_CODES.RESOURCE_EXISTS,
          message: ERROR_MESSAGES.PROJECT_KEY_TAKEN,
          status: HTTP_STATUS.CONFLICT,
        });
      }

      body.key = (body.key as string).toUpperCase();
    }

    mswStore.updateProject(id, {
      ...body,
      updatedAt: new Date().toISOString(),
    } as Partial<MockProject>);

    const updated = mswStore.findProjectById(id)!;

    return successResponse({
      data: withTaskCount(updated),
      message: SUCCESS_MESSAGES.PROJECT_UPDATED,
    });
  }),
);

// ── DELETE /api/projects/:id ────────────────────────────────────────────────
const deleteProject = http.delete(
  `${PROJECTS_BASE_URL}/:id`,
  withAuth(async ({ user, params }) => {
    await delay();

    const id = params.id as string;
    const project = mswStore.findProjectById(id);

    if (!project) {
      return errorResponse({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: ERROR_MESSAGES.PROJECT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    if (!isProjectOwner(user.id, user.role, project)) {
      return errorResponse({
        code: ERROR_CODES.FORBIDDEN,
        message: ERROR_MESSAGES.FORBIDDEN,
        status: HTTP_STATUS.FORBIDDEN,
      });
    }

    mswStore.deleteTasksByProject(id);
    mswStore.deleteProject(id);

    return successResponse({
      data: {},
      message: SUCCESS_MESSAGES.PROJECT_DELETED,
    });
  }),
);

export const projectHandlers = [
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
];
