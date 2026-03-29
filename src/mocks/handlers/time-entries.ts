import { http } from "msw";

import type { MockTimeEntry } from "../fixtures/time-entries";

import { withAuth } from "../utils/auth";
import { TIME_ENTRIES_BASE_URL } from "../utils/constants";
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

function enrichWithTask(entry: MockTimeEntry) {
  const task = mswStore.findTaskById(entry.taskId);
  return {
    ...entry,
    taskKey: task?.key ?? null,
    taskTitle: task?.title ?? null,
  };
}

/* =========================================================
   Handlers
========================================================= */

// ── GET /api/time-entries/my ──────────────────────────────────────────────
const getMyTimeEntries = http.get(
  `${TIME_ENTRIES_BASE_URL}/my`,
  withAuth(async ({ user }) => {
    await delay();

    const entries = mswStore
      .getTimeEntriesByUser(user.id)
      .map(enrichWithTask);

    return successResponse({
      data: entries,
      message: SUCCESS_MESSAGES.TIME_ENTRIES_FETCHED,
    });
  }),
);

// ── POST /api/time-entries ────────────────────────────────────────────────
const createTimeEntry = http.post(
  TIME_ENTRIES_BASE_URL,
  withAuth(async ({ user }, request) => {
    await delay();

    const body = await request.json() as Record<string, unknown>;
    const { taskId, minutes, date, description } = body;

    if (!taskId || !minutes || !date) {
      return errorResponse({
        code: ERROR_CODES.VALIDATION_ERROR,
        message: ERROR_MESSAGES.REQUIRED_FIELDS,
        status: HTTP_STATUS.BAD_REQUEST,
      });
    }

    const task = mswStore.findTaskById(taskId as string);

    if (!task) {
      return errorResponse({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: ERROR_MESSAGES.TASK_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    const now = new Date().toISOString();

    const newEntry: MockTimeEntry = {
      id: `time_${crypto.randomUUID().slice(0, 6)}`,
      taskId: taskId as string,
      userId: user.id,
      projectId: task.projectId,
      minutes: minutes as number,
      description: (description as string) ?? "",
      date: date as string,
      createdAt: now,
      updatedAt: now,
    };

    mswStore.addTimeEntry(newEntry);

    return successResponse({
      data: enrichWithTask(newEntry),
      message: SUCCESS_MESSAGES.TIME_ENTRY_CREATED,
      status: HTTP_STATUS.CREATED,
    });
  }),
);

// ── PATCH /api/time-entries/:id ───────────────────────────────────────────
const updateTimeEntry = http.patch(
  `${TIME_ENTRIES_BASE_URL}/:id`,
  withAuth(async ({ user, params }, request) => {
    await delay();

    const id = params.id as string;
    const entry = mswStore.findTimeEntryById(id);

    if (!entry) {
      return errorResponse({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: ERROR_MESSAGES.TIME_ENTRY_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    // Owner-only
    if (entry.userId !== user.id) {
      return errorResponse({
        code: ERROR_CODES.FORBIDDEN,
        message: ERROR_MESSAGES.FORBIDDEN,
        status: HTTP_STATUS.FORBIDDEN,
      });
    }

    const body = await request.json() as Record<string, unknown>;

    const allowed: Partial<MockTimeEntry> = {};
    if ("taskId" in body) {
      const task = mswStore.findTaskById(body.taskId as string);
      if (!task) {
        return errorResponse({
          code: ERROR_CODES.RESOURCE_NOT_FOUND,
          message: ERROR_MESSAGES.TASK_NOT_FOUND,
          status: HTTP_STATUS.NOT_FOUND,
        });
      }
      allowed.taskId = body.taskId as string;
      allowed.projectId = task.projectId;
    }
    if ("minutes" in body)
      allowed.minutes = body.minutes as number;
    if ("date" in body)
      allowed.date = body.date as string;
    if ("description" in body)
      allowed.description = body.description as string;

    mswStore.updateTimeEntry(id, {
      ...allowed,
      updatedAt: new Date().toISOString(),
    });

    return successResponse({
      data: enrichWithTask(mswStore.findTimeEntryById(id)!),
      message: SUCCESS_MESSAGES.TIME_ENTRY_UPDATED,
    });
  }),
);

// ── DELETE /api/time-entries/:id ──────────────────────────────────────────
const deleteTimeEntry = http.delete(
  `${TIME_ENTRIES_BASE_URL}/:id`,
  withAuth(async ({ user, params }) => {
    await delay();

    const id = params.id as string;
    const entry = mswStore.findTimeEntryById(id);

    if (!entry) {
      return errorResponse({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: ERROR_MESSAGES.TIME_ENTRY_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    // Owner-only
    if (entry.userId !== user.id) {
      return errorResponse({
        code: ERROR_CODES.FORBIDDEN,
        message: ERROR_MESSAGES.FORBIDDEN,
        status: HTTP_STATUS.FORBIDDEN,
      });
    }

    mswStore.deleteTimeEntry(id);

    return successResponse({
      data: {},
      message: SUCCESS_MESSAGES.TIME_ENTRY_DELETED,
    });
  }),
);

export const timeEntryHandlers = [
  getMyTimeEntries,
  createTimeEntry,
  updateTimeEntry,
  deleteTimeEntry,
];
