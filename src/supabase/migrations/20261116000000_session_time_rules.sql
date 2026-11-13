alter table public.sessions
  add constraint sessions_same_day_duration check (
    (scheduled_time at time zone 'Asia/Jakarta')::date = (end_time at time zone 'Asia/Jakarta')::date
    and end_time - scheduled_time between interval '10 minutes' and interval '12 hours'
  ) not valid;

create function public.enforce_participant_schedule()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_start timestamptz;
  v_end timestamptz;
begin
  select scheduled_time, end_time into v_start, v_end
  from public.sessions
  where id_session = new.id_session;

  if exists (
    select 1
    from public.session_participants p
    join public.sessions s on s.id_session = p.id_session
    where p.id_mentee = new.id_mentee
      and s.id_session <> new.id_session
      and s.status = 'TERJADWAL'
      and s.scheduled_time < v_end
      and s.end_time > v_start
  ) then
    raise exception 'PARTICIPANT_SCHEDULE_CONFLICT';
  end if;

  return new;
end;
$$;

create trigger session_participants_enforce_schedule
before insert on public.session_participants
for each row execute function public.enforce_participant_schedule();
