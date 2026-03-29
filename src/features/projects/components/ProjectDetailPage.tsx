import { useState } from "react";
import { Navigate, useParams } from "react-router";

import type { Task } from "@/types";

import { PageBreadcrumb, PermissionGate } from "@/components/common";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { paths } from "@/config/paths";
import { PERMISSIONS } from "@/config/permissions";
import {
  PROJECT_COLOR_VALUES,
  PROJECT_STATUS_BADGE_VARIANTS,
  PROJECT_STATUS_LABELS,
  TASK_STATUS_ORDER,
} from "@/constants";
import { formatDate } from "@/utils/date";

import { useGetProjectQuery } from "../api";
import { KanbanBoard } from "./KanbanBoard";
import { OverviewTab } from "./OverviewTab";
import { TaskSheet } from "./TaskSheet";

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading, isError } = useGetProjectQuery(id!, { skip: !id });

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  if (!id || isError) {
    return <Navigate to={paths.app.projects.root.path} replace />;
  }

  if (isLoading) {
    return <ProjectDetailSkeleton />;
  }

  if (!project) {
    return <Navigate to={paths.app.projects.root.path} replace />;
  }

  // Combine owner + members for assignee lookup in board
  const allMembers = [project.owner, ...project.members];

  return (
    <div>
      {/* Breadcrumb */}
      <PageBreadcrumb
        items={[
          { label: "Projects", path: paths.app.projects.root.path },
          { label: project.name },
        ]}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="size-3 shrink-0 rounded-full"
              style={{ backgroundColor: PROJECT_COLOR_VALUES[project.color] }}
            />
            <h1 className="truncate text-2xl font-semibold tracking-tight">
              {project.name}
            </h1>
            <span className="shrink-0 text-sm text-muted-foreground">
              {project.key}
            </span>
            <Badge variant={PROJECT_STATUS_BADGE_VARIANTS[project.status]}>
              {PROJECT_STATUS_LABELS[project.status]}
            </Badge>
          </div>
          {project.description && (
            <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>
          )}
        </div>
        <div className="shrink-0 space-y-0.5 text-right text-xs">
          <p>
            <span className="text-muted-foreground">Created </span>
            <span className="font-medium text-foreground">
              {formatDate(project.createdAt)}
            </span>
          </p>
          <p>
            <span className="text-muted-foreground">Updated </span>
            <span className="font-medium text-foreground">
              {formatDate(project.updatedAt)}
            </span>
          </p>
        </div>
      </div>

      {/* Overview — always visible */}
      <OverviewTab project={project} />

      {/* Tabs */}
      <Tabs defaultValue="board" className="pt-6">
        <div className="flex items-center justify-between gap-4 pb-4">
          <TabsList variant="line">
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="sprints">Sprints</TabsTrigger>
          </TabsList>

          <PermissionGate requires={PERMISSIONS.TASKS_CREATE}>
            <TaskSheet projectId={project.id} members={allMembers} />
          </PermissionGate>
        </div>

        <TabsContent value="board">
          <KanbanBoard
            tasks={project.tasks}
            members={allMembers}
            onTaskClick={setSelectedTask}
          />
        </TabsContent>

        <TabsContent value="sprints">
          <div className="flex h-48 items-center justify-center rounded-lg border border-dashed">
            <p className="text-sm text-muted-foreground">
              Sprint planning coming soon
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Task edit sheet */}
      <TaskSheet
        task={selectedTask}
        members={allMembers}
        projectId={project.id}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ProjectDetailSkeleton() {
  return (
    <div>
      <Skeleton className="mb-4 h-4 w-32" />

      <div className="pb-6">
        <div className="flex items-center gap-2">
          <Skeleton className="size-3 rounded-full" />
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-5 w-10" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="mt-1 h-4 w-72" />
        <Skeleton className="mt-1 h-3 w-48" />
      </div>

      {/* Overview skeleton */}
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-44 rounded-lg" />
        <Skeleton className="h-44 rounded-lg" />
      </div>

      {/* Tabs skeleton */}
      <Skeleton className="mt-6 mb-4 h-9 w-48" />

      <div className="flex gap-4">
        {TASK_STATUS_ORDER.map(status => (
          <div key={status} className="min-w-[272px] flex-1 space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
