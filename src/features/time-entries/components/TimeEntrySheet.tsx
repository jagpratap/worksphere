import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import type { CreateTimeEntryFormValues } from "@/features/time-entries";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useGetMyTasksQuery } from "@/features/tasks";
import {
  createTimeEntrySchema,
  useCreateTimeEntryMutation,
  useDeleteTimeEntryMutation,
  useUpdateTimeEntryMutation,
} from "@/features/time-entries";
import { parseApiError } from "@/utils/error";

import type { TimeEntryWithTask } from "../types";

type CreateMode = object;

type EditMode = {
  entry: TimeEntryWithTask | null;
  onClose: () => void;
};

type TimeEntrySheetProps = CreateMode | EditMode;

function isEditMode(props: TimeEntrySheetProps): props is EditMode {
  return "entry" in props;
}

export function TimeEntrySheet(props: TimeEntrySheetProps) {
  const editing = isEditMode(props);
  const entry = editing ? props.entry : null;

  const { data: tasks } = useGetMyTasksQuery();

  const [createEntry, { isLoading: isCreating }] = useCreateTimeEntryMutation();
  const [updateEntry, { isLoading: isUpdating }] = useUpdateTimeEntryMutation();
  const [deleteEntry, { isLoading: isDeleting }] = useDeleteTimeEntryMutation();

  const {
    control,
    setError,
    handleSubmit,
    reset,
  } = useForm<CreateTimeEntryFormValues>({
    resolver: zodResolver(createTimeEntrySchema),
    defaultValues: {
      taskId: "",
      minutes: 60,
      date: new Date().toISOString().slice(0, 10),
      description: "",
    },
  });

  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    if (entry) {
      reset({
        taskId: entry.taskId,
        minutes: entry.minutes,
        date: entry.date,
        description: entry.description,
      });
    }
  }, [entry, reset]);

  const onSubmit = async (values: CreateTimeEntryFormValues) => {
    try {
      if (editing && entry) {
        const { message } = await updateEntry({ id: entry.id, ...values }).unwrap();
        toast.success(message);
        props.onClose();
      }
      else {
        const { message } = await createEntry(values).unwrap();
        toast.success(message);
        setCreateOpen(false);
        reset();
      }
    }
    catch (err) {
      const { message, fieldErrors } = parseApiError<CreateTimeEntryFormValues>(err);

      Object.entries(fieldErrors).forEach(([field, msg]) => {
        setError(field as keyof CreateTimeEntryFormValues, {
          type: "server",
          message: msg,
        });
      });

      if (Object.keys(fieldErrors).length === 0) {
        toast.error(message);
      }
    }
  };

  const handleDelete = async () => {
    if (!editing || !entry)
      return;

    try {
      const { message } = await deleteEntry({ id: entry.id }).unwrap();
      toast.success(message);
      props.onClose();
    }
    catch (err) {
      const { message } = parseApiError(err);
      toast.error(message);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (editing) {
      if (!nextOpen)
        props.onClose();
    }
    else {
      setCreateOpen(nextOpen);
      if (!nextOpen)
        reset();
    }
  };

  const isOpen = editing ? !!entry : createOpen;
  const isSubmitting = editing ? isUpdating : isCreating;
  const formId = editing ? "edit-time-entry-form" : "create-time-entry-form";

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      {!editing && (
        <SheetTrigger asChild>
          <Button size="sm">
            <Plus className="size-4" />
            Log Time
          </Button>
        </SheetTrigger>
      )}

      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">
            {editing ? "Edit Time Entry" : "Log Time"}
          </SheetTitle>
          <SheetDescription>
            {editing ? "Edit this time entry or delete it." : "Log time spent on a task."}
          </SheetDescription>
        </SheetHeader>

        <form
          id={formId}
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto px-4"
        >
          <FieldGroup>
            {/* Task */}
            <Controller
              name="taskId"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Task</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id={field.name} className="w-full">
                      <SelectValue placeholder="Select a task" />
                    </SelectTrigger>
                    <SelectContent>
                      {tasks?.map(task => (
                        <SelectItem key={task.id} value={task.id}>
                          {task.key}
                          {" — "}
                          {task.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Time (minutes) */}
            <Controller
              name="minutes"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Time (minutes)</FieldLabel>
                  <Input
                    id={field.name}
                    type="number"
                    min={1}
                    max={480}
                    value={field.value}
                    onChange={e => field.onChange(e.target.valueAsNumber)}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Date */}
            <Controller
              name="date"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Date</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="date"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Description */}
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder="What did you work on?"
                    rows={3}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <SheetFooter className={editing ? "flex-row justify-between" : undefined}>
          {editing && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isDeleting}>
                  <Trash2 className="size-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete time entry?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this time entry. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} variant="destructive">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <Button
            type="submit"
            form={formId}
            disabled={isSubmitting}
          >
            {editing
              ? (isSubmitting ? "Saving..." : "Save Changes")
              : (isSubmitting ? "Logging..." : "Log Time")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
