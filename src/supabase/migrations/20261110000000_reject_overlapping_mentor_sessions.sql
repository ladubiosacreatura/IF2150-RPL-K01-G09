create function public.reject_overlapping_mentor_sessions()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if new.status = 'TERJADWAL' then
    perform pg_advisory_xact_lock(hashtext(new.id_mentor::text), 0);

    if exists (
      select 1
      from public.sessions existing
      where existing.id_mentor = new.id_mentor
        and existing.status = 'TERJADWAL'
        and existing.id_session <> new.id_session
        and existing.scheduled_time < new.end_time
        and existing.end_time > new.scheduled_time
    ) then
      raise exception 'Tutor already has an overlapping scheduled session.'
        using
          errcode = '23P01',
          detail = 'A tutor cannot schedule overlapping sessions.',
          constraint = 'sessions_no_mentor_time_overlap';
    end if;
  end if;

  return new;
end;
$$;

revoke all on function public.reject_overlapping_mentor_sessions() from public, anon, authenticated;

create trigger sessions_reject_overlapping_mentor_sessions
before insert or update of id_mentor, scheduled_time, end_time, status
on public.sessions
for each row
execute function public.reject_overlapping_mentor_sessions();
