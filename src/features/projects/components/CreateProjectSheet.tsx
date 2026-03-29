import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

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
  PROJECT_COLORS,
  PROJECT_STATUS,
  PROJECT_STATUS_LABELS,
} from "@/constants";
import { parseApiError } from "@/utils/error";

import type { CreateProjectFormValues } from "../schemas";

import { useCreateProjectMutation } from "../api";
import { createProjectSchema } from "../schemas";
import { ColorPicker } from "./ColorPicker";

export function CreateProjectSheet() {
  const [createProject, { isLoading }] = useCreateProjectMutation();

  const {
    reset,
    control,
    setError,
    handleSubmit,
  } = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      key: "",
      description: "",
      status: PROJECT_STATUS.PLANNING,
      color: PROJECT_COLORS.BLUE,
      memberIds: [],
    },
  });

  const [open, setOpen] = useState(false);

  const onSubmit = async (values: CreateProjectFormValues) => {
    try {
      const { message } = await createProject(values).unwrap();
      toast.success(message);
      setOpen(false);
      reset();
    }
    catch (err) {
      const { message, fieldErrors } = parseApiError<CreateProjectFormValues>(err);

      Object.entries(fieldErrors).forEach(([field, msg]) => {
        setError(field as keyof CreateProjectFormValues, {
          type: "server",
          message: msg,
        });
      });

      if (Object.keys(fieldErrors).length === 0) {
        toast.error(message);
      }
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen)
      reset();
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" />
          New Project
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">Create Project</SheetTitle>
          <SheetDescription>
            Add a new project to your workspace.
          </SheetDescription>
        </SheetHeader>

        <form
          id="create-project-form"
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
                    placeholder="e.g. WorkSphere"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Key */}
            <Controller
              name="key"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Key</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="e.g. WSP"
                    maxLength={5}
                    className="uppercase"
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
                    placeholder="What is this project about?"
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
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id={field.name} className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(PROJECT_STATUS).map(status => (
                        <SelectItem key={status} value={status}>
                          {PROJECT_STATUS_LABELS[status]}
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

            {/* Color */}
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Color</FieldLabel>
                  <ColorPicker
                    value={field.value}
                    onChange={field.onChange}
                  />
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <SheetFooter>
          <Button
            type="submit"
            form="create-project-form"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Project"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
