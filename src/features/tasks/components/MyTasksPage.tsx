import { AlertCircle, CheckCircle2, Search, SearchX, X } from "lucide-react";
import { useMemo } from "react";

import type { TaskStatus } from "@/constants";
import type { Task } from "@/types";

import { PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { TASK_STATUS, TASK_STATUS_LABELS } from "@/constants";
import { useFilterParams } from "@/hooks/use-filter-params";

import { useGetMyTasksQuery } from "../api";
import { MyTaskCard, MyTaskCardSkeleton } from "./MyTaskCard";

type FilterTab = "all" | TaskStatus;

const FILTER_TABS: { label: string; value: FilterTab }[] = [
  { label: "All", value: "all" },
  { label: TASK_STATUS_LABELS[TASK_STATUS.TODO], value: TASK_STATUS.TODO },
  { label: TASK_STATUS_LABELS[TASK_STATUS.IN_PROGRESS], value: TASK_STATUS.IN_PROGRESS },
  { label: TASK_STATUS_LABELS[TASK_STATUS.IN_REVIEW], value: TASK_STATUS.IN_REVIEW },
  { label: TASK_STATUS_LABELS[TASK_STATUS.DONE], value: TASK_STATUS.DONE },
];

const MY_TASKS_FILTER_DEFAULTS = { status: "all", q: "" };

export function MyTasksPage() {
  const { data: tasks, isLoading, isError } = useGetMyTasksQuery();

  const { values: filters, set: setFilter } = useFilterParams(MY_TASKS_FILTER_DEFAULTS);

  const filteredTasks = useMemo(() => {
    if (!tasks)
      return [];

    return tasks.filter((task) => {
      if (filters.status !== "all" && task.status !== filters.status)
        return false;

      if (filters.q) {
        const q = filters.q.toLowerCase();
        return (
          task.title.toLowerCase().includes(q)
          || task.key.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [tasks, filters.status, filters.q]);

  return (
    <>
      <PageHeader title="My Tasks" description="Your assigned tasks across all projects" />

      {/* Filters */}
      <div className="flex items-center gap-3 pb-4">
        <div className="flex items-center gap-1">
          {FILTER_TABS.map(tab => (
            <Button
              key={tab.value}
              variant={filters.status === tab.value ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilter("status", tab.value)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <InputGroup className="ml-auto max-w-xs">
          <InputGroupAddon align="inline-start">
            <InputGroupText>
              <Search className="size-4" />
            </InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search tasks..."
            value={filters.q}
            onChange={e => setFilter("q", e.target.value)}
          />
          {filters.q && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                variant="ghost"
                aria-label="Clear search"
                onClick={() => setFilter("q", "")}
              >
                <X className="size-3.5" />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
      </div>

      {/* Task list */}
      <div className="flex flex-col gap-2">
        {taskListContent(isLoading, isError, tasks, filteredTasks)}
      </div>
    </>
  );
}

// ─── Empty / Error States ──────────────────────────────────────────────────────

function taskListContent(
  isLoading: boolean,
  isError: boolean,
  tasks: Task[] | undefined,
  filteredTasks: Task[],
) {
  if (isLoading) {
    return Array.from({ length: 5 }, (_, i) => <MyTaskCardSkeleton key={i} />);
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="size-6 text-destructive" />
        </div>
        <h3 className="mt-4 text-sm font-medium">Failed to load tasks</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Something went wrong. Please try refreshing the page.
        </p>
      </div>
    );
  }

  if (!tasks?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <CheckCircle2 className="size-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-sm font-medium">No tasks assigned</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          You don't have any tasks assigned to you yet.
        </p>
      </div>
    );
  }

  if (!filteredTasks.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <SearchX className="size-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-sm font-medium">No tasks found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your search or filter.
        </p>
      </div>
    );
  }

  return filteredTasks.map(task => (
    <MyTaskCard key={task.id} task={task} />
  ));
}
