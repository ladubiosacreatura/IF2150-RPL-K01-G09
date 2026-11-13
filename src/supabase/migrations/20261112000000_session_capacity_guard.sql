-- KF13 (R21): sesi yang sudah penuh menolak Mentee berikutnya.
-- Pemeriksaan di aplikasi (Session.checkCapacity) hanya memberi pesan lebih awal; trigger ini
-- menjamin batas kapasitas tetap aman ketika dua Mentee menekan "Gabung Sesi" bersamaan.
create function public.enforce_session_capacity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_capacity integer;
  v_count integer;
begin
  -- Kunci baris sesi agar pendaftaran bersamaan pada sesi yang sama diproses bergantian.
  select capacity into v_capacity
  from public.sessions
  where id_session = new.id_session
  for update;

  if not found then
    raise exception 'SESSION_NOT_FOUND';
  end if;

  select count(*) into v_count
  from public.session_participants
  where id_session = new.id_session;

  if v_count >= v_capacity then
    raise exception 'SESSION_FULL';
  end if;

  return new;
end;
$$;

create trigger session_participants_enforce_capacity
before insert on public.session_participants
for each row execute function public.enforce_session_capacity();
