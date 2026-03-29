import { AlertCircle, Users } from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/components/common";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetProjectsQuery } from "@/features/projects";

import type { MemberWorkload } from "../types";

import { useGetWorkloadQuery } from "../api";
import { MemberWorkloadCard, MemberWorkloadCardSkeleton } from "./MemberWorkloadCard";

export function WorkloadPage() {
  const [projectId, setProjectId] = useState<string | undefined>(undefined);

  const { data: projects } = useGetProjectsQuery();
  const { data: workload, isLoading, isError } = useGetWorkloadQuery(projectId);

  return (
    <>
      <PageHeader title="Workload" description="Task distribution across team members">
        <Select
          value={projectId ?? "all"}
          onValueChange={v => setProjectId(v === "all" ? undefined : v)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects?.map(project => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {workloadContent(isLoading, isError, workload)}
      </div>
    </>
  );
}

function workloadContent(
  isLoading: boolean,
  isError: boolean,
  workload: MemberWorkload[] | undefined,
) {
  if (isLoading) {
    return Array.from({ length: 6 }, (_, i) => <MemberWorkloadCardSkeleton key={i} />);
  }

  if (isError) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="size-6 text-destructive" />
        </div>
        <h3 className="mt-4 text-sm font-medium">Failed to load workload</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Something went wrong. Please try refreshing the page.
        </p>
      </div>
    );
  }

  if (!workload?.length) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Users className="size-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-sm font-medium">No workload data</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          No tasks are assigned to any team members yet.
        </p>
      </div>
    );
  }

  return workload.map(member => (
    <MemberWorkloadCard key={member.user.id} workload={member} />
  ));
}
