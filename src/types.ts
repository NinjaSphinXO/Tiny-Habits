export type Habit = {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
};

export type HabitLog = {
  id: string;
  habit_id: string;
  user_id: string;
  log_date: string;
  created_at: string;
};

export type HabitWithLogs = Habit & {
  habit_logs: Pick<HabitLog, "id" | "log_date">[];
};
