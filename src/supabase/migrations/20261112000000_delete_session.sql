alter table public.notifications
  alter column id_session drop not null;

alter table public.notifications
  drop constraint notifications_id_session_fkey,
  add constraint notifications_id_session_fkey
    foreign key (id_session) references public.sessions (id_session) on delete set null;

create function public.delete_session(p_session uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_mentor uuid;
  v_topic text;
  v_participant_count integer;
begin
  select s.id_mentor, s.topic
    into v_mentor, v_topic
    from public.sessions s
    where s.id_session = p_session
    for update;

  if not found or v_mentor is distinct from auth.uid() then
    raise exception 'session not found or not owned';
  end if;

  select count(*)
    into v_participant_count
    from public.session_participants p
    where p.id_session = p_session;

  insert into public.notifications (id_user, id_session, title, content)
    select p.id_mentee, p.id_session, 'Sesi dibatalkan',
      'Sesi "' || v_topic || '" yang Anda ikuti telah dihapus oleh mentor.'
    from public.session_participants p
    where p.id_session = p_session;

  delete from public.sessions s
    where s.id_session = p_session and s.id_mentor = auth.uid();

  if not found then
    raise exception 'session not found or not owned';
  end if;

  return v_participant_count;
end;
$$;

revoke execute on function public.delete_session(uuid) from public, anon;
grant execute on function public.delete_session(uuid) to authenticated;
