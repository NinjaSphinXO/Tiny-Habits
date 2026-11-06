-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;

-- =========================================================
-- GRANTS (what the logged-in role may do at all)
-- =========================================================

grant select, insert, delete on public.habits to authenticated;
grant select, insert, delete on public.habit_logs to authenticated;

-- =========================================================
-- POLICIES: habits
-- =========================================================

create policy "habits: select own"
  on public.habits for select to authenticated
  using (user_id = (select auth.uid()));

create policy "habits: insert own"
  on public.habits for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "habits: delete own"
  on public.habits for delete to authenticated
  using (user_id = (select auth.uid()));

-- =========================================================
-- POLICIES: habit_logs
-- =========================================================

create policy "habit_logs: select own"
  on public.habit_logs for select to authenticated
  using (user_id = (select auth.uid()));

create policy "habit_logs: insert own on own habit"
  on public.habit_logs for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1
      from public.habits h
      where h.id = habit_id
        and h.user_id = (select auth.uid())
    )
  );

create policy "habit_logs: delete own"
  on public.habit_logs for delete to authenticated
  using (user_id = (select auth.uid()));