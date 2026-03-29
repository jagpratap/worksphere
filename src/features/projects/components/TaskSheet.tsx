import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import type { CreateTaskFormValues } from "@/features/tasks";
import type { SafeUser, Task } from "@/types";

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
import {
  DEFAULT_TASK_PRIORITY,
  DEFAULT_TASK_STATUS,
  TASK_PRIORITY,
  TASK_PRIORITY_LABELS,
  TASK_STATUS,
  TASK_STATUS_LABELS,
} from "@/constants";
import {
  createTaskSchema,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "@/features/tasks";
import { parseApiError } from "@/utils/error";

type CreateMode = {
  projectId: string;
  members: SafeUser[];
};

type EditMode = {
  task: Task | null;
  members: SafeUser[];
  projectId: string;
  onClose: () => void;
};

type TaskSheetProps = CreateMode | EditMode;

function isEditMode(props: TaskSheetProps): props is EditMode {
  return "task" in props;
}

export function TaskSheet(props: TaskSheetProps) {
  const editing = isEditMode(props);
  const task = editing ? props.task : null;

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const {
    control,
    setError,
    handleSubmit,
    reset,
  } = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: DEFAULT_TASK_STATUS,
      priority: DEFAULT_TASK_PRIORITY,
      assigneeId: null,
    },
  });

  const [createOpen, setCreateOpen] = useState(false);

  // Sync form when editing an existing task
  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assigneeId: task.assigneeId,
      });
    }
  }, [task, reset]);

  const onSubmit = async (values: CreateTaskFormValues) => {
    try {
      if (editing && task) {
        const { message } = await updateTask({ id: task.id, ...values }).unwrap();
        toast.success(message);
        props.onClose();
      }
      else {
        const { message } = await createTask({ ...values, projectId: props.projectId }).unwrap();
        toast.success(message);
        setCreateOpen(false);
        reset();
      }
    }
    catch (err) {
      const { message, fieldErrors } = parseApiError<CreateTaskFormValues>(err);

      Object.entries(fieldErrors).forEach(([field, msg]) => {
        setError(field as keyof CreateTaskFormValues, {
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
    if (!editing || !task)
      return;

    try {
      const { message } = await deleteTask({ id: task.id, projectId: props.projectId }).unwrap();
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

  const isOpen = editing ? !!task : createOpen;
  const isSubmitting = editing ? isUpdating : isCreating;
  const formId = editing ? "edit-task-form" : "create-task-form";

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      {!editing && (
        <SheetTrigger asChild>
          <Button size="sm">
            <Plus className="size-4" />
            New Task
          </Button>
        </SheetTrigger>
      )}

      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">{editing ? task?.key : "Create Task"}</SheetTitle>
          <SheetDescription>
            {editing ? "Edit task details or delete it." : "Add a new task to this project."}
          </SheetDescription>
        </SheetHeader>

        <form
          id={formId}
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto px-4"
        >
          <FieldGroup>
            {/* Title */}
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder={!editing ? "e.g. Implement login flow" : undefined}
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
                    placeholder={!editing ? "Describe the task..." : undefined}
                    rows={editing ? 4 : 3}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Status */}
            <Controller
              name="status"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id={field.name} className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(TASK_STATUS).map(status => (
                        <SelectItem key={status} value={status}>
                          {TASK_STATUS_LABELS[status]}
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

            {/* Priority */}
            <Controller
              name="priority"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Priority</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id={field.name} className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(TASK_PRIORITY).map(priority => (
                        <SelectItem key={priority} value={priority}>
                          {TASK_PRIORITY_LABELS[priority]}
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

            {/* Assignee */}
            <Controller
              name="assigneeId"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Assignee</FieldLabel>
                  <Select
                    value={field.value ?? "unassigned"}
                    onValueChange={v => field.onChange(v === "unassigned" ? null : v)}
                  >
                    <SelectTrigger id={field.name} className="w-full">
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {props.members.map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <AlertDialogTitle>Delete task?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete
                    {" "}
                    <strong>{task?.key}</strong>
                    . This action cannot be undone.
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
              : (isSubmitting ? "Creating..." : "Create Task")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
