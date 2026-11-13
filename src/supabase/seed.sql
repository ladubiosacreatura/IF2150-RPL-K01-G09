do $$
declare
  v_mentor  uuid := '11111111-1111-1111-1111-111111111111';
  v_mentee1 uuid := '22222222-2222-2222-2222-222222222222';
  v_mentee2 uuid := '33333333-3333-3333-3333-333333333333';
  v_upcoming uuid := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  v_done     uuid := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
  v_today    date := (now() at time zone 'Asia/Jakarta')::date;
  u record;
begin
  for u in
    select * from (values
      (v_mentor,  'mentor.demo@mahasiswa.itb.ac.id'),
      (v_mentee1, 'mentee.satu@mahasiswa.itb.ac.id'),
      (v_mentee2, 'mentee.dua@mahasiswa.itb.ac.id')
    ) as t(id, email)
  loop
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, email_change, email_change_token_new, recovery_token
    ) values (
      '00000000-0000-0000-0000-000000000000', u.id, 'authenticated', 'authenticated', u.email,
      extensions.crypt('password123', extensions.gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
    );
    insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    values (gen_random_uuid(), u.id, u.id::text,
            jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true),
            'email', now(), now(), now());
  end loop;

  insert into public.users (id_user, username, email) values
    (v_mentor,  'mentor_demo', 'mentor.demo@mahasiswa.itb.ac.id'),
    (v_mentee1, 'mentee_satu', 'mentee.satu@mahasiswa.itb.ac.id'),
    (v_mentee2, 'mentee_dua',  'mentee.dua@mahasiswa.itb.ac.id');

  insert into public.profiles (id_user, name, university, study_program, bio) values
    (v_mentor,  'Mentor Demo', 'Institut Teknologi Bandung', 'Teknik Informatika', 'Suka mengajar struktur data.'),
    (v_mentee1, 'Mentee Satu', 'Institut Teknologi Bandung', 'Sistem dan Teknologi Informasi', ''),
    (v_mentee2, 'Mentee Dua',  'Institut Teknologi Bandung', 'Teknik Informatika', '');

  insert into public.preferences (id_user, material_tag, availability, session_format_preference) values
    (v_mentee1, array['Struktur Data', 'Kalkulus'],
     '[{"day":1,"start":"08:00","end":"22:00"},{"day":3,"start":"08:00","end":"22:00"},{"day":5,"start":"08:00","end":"22:00"}]',
     'BOTH'),
    (v_mentee2, array['Struktur Data'],
     '[{"day":0,"start":"00:00","end":"23:59"},{"day":1,"start":"00:00","end":"23:59"},{"day":2,"start":"00:00","end":"23:59"},{"day":3,"start":"00:00","end":"23:59"},{"day":4,"start":"00:00","end":"23:59"},{"day":5,"start":"00:00","end":"23:59"},{"day":6,"start":"00:00","end":"23:59"}]',
     'DARING');

  insert into public.sessions (id_session, id_mentor, topic, description, schedule, scheduled_time, end_time, format, capacity)
  values (v_upcoming, v_mentor, 'Struktur Data', 'Latihan soal pohon biner dan graf.',
          v_today + 2, (v_today + 2 + time '10:00') at time zone 'Asia/Jakarta', (v_today + 2 + time '12:00') at time zone 'Asia/Jakarta',
          'DARING', 5);
  insert into public.session_participants (id_session, id_mentee) values (v_upcoming, v_mentee1);

  insert into public.sessions (id_session, id_mentor, topic, description, schedule, scheduled_time, end_time, format, capacity, status)
  values (v_done, v_mentor, 'Kalkulus', 'Review integral parsial.',
          v_today - 3, (v_today - 3 + time '10:00') at time zone 'Asia/Jakarta', (v_today - 3 + time '12:00') at time zone 'Asia/Jakarta',
          'LURING', 10, 'SELESAI');
  insert into public.session_participants (id_session, id_mentee) values (v_done, v_mentee1), (v_done, v_mentee2);
  insert into public.feedbacks (id_session, id_mentee, id_mentor, rating, comment)
  values (v_done, v_mentee2, v_mentor, 5, 'Penjelasannya jelas sekali.');

  insert into public.chat_messages (id_group_chat, id_sender, text)
  select id_group_chat, v_mentor, 'Halo semua, silakan siapkan pertanyaan.'
  from public.group_chats where id_session = v_upcoming;
end;
$$;
