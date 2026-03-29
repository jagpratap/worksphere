import type { ApiSuccessResponse } from "@/types";

import { baseApi } from "@/store/base-api";

import type { MemberWorkload } from "./types";

const workloadApi = baseApi
  .enhanceEndpoints({ addTagTypes: ["Workload", "Tasks"] })
  .injectEndpoints({
    endpoints: builder => ({
      // ── GET /api/workload?projectId= ──────────────────────────────────────
      getWorkload: builder.query<MemberWorkload[], string | undefined>({
        query: projectId =>
          projectId ? `/workload?projectId=${projectId}` : "/workload",
        transformResponse: (res: ApiSuccessResponse<MemberWorkload[]>) => res.data,
        providesTags: [{ type: "Workload", id: "LIST" }],
      }),
    }),
  });

export const { useGetWorkloadQuery } = workloadApi;
