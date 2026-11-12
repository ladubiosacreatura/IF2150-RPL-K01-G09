-- UC09: one transaction, so a failed run leaves reminder_sent = false for the next cron
-- call to retry (KNF03); SKIP LOCKED stops overlapping runs from notifying twice.
create function public.send_session_reminders(
  p_now timestamptz default now(),
  p_lead_minutes integer default 15
)
returns integer
language plpgsql
set search_path = public
as $$
declare
  v_sent integer;
begin
  with due as (
    select s.id_session, s.id_mentor, s.topic, s.scheduled_time
    from public.sessions s
    where s.status = 'TERJADWAL'
      and not s.reminder_sent
      and s.scheduled_time > p_now
      and s.scheduled_time <= p_now + make_interval(mins => p_lead_minutes)
    for update skip locked
  ),
  recipients as (
    select d.id_session, d.id_mentor as id_user, d.topic, d.scheduled_time
    from due d
    union
    select d.id_session, p.id_mentee, d.topic, d.scheduled_time
    from due d
    join public.session_participants p on p.id_session = d.id_session
  ),
  inserted as (
    insert into public.notifications (id_user, id_session, title, content)
    select
      r.id_user,
      r.id_session,
      format('Sesi dimulai %s menit lagi', p_lead_minutes),
      format('%s · %s WIB', r.topic, to_char(r.scheduled_time at time zone 'Asia/Jakarta', 'HH24.MI'))
    from recipients r
    returning 1
  ),
  reminded as (
    update public.sessions s
    set reminder_sent = true
    from due d
    where s.id_session = d.id_session
    returning 1
  )
  select count(*) into v_sent from inserted;

  return v_sent;
end;
$$;

revoke execute on function public.send_session_reminders(timestamptz, integer) from public, anon, authenticated;
grant execute on function public.send_session_reminders(timestamptz, integer) to service_role;
