# PeerUP

PeerUP is a peer-learning web app for university students. Mentors open study sessions (topic, schedule, online or offline format, capacity 1–20). Mentees set their preferences, get matched sessions, and join them. Each session gets a temporary group chat, a reminder 15 minutes before it starts, and a rating afterwards.

Design documents: SKPL (`docs/M5`), APL (`docs/M6`), DPPL (`docs/M7`, `docs/M8`), and the implementation report (`docs/M9`).

## Tech stack

| Part                           | Technology                                           | Version                    |
| ------------------------------ | ---------------------------------------------------- | -------------------------- |
| Runtime                        | Node.js                                              | 22 or newer (`.nvmrc`: 24) |
| Framework                      | Next.js (App Router, Server Actions, Route Handlers) | 15.5                       |
| UI                             | React, Tailwind CSS                                  | 19.1, 4                    |
| Language                       | TypeScript                                           | 5                          |
| Database, Auth, Realtime, Cron | Supabase (PostgreSQL 17) via Supabase CLI            | CLI 2.x                    |
| Tests                          | Vitest                                               | 5                          |

## Architecture: MVC over client-server, in one Next.js app

The client and the server are one codebase, separated by where code runs (DPPL2 §2.2).

| Layer          | Folder                                                  | Runs on                                       |
| -------------- | ------------------------------------------------------- | --------------------------------------------- |
| View           | `app/**/page.tsx`, `components/`                        | Browser (Client Components) and server render |
| Controller     | `controllers/` (`"use server"` Server Actions)          | Server only                                   |
| Model          | `models/` (types and Supabase queries)                  | Server only (`server-only`)                   |
| Shared support | `lib/validator.ts`                                      | Server and tests                              |
| Adapters       | `lib/adapters/` (Auth, Realtime, Cron), `app/api/cron/` | Server (Realtime: browser)                    |
| Persistence    | `supabase/migrations/`, `supabase/seed.sql`             | PostgreSQL                                    |

## Prerequisites

- Node.js 22 or newer and npm
- Docker Desktop (or another Docker runtime), **only** for option B (local database)

Run every command from `src/`, in the same environment the repository lives in. If you cloned it inside WSL (`\\wsl.localhost\...`), install Node in WSL and run npm from the WSL terminal. Windows npm cannot run scripts on a WSL path. If you cloned it on a Windows drive, run npm from Windows. After switching between the two, delete `node_modules` and run `npm ci` again.

## Install and configure

There are two ways to get a database. The team uses option A.

### Option A: shared hosted Supabase project (default, no Docker)

```bash
cd src
npm ci                       # install dependencies from package-lock.json
cp .env.example .env.local   # then fill in the values below
```

Get the values from the Supabase dashboard (Project Settings → API), or ask a teammate who has access.

| Variable                        | Value                                                 |
| ------------------------------- | ----------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Project URL, e.g. `https://<project-ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable (anon) key                                |
| `SUPABASE_SERVICE_ROLE_KEY`     | Secret (service_role) key, server only                |
| `CRON_SECRET`                   | Any long random string                                |

`SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security and has full admin access to the project. Share it only in a private message, and never commit `.env.local`.

Everyone on option A shares one database, so data one person creates is visible to everyone. Skip the `db:*` scripts: they only control a local database.

In the dashboard, keep **Authentication → Sign In / Providers → Email → Confirm email** turned off. The app does not handle confirmation links, so with it on, new accounts cannot log in. Local Supabase already has it off (`enable_confirmations = false` in `supabase/config.toml`).

Changes to `supabase/migrations/` or `supabase/seed.sql` do not reach the hosted database by themselves. One agreed person applies them after the PR is merged, either by pasting the SQL into the dashboard's SQL Editor or with the CLI (no Docker needed):

```bash
npx supabase link --project-ref <project-ref>   # once
npx supabase db push                            # apply new migrations
```

### Option B: local Supabase (needs Docker)

