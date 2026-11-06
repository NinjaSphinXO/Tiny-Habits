import { supabase } from "@/lib/supabase";
import type { Habit } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddHabit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (title: string) => {
      const { data, error } = await supabase
        .from("habits")
        .insert({ title })
        .select()
        .single()
        .overrideTypes<Habit>();

      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["habits"] }),
  });
};
