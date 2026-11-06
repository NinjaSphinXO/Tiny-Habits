import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { habitSchema } from "@/lib/schemas";
import type { HabitValues } from "@/lib/schemas";
import { useAddHabit } from "@/hooks/useAddHabit";
import { isUniqueViolation } from "@/lib/errors";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const AddHabitDialog = () => {
  const [open, setOpen] = useState(false);

  const { mutateAsync } = useAddHabit();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<HabitValues>({
    resolver: zodResolver(habitSchema),
    defaultValues: { title: "" },
  });

  const onSubmit = async (values: HabitValues) => {
    try {
      await mutateAsync(values.title);
      reset();
      setOpen(false);
    } catch (error) {
      if (isUniqueViolation(error)) {
        setError("title", { type: "server", message: "You already have this habit" });
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button className="my-3">Add habit</Button>} />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a habit</DialogTitle>
          <DialogDescription>
            Give your habit a short name, up to 40 characters.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field data-invalid={!!errors.title}>
            <FieldLabel htmlFor="habit-title">Title</FieldLabel>
            <Input
              id="habit-title"
              type="text"
              autoComplete="off"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "habit-title-error" : undefined}
              {...register("title")}
            />
            {errors.title && (
              <FieldError id="habit-title-error">{errors.title.message}</FieldError>
            )}
          </Field>

          <DialogFooter className="mt-4">
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add habit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHabitDialog;
