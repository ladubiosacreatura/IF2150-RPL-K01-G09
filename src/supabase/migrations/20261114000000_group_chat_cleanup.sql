create function public.close_expired_group_chats(
  p_now timestamptz default now(),
  p_retention_hours integer default 48
)
returns integer
language plpgsql
set search_path = public
as $$
declare
  v_closed integer;
begin
  with expired as (
    update public.group_chats g
    set is_active = false,
        expires_at = s.end_time + make_interval(hours => p_retention_hours)
    from public.sessions s
    where s.id_session = g.id_session
      and g.is_active
      and s.end_time + make_interval(hours => p_retention_hours) <= p_now
    returning g.id_group_chat
  ),
  purged as (
    delete from public.chat_messages m
    using expired e
    where m.id_group_chat = e.id_group_chat
    returning 1
  )
  select count(*) into v_closed from expired;

  return v_closed;
end;
$$;

revoke execute on function public.close_expired_group_chats(timestamptz, integer) from public, anon, authenticated;
grant execute on function public.close_expired_group_chats(timestamptz, integer) to service_role;
