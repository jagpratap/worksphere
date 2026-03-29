import { AlertCircle, CalendarRange } from "lucide-react";
import { useState } from "react";

import type { SprintWithStats } from "../types";

import { useGetSprintsByProjectQuery } from "../api";
import { SprintCard, SprintCardSkeleton } from "./SprintCard";
import { SprintSheet } from "./SprintSheet";

type SprintsTabProps = {
  projectId: string;
};

export function SprintsTab({ projectId }: SprintsTabProps) {
  const { data: sprints, isLoading, isError } = useGetSprintsByProjectQuery(projectId);

  const [selectedSprint, setSelectedSprint] = useState<SprintWithStats | null>(null);

  return (
    <>
      <div className="space-y-3">
        {sprintListContent(isLoading, isError, sprints, setSelectedSprint)}
      </div>

      {/* Edit sheet */}
      <SprintSheet
        sprint={selectedSprint}
        projectId={projectId}
        onClose={() => setSelectedSprint(null)}
      />
    </>
  );
}

// ─── Empty / Error States ──────────────────────────────────────────────────────

function sprintListContent(
  isLoading: boolean,
  isError: boolean,
  sprints: SprintWithStats[] | undefined,
  onSelect: (sprint: SprintWithStats) => void,
) {
  if (isLoading) {
    return Array.from({ length: 3 }, (_, i) => <SprintCardSkeleton key={i} />);
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="size-6 text-destructive" />
        </div>
        <h3 className="mt-4 text-sm font-medium">Failed to load sprints</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Something went wrong. Please try refreshing the page.
        </p>
      </div>
    );
  }

  if (!sprints?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <CalendarRange className="size-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-sm font-medium">No sprints yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a sprint to start planning your iterations.
        </p>
      </div>
    );
  }

  return sprints.map(sprint => (
    <SprintCard
      key={sprint.id}
      sprint={sprint}
      onClick={() => onSelect(sprint)}
    />
  ));
}
