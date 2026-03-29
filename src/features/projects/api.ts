import type { ApiSuccessResponse, Project } from "@/types";

import { baseApi } from "@/store/base-api";

import type {
  CreateProjectInput,
  ProjectDetailResponse,
  ProjectWithOwner,
  UpdateProjectInput,
} from "./types";

const projectsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ["Projects", "Tasks"] })
  .injectEndpoints({
    endpoints: builder => ({
      // ── GET /api/projects ─────────────────────────────────────────────────
      getProjects: builder.query<ProjectWithOwner[], void>({
        query: () => "/projects",
        transformResponse: (res: ApiSuccessResponse<ProjectWithOwner[]>) => res.data,
        providesTags: (result) => {
          const list = { type: "Projects" as const, id: "LIST" };
          const items = result?.map(({ id }) => ({ type: "Projects" as const, id })) ?? [];

          return [...items, list];
        },
      }),

      // ── GET /api/projects/:id ─────────────────────────────────────────────
      getProject: builder.query<ProjectDetailResponse, string>({
        query: id => `/projects/${id}`,
        transformResponse: (res: ApiSuccessResponse<ProjectDetailResponse>) => res.data,
        providesTags: (result, _error, id) => {
          const project = { type: "Projects" as const, id };
          const tasks = result?.tasks?.map(t => ({ type: "Tasks" as const, id: t.id })) ?? [];
          const taskList = { type: "Tasks" as const, id: "LIST" };

          return [project, ...tasks, taskList];
        },
      }),

      // ── POST /api/projects ────────────────────────────────────────────────
      createProject: builder.mutation<ApiSuccessResponse<Project>, CreateProjectInput>({
        query: body => ({
          url: "/projects",
          method: "POST",
          body,
        }),
        invalidatesTags: [{ type: "Projects", id: "LIST" }],
      }),

      // ── PATCH /api/projects/:id ───────────────────────────────────────────
      updateProject: builder.mutation<ApiSuccessResponse<Project>, { id: string } & UpdateProjectInput>({
        query: ({ id, ...body }) => ({
          url: `/projects/${id}`,
          method: "PATCH",
          body,
        }),
        invalidatesTags: (_result, _error, { id }) => [
          { type: "Projects", id },
          { type: "Projects", id: "LIST" },
        ],
      }),

      // ── DELETE /api/projects/:id ──────────────────────────────────────────
      deleteProject: builder.mutation<ApiSuccessResponse<object>, string>({
        query: id => ({
          url: `/projects/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: [{ type: "Projects", id: "LIST" }],
      }),
    }),
  });

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectsApi;
