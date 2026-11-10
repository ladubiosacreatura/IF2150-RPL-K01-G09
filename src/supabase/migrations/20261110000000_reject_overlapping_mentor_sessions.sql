create extension if not exists btree_gist with schema extensions;

alter table public.sessions
  add constraint sessions_no_mentor_time_overlap
  exclude using gist (
    id_mentor extensions.gist_uuid_ops with =,
    tstzrange(scheduled_time, end_time, '[)') with &&
  )
  where (status = 'TERJADWAL');
