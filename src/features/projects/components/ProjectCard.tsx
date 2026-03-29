import { Link } from "react-router";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { paths } from "@/config/paths";
import {
  PROJECT_COLOR_VALUES,
  PROJECT_STATUS_BADGE_VARIANTS,
  PROJECT_STATUS_LABELS,
} from "@/constants";
import { getInitials } from "@/utils/string";

import type { ProjectWithOwner } from "../types";

type ProjectCardProps = {
  project: ProjectWithOwner;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const { owner } = project;

  return (
    <Link to={paths.app.projects.detail(project.id).path}>
      <Card className="gap-3 p-4 transition-colors hover:bg-muted/50">
        {/* Top: Name + Status */}
        <div className="flex items-center gap-2">
          <span
            className="size-3 shrink-0 rounded-full"
            style={{ backgroundColor: PROJECT_COLOR_VALUES[project.color] }}
          />
          <span className="truncate font-medium">{project.name}</span>
          <span className="shrink-0 text-xs text-muted-foreground">
            {project.key}
          </span>
          <Badge className="ml-auto" variant={PROJECT_STATUS_BADGE_VARIANTS[project.status]}>
            {PROJECT_STATUS_LABELS[project.status]}
          </Badge>
        </div>

        {/* Description */}
        {project.description && (
          <p className="truncate text-sm text-muted-foreground">
            {project.description}
          </p>
        )}

        {/* Bottom: Owner + Task count */}
        <div className="flex items-center justify-between">
          {owner && (
            <div className="flex items-center gap-1.5">
              <Avatar className="size-5">
                <AvatarImage src={owner.avatar} alt={owner.name} />
                <AvatarFallback className="text-[10px]">
                  {getInitials(owner.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {owner.name}
              </span>
            </div>
          )}
          <span className="text-xs text-muted-foreground">
            {project.taskCount}
            {" "}
            {project.taskCount === 1 ? "task" : "tasks"}
          </span>
        </div>
      </Card>
    </Link>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export function ProjectCardSkeleton() {
  return (
    <Card className="gap-3 p-4">
      <div className="flex items-center gap-2">
        <Skeleton className="size-3 rounded-full" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-10" />
        <Skeleton className="ml-auto h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-3.5 w-64" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Skeleton className="size-5 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-3 w-12" />
      </div>
    </Card>
  );
}
