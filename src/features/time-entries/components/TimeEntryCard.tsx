import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatMinutes } from "@/utils/date";

import type { TimeEntryWithTask } from "../types";

type TimeEntryCardProps = {
  entry: TimeEntryWithTask;
  onEdit: () => void;
  onDelete: () => void;
};

export function TimeEntryCard({ entry, onEdit, onDelete }: TimeEntryCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <Card className="flex-row items-center gap-4 p-4">
        {/* Time */}
        <div className="w-16 shrink-0 text-right">
          <span className="text-sm font-semibold tabular-nums">
            {formatMinutes(entry.minutes)}
          </span>
        </div>

        {/* Task + Description */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {entry.taskKey && (
              <span className="shrink-0 text-xs font-medium text-muted-foreground">
                {entry.taskKey}
              </span>
            )}
            <span className="truncate text-sm font-medium">
              {entry.taskTitle ?? "Unknown task"}
            </span>
          </div>
          {entry.description && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {entry.description}
            </p>
          )}
        </div>

        {/* Date */}
        <span className="shrink-0 text-xs text-muted-foreground">
          {formatDate(entry.date)}
        </span>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger className="shrink-0 rounded-md p-1 hover:bg-muted">
            <MoreHorizontal className="size-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => setConfirmOpen(true)}>
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Card>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete time entry?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this time entry. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} variant="destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function TimeEntryCardSkeleton() {
  return (
    <Card className="flex-row items-center gap-4 p-4">
      <Skeleton className="h-4 w-16" />
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3.5 w-12" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-3 w-56" />
      </div>
      <Skeleton className="h-3 w-20" />
      <Skeleton className="size-6 rounded" />
    </Card>
  );
}
