import { todayLocal } from "@/lib/date";
import { useAppSelector } from "@/hooks/redux";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { HabitWithLogs } from "@/types";

export const useHabits = () => {
  const userId = useAppSelector((state) => state.auth.user?.id);
  const today = todayLocal();

  return useQuery({
    queryKey: ["habits", userId, today],
    queryFn: async (): Promise<HabitWithLogs[]> => {
      const { data, error } = await supabase
        .from("habits")
        .select("*, habit_logs(id, log_date)")
        .eq("habit_logs.log_date", today)
        .order("created_at", { ascending: true })
        .overrideTypes<HabitWithLogs[]>();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};
