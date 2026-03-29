import type { ApiSuccessResponse } from "@/types";

import { baseApi } from "@/store/base-api";

import type {
  CreateTimeEntryInput,
  TimeEntryWithTask,
  UpdateTimeEntryInput,
} from "./types";

const timeEntriesApi = baseApi
  .enhanceEndpoints({ addTagTypes: ["TimeEntries"] })
  .injectEndpoints({
    endpoints: builder => ({
      // ── GET /api/time-entries/my ────────────────────────────────────────────
      getMyTimeEntries: builder.query<TimeEntryWithTask[], void>({
        query: () => "/time-entries/my",
        transformResponse: (res: ApiSuccessResponse<TimeEntryWithTask[]>) => res.data,
        providesTags: (result) => {
          const list = { type: "TimeEntries" as const, id: "LIST" };
          const items = result?.map(({ id }) => ({ type: "TimeEntries" as const, id })) ?? [];

          return [...items, list];
        },
      }),

      // ── POST /api/time-entries ─────────────────────────────────────────────
      createTimeEntry: builder.mutation<ApiSuccessResponse<TimeEntryWithTask>, CreateTimeEntryInput>({
        query: body => ({
          url: "/time-entries",
          method: "POST",
          body,
        }),
        invalidatesTags: [{ type: "TimeEntries", id: "LIST" }],
      }),

      // ── PATCH /api/time-entries/:id ────────────────────────────────────────
      updateTimeEntry: builder.mutation<ApiSuccessResponse<TimeEntryWithTask>, { id: string } & UpdateTimeEntryInput>({
        query: ({ id, ...body }) => ({
          url: `/time-entries/${id}`,
          method: "PATCH",
          body,
        }),
        invalidatesTags: (result) => {
          const item = result?.data ? { type: "TimeEntries" as const, id: result.data.id } : null;

          return item ? [item, { type: "TimeEntries", id: "LIST" }] : [];
        },
      }),

      // ── DELETE /api/time-entries/:id ───────────────────────────────────────
      deleteTimeEntry: builder.mutation<ApiSuccessResponse<object>, { id: string }>({
        query: ({ id }) => ({
          url: `/time-entries/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (_result, _error, { id }) => [
          { type: "TimeEntries", id },
          { type: "TimeEntries", id: "LIST" },
        ],
      }),
    }),
  });

export const {
  useGetMyTimeEntriesQuery,
  useCreateTimeEntryMutation,
  useUpdateTimeEntryMutation,
  useDeleteTimeEntryMutation,
} = timeEntriesApi;
