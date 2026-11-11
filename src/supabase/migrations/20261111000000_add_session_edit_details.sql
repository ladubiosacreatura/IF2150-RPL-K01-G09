alter table public.sessions
  add column material_tag text not null default '',
  add column meeting_link text not null default '',
  add constraint sessions_material_tag_length check (char_length(material_tag) <= 60),
  add constraint sessions_meeting_link_length check (char_length(meeting_link) <= 500);