```bash
cd src
npm ci                       # install dependencies from package-lock.json
npm run db:start             # start local Supabase (first run downloads Docker images)
npm run db:reset             # wipe the local database, apply migrations and seed.sql
npm run db:status            # prints API URL, anon key, and service_role key
cp .env.example .env.local   # then paste the values from db:status
```

| Variable                        | Value                                                         |
| ------------------------------- | ------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | `API URL` from `db:status` (default `http://127.0.0.1:54321`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon key` from `db:status`                                   |
| `SUPABASE_SERVICE_ROLE_KEY`     | `service_role key` from `db:status` (server only)             |
| `CRON_SECRET`                   | Any long random string                                        |

While `db:start` is up, Supabase Studio (database browser) runs at http://127.0.0.1:54323 and Mailpit (catches emails sent by local Auth) at http://127.0.0.1:54324. Stop everything with `npm run db:stop`.

## Run

```bash
npm run dev        # http://localhost:3000
npm test           # unit tests (tests/)
npm run lint
npm run typecheck
npm run format     # Prettier
npm run build
```

## Scheduled jobs

Both endpoints accept `GET` or `POST` with the header `Authorization: Bearer <CRON_SECRET>` and answer 401 without it. A scheduler should call them every minute; repeated calls are safe.

| Endpoint                 | Job                                                                                     |
| ------------------------ | --------------------------------------------------------------------------------------- |
| `/api/cron/reminders`    | Creates the 15-minute session reminders (KF09). Each session is reminded once.          |
| `/api/cron/chat-cleanup` | Closes group chats 48 hours after their session ends and deletes their messages (KF12). |

To trigger one by hand while `npm run dev` is running:

```bash
curl -X POST -H "Authorization: Bearer <CRON_SECRET>" http://localhost:3000/api/cron/reminders
```

## Test accounts

Created by `supabase/seed.sql`, and already present in the shared hosted project. Every password is `password123`. All data is fictional.

| Email                             | Role in seed data                                            |
| --------------------------------- | ------------------------------------------------------------ |
| `mentor.demo@mahasiswa.itb.ac.id` | Mentor of one upcoming and one finished session              |
| `mentee.satu@mahasiswa.itb.ac.id` | Mentee, joined both sessions, has not rated the finished one |
| `mentee.dua@mahasiswa.itb.ac.id`  | Mentee, rated the finished session                           |

Any account can act as a mentor (create a session) or a mentee (join one). Registration only accepts university emails ending in `.ac.id`.

## Modules

| Module               | Use cases              | Main files                                                                                                                                                                                                                                                                                            |
| -------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth & Profile       | UC01, UC02, UC15       | `controllers/userController.ts`, `lib/adapters/authAdapter.ts`, `app/login`, `app/register`, `app/profile`                                                                                                                                                                                            |
| Mentor Sessions      | UC03, UC05, UC11, UC12 | `controllers/sessionController.ts`, `models/session.ts`, `app/sessions/new`, `app/sessions/[id]`, `app/sessions/[id]/edit`, `components/HostSessionPanel.tsx`, `components/EditSessionPanel.tsx`, `components/DeleteSessionButton.tsx`                                                                |
| Discovery & Join     | UC04, UC10, UC14       | `controllers/sessionParticipationController.ts`, `app/dashboard`, `app/discover`, `app/sessions/[id]`, `components/ParticipantSessionPanel.tsx`                                                                                                                                                       |
| Chat & Notifications | UC08, UC09             | `controllers/chatController.ts`, `controllers/chatCleanupController.ts`, `controllers/notificationController.ts`, `controllers/reminderController.ts`, `lib/adapters/realtimeAdapter.ts`, `lib/adapters/cronAdapter.ts`, `app/sessions/[id]/chat`, `app/api/cron`, `components/PopUpNotification.tsx` |
| Feedback & History   | UC06, UC07, UC13       | `controllers/feedbackController.ts`, `controllers/sessionHistoryController.ts`, `models/sessionHistory.ts`, `models/feedback.ts`, `app/sessions/[id]/feedback`, `app/history`, `components/SessionHistoryView.tsx`, `components/FeedbackForm.tsx`, `components/SessionFeedbackView.tsx`               |

Shared files (`models/types.ts`, `models/session.ts`, `lib/validator.ts`, `supabase/migrations/`) change only in their own PR. `models/session.ts` belongs to the Mentor Sessions module but is used by every other session module, so merge its public methods early and keep their signatures stable.

## Database tables

Schema: `supabase/migrations/20261102000000_init.sql`. Every table has Row Level Security enabled.

| Table                  | Columns                                                                                                                                                                                             | DPPL class                       |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `users`                | `id_user` (PK, FK to `auth.users`), `username`, `email`, `data_consent_at`, `created_at`                                                                                                            | C01 User, C02 Mentor, C03 Mentee |
| `profiles`             | `id_user` (PK, FK), `name`, `university`, `study_program`, `bio`                                                                                                                                    | C10 Profile                      |
| `preferences`          | `id_user` (PK, FK), `material_tag` text[], `availability` jsonb, `session_format_preference`                                                                                                        | C09 Preference                   |
| `sessions`             | `id_session` (PK), `id_mentor` (FK), `topic`, `description`, `schedule`, `scheduled_time`, `end_time`, `format`, `capacity` (1–20), `status`, `reason_not_conducted`, `reminder_sent`, `created_at` | C04 Session                      |
| `session_participants` | `id_session` (FK), `id_mentee` (FK), `joined_at`; PK (`id_session`, `id_mentee`)                                                                                                                    | C04 Session.userList             |
| `group_chats`          | `id_group_chat` (PK), `id_session` (FK, unique), `is_active`, `expires_at`                                                                                                                          | C05 GroupChat                    |
| `chat_messages`        | `id_message` (PK), `id_group_chat` (FK), `id_sender` (FK), `text`, `time_stamp`                                                                                                                     | C08 ChatMessage                  |
| `feedbacks`            | `id_feedback` (PK), `id_session` (FK), `id_mentee` (FK), `id_mentor` (FK), `rating` (1–5), `comment`, `date`; unique (`id_session`, `id_mentee`)                                                    | C06 Feedback                     |
| `notifications`        | `notification_id` (PK), `id_user` (FK), `id_session` (FK), `title`, `content`, `timestamp`, `is_read`                                                                                               | C22 Notification                 |

Enums: `session_status` (`TERJADWAL`, `SELESAI`, `TIDAK_TERLAKSANA`, `DIBATALKAN`), `session_format` (`DARING`, `LURING`), `format_preference` (`DARING`, `LURING`, `BOTH`). A trigger creates the group chat when a session is inserted.

Only the mentor can update a `sessions` row directly. To confirm whether an ended session took place (UC05), mentor and mentee both call `supabase.rpc("confirm_session", { p_session, p_status, p_reason })` with `p_status` `SELESAI` or `TIDAK_TERLAKSANA`. A mentee can insert feedback only for a `SELESAI` session they joined, with `id_mentor` set to that session's mentor.

The history page groups a user's sessions by status and lets either session member confirm an ended session. Mentees can submit one 1–5 star rating with an optional comment for each completed session; skipped ratings remain available from the history list.

## Contributing

- `development` is the integration branch. `main` only receives merges from `development`.
- Create the branch from its GitHub issue ("Create a branch" in the issue sidebar) with `development` as the source, so it is named `<issue>-<type>-<kf>-<feature>`, for example `89-feat-kf04-implement-availability-schedule`.
- Commit messages follow `<type>: <description>` with no scope and no issue number, for example `feat: implement KF04 availability schedule`.
- Before opening a PR, run `npm run typecheck`, `npm run lint`, and `npm test`.
- Open the PR against `development`, close its issue (`Closes #12`), attach screenshots or test output, and get one review from another team member.
