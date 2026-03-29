import type { ApiSuccessResponse } from "@/types";

import { baseApi } from "@/store/base-api";

import type {
  CreateSprintInput,
  SprintWithStats,
  UpdateSprintInput,
} from "./types";

const sprintsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ["Sprints", "Tasks"] })
  .injectEndpoints({
    endpoints: builder => ({
      // ── GET /api/projects/:id/sprints ──────────────────────────────────────
      getSprintsByProject: builder.query<SprintWithStats[], string>({
        query: projectId => `/projects/${projectId}/sprints`,
        transformResponse: (res: ApiSuccessResponse<SprintWithStats[]>) => res.data,
        providesTags: (result) => {
          const list = { type: "Sprints" as const, id: "LIST" };
          const items = result?.map(({ id }) => ({ type: "Sprints" as const, id })) ?? [];

          return [...items, list];
        },
      }),

      // ── POST /api/sprints ─────────────────────────────────────────────────
      createSprint: builder.mutation<ApiSuccessResponse<SprintWithStats>, CreateSprintInput>({
        query: body => ({
          url: "/sprints",
          method: "POST",
          body,
        }),
        invalidatesTags: [{ type: "Sprints", id: "LIST" }],
      }),

      // ── PATCH /api/sprints/:id ────────────────────────────────────────────
      updateSprint: builder.mutation<ApiSuccessResponse<SprintWithStats>, { id: string } & UpdateSprintInput>({
        query: ({ id, ...body }) => ({
          url: `/sprints/${id}`,
          method: "PATCH",
          body,
        }),
        invalidatesTags: (result) => {
          const item = result?.data ? { type: "Sprints" as const, id: result.data.id } : null;

          return item ? [item, { type: "Sprints", id: "LIST" }] : [];
        },
      }),

      // ── DELETE /api/sprints/:id ───────────────────────────────────────────
      deleteSprint: builder.mutation<ApiSuccessResponse<object>, { id: string }>({
        query: ({ id }) => ({
          url: `/sprints/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (_result, _error, { id }) => [
          { type: "Sprints", id },
          { type: "Sprints", id: "LIST" },
          { type: "Tasks", id: "LIST" },
        ],
      }),
    }),
  });

export const {
  useGetSprintsByProjectQuery,
  useCreateSprintMutation,
  useUpdateSprintMutation,
  useDeleteSprintMutation,
} = sprintsApi;
