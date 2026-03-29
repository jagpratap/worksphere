import { AlertCircle, Clock, Search, SearchX, Timer, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import { useFilterParams } from "@/hooks/use-filter-params";
import { formatMinutes, isThisWeek, isToday } from "@/utils/date";
import { parseApiError } from "@/utils/error";

import type { TimeEntryWithTask } from "../types";

import {
  useDeleteTimeEntryMutation,
  useGetMyTimeEntriesQuery,
} from "../api";
import { TimeEntryCard, TimeEntryCardSkeleton } from "./TimeEntryCard";
import { TimeEntrySheet } from "./TimeEntrySheet";

type FilterTab = "all" | "today" | "week";

const FILTER_TABS: { label: string; value: FilterTab }[] = [
  { label: "All", value: "all" },
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
];

const TIME_FILTER_DEFAULTS = { period: "all", q: "" };

export function TimeTrackerPage() {
  const { data: entries, isLoading, isError } = useGetMyTimeEntriesQuery();
  const [deleteEntry] = useDeleteTimeEntryMutation();

  const { values: filters, set: setFilter } = useFilterParams(TIME_FILTER_DEFAULTS);

  const [selectedEntry, setSelectedEntry] = useState<TimeEntryWithTask | null>(null);

  const filteredEntries = useMemo(() => {
    if (!entries)
      return [];

    return entries.filter((entry) => {
      if (filters.period === "today" && !isToday(entry.date))
        return false;
      if (filters.period === "week" && !isThisWeek(entry.date))
        return false;

      if (filters.q) {
        const q = filters.q.toLowerCase();
        return (
          entry.taskTitle?.toLowerCase().includes(q)
          || entry.taskKey?.toLowerCase().includes(q)
          || entry.description.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [entries, filters.period, filters.q]);

  // Summary stats
  const todayMinutes = useMemo(
    () => entries?.filter(e => isToday(e.date)).reduce((sum, e) => sum + e.minutes, 0) ?? 0,
    [entries],
  );

  const weekMinutes = useMemo(
    () => entries?.filter(e => isThisWeek(e.date)).reduce((sum, e) => sum + e.minutes, 0) ?? 0,
    [entries],
  );

  const handleDelete = async (entry: TimeEntryWithTask) => {
    try {
      const { message } = await deleteEntry({ id: entry.id }).unwrap();
      toast.success(message);
    }
    catch (err) {
      const { message } = parseApiError(err);
      toast.error(message);
    }
  };

  return (
    <>
      <PageHeader title="Time Tracker" description="Track time spent on your tasks">
        <TimeEntrySheet />
      </PageHeader>

      {/* Summary stats */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-2 gap-3 pb-6 sm:grid-cols-2 md:max-w-md">
          <SummaryCard label="Today" value={todayMinutes} icon={Clock} />
          <SummaryCard label="This Week" value={weekMinutes} icon={Timer} />
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 pb-4">
        <div className="flex items-center gap-1">
          {FILTER_TABS.map(tab => (
            <Button
              key={tab.value}
              variant={filters.period === tab.value ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilter("period", tab.value)}
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
            placeholder="Search entries..."
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

      {/* Entry list */}
      <div className="flex flex-col gap-2">
        {entryListContent(isLoading, isError, entries, filteredEntries, setSelectedEntry, handleDelete)}
      </div>

      {/* Edit sheet */}
      <TimeEntrySheet
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
      />
    </>
  );
}

// ─── Summary Card ──────────────────────────────────────────────────────────────

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Clock;
}) {
  return (
    <Card className="flex-row items-center gap-3 p-4">
      <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="size-4 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold tabular-nums">{formatMinutes(value)}</p>
      </div>
    </Card>
  );
}

// ─── Loading skeleton for summary ──────────────────────────────────────────────

export function SummaryCardSkeleton() {
  return (
    <Card className="flex-row items-center gap-3 p-4">
      <Skeleton className="size-9 rounded-lg" />
      <div className="space-y-1">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-12" />
      </div>
    </Card>
  );
}

// ─── Empty / Error States ──────────────────────────────────────────────────────

function entryListContent(
  isLoading: boolean,
  isError: boolean,
  entries: TimeEntryWithTask[] | undefined,
  filteredEntries: TimeEntryWithTask[],
  onEdit: (entry: TimeEntryWithTask) => void,
  onDelete: (entry: TimeEntryWithTask) => void,
) {
  if (isLoading) {
    return Array.from({ length: 5 }, (_, i) => <TimeEntryCardSkeleton key={i} />);
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="size-6 text-destructive" />
        </div>
        <h3 className="mt-4 text-sm font-medium">Failed to load time entries</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Something went wrong. Please try refreshing the page.
        </p>
      </div>
    );
  }

  if (!entries?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Clock className="size-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-sm font-medium">No time logged</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Start tracking time by clicking &quot;Log Time&quot; above.
        </p>
      </div>
    );
  }

  if (!filteredEntries.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <SearchX className="size-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-sm font-medium">No entries found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your search or filter.
        </p>
      </div>
    );
  }

  return filteredEntries.map(entry => (
    <TimeEntryCard
      key={entry.id}
      entry={entry}
      onEdit={() => onEdit(entry)}
      onDelete={() => onDelete(entry)}
    />
  ));
}
