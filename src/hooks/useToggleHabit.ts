import { todayLocal } from "@/lib/date";
import { isUniqueViolation } from "@/lib/errors";
import { supabase } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useToggleHabit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ habitId, done }: { habitId: string; done: boolean }) => {
      const today = todayLocal();
      if (done) {
        const { error } = await supabase
          .from("habit_logs")
          .insert({ habit_id: habitId, log_date: today });

        if (error && !isUniqueViolation(error)) {
          throw error;
        }
      } else {
        const { error } = await supabase
          .from("habit_logs")
          .delete()
          .eq("habit_id", habitId)
          .eq("log_date", today);
        if (error) throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["habits"] }),
  });
};

export default useToggleHabit;
