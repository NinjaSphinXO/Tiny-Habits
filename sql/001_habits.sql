-- habits: one row per habit a user creates
create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 40),
  created_at timestamptz not null default now()
);

-- one title per user, ignoring case and surrounding spaces
create unique index habits_user_title_unique
  on public.habits (user_id, lower(btrim(title)));

-- habit_logs: one row = "this habit was done on this day"
create table public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null
    references public.habits (id) on delete cascade,
  user_id uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  log_date date not null,
  created_at timestamptz not null default now(),
  unique (habit_id, log_date)
);