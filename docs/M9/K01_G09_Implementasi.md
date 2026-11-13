<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 9
<br>
IMPLEMENTASI PERANGKAT LUNAK
</h1>
<br>

## PeerUP

### <img alt="Arsitektur MVC PeerUP" src="./assets/Logo_PeerUP.jpeg" width="30%">

### Untuk: Mikhael Andrian Yonatan

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | *K01* |
| Kelompok | *G09* |
| Nama Kelompok | *PindahCSUI*|

| NIM        | Nama                                 |
|---         |---                                   |
| *13525049* | *Hugo Daniel Johansen Napitupulu*    |
| *13525001* | *Matthew Allen Reynaldo*             |
| *13525010* | *Fabian Amzar Susanto*               |
| *13525025* | *David Christian*                    |
| *13525028* | *Markus Christiano Simanjuntak*      |
---


# BAGIAN A: Ketentuan Implementasi

## A.1 Deskripsi Tugas

Pada tugas ini, kalian mengimplementasikan perangkat lunak yang telah dirancang pada tugas-tugas sebelumnya (SKPL, APL, DPPL) menjadi aplikasi yang **dapat dijalankan**. Platform bebas (web, desktop, atau mobile) selama aplikasi dapat dijalankan ulang oleh asisten mengikuti petunjuk kalian.

Ketentuan umum:
- Setiap anggota bertanggung jawab atas **minimal satu fitur atau modul** dan harus terlihat jelas di riwayat commit/PR.
- Implementasi harus **mengacu pada DPPL**. Jika ada yang berubah (kelas, layar, basis data, dsb.), catat di Bagian B.1. Perubahan itu wajar, tetapi harus tercatat dan beralasan.
- Implementasi **tidak harus berupa kelas** (misalnya fungsi, komponen, *route/handler*, *stored procedure*, atau skrip). Namun, setiap kelas perancangan pada DPPL **wajib dapat ditelusuri** ke implementasinya, dan penelusuran ini dicatat di Bagian B.5.
- Seluruh use case pada SKPL **diprioritaskan** untuk diimplementasikan. Status tiap use case akan dilaporkan pada HIUPL (Tugas 10).
- Seluruh mahasiswa **wajib** mengikuti asistensi akbar.

## A.2 Platform, Bahasa, dan Teknologi

Kalian **bebas** memilih bahasa, framework, library, dan basis data, dengan syarat:

1. **Dapat dijalankan ulang** oleh asisten pada mesin biasa dengan mengikuti README. Versi bahasa/runtime dan seluruh dependensi harus tertulis jelas.
2. **Dependensi dikelola lewat file standar**, misalnya `package.json` + lockfile, `requirements.txt`/`pyproject.toml`, `pom.xml`/`build.gradle`, `composer.json`, `pubspec.yaml`, dan sejenisnya. Jangan meng-commit folder hasil instalasi (`node_modules/`, `venv/`, `build/`, dll.).
3. **Jika memakai layanan eksternal** (basis data cloud, API pihak ketiga, auth, dll.), sediakan cara menjalankan tanpa akun pribadi kalian, atau sediakan data/akun uji pada README. Basis data **sangat disarankan** dapat dijalankan lokal (SQLite, atau Docker Compose untuk PostgreSQL/MySQL/MongoDB).
4. **Arsitektur sesuai DPPL.** Pola arsitektur yang kalian pilih di APL/DPPL (MVC, layered, client-server, dll.) harus terlihat pada struktur kode.

Ketentuan tambahan per platform:

| Platform | Ketentuan |
| :--- | :--- |
| **Web** | Berjalan lokal lewat satu-dua perintah yang terdokumentasi. Boleh juga di-*deploy*; jika ya, cantumkan URL, tetapi **tetap wajib bisa dijalankan lokal** (URL deploy bisa mati). |
| **Desktop** | Berjalan dari source lewat perintah yang terdokumentasi. Build/installer opsional. |
| **Mobile** | Berjalan di emulator/simulator atau perangkat. Sertakan langkah menjalankan, dan **sangat disarankan** melampirkan APK/build di Release. |

## A.3 Keamanan Repository

Repo fork kelompok bersifat **public**, sehingga:

- **Dilarang** meng-commit password, API key, token, `.env` asli, sertifikat/private key, atau data pribadi. Hal ini dapat mengurangi nilai.
- Sediakan `.env.example` berisi nama variabel tanpa nilai rahasia, dan masukkan `.env` ke `.gitignore`.
- Jika sudah terlanjur ter-commit, **cabut/ganti** kredensial tersebut. Menghapus commit saja tidak cukup.
- Data uji/seed harus berupa data fiktif.

## A.4 Struktur Folder

Seluruh kode ditempatkan di `src/` pada repo fork. Jangan mengubah folder milestone lama.

```
src/                              # SELURUH kode implementasi
	README.md                     # dokumentasi utama aplikasi (lihat A.5)
	.env.example                  # jika memakai environment variable
	<struktur kode kalian>        # bebas, mengikuti pola arsitektur DPPL
	tests/                        # test case (jika ada)
docs/
	M9/
		KXX_GYY_Implementasi.md   # laporan ini (Bagian B)
		KXX_GYY_Form-Asistensi.md
```

Catatan:
- `README.md` aplikasi diletakkan di **`src/README.md`**, bukan di root repo.
- Jika kerangka kerja kalian mewajibkan struktur tertentu (misalnya Maven `src/main/java`, Flutter `lib/`, monorepo `frontend/` dan `backend/`), letakkan semuanya **di dalam `src/`**.
- Nama file dan folder pada `docs/M9/` mengikuti aturan penamaan milestone sebelumnya (`KXX_GYY_...`).

## A.5 Isi Minimal `src/README.md`

README harus cukup bagi orang yang belum pernah melihat proyek kalian untuk menjalankan aplikasi dari nol. Minimal berisi:

1. **Deskripsi singkat** aplikasi.
2. **Teknologi yang digunakan** beserta versi (bahasa, framework, basis data).
3. **Prasyarat dan instalasi** (software yang harus ada, perintah instalasi dependensi).
4. **Konfigurasi** (environment variable, setup basis data, migrasi/seed) dan langkah demi langkah menjalankannya.
5. **Cara menjalankan aplikasi** (dan cara menjalankan test, jika ada).
6. **Akun/data uji** untuk mencoba tiap peran pengguna (jika ada login).
7. **Daftar modul/fitur yang diimplementasi** beserta pembagian anggota.
8. **Daftar tabel/koleksi basis data** beserta atributnya (atau tautan ke skema/ERD).

## A.6 Best Practices

Kalian dianjurkan menerapkan praktik berikut. Bukti penerapannya dirangkum pada Bagian B.2.

### 1. Branching
Sesuai aturan umum di README repository, `main` fork kelompok dijaga agar tetap bisa menerima sync dari asisten. Pada tugas ini **sangat disarankan** memakai branch per fitur dengan format `<tipe>/<nama-fitur>` (contoh: `feat/login-page`, `fix/null-cart`), lalu digabungkan ke `main` melalui Pull Request. Skema Gitflow penuh (dengan `develop`) boleh dipakai, tetapi tidak diwajibkan.

### 2. Semantic Commit
Gunakan format `<tipe>(<scope>): <deskripsi>`, misalnya `feat(auth): tambah validasi email`.

| Tipe | Kegunaan |
| :--- | :--- |
| `feat` | Menambahkan fitur baru |
| `fix` | Memperbaiki bug |
| `docs` | Mengubah dokumentasi |
| `style` | Perubahan format/spasi, tanpa mengubah logika |
| `refactor` | Perubahan kode yang tidak menambah fitur atau memperbaiki bug |
| `test` | Menambah/memperbaiki pengujian |
| `chore` | Tugas rutin (build, dependensi, konfigurasi) |

### 3. Track Tasks
Gunakan **GitHub Issues** (dan opsional GitHub Projects) untuk membagi tugas dan melacak progres.
- Pecah fitur besar menjadi issue yang lebih kecil dan tetapkan penanggung jawabnya.
- Hubungkan PR dengan issue (`Closes #12`) dan tutup issue ketika selesai.

### 4. Pull Request dan Code Review
- Setiap PR berisi penjelasan deskriptif tentang apa yang dikerjakan, beserta bukti (tangkapan layar/rekaman/hasil test).
- Setiap PR di-*review* minimal **1 anggota lain**, dengan komentar konstruktif atau approval.

### 5. Pengujian dan Optimasi Performa
- Tulis pengujian untuk logika inti (unit test dan/atau pengujian alur utama). Cakupan penuh tidak diwajibkan, tetapi pengujian pada logika utama dinilai.
- Lakukan **profiling** pada setidaknya satu fitur yang berat (query besar, proses pengolahan data, render list panjang, dsb.), lalu catat temuan dan perbaikannya. Contoh alat:

| Platform | Contoh alat |
| :--- | :--- |
| Web (frontend) | Chrome DevTools (Performance/Network), Lighthouse |
| Web (backend) | Profiler bawaan bahasa, `EXPLAIN` pada query basis data, logging waktu respons |
| Python | `cProfile`, `PyInstrument` |
| Java | VisualVM, JProfiler |
| Mobile | Android Studio Profiler, Flutter DevTools, Xcode Instruments |

### 6. Penggunaan AI
Penggunaan AI **tetap harus dicatat** pada `docs/KXX_GYY_AI-Usage.md` sesuai ketentuan yang sudah berlaku.

## A.7 Pengumpulan

Pengumpulan dinilai dari **tag release**, bukan commit terakhir.

1. Pastikan seluruh pekerjaan sudah di-*commit* dan di-*push* ke `main` fork kelompok.
2. Buat release dengan tag **`v9.0`** (revisi berikutnya `v9.1`, `v9.2`, dst.) dengan target branch `main`.
3. Yang dinilai adalah **tag terakhir yang dibuat sebelum deadline**.

## A.8 Aturan Tanya Jawab

Agar semua kelompok mendapat jawaban yang sama, pertanyaan dibagi menjadi dua jalur:

| Jenis Pertanyaan | Jalur |
| :--- | :--- |
| **Ketentuan tugas**, misalnya teknologi yang diperbolehkan, struktur folder, format pengumpulan, dan penilaian | **Sheets QnA:** *[tautan sheets QnA]* |
| **Kendala teknis kelompok sendiri**, misalnya error, setup, dan penggunaan git | Grup kelompok bersama asisten masing-masing |

Ketentuan:
1. Pertanyaan tentang ketentuan tugas **wajib** diajukan melalui Sheets QnA. Periksa terlebih dahulu apakah pertanyaan serupa sudah dijawab.
2. Jika pertanyaan tentang ketentuan tugas tetap diajukan langsung kepada asisten kelompok, asisten **berhak menolak menjawab** dan meminta kelompok memasukkan pertanyaannya ke Sheets QnA.
3. Jika pertanyaan di Sheets QnA **belum dijawab dalam 24 jam**, kelompok boleh menghubungi asisten kelompok masing-masing. Cantumkan pertanyaan yang sudah diajukan di sheets tersebut.
4. Jawaban pada Sheets QnA berlaku untuk **seluruh kelompok** dan menjadi acuan jika terjadi perbedaan pemahaman.

---

# BAGIAN B: Laporan Implementasi

## B.1 Perubahan dari DPPL

Tabel B.1. Perubahan dari DPPL

| No | Bagian DPPL | Rancangan Awal | Implementasi Akhir | Alasan |
| :--- | :--- | :--- | :--- | :--- |
| 1 | C02 Mentor, C03 Mentee | Kelas tersendiri yang mewarisi *User* | Tidak menjadi kelas; peran ditentukan oleh kolom `sessions.id_mentor` dan tabel `session_participants` | Satu pengguna dapat menjadi mentor sekaligus mentee, sehingga peran lebih tepat sebagai relasi daripada subkelas |
| 2 | C13 SessionControl / *SessionController* | Satu *controller* untuk seluruh operasi sesi | Dipecah menjadi `sessionController.ts`, `sessionParticipationController.ts`, dan `sessionHistoryController.ts` | Mengikuti pembagian modul antaranggota agar perubahan tidak saling bertabrakan |
| 3 | C17, C18, C19 *SessionView* | Satu komponen *SessionView* untuk mentor dan mentee | Halaman `app/sessions/[id]/page.tsx` dengan panel terpisah (`HostSessionPanel`, `EditSessionPanel`, `ParticipantSessionPanel`, `DeleteSessionButton`) dan *route* `/sessions/new`, `/sessions/[id]/edit` | Komponen kecil per peran lebih mudah diuji dan dikerjakan paralel |
| 4 | C15 LoginPage | Satu halaman dengan `formMode` login/registrasi | Dua *route*: `/login` dan `/register` | Lebih sederhana dan setiap URL dapat diakses langsung |
| 5 | UC11 Konfirmasi Keterlaksanaan, `processSessionConfirmation()` | Tombol "Terlaksana"/"Tidak Terlaksana" pada halaman detail sesi | `processSessionCompletion()` pada halaman riwayat/feedback, memanggil RPC SQL `confirm_session()` | Konfirmasi dan feedback berada pada alur yang sama setelah sesi berakhir; RPC menjamin perubahan status atomik |
| 6 | C04 Session, `checkCapacity()` (KF13, KF14) | Pemeriksaan kapasitas di *controller* | Tetap di *controller*, ditambah *trigger* SQL `enforce_session_capacity()` (`SESSION_FULL`) | Mencegah kapasitas terlampaui saat dua mentee bergabung bersamaan (*race condition*) |
| 7 | KF06 Tabrakan jadwal mentor | Validasi `validateScheduleConflict()` di *controller* | Validasi di *controller* ditambah *exclusion constraint* `btree_gist` pada tabel `sessions` untuk sesi `TERJADWAL` | Aturan bisnis tetap terjaga di basis data meskipun ada permintaan bersamaan |
| 8 | C04 Session, `markAsDeleted()` (KF16) | *Soft delete* lewat `markAsDeleted()` | Fungsi SQL `delete_session()` yang mengubah status menjadi Dibatalkan dan memberi notifikasi peserta; `notifications.id_session` menjadi *nullable* (`on delete set null`) | Perubahan status dan notifikasi dijalankan dalam satu transaksi |
| 9 | Tabel `sessions` (KF17) | Atribut sesi pada DPPL | Kolom baru `material_tag` dan `meeting_link` | Dibutuhkan oleh formulir edit sesi dan tampilan detail |
| 10 | C22 Notification, C05 GroupChat (KF09, KF12) | Pekerjaan terjadwal dari *Cron* | *Route* `app/api/cron/reminders` dan `app/api/cron/chat-cleanup` yang dilindungi `CRON_SECRET` dan memanggil fungsi SQL `send_session_reminders()` serta `close_expired_group_chats()` | Dapat dipanggil penjadwal eksternal apa pun dan aman dipanggil berulang |
| 11 | C06 Feedback, `existsBySessionAndAuthor()` | Operasi pemeriksaan terpisah | *Unique constraint* (`id_session`, `id_mentee`) yang memicu `FeedbackAlreadyExistsError` | Mencegah feedback ganda tanpa kueri tambahan |
| 12 | C07 SessionHistory, `getArchivedSessions()` | Operasi pada *SessionController* | `SessionHistory.listForUser()` dengan satu kueri relasi `session_participants → sessions` dan kueri feedback paralel | Hasil optimasi profiling (B.2.1) |
| 13 | C13 SessionControl, `validateSessionTime()` (KF20, Algo-C13-04) | Operasi pada *SessionController* | Fungsi murni `validateSessionTime()` di `lib/validator.ts`, dipanggil `processSessionCreation()` dan `processSessionUpdate()`, ditambah *check constraint* `sessions_same_day_duration` (zona waktu Asia/Jakarta, 10 menit–12 jam) | Aturan dipakai bersama dan diuji unit tanpa basis data; *constraint* mencegah data yang melanggar aturan masuk lewat jalur lain. *Constraint* bersifat `NOT VALID` sehingga hanya berlaku untuk sesi baru dan sesi yang diubah |
| 14 | C13 SessionControl, `validateParticipantSchedule()`; C04 `getSessionsByParticipantInRange()`, Q-C04-14 (KF21) | Pemeriksaan di *controller* melalui query Q-C04-14 sebelum `addParticipant()` | *Trigger* SQL `enforce_participant_schedule()` pada `session_participants` yang menolak dengan `PARTICIPANT_SCHEDULE_CONFLICT`; `Session.addParticipant()` memetakannya ke `ParticipantScheduleConflictError` | Pemeriksaan dan penyimpanan terjadi dalam satu transaksi sehingga dua permintaan bergabung yang bersamaan tidak dapat lolos. Aturan hanya berlaku saat Mentee bergabung, bukan saat Mentor mengubah jadwal sesi yang sudah diikuti |

## B.2 Bukti Penerapan Best Practices

Tabel B.2. Bukti Best Practices

| Praktik | Bukti | Keterangan |
| :--- | :--- | :--- |
| Branching | [Daftar branch](https://github.com/ladubiosacreatura/IF2150-RPL-K01-G09/branches/all), [graph commit](https://github.com/ladubiosacreatura/IF2150-RPL-K01-G09/network) | Skema `main` + `development`. Setiap KF dikerjakan di branch yang dibuat dari issue-nya (`<nomor-issue>-feat-kfXX-...`), digabung ke `development` lewat PR, lalu `development` digabung ke `main` untuk rilis `v9.0` |
| Semantic commit | [Riwayat commit](https://github.com/ladubiosacreatura/IF2150-RPL-K01-G09/commits/development) | Format `<tipe>: <deskripsi>` dengan tipe `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, misalnya `feat: ...`, `fix: ...`, `test: ...` |
| Track tasks | [Issues](https://github.com/ladubiosacreatura/IF2150-RPL-K01-G09/issues?q=is%3Aissue) | Satu issue per KF (KF01–KF19) dengan penanggung jawab sesuai Tabel B.4; PR menutup issue dengan `Closes #<n>` |
| Pull request dan review | [#99 KF02](https://github.com/ladubiosacreatura/IF2150-RPL-K01-G09/pull/99), [#106 KF17](https://github.com/ladubiosacreatura/IF2150-RPL-K01-G09/pull/106), [#101 KF04](https://github.com/ladubiosacreatura/IF2150-RPL-K01-G09/pull/101), [#128 KF13](https://github.com/ladubiosacreatura/IF2150-RPL-K01-G09/pull/128) | Setiap PR berisi deskripsi, issue terkait, dan hasil pengujian. Contoh review: Markus me-review PR David (#98, #99) dan Matthew (#106, #108); Hugo me-review PR David (#100, #101); Fabian me-review #128. CI (lint, typecheck, test, build) berjalan di setiap PR |
| Pengujian | [`src/tests/`](https://github.com/ladubiosacreatura/IF2150-RPL-K01-G09/tree/development/src/tests) | Vitest: 14 berkas uji untuk validator, *controller* (user, sesi, partisipasi, feedback, riwayat, chat), model, serta fungsi SQL (kapasitas, pengingat, grup obrolan) yang diuji pada PostgreSQL *in-memory* (PGlite) dengan seluruh migrasi. Jalankan `npm test` dari `src/` |

### B.2.1 Profiling dan Optimasi

| Informasi | Keterangan |
| :--- | :--- |
| Fitur / proses yang diprofil | Halaman riwayat sesi (KF11), `SessionHistory.listForUser()` |
| Alat | Logging waktu respons (`performance.now()`) terhadap basis data Supabase *hosted*, median dari 20 kali pemanggilan per akun uji |
| Temuan (sebelum) | Riwayat dibentuk dengan beberapa kueri berurutan (daftar ID sesi yang diikuti, lalu sesi, lalu feedback). Median: `mentor.demo` 744 ms, `mentee.dua` 598 ms, `mentee.satu` 583 ms |
| Perbaikan | Mengambil sesi yang diikuti dalam satu kueri relasi `session_participants.select("sessions(*)")` dan menjalankan kueri feedback secara paralel (`Promise.all`) |
| Hasil (sesudah) | Median: `mentor.demo` 242 ms (-67%), `mentee.dua` 393 ms (-34%), `mentee.satu` 429 ms (-26%); seluruhnya jauh di bawah batas 3 detik pada KNF05 |

## B.3 Kendala dan Catatan Penting

**Kendala**

- Beberapa PR saling bergantung (KF10a, KF16, KF17 dan KF13, KF15), sehingga urutan *merge* sempat salah dan menimbulkan konflik. Konflik diselesaikan dengan menggabungkan ulang sesuai urutan ketergantungan.
- PR KF13 dan KF15 awalnya dibuat dari `main` dan mengganti berkas secara utuh. Kodenya dipindahkan ke branch baru dari `development` dengan *cherry-pick* sehingga riwayat kontribusi penulis tetap terlihat (PR #128 dan #129).
- Migrasi tidak otomatis diterapkan ke basis data *hosted*; satu anggota menerapkannya setelah PR digabung.

**Known issues**

- Pemeriksaan tabrakan jadwal mentee saat bergabung ke sesi (`validateParticipantSchedule()`, galat `PARTICIPANT_SCHEDULE_CONFLICT`) belum diimplementasikan; yang sudah ada adalah pemeriksaan tabrakan jadwal mentor (KF06).
- Pengukuran KNF05 baru dilakukan di sisi server (B.2.1), belum melalui pengukuran *browser* (Lighthouse).
- Pengingat (KF09) dan pembersihan grup obrolan (KF12) hanya berjalan bila *endpoint* cron dipanggil oleh penjadwal; tanpa penjadwal, panggil manual (lihat di bawah).

**Catatan menjalankan aplikasi**

- Jalankan dari `src/`: `npm ci`, salin `.env.example` ke `.env.local` lalu isi nilainya, `npm run db:start` dan `npm run db:reset` (membutuhkan Docker), lalu `npm run dev`. Detail ada di `src/README.md`.
- Akun uji (kata sandi `password123`): `mentor.demo@mahasiswa.itb.ac.id`, `mentee.satu@mahasiswa.itb.ac.id`, `mentee.dua@mahasiswa.itb.ac.id`.
- Registrasi hanya menerima email universitas yang berakhiran `.ac.id`.
- Memicu pengingat dan pembersihan obrolan secara manual: `curl -X POST -H "Authorization: Bearer <CRON_SECRET>" http://localhost:3000/api/cron/reminders` (atau `/api/cron/chat-cleanup`).

## B.4 Kontribusi Anggota

Tabel B.4. Kontribusi Anggota

| NIM | Nama | Modul / Fitur yang Dikerjakan | Persentase Kontribusi |
| :--- | :--- | :--- | :--- |
| 13525001 | Matthew Allen Reynaldo | Modul Sesi Mentor: KF05 membuat sesi, KF06 menolak jadwal bentrok, KF14 validasi kapasitas, KF17 edit sesi, KF16 hapus sesi, KF10a konfirmasi keterlaksanaan sesi (UC03, UC05, UC11, UC12) | 20% |
| 13525010 | Fabian Amzar Susanto | Modul Bergabung Sesi: KF13 menolak bergabung saat sesi penuh, KF15 membatalkan keikutsertaan (UC04, UC10); *review* PR #85 dan #128 | 20% |
| 13525025 | David Christian | *Scaffold* proyek dan README; modul Autentikasi dan Preferensi: KF01 registrasi, KF02 login, KF03 tag preferensi, KF04 jadwal ketersediaan (UC01, UC02); modul Obrolan dan Notifikasi: KF09 pengingat sesi, KF12 grup obrolan sementara (UC08, UC09); *review* PR #102–#105, #107, #119–#121 | 20% |
| 13525028 | Markus Christiano Simanjuntak | Modul Feedback dan Riwayat: KF10b penilaian setelah sesi, KF18 melihat feedback sesi, KF11 halaman riwayat sesi, optimasi kueri riwayat (UC06, UC07, UC13); *review* PR #98, #99, #106, #108, #122–#124, #127 | 20% |
| 13525049 | Hugo Daniel Johansen Napitupulu | Modul Profil dan Beranda: KF19 halaman profil, KF07 beranda dan *matchmaking* sesi, KF08 bergabung ke sesi (UC04, UC14, UC15); *review* PR #100, #101 | 20% |

## B.5 Traceability Kelas Perancangan ke Implementasi

Seluruh path relatif terhadap `src/`.

Tabel B.5. Traceability Kelas Perancangan ke Implementasi

| ID Kelas | Nama Kelas Perancangan | Bentuk Implementasi | Lokasi (File dan Nama) | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| C01 | User | Kelas Model, Tabel, Server Action | `models/user.ts` - `User`; tabel `users`; `controllers/userController.ts` - `processRegistration()`, `authLogin()`, `logout()`, `getCurrentUser()` | Atribut `idUser`, `username`, `email` menjadi kolom tabel `users`. `create()`, `findById()`, dan `exists()` menjadi metode statis. `register()`, `login()`, `logout()` diwujudkan di `UserControl`. `createMessage()`/`sendMessage()` diwujudkan di `chatController.sendMessage()` |
| C02 | Mentor | Relasi tabel | Kolom `sessions.id_mentor`; `models/session.ts` - `Session.findForMentor()`; `models/feedback.ts` - `Feedback.getFeedbackBySession()` | Tidak menjadi kelas tersendiri; pengguna berperan sebagai mentor pada sesi yang `id_mentor`-nya adalah dirinya. `getSessionsMade()` diwujudkan oleh kueri sesi berdasarkan `id_mentor`, `viewFeedback()` oleh `retrieveFeedbackBySession()` |
| C03 | Mentee | Relasi tabel | Tabel `session_participants`; `models/session.ts` - `Session.addParticipant()`, `Session.getUpcomingByUser()`; `controllers/feedbackController.ts` - `submitFeedback()` | Tidak menjadi kelas tersendiri; pengguna berperan sebagai mentee pada sesi yang ia ikuti di `session_participants`. `getSessionsJoined()` menjadi kueri `session_participants`, `giveFeedback()` menjadi `submitFeedback()`, `checkCompletedSession()` menjadi `checkFeedbackEligibility()` |
| C04 | Session | Kelas Model, fungsi murni, Tabel, fungsi SQL | `models/session.ts` - `Session`, `matchSession()`, `searchSession()`, `checkCapacity()`; tabel `sessions`, `session_participants`; SQL `delete_session()`, `enforce_session_capacity()` | Atribut menjadi kolom tabel; `userList` menjadi tabel `session_participants`. `saveSession()` menjadi `createSession()`, `edit*()` menjadi `updateSession()`, `markAsDeleted()` menjadi `deleteSession()`, `getSessionDetails()` menjadi `getSessionDetail()`. KF20/KF21: migrasi `20261116000000_session_time_rules.sql` (*constraint* `sessions_same_day_duration`, *trigger* `enforce_participant_schedule()`); `ParticipantScheduleConflictError` |
| C05 | GroupChat | Kelas Model, Tabel, *trigger* SQL | `models/groupChat.ts` - `GroupChat`; tabel `group_chats`; SQL `create_group_chat_for_session()`, `close_expired_group_chats()` | `findBySession()`, `isActive()`, `findMenteeIds()`, `closeExpired()`. `isMember()` dijaga oleh fungsi SQL `is_session_member()` pada RLS |
| C06 | Feedback | Kelas Model, Tabel | `models/feedback.ts` - `Feedback`; tabel `feedbacks` | `save()` menjadi `create()`; `getFeedbackBySession()` tetap; `existsBySessionAndAuthor()` diwujudkan oleh *unique constraint* (`id_session`, `id_mentee`) yang memicu `FeedbackAlreadyExistsError` |
| C07 | SessionHistory | Kelas Model, fungsi | `models/sessionHistory.ts` - `SessionHistory`; `models/sessionHistoryTypes.ts` - `getGroupedByStatus()` | `getArchivedSessions()` menjadi `listForUser()`; `getGroupedByStatus()` tetap; konfirmasi menjadi `confirmSession()` yang memanggil RPC `confirm_session()` |
| C08 | ChatMessage | Kelas Model, Tabel | `models/chatMessage.ts` - `ChatMessage`; tabel `chat_messages` | `create()` dan `findByGroupChat()` tetap; *getter* menjadi properti kelas |
| C09 | Preference | Kelas Model, Tabel | `models/preference.ts` - `Preference`; tabel `preferences` | `getPreferenceByUser()`, `updatePreference()` (statis, *upsert*), `getPreferenceDetails()`. `isComplete()` menjadi `validatePreference()` di `lib/validator.ts` |
| C10 | Profile | Kelas Model, Tabel | `models/profile.ts` - `Profile`; tabel `profiles` | `create()`, `findByUser()`, `findByUsers()`, `updateProfile()` (statis, *upsert*), `getProfileData()` |
| C11 | Dashboard | Halaman (Server Component), Komponen | `app/dashboard/page.tsx`; `app/discover/page.tsx`; `components/ParticipantSessionPanel.tsx` - `DiscoverCatalog` | `loadDashboard()` menjadi pemuatan halaman yang memanggil `getUpcomingSessions()` dan `findRecommendation()`. `searchSession()` dan filter berada di `DiscoverCatalog` |
| C12 | UserControl | Server Action, Adapter | `controllers/userController.ts`; `lib/adapters/authAdapter.ts`; `lib/validator.ts` - `validateEmail()` | Seluruh operasi tersedia: `authLogin()`, `getCurrentUser()`, `processRegistration()`, `saveProfile()`, `savePreference()`, `fetchUserProfile()`, `fetchUserPreference()`. Atribut `authAdapter` dan `validator` menjadi modul yang diimpor |
| C13 | SessionControl | Server Action | `controllers/sessionController.ts` - `processSessionCreation()`, `processSessionUpdate()`, `processSessionDeletion()`; `controllers/sessionParticipationController.ts` - `getUpcomingSessions()`, `findRecommendation()`, `getOpenSessions()`, `getSessionDetail()`, `joinSession()`; `controllers/sessionHistoryController.ts` - `fetchUserHistory()`, `processSessionCompletion()` | Dipecah menjadi tiga modul. `validateScheduleConflict()` dan `validateCapacity()` menggunakan `lib/validator.ts`. KF20: `validateSessionTime()` (`lib/validator.ts`) dipanggil pada pembuatan dan pengubahan sesi; KF21: `joinSession()` mengembalikan `PARTICIPANT_SCHEDULE_CONFLICT` |
| C14 | FeedbackControl | Server Action | `controllers/feedbackController.ts` - `checkFeedbackEligibility()`, `submitFeedback()`, `retrieveFeedbackBySession()` | `validateFeedback()` menjadi `validateRating()` di `lib/validator.ts`; `saveFeedback()` digabung ke `submitFeedback()` |
| C15 | LoginPage | Halaman, Komponen | `app/login/page.tsx` + `components/LoginForm.tsx`; `app/register/page.tsx` + `components/RegisterForm.tsx` | `formMode` diwujudkan sebagai dua *route* (`/login` dan `/register`). Input menjadi *state* komponen, `submitForm()` menjadi *handler* yang memanggil `authLogin()`/`processRegistration()` |
| C16 | ProfilePage | Halaman, Komponen | `app/profile/page.tsx`, `app/profile/[id]/page.tsx`, `app/profile/not-found.tsx`, `app/profile/preferences/page.tsx`; `components/ProfileView.tsx`, `components/PreferenceForm.tsx`, `components/AvailabilityEditor.tsx` | `openProfile()` menjadi *route*; `showNotFound()` menjadi `not-found.tsx`; `isEditingPreference` dan form preferensi menjadi halaman `/profile/preferences` |
| C17 | SessionPage | Halaman | `app/sessions/[id]/page.tsx` | Menampilkan detail sesi dan memilih panel mentor atau mentee. Konfirmasi keterlaksanaan dipindah ke halaman riwayat |
| C18 | HostSessionPage | Halaman, Komponen | `app/sessions/new/page.tsx` + `components/HostSessionPanel.tsx`; `app/sessions/[id]/edit/page.tsx` + `components/EditSessionPanel.tsx`; `components/DeleteSessionButton.tsx`; `components/SessionFeedbackView.tsx` | `showCreateForm()`/`submitSessionData()` di `HostSessionPanel`, `showEditForm()`/`submitSessionUpdate()` di `EditSessionPanel`, `confirmDelete()`/`cancelDelete()` di `DeleteSessionButton`, `showFeedbackList()`/`showEmptyFeedback()` di `SessionFeedbackView` |
| C19 | ParticipantSessionPage | Komponen | `components/ParticipantSessionPanel.tsx` - `ParticipantSessionPanel` | `submitJoinRequest()` menjadi *handler* `onJoin()` yang memanggil `joinSession()` |
| C20 | FeedbackForm | Komponen, Halaman | `components/FeedbackForm.tsx` - `FeedbackForm`; `app/sessions/[id]/feedback/page.tsx` | `rating` dan `comment` menjadi *state*; `submitFeedback()` menjadi `sendFeedback()`; mode `confirm` juga dipakai untuk konfirmasi keterlaksanaan sesi |
| C21 | GroupChatPage | Halaman, Komponen, Adapter | `app/sessions/[id]/chat/page.tsx`; `components/ChatRoom.tsx` - `ChatRoom`; `lib/adapters/realtimeAdapter.ts` - `subscribeToChatMessages()`; `controllers/chatController.ts` - `getGroupChat()`, `sendMessage()` | `messageList` menjadi *state*; `onMessageReceived()` menjadi langganan Supabase Realtime; `showChatExpired()`/`disableMessageInput()` berdasarkan status aktif grup obrolan |
| C22 | Notification | Kelas Model, Tabel, fungsi SQL, Route | `models/notification.ts` - `Notification`; tabel `notifications`; SQL `send_session_reminders()`; `controllers/reminderController.ts`, `controllers/notificationController.ts`; `app/api/cron/reminders/route.ts`; `lib/adapters/cronAdapter.ts` | `create()` menjadi `sendSessionReminders()`; `getNotificationsByUser()` menjadi `getUnreadSince()`; `markAsRead()` dan `openApp()` tetap |
| C23 | PopUpNotification | Komponen, Adapter | `components/PopUpNotification.tsx` - `PopUpNotification` (dipasang di `app/layout.tsx`); `lib/adapters/realtimeAdapter.ts` - `subscribeToNotifications()` | `onNotificationReceived()` menjadi langganan Realtime; `clickNotification()` menjadi `open()` yang memanggil `markAsRead()` lalu berpindah ke halaman sesi; `dismiss()` menutup *pop-up* |
| C24 | HistoryPage | Halaman, Komponen | `app/history/page.tsx`; `components/SessionHistoryView.tsx` - `SessionHistoryView` | `openHistory()` menjadi pemuatan halaman yang memanggil `fetchUserHistory()`; `selectedStatusFilter` menjadi *state*; `showEmptyState()` saat daftar kosong |
