export const SESSION_STATUSES = ["TERJADWAL", "SELESAI", "TIDAK_TERLAKSANA", "DIBATALKAN"] as const;
export type SessionStatus = (typeof SESSION_STATUSES)[number];

export const ARCHIVED_STATUSES = [
  "SELESAI",
  "TIDAK_TERLAKSANA",
  "DIBATALKAN",
] as const satisfies readonly SessionStatus[];

export const SESSION_FORMATS = ["DARING", "LURING"] as const;
export type SessionFormat = (typeof SESSION_FORMATS)[number];
export type FormatPreference = SessionFormat | "BOTH";

export type Availability = { day: number; start: string; end: string };

export const CAPACITY_MIN = 1;
export const CAPACITY_MAX = 20;
export const RATING_MIN = 1;
export const RATING_MAX = 5;
export const REMINDER_LEAD_MINUTES = 15;
export const CHAT_RETENTION_HOURS = 48;

export type UserRow = {
  id_user: string;
  username: string;
  email: string;
  data_consent_at: string;
  created_at: string;
};

export type ProfileRow = {
  id_user: string;
  name: string;
  university: string;
  study_program: string;
  bio: string;
};

export type PreferenceRow = {
  id_user: string;
  material_tag: string[];
  availability: Availability[];
  session_format_preference: FormatPreference | null;
};

export type SessionRow = {
  id_session: string;
  id_mentor: string;
  topic: string;
  description: string;
  material_tag: string;
  schedule: string;
  scheduled_time: string;
  end_time: string;
  meeting_link: string;
  format: SessionFormat;
  capacity: number;
  status: SessionStatus;
  reason_not_conducted: string | null;
  reminder_sent: boolean;
  created_at: string;
};

export type SessionParticipantRow = { id_session: string; id_mentee: string; joined_at: string };

export type GroupChatRow = {
  id_group_chat: string;
  id_session: string;
  is_active: boolean;
  expires_at: string | null;
};

export type ChatMessageRow = {
  id_message: string;
  id_group_chat: string;
  id_sender: string;
  text: string;
  time_stamp: string;
};

export type FeedbackRow = {
  id_feedback: string;
  id_session: string;
  id_mentee: string;
  id_mentor: string;
  rating: number;
  comment: string;
  date: string;
};

export type NotificationRow = {
  notification_id: string;
  id_user: string;
  id_session: string;
  title: string;
  content: string;
  timestamp: string;
  is_read: boolean;
};

export type ProfileData = {
  username: string;
  name: string;
  university: string;
  studyProgram: string;
  bio: string;
};

export type PreferenceData = {
  materialTag: string[];
  availability: Availability[];
  sessionFormatPreference: FormatPreference | null;
};

export type SessionData = {
  topic: string;
  description: string;
  startTime: Date;
  endTime: Date;
  format: SessionFormat;
  capacity: number;
};

export type SessionUpdateData = SessionData & {
  materialTag: string;
  meetingLink: string;
};

export type ActionResult<T = void> = { ok: true; data: T } | { ok: false; error: string };
