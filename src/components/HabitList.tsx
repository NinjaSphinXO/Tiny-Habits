import { useHabits } from "@/hooks/useHabits";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import HabitItem from "@/components/HabitItem";

const HabitList = () => {
  const { isPending, isError, isFetching, data, refetch } = useHabits();

  // ── 1. Loading ────────────────────────────────────────────────
  if (isPending && isFetching) {
    return (
      <div role="status" className="space-y-3">
        <span className="sr-only">Loading habits…</span>
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  // ── 2. Error ──────────────────────────────────────────────────
  if (isError) {
    return (
      <div
        role="alert"
        className="flex flex-col items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
      >
        <p className="font-medium">Something went wrong while loading your habits.</p>
        <Button
          variant="outline"
          size="sm"
          disabled={isFetching}
          onClick={() => refetch()}
        >
          {isFetching ? "Retrying…" : "Retry"}
        </Button>
      </div>
    );
  }

  // ── 3. Empty ──────────────────────────────────────────────────
  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center">
        <p className="text-sm font-medium text-foreground">No habits yet.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Use <span className="font-bold text-green-400">Add habit</span> to get started.
        </p>
      </div>
    );
  }

  // ── 4. Data ───────────────────────────────────────────────────
  return (
    <ul className="space-y-2">
      {data.map((habit) => (
        <HabitItem key={habit.id} habit={habit} />
      ))}
    </ul>
  );
};

export default HabitList;
