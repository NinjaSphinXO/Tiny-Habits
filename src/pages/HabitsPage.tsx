import AddHabitDialog from "@/components/AddHabitDialog";
import HabitList from "@/components/HabitList";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/redux";
import { supabase } from "@/lib/supabase";
import { getDisplayName } from "@/lib/user";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const todayReadable = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric",
});

const HabitsPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const queryClient = useQueryClient();

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      {/* ── Header row ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My habits</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Signed in as {getDisplayName(user)}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={async () => {
            const { error } = await supabase.auth.signOut();
            if (error) return toast.error(error.message);
            queryClient.clear();
          }}
        >
          Log out
        </Button>
      </div>

      {/* ── Actions row ────────────────────────────────────────── */}
      <div>
        <AddHabitDialog />
      </div>

      {/* ── List section ───────────────────────────────────────── */}
      <section aria-labelledby="today-heading">
        <div className="mb-3 flex items-baseline gap-3">
          <h2 id="today-heading" className="text-base font-semibold">
            Today
          </h2>
          <span className="text-sm text-muted-foreground">{todayReadable}</span>
        </div>
        <HabitList />
      </section>
    </main>
  );
};

export default HabitsPage;
