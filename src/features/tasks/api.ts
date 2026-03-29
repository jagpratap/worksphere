import type {
  ApiSuccessResponse,
  Task,
} from "@/types";

import { baseApi } from "@/store/base-api";

import type {
  CreateTaskInput,
  ReorderTasksRequest,
  ReorderTasksResponse,
  UpdateTaskInput,
} from "./types";

const tasksApi = baseApi
  .enhanceEndpoints({ addTagTypes: ["Projects", "Tasks"] })
  .injectEndpoints({
    endpoints: builder => ({
      // ── GET /api/projects/:id/tasks ────────────────────────────────────────
      getTasksByProject: builder.query<Task[], string>({
        query: projectId => `/projects/${projectId}/tasks`,
        transformResponse: (res: ApiSuccessResponse<Task[]>) => res.data,
        providesTags: (result) => {
          const list = { type: "Tasks" as const, id: "LIST" };
          const items = result?.map(({ id }) => ({ type: "Tasks" as const, id })) ?? [];

          return [...items, list];
        },
      }),

      // ── GET /api/tasks/my ─────────────────────────────────────────────────
      getMyTasks: builder.query<Task[], void>({
        query: () => "/tasks/my",
        transformResponse: (res: ApiSuccessResponse<Task[]>) => res.data,
        providesTags: (result) => {
          const list = { type: "Tasks" as const, id: "LIST" };
          const items = result?.map(({ id }) => ({ type: "Tasks" as const, id })) ?? [];

          return [...items, list];
        },
      }),

      // ── GET /api/tasks/:id ────────────────────────────────────────────────
      getTask: builder.query<Task, string>({
        query: id => `/tasks/${id}`,
        transformResponse: (res: ApiSuccessResponse<Task>) => res.data,
        providesTags: (_result, _error, id) => [
          { type: "Tasks" as const, id },
        ],
      }),

      // ── POST /api/tasks ───────────────────────────────────────────────────
      createTask: builder.mutation<ApiSuccessResponse<Task>, CreateTaskInput>({
        query: body => ({
          url: "/tasks",
          method: "POST",
          body,
        }),
        invalidatesTags: (_result, _error, { projectId }) => [
          { type: "Tasks", id: "LIST" },
          { type: "Projects", id: projectId },
        ],
      }),

      // ── PATCH /api/tasks/:id ──────────────────────────────────────────────
      updateTask: builder.mutation<ApiSuccessResponse<Task>, { id: string } & UpdateTaskInput>({
        query: ({ id, ...body }) => ({
          url: `/tasks/${id}`,
          method: "PATCH",
          body,
        }),
        invalidatesTags: (result) => {
          const item = result?.data ? { type: "Tasks" as const, id: result.data.id } : null;

          return item ? [item] : [];
        },
      }),

      // ── POST /api/tasks/reorder ───────────────────────────────────────────
      reorderTasks: builder.mutation<ApiSuccessResponse<ReorderTasksResponse>, ReorderTasksRequest>({
        query: body => ({
          url: "/tasks/reorder",
          method: "POST",
          body,
        }),
        invalidatesTags: [{ type: "Tasks", id: "LIST" }],
      }),

      // ── DELETE /api/tasks/:id ─────────────────────────────────────────────
      deleteTask: builder.mutation<ApiSuccessResponse<object>, { id: string; projectId: string }>({
        query: ({ id }) => ({
          url: `/tasks/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (_result, _error, { id, projectId }) => [
          { type: "Tasks", id },
          { type: "Tasks", id: "LIST" },
          { type: "Projects", id: projectId },
        ],
      }),
    }),
  });

export const {
  useGetTaskQuery,
  useGetMyTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useReorderTasksMutation,
  useDeleteTaskMutation,
  useGetTasksByProjectQuery,
} = tasksApi;
