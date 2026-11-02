create type public.session_status as enum ('TERJADWAL', 'SELESAI', 'TIDAK_TERLAKSANA', 'DIBATALKAN');
create type public.session_format as enum ('DARING', 'LURING');
create type public.format_preference as enum ('DARING', 'LURING', 'BOTH');

create table public.users (
  id_user uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  email text not null unique,
  data_consent_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.profiles (
  id_user uuid primary key references public.users (id_user) on delete cascade,
  name text not null,
  university text not null,
  study_program text not null,
  bio text not null default ''
);

create table public.preferences (
  id_user uuid primary key references public.users (id_user) on delete cascade,
  material_tag text[] not null default '{}',
  availability jsonb not null default '[]'::jsonb,
  session_format_preference public.format_preference
);

create table public.sessions (
  id_session uuid primary key default gen_random_uuid(),
  id_mentor uuid not null references public.users (id_user) on delete cascade,
  topic text not null,
  description text not null default '',
  schedule date not null,
  scheduled_time timestamptz not null,
  end_time timestamptz not null,
  format public.session_format not null,
  capacity integer not null check (capacity between 1 and 20),
  status public.session_status not null default 'TERJADWAL',
  reason_not_conducted text,
  reminder_sent boolean not null default false,
  created_at timestamptz not null default now(),
  check (end_time > scheduled_time)
);

create table public.session_participants (
  id_session uuid not null references public.sessions (id_session) on delete cascade,
  id_mentee uuid not null references public.users (id_user) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (id_session, id_mentee)
);

create table public.group_chats (
  id_group_chat uuid primary key default gen_random_uuid(),
  id_session uuid not null unique references public.sessions (id_session) on delete cascade,
  is_active boolean not null default true,
  expires_at timestamptz
);

create table public.chat_messages (
  id_message uuid primary key default gen_random_uuid(),
  id_group_chat uuid not null references public.group_chats (id_group_chat) on delete cascade,
  id_sender uuid not null references public.users (id_user) on delete cascade,
  text text not null check (length(trim(text)) > 0),
  time_stamp timestamptz not null default now()
);

create table public.feedbacks (
  id_feedback uuid primary key default gen_random_uuid(),
  id_session uuid not null references public.sessions (id_session) on delete cascade,
  id_mentee uuid not null references public.users (id_user) on delete cascade,
  id_mentor uuid not null references public.users (id_user) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text not null default '',
  date timestamptz not null default now(),
  unique (id_session, id_mentee)
);

create table public.notifications (
  notification_id uuid primary key default gen_random_uuid(),
  id_user uuid not null references public.users (id_user) on delete cascade,
  id_session uuid not null references public.sessions (id_session) on delete cascade,
  title text not null,
  content text not null,
  timestamp timestamptz not null default now(),
  is_read boolean not null default false
);

create index on public.sessions (id_mentor);
create index on public.session_participants (id_mentee);
create index on public.chat_messages (id_group_chat);
create index on public.feedbacks (id_session);
create index on public.notifications (id_user);

create function public.create_group_chat_for_session()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.group_chats (id_session) values (new.id_session);
  return new;
end;
$$;

create trigger sessions_create_group_chat
after insert on public.sessions
for each row execute function public.create_group_chat_for_session();

create function public.is_session_member(p_session uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.sessions s where s.id_session = p_session and s.id_mentor = auth.uid())
      or exists (select 1 from public.session_participants p where p.id_session = p_session and p.id_mentee = auth.uid());
$$;

alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.preferences enable row level security;
alter table public.sessions enable row level security;
alter table public.session_participants enable row level security;
alter table public.group_chats enable row level security;
alter table public.chat_messages enable row level security;
alter table public.feedbacks enable row level security;
alter table public.notifications enable row level security;

create policy users_select on public.users for select to authenticated using (true);
create policy users_insert on public.users for insert to authenticated with check (id_user = auth.uid());
create policy users_update on public.users for update to authenticated using (id_user = auth.uid());

create policy profiles_select on public.profiles for select to authenticated using (true);
create policy profiles_insert on public.profiles for insert to authenticated with check (id_user = auth.uid());
create policy profiles_update on public.profiles for update to authenticated using (id_user = auth.uid());

create policy preferences_all on public.preferences for all to authenticated
  using (id_user = auth.uid()) with check (id_user = auth.uid());

create policy sessions_select on public.sessions for select to authenticated using (true);
create policy sessions_insert on public.sessions for insert to authenticated with check (id_mentor = auth.uid());
create policy sessions_update on public.sessions for update to authenticated
  using (public.is_session_member(id_session));

create policy participants_select on public.session_participants for select to authenticated using (true);
create policy participants_insert on public.session_participants for insert to authenticated with check (id_mentee = auth.uid());
create policy participants_delete on public.session_participants for delete to authenticated using (id_mentee = auth.uid());

create policy group_chats_select on public.group_chats for select to authenticated
  using (public.is_session_member(id_session));
create policy chat_messages_select on public.chat_messages for select to authenticated
  using (exists (select 1 from public.group_chats g
                 where g.id_group_chat = chat_messages.id_group_chat and public.is_session_member(g.id_session)));
create policy chat_messages_insert on public.chat_messages for insert to authenticated
  with check (id_sender = auth.uid() and exists (
    select 1 from public.group_chats g
    where g.id_group_chat = chat_messages.id_group_chat and g.is_active and public.is_session_member(g.id_session)));
create policy chat_messages_modify on public.chat_messages for update to authenticated using (id_sender = auth.uid());
create policy chat_messages_delete on public.chat_messages for delete to authenticated using (id_sender = auth.uid());

create policy feedbacks_select on public.feedbacks for select to authenticated
  using (id_mentee = auth.uid() or id_mentor = auth.uid());
create policy feedbacks_insert on public.feedbacks for insert to authenticated with check (id_mentee = auth.uid());

create policy notifications_select on public.notifications for select to authenticated using (id_user = auth.uid());
create policy notifications_update on public.notifications for update to authenticated using (id_user = auth.uid());

alter publication supabase_realtime add table public.chat_messages, public.notifications;
