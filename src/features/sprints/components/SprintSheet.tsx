import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import type { CreateSprintFormValues, SprintWithStats } from "@/features/sprints";

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
  DEFAULT_SPRINT_STATUS,
  SPRINT_STATUS,
  SPRINT_STATUS_LABELS,
} from "@/constants";
import {
  createSprintSchema,
  useCreateSprintMutation,
  useDeleteSprintMutation,
  useUpdateSprintMutation,
} from "@/features/sprints";
import { parseApiError } from "@/utils/error";

type CreateMode = {
  projectId: string;
};

type EditMode = {
  sprint: SprintWithStats | null;
  projectId: string;
  onClose: () => void;
};

type SprintSheetProps = CreateMode | EditMode;

function isEditMode(props: SprintSheetProps): props is EditMode {
  return "sprint" in props;
}

export function SprintSheet(props: SprintSheetProps) {
  const editing = isEditMode(props);
  const sprint = editing ? props.sprint : null;

  const [createSprint, { isLoading: isCreating }] = useCreateSprintMutation();
  const [updateSprint, { isLoading: isUpdating }] = useUpdateSprintMutation();
  const [deleteSprint, { isLoading: isDeleting }] = useDeleteSprintMutation();

  const {
    control,
    setError,
    handleSubmit,
    reset,
  } = useForm<CreateSprintFormValues>({
    resolver: zodResolver(createSprintSchema),
    defaultValues: {
      name: "",
      goal: "",
      status: DEFAULT_SPRINT_STATUS,
      startDate: "",
      endDate: "",
    },
  });

  const [createOpen, setCreateOpen] = useState(false);

  // Sync form when editing an existing sprint
  useEffect(() => {
    if (sprint) {
      reset({
        name: sprint.name,
        goal: sprint.goal,
        status: sprint.status,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
      });
    }
  }, [sprint, reset]);

  const onSubmit = async (values: CreateSprintFormValues) => {
    try {
      if (editing && sprint) {
        const { message } = await updateSprint({ id: sprint.id, ...values }).unwrap();
        toast.success(message);
        props.onClose();
      }
      else {
        const { message } = await createSprint({ ...values, projectId: props.projectId }).unwrap();
        toast.success(message);
        setCreateOpen(false);
        reset();
      }
    }
    catch (err) {
      const { message, fieldErrors } = parseApiError<CreateSprintFormValues>(err);

      Object.entries(fieldErrors).forEach(([field, msg]) => {
        setError(field as keyof CreateSprintFormValues, {
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
    if (!editing || !sprint)
      return;

    try {
      const { message } = await deleteSprint({ id: sprint.id }).unwrap();
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

  const isOpen = editing ? !!sprint : createOpen;
  const isSubmitting = editing ? isUpdating : isCreating;
  const formId = editing ? "edit-sprint-form" : "create-sprint-form";

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      {!editing && (
        <SheetTrigger asChild>
          <Button size="sm">
            <Plus className="size-4" />
            New Sprint
          </Button>
        </SheetTrigger>
      )}

      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">
            {editing ? "Edit Sprint" : "Create Sprint"}
          </SheetTitle>
          <SheetDescription>
            {editing ? "Edit sprint details or delete it." : "Add a new sprint to this project."}
          </SheetDescription>
        </SheetHeader>

        <form
          id={formId}
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto px-4"
        >
          <FieldGroup>
            {/* Name */}
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder={!editing ? "e.g. Sprint 1" : undefined}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Goal */}
            <Controller
              name="goal"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Goal</FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder={!editing ? "What should this sprint achieve?" : undefined}
                    rows={3}
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
                      {Object.values(SPRINT_STATUS).map(status => (
                        <SelectItem key={status} value={status}>
                          {SPRINT_STATUS_LABELS[status]}
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

            {/* Start Date */}
            <Controller
              name="startDate"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Start Date</FieldLabel>
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

            {/* End Date */}
            <Controller
              name="endDate"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>End Date</FieldLabel>
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
                  <AlertDialogTitle>Delete sprint?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete
                    {" "}
                    <strong>{sprint?.name}</strong>
                    {" "}
                    and unassign all tasks from it. This action cannot be undone.
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
              : (isSubmitting ? "Creating..." : "Create Sprint")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
