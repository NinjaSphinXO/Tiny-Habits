import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAppSelector } from "@/hooks/redux";
import { supabase } from "@/lib/supabase";

export const useHabitsRealtime = () => {
  const queryClient = useQueryClient();
  const userId = useAppSelector((state) => state.auth.user?.id);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase.channel("habits-change");

    channel
      .on("postgres_changes", { event: "*", schema: "public", table: "habits" }, () =>
        queryClient.invalidateQueries({ queryKey: ["habits"] }),
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "habit_logs" }, () =>
        queryClient.invalidateQueries({ queryKey: ["habits"] }),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, userId]);
};
