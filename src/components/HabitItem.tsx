import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { HabitWithLogs } from "@/types";
import useToggleHabit from "@/hooks/useToggleHabit";
import useDeleteHabit from "@/hooks/useDeleteHabit";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const HabitItem = ({ habit }: { habit: HabitWithLogs }) => {
  const toggleMutation = useToggleHabit();
  const deleteMutation = useDeleteHabit();

  const checked = habit.habit_logs.length > 0;
  const isTogglePending = toggleMutation.isPending;
  const isDeletePending = deleteMutation.isPending;

  const handleCheckedChange = (next: boolean) => {
    if (isTogglePending) return;
    toggleMutation.mutate(
      { habitId: habit.id, done: next },
      {
        onError: () => toast.error("Couldn't update habit. Please try again later."),
      },
    );
  };

  const handleDelete = () => {
    deleteMutation.mutate(habit.id, {
      onError: () => toast.error("Couldn't delete habit. Please try again later."),
    });
  };

  return (
    <li className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-sm transition-colors hover:bg-muted/40">
      <Checkbox
        id={`habit-${habit.id}`}
        checked={checked}
        onCheckedChange={handleCheckedChange}
      />

      <label
        htmlFor={`habit-${habit.id}`}
        className={[
          "flex-1 cursor-pointer select-none text-sm font-medium leading-snug",
          checked ? "text-muted-foreground line-through" : "text-foreground",
        ].join(" ")}
      >
        {habit.title}
      </label>

      {/* Delete button */}
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Delete ${habit.title}`}
        disabled={isDeletePending || isTogglePending}
        onClick={handleDelete}
        className="shrink-0 text-muted-foreground hover:text-destructive"
      >
        <Trash2 aria-hidden="true" />
      </Button>
    </li>
  );
};

export default HabitItem;
