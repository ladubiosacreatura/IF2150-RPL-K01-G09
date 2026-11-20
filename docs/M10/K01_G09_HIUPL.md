<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 10
<br>
HASIL IMPLEMENTASI DAN UJI PERANGKAT LUNAK (HIUPL)
</h1>
<br>

## PeerUP

### <img alt="Logo PeerUP" src="./assets/Logo_PeerUP.jpeg" width="30%">

### Untuk: Mikhael Andrian Yonatan

Dipersiapkan oleh:
| Informasi 	| Keterangan 		|
| --- 			| --- 			|
| Kelas 		| *K01* 		|
| Kelompok 		| *G09* 		|
| Nama Kelompok	| *PindahCSUI*	|

| NIM        | Nama                                 |
|---         |---                                   |
| *13525049* | *Hugo Daniel Johansen Napitupulu*    |
| *13525001* | *Matthew Allen Reynaldo*             |
| *13525010* | *Fabian Amzar Susanto*               |
| *13525025* | *David Christian*                    |
| *13525028* | *Markus Christiano Simanjuntak*      |

---

## Daftar Isi

- [BAB 1: Pendahuluan](#bab-1-pendahuluan)
  - [1.1 Tujuan Penulisan Dokumen](#11-tujuan-penulisan-dokumen)
  - [1.2 Lingkup Masalah](#12-lingkup-masalah)
  - [1.3 Definisi, Istilah, dan Singkatan](#13-definisi-istilah-dan-singkatan)
  - [1.4 Aturan Penomoran](#14-aturan-penomoran)
  - [1.5 Referensi](#15-referensi)
  - [1.6 Deskripsi Umum Dokumen (Ikhtisar)](#16-deskripsi-umum-dokumen-ikhtisar)
- [BAB 2: Deskripsi Umum Perangkat Lunak](#bab-2-deskripsi-umum-perangkat-lunak)
  - [2.1 System Overview](#21-system-overview)
  - [2.2 Pemodelan Use Case](#22-pemodelan-use-case)
- [BAB 3: Implementasi](#bab-3-implementasi)
  - [3.1 Lingkungan Implementasi](#31-lingkungan-implementasi)
  - [3.2 Implementasi Modul](#32-implementasi-modul)
  - [3.3 Implementasi Antarmuka](#33-implementasi-antarmuka)
  - [3.4 File Lain](#34-file-lain)
- [BAB 4: Hasil Pengujian](#bab-4-hasil-pengujian)
  - [4.1 Strategi dan Kedalaman Pengujian Kelas](#41-strategi-dan-kedalaman-pengujian-kelas)
  - [4.2 Pengujian Unit Kelas](#42-pengujian-unit-kelas)
  - [4.3 Pengujian Integrasi](#43-pengujian-integrasi)
  - [4.4 Pengujian Use Case](#44-pengujian-use-case)
  - [4.5 Pengujian Kebutuhan Non-Fungsional (KNF)](#45-pengujian-kebutuhan-non-fungsional-knf)
  - [4.6 Tangkapan Layar dan Bukti Hasil Pengujian](#46-tangkapan-layar-dan-bukti-hasil-pengujian)
- [BAB 5: Traceability](#bab-5-traceability)

---

## Daftar Perubahan

| Revisi | Deskripsi |
| :--- | :--- |
| *A* | *Deskripsikan perubahan yang dilakukan dari dokumen sebelumnya pada dokumen ini. Jika tidak terdapat perubahan, harap kosongkan tabel.* |
| *B* |  |
| *C* |  |
| ... |  |

---

# BAB 1: Pendahuluan

## 1.1 Tujuan Penulisan Dokumen
Dokumen Hasil Implementasi dan Uji Perangkat Lunak (HIUPL) ini mendokumentasikan hasil implementasi perangkat lunak **PeerUP** berdasarkan rancangan pada DPPL dan hasil pengujiannya terhadap kebutuhan pada SKPL. Dokumen ini memuat lingkungan implementasi, daftar modul, antarmuka, dan berkas yang telah dibuat, strategi dan kedalaman pengujian setiap kelas, hasil pengujian unit, integrasi, *use case*, dan kebutuhan non-fungsional beserta buktinya, serta matriks *traceability* dari kebutuhan hingga *test case*. Tujuannya adalah menunjukkan secara terverifikasi bahwa fitur yang diimplementasikan berjalan sesuai kebutuhan, bukan sekadar menyatakan bahwa fitur sudah berjalan. Dokumen ini ditujukan bagi:
1. **Tim Pengembang (Developer):** Sebagai catatan implementasi dan acuan perbaikan atas *test case* yang belum lulus.
2. **Penguji Perangkat Lunak (Tester / QA):** Sebagai acuan untuk menjalankan ulang pengujian dan memeriksa bukti hasilnya.
3. **Dosen dan/atau Asisten Pengampu IF2150:** Sebagai dokumen evaluasi akademik terhadap hasil implementasi dan pengujian yang dilakukan oleh kelompok ini.

## 1.2 Lingkup Masalah
**PeerUP** adalah aplikasi web pembelajaran kolaboratif sebaya (*peer-to-peer tutoring*) bagi mahasiswa yang mempertemukan *Mentee* dengan *Mentor* berdasarkan kecocokan materi, jadwal, dan format belajar (daring/luring), dilengkapi pembuatan dan pengelolaan sesi, *group chat* sementara, pengingat jadwal otomatis, riwayat sesi, serta *feedback* (SKPL BAB 2). Aplikasi dibangun dengan Next.js dan bergantung pada layanan eksternal Supabase (Auth, PostgreSQL, Realtime, dan pemicu terjadwal/Cron) sesuai rancangan arsitektur MVC dan *Client-Server* pada DPPL BAB 2. Lingkup HIUPL ini adalah implementasi pada tag `v9.2` beserta pengujiannya terhadap KF01–KF21, KNF01–KNF05, `UC01`–`UC15`, dan kelas `C01`–`C24`.

## 1.3 Definisi, Istilah, dan Singkatan
Semua definisi dan singkatan yang digunakan dalam dokumen ini beserta penjelasannya disajikan pada Tabel 1.3.

Tabel 1.3. Definisi Istilah dan Singkatan

| Singkatan, Akronim, atau Istilah | Penjelasan |
| :--- | :--- |
| *P/L* | *Singkatan dari Perangkat Lunak, yaitu aplikasi yang memberikan perintah kepada komputer untuk menjalankan tugas tertentu.* |
| *SKPL* | *Singkatan dari Spesifikasi Kebutuhan Perangkat Lunak, yaitu dokumen yang merangkum kebutuhan fungsional, non-fungsional, dan pemodelan use case perangkat lunak.* |
| *APL* | *Singkatan dari Arsitektur Perangkat Lunak, yaitu dokumen yang mendeskripsikan style arsitektur, komponen, dan view arsitektur perangkat lunak.* |
| *DPPL* | *Singkatan dari Deskripsi Perancangan Perangkat Lunak, yaitu dokumen yang merinci arsitektur, realisasi use case, spesifikasi rinci kelas, serta perancangan antarmuka perangkat lunak.* |
| *HIUPL* | *Singkatan dari Hasil Implementasi dan Uji Perangkat Lunak, yaitu dokumen ini.* |
| *KF* | *Singkatan dari Kebutuhan Fungsional.* |
| *KNF* | *Singkatan dari Kebutuhan Non-Fungsional.* |
| *UC* | *Singkatan dari Use Case.* |
| *Mentor / Tutor* | *Pengguna sebaya yang memiliki penguasaan materi lebih baik dan membuka sesi belajar untuk membimbing pengguna lain.* |
| *Mentee* | *Pengguna (siswa/mahasiswa) yang mencari bantuan pemahaman materi dan bergabung ke dalam sesi belajar.* |
| *Matchmaking* | *Proses pencocokan otomatis antara preferensi materi serta jadwal kosong Mentee dengan sesi belajar yang tersedia.* |
| *BaaS* | *Backend-as-a-Service, layanan cloud yang menyediakan infrastruktur backend siap pakai seperti basis data, autentikasi, dan komunikasi real-time.* |
| *RLS* | *Row Level Security, aturan akses PostgreSQL per baris data yang membatasi data yang dapat dibaca atau diubah oleh setiap pengguna.* |
| *TC* | *Test Case, yaitu satu kasus uji yang terdiri atas kondisi awal, langkah, data masukan, hasil yang diharapkan, hasil aktual, dan kesimpulan.* |
| *UT* | *Unit Test, yaitu pengujian satu operasi atau fungsi pada satu kelas secara terisolasi dari komponen lain.* |
| *INT* | *Integration Test, yaitu pengujian interaksi antarkomponen yang melewati batas arsitektur, seperti Controller ke Model, aplikasi ke basis data, dan aplikasi ke sistem eksternal.* |
| *Normal, Boundary, Negative* | *Jenis test case: normal menguji masukan valid pada umumnya, boundary menguji nilai tepat pada batas yang masih valid atau tidak valid (misalnya kapasitas 1 dan 20, durasi 10 menit), dan negative menguji masukan tidak valid yang harus ditolak.* |
| *Coverage* | *Code coverage, yaitu persentase kode yang dijalankan oleh test. Dokumen ini melaporkan line coverage (persentase baris yang dieksekusi) dan branch coverage (persentase cabang keputusan, benar dan salah, yang dijalani).* |
| *White-box / Black-box* | *White-box menguji dengan melihat struktur internal kode (contohnya coverage), sedangkan black-box mencocokkan masukan dan keluaran dengan kebutuhan tanpa melihat kode.* |
| *Mendalam, Sedang, Tidak perlu* | *Tingkat kedalaman pengujian kelas pada Subbab 4.1. Mendalam: unit test setiap operasi public, minimal 3 TC per operasi, coverage ≥ 70%. Sedang: operasi public utama, minimal 2 TC per operasi (boleh melalui pengujian integrasi). Tidak perlu: tanpa unit test khusus, teruji tidak langsung melalui TC use case.* |
| *Pass / Fail* | *Kesimpulan test case: Pass jika hasil aktual sama dengan hasil yang diharapkan, Fail jika berbeda.* |
| *Mock* | *Objek tiruan yang menggantikan komponen nyata (misalnya klien Supabase) agar unit dapat diuji tanpa layanan eksternal.* |
| *Vitest* | *Framework pengujian otomatis untuk JavaScript/TypeScript yang dipakai untuk unit test dan integration test.* |
| *PGlite* | *PostgreSQL yang berjalan di dalam proses Node.js, dipakai untuk menjalankan seluruh migrasi dan menguji trigger, fungsi, serta RLS tanpa server basis data terpisah.* |

## 1.4 Aturan Penomoran
Pola ID dari dokumen sebelumnya tetap dipakai agar *traceability* tetap jelas. Pola ID pengujian ditambahkan pada lima baris terakhir Tabel 1.4.

Tabel 1.4. Aturan Penomoran

| Hal/Bagian | Penomoran | Keterangan |
| :--- | :--- | :--- |
| *User Story* | *US-XX* | *XX menyatakan dua digit nomor urut kebutuhan pengguna awal (contoh: US-01).* |
| *Aktivitas* | *AXX* | *XX menyatakan dua digit nomor urut aktivitas proses bisnis (contoh: A01).* |
| *Kebutuhan* | *RXX* | *XX menyatakan dua digit nomor urut pemetaan kebutuhan (contoh: R01).* |
| *Kebutuhan Fungsional* | *KFXX* | *XX menyatakan dua digit nomor urut kebutuhan fungsional (contoh: KF01).* |
| *Kebutuhan Non-Fungsional* | *KNFXX* | *XX menyatakan dua digit nomor urut kebutuhan non-fungsional (contoh: KNF01).* |
| *Aktor* | *AKXX* | *XX menyatakan dua digit nomor urut aktor pada pemodelan use case (contoh: AK01).* |
| *Use Case* | *UCXX* | *XX menyatakan dua digit nomor urut use case (contoh: UC01).* |
| *Kelas* | *CXX* | *XX menyatakan dua digit nomor urut kelas pada diagram kelas (contoh: C01).* |
| *Algoritma* | *Algo-CXX-YY* | *CXX menyatakan ID kelas dan YY menyatakan nomor urut algoritma pada kelas tersebut (contoh: Algo-C01-01).* |
| *Query* | *Q-CXX-YY* | *CXX menyatakan ID kelas dan YY menyatakan nomor urut query pada kelas tersebut (contoh: Q-C01-01).* |
| *Antarmuka* | *I-XX* | *XX menyatakan dua digit nomor urut rancangan layar antarmuka (contoh: I-01).* |
| *Unit Test Kelas* | *CXX-UTYY* | *CXX menyatakan ID kelas yang diuji dan YY menyatakan nomor urut test case unit pada kelas tersebut (contoh: C05-UT01).* |
| *Unit Test Validator* | *VAL-UTYY* | *YY menyatakan nomor urut test case unit untuk modul pendukung `lib/validator.ts`, yang tidak memiliki ID kelas pada DPPL (contoh: VAL-UT01).* |
| *Integration Test* | *INT-TCYY* | *YY menyatakan nomor urut test case integrasi (contoh: INT-TC01).* |
| *Use Case Test* | *UCXX-TCYY* | *UCXX menyatakan ID use case dan YY menyatakan nomor urut test case pada use case tersebut, satu atau lebih untuk setiap skenario normal dan alternatif (contoh: UC01-TC01).* |
| *KNF Test* | *KNFXX-TCYY* | *KNFXX menyatakan ID KNF dan YY menyatakan nomor urut test case pada KNF tersebut (contoh: KNF01-TC01).* |

## 1.5 Referensi
1. Kelompok G09 K01. *Spesifikasi Kebutuhan Perangkat Lunak (SKPL) PeerUP* (Tugas 5), `docs/M5/K01_G09_SKPL.md`.
2. Kelompok G09 K01. *Arsitektur Perangkat Lunak (APL) PeerUP* (Tugas 6), `docs/M6/K01_G09_APL.md`.
3. Kelompok G09 K01. *Deskripsi Perancangan Perangkat Lunak (DPPL) PeerUP* (Tugas 7 dan Tugas 8), `docs/M8/K01_G09_DPPL2.md`.
4. Kelompok G09 K01. *Laporan Implementasi PeerUP* (Tugas 9), `docs/M9/K01_G09_Implementasi.md`, serta kode sumber pada `src/` (tag `v9.2`).
5. Dokumentasi Perangkat Lunak *Topic Brainstorming* (Tugas 1), *Requirement Gathering* (Tugas 2), *Use Case & Scenario Use Case* (Tugas 3), dan *Class Diagram* (Tugas 4) Kelompok G09 IF2150 Rekayasa Perangkat Lunak.
6. Vercel. *Next.js Documentation* (versi 15). https://nextjs.org/docs
7. Meta. *React Documentation* (versi 19). https://react.dev
8. Supabase. *Supabase Documentation: Auth, Database, Realtime, Cron*. https://supabase.com/docs
9. Tailwind Labs. *Tailwind CSS Documentation* (versi 4). https://tailwindcss.com/docs
10. Vitest. *Vitest Documentation* dan *Coverage* (`@vitest/coverage-v8`). https://vitest.dev/guide/coverage
11. ElectricSQL. *PGlite Documentation*. https://pglite.dev/docs
12. Google. *Chrome DevTools Documentation*. https://developer.chrome.com/docs/devtools
13. Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP).
14. Undang-Undang Republik Indonesia Nomor 1 Tahun 2024 tentang Perubahan Kedua atas UU ITE.

## 1.6 Deskripsi Umum Dokumen (Ikhtisar)
Dokumen HIUPL ini terdiri atas lima bab. **BAB 1 Pendahuluan** menjelaskan tujuan, lingkup, istilah (termasuk istilah pengujian), aturan penomoran ID pengujian, dan referensi. **BAB 2 Deskripsi Umum Perangkat Lunak** memberikan *system overview* PeerUP, batasan sistem, sistem eksternal, dan *use case diagram*. **BAB 3 Implementasi** mencatat lingkungan implementasi, modul dan kelas yang diimplementasikan beserta berkasnya, antarmuka `I-01`–`I-16` yang telah dibuat, serta berkas lain seperti konfigurasi, skema basis data, dan berkas pengujian. **BAB 4 Hasil Pengujian** memuat strategi dan kedalaman pengujian setiap kelas, hasil pengujian unit beserta *coverage*, pengujian integrasi, pengujian setiap skenario *use case*, pengujian KNF, dan bukti tangkapan layar. **BAB 5 Traceability** memetakan setiap KF ke KNF, *use case*, kelas perancangan, berkas implementasi, dan *test case*.

<br>

---

# BAB 2: Deskripsi Umum Perangkat Lunak

## 2.1 System Overview

PeerUP adalah aplikasi web yang memfasilitasi pembelajaran kolaboratif sebaya (*peer-to-peer tutoring*) bagi mahasiswa. Pengguna mendaftar dengan email berdomain universitas, lalu mengatur profil serta preferensi materi, waktu, dan format belajar. *Mentor* membuat sesi belajar dengan topik, jadwal, format daring/luring, dan kapasitas peserta. *Mentee* mendapatkan rekomendasi sesi hasil *matchmaking* yang sesuai preferensinya, lalu bergabung ke sesi tersebut. Setiap sesi memiliki *group chat* sementara untuk koordinasi, dan peserta menerima pengingat otomatis 15 menit sebelum sesi dimulai. Setelah sesi selesai, sesi dikonfirmasi, *Mentee* memberikan *feedback*, dan sesi tercatat pada riwayat.

Sistem mengikuti pola MVC di atas arsitektur *Client-Server* (DPPL BAB 2). *View* (halaman Next.js dan komponen React) berjalan pada *web browser* pengguna, sedangkan *Controller* (Server Actions) dan *Model* berjalan pada server Next.js. Gambar 2.1 memperlihatkan batas sistem PeerUP dan sistem eksternal di luarnya.

<p align="center">
<img alt="Physical View PeerUP" src="./assets/Physical-View.png" width="80%">
</p>
<p align="center">
<i>Gambar 2.1. System Overview (Physical View) PeerUP</i>
</p>

Gambar 2.1 memperlihatkan tiga kelompok node:
1. **Perangkat pengguna:** *web browser* modern yang memuat antarmuka PeerUP dan menangani interaksi pengguna. Browser berkomunikasi dengan aplikasi Next.js melalui HTTPS, dan dengan Supabase Realtime melalui WSS untuk menerima pesan *group chat* dan notifikasi secara langsung.
2. **Aplikasi Next.js (batas sistem PeerUP):** menjalankan *View*, *Controller*, *Model*, *adapter*, dan *route* `app/api/cron/` yang memproses pengingat dan pembersihan *group chat*. Rancangan menempatkan aplikasi pada Vercel. Pada tahap implementasi dan pengujian ini, aplikasi dijalankan secara lokal (`npm run dev`) dan belum di-*deploy* (Subbab 3.1).
3. **Supabase Cloud Services (sistem eksternal):** Supabase Auth untuk registrasi, *login*, dan *hash* kata sandi; PostgreSQL untuk data persisten beserta *trigger* dan RLS; Supabase Realtime untuk pengiriman pembaruan berbasis WebSocket; serta Supabase Cron untuk memicu *route* cron secara terjadwal.

Kode PeerUP hanya berinteraksi dengan sistem eksternal melalui `lib/supabase/` dan *adapter* (`authAdapter`, `realtimeAdapter`, `cronAdapter`), sehingga batas tersebut menjadi titik pengujian integrasi pada Subbab 4.3. Batasan utama sistem (SKPL Subbab 2.4) meliputi: registrasi hanya dengan email domain universitas; kapasitas sesi 1–20 peserta; sesi tidak lintas hari dengan durasi 10 menit hingga 12 jam; jadwal sesi tidak boleh beririsan untuk Mentor maupun Mentee yang sama; *group chat* dibersihkan 48 jam setelah sesi berakhir; dan kata sandi disimpan dalam bentuk *hash*.

## 2.2 Pemodelan Use Case

<p align="center">
<img alt="Use Case Diagram PeerUP" src="./assets/Use-Case-Diagram.webp" width="70%">
</p>
<p align="center">
<i>Gambar 2.2. Use Case Diagram PeerUP</i>
</p>

Gambar 2.2 menunjukkan dua aktor PeerUP, yaitu *Mentee* (`AK01`) dan *Mentor* (`AK02`), serta lima belas *use case* di dalam batas sistem. Keduanya dapat mendaftarkan akun dan autentikasi (`UC01`), mengelola preferensi profil (`UC02`), mengonfirmasi keterlaksanaan sesi (`UC05`), melihat riwayat sesi (`UC06`), berkomunikasi pada *group chat* sementara (`UC08`), menerima notifikasi sesi (`UC09`), membuka beranda (`UC14`), dan melihat profil (`UC15`). Hanya *Mentor* yang dapat membuat (`UC03`), mengedit (`UC12`), dan menghapus sesi (`UC11`) serta melihat *feedback* sesinya (`UC13`). Hanya *Mentee* yang dapat mencari dan bergabung ke sesi (`UC04`), membatalkan keikutsertaan (`UC10`), dan memberikan penilaian sehabis sesi (`UC07`). Rincian setiap *use case* dan skenarionya mengacu pada SKPL BAB 4 dan menjadi dasar pengujian *use case* pada Subbab 4.4.

Tabel 2.1. Daftar Use Case PeerUP

| ID UC | Nama Use Case | Aktor | ID KF |
| :--- | :--- | :--- | :--- |
| *UC01* | *Mendaftarkan Akun dan Autentikasi* | *Mentor, Mentee* | *KF01, KF02* |
| *UC02* | *Mengelola Preferensi Profil* | *Mentor, Mentee* | *KF03, KF04* |
| *UC03* | *Membuat Sesi Belajar* | *Mentor* | *KF05, KF06, KF14, KF20* |
| *UC04* | *Mencari dan Bergabung ke Sesi* | *Mentee* | *KF07, KF08, KF13, KF21* |
| *UC05* | *Mengonfirmasi Keterlaksanaan Sesi* | *Mentor, Mentee* | *KF10* |
| *UC06* | *Melihat Riwayat Sesi* | *Mentor, Mentee* | *KF11, KF18* |
| *UC07* | *Memberikan Penilaian Sehabis Sesi* | *Mentee* | *KF10* |
| *UC08* | *Berkomunikasi Menggunakan Grup Obrolan Sementara* | *Mentor, Mentee* | *KF12* |
| *UC09* | *Menerima Notifikasi Sesi* | *Mentor, Mentee* | *KF09* |
| *UC10* | *Membatalkan Keikutsertaan Sesi* | *Mentee* | *KF15* |
| *UC11* | *Menghapus Sesi* | *Mentor* | *KF16* |
| *UC12* | *Mengedit Sesi* | *Mentor* | *KF06, KF14, KF17, KF20* |
| *UC13* | *Melihat Feedback Sesi* | *Mentor* | *KF18* |
| *UC14* | *Membuka Beranda Utama* | *Mentor, Mentee* | *KF07* |
| *UC15* | *Melihat Profil* | *Mentor, Mentee* | *KF19* |

<br>

---

# BAB 3: Implementasi

Bagian ini diisi dengan informasi tentang elemen P/L yang dikembangkan (*executable files*, *configuration files*, *data files*, dan sebagainya) serta perubahannya terhadap rancangan pada DPPL (jika ada).

## 3.1 Lingkungan Implementasi

Lingkungan implementasi mengikuti Subbab 2.1 DPPL: aplikasi web Next.js (TypeScript) dengan Supabase sebagai *backend*. Versi pada Tabel 3.1 adalah versi yang benar-benar terpasang dari `src/package-lock.json` pada tag `v9.2`. Perbedaan dari DPPL dicatat di bawah tabel.

Tabel 3.1. Lingkungan Implementasi

| Aspek | Keterangan |
| :--- | :--- |
| *Hardware* | Laptop Lenovo 82YA, Intel Core i7-13700H (14 inti), RAM 16 GB. Perangkat ini dipakai untuk pengembangan dan seluruh pengujian pada BAB 4 milik David (UC01, UC02, UC08, UC09, KNF01, KNF03, KNF04, dan pengujian integrasi). |
| *Operating System* | Pengembangan: Windows 11 Home Single Language (build 26300). CI: Ubuntu (`ubuntu-latest`, GitHub Actions). Klien: peramban modern apa pun (diuji dengan peramban berbasis Chromium). |
| *Bahasa Pemrograman* | TypeScript 5.9.3 untuk *frontend*, *Server Actions*, dan *Route Handlers*. SQL (PL/pgSQL) untuk skema, *constraint*, *trigger*, fungsi, dan kebijakan RLS pada `src/supabase/migrations/`. |
| *Framework/Library* | Next.js 15.5.28 (App Router), React 19.1.0, React DOM 19.1.0, Tailwind CSS 4.3.5 (`@tailwindcss/postcss`), `@supabase/supabase-js` 2.119.0, `@supabase/ssr` 0.12.7, `server-only` 0.0.1. *Runtime*: Node.js 24 (versi pada `src/.nvmrc`; pengujian memakai Node.js 24.18.0, npm 12.0.2). |
| *DBMS* | PostgreSQL yang dikelola Supabase. Konfigurasi lokal (`src/supabase/config.toml`) memakai PostgreSQL 17. Layanan Supabase yang dipakai: Auth, PostgREST, Realtime. |
| *Development Tools* | Visual Studio Code 1.147.0, Git 2.43.0 dengan GitHub (repositori, *issue*, *pull request*, GitHub Actions `.github/workflows/ci.yml`), Supabase CLI 2.122.1 (`npm run db:*`), ESLint 9.39.5, Prettier 3.9.10. |
| *Testing Tools* | Vitest 5.0.5 (unit dan integrasi), `@vitest/coverage-v8` 5.0.5 (*coverage*), `@electric-sql/pglite` 0.2.17 (PostgreSQL *in-memory* yang menjalankan seluruh migrasi asli untuk pengujian *trigger*, fungsi, dan RLS), Chrome DevTools (*response time*), `curl` (pengujian *route* cron), skrip Node.js dengan `@supabase/supabase-js` (pemeriksaan basis data dan Realtime). |

Perbedaan dari Subbab 2.1 DPPL:

1. *Scheduled Task*: DPPL merencanakan Supabase Cron. Pada implementasi, pemicu terjadwal berupa *route* `POST /api/cron/reminders` dan `POST /api/cron/chat-cleanup` yang dilindungi `CRON_SECRET` (Tabel B.1 M9 nomor 10). Hingga tag `v9.2` belum ada penjadwal yang terpasang (lihat KNF03-TC02).
2. *Hosting*: aplikasi belum di-*deploy* ke Vercel. Pengujian dijalankan dengan `npm run dev` di `http://localhost:3000`.
3. Basis data uji: panduan tim memakai Supabase lokal (`npm run db:start`, membutuhkan Docker). Docker tidak tersedia pada laptop penguji, sehingga pengujian UC01, UC02, UC08, UC09, KNF01, KNF03, KNF04, dan integrasi aplikasi–Supabase dilakukan terhadap proyek Supabase *hosted* milik tim dengan akun seed (`mentor.demo`, `mentee.satu`) dan akun uji baru `hiupl.uji@mahasiswa.itb.ac.id`. Pengujian *trigger*, fungsi, dan RLS tetap memakai PGlite dengan seluruh migrasi.

## 3.2 Implementasi Modul

Daftar modul/kelas yang **TELAH** diimplementasikan. Gunakan nama dan ID kelas yang sama dengan DPPL, dan konsisten dengan Tabel B.5 pada dokumen Implementasi (Tugas 9).

Tabel 3.2. Implementasi Modul

| No | ID Kelas | Nama Modul/Kelas | Nama File Fisik | Nama File Executable |
| :--- | :--- | :--- | :--- | :--- |
| 1 | C01 | User | `src/models/user.ts`; `src/controllers/userController.ts`; `src/controllers/chatController.ts` | - |
| 2 | C02 | Mentor | `src/models/session.ts`; `src/models/feedback.ts` | - |
| 3 | C03 | Mentee | `src/models/session.ts`; `src/controllers/feedbackController.ts` | - |
| 4 | C04 | Session | `src/models/session.ts`; `src/supabase/migrations/20261112000000_delete_session.sql`; `src/supabase/migrations/20261116000000_session_time_rules.sql` | - |
| 5 | C05 | GroupChat | `src/models/groupChat.ts`; `src/supabase/migrations/20261114000000_group_chat_expiry.sql` | - |
| 6 | C06 | Feedback | `src/models/feedback.ts`; `src/supabase/migrations/20261102000000_init.sql` | - |
| 7 | C07 | SessionHistory | `src/models/sessionHistory.ts`; `src/models/sessionHistoryTypes.ts`; `src/controllers/sessionHistoryController.ts` | - |
| 8 | C08 | ChatMessage | `src/models/chatMessage.ts`; `src/supabase/migrations/20261102000000_init.sql` | - |
| 9 | C09 | Preference | `src/models/preference.ts`; `src/lib/validator.ts` | - |
| 10 | C10 | Profile | `src/models/profile.ts` | - |
| 11 | C11 | Dashboard | `src/app/dashboard/page.tsx`; `src/app/discover/page.tsx`; `src/components/ParticipantSessionPanel.tsx` | - |
| 12 | C12 | UserControl | `src/controllers/userController.ts`; `src/lib/adapters/authAdapter.ts`; `src/lib/validator.ts` | - |
| 13 | C13 | SessionControl | `src/controllers/sessionController.ts`; `src/controllers/sessionParticipationController.ts`; `src/controllers/sessionHistoryController.ts`; `src/lib/validator.ts` | - |
| 14 | C14 | FeedbackControl | `src/controllers/feedbackController.ts`; `src/lib/validator.ts` | - |
| 15 | C15 | LoginPage | `src/app/login/page.tsx`; `src/components/LoginForm.tsx`; `src/app/register/page.tsx`; `src/components/RegisterForm.tsx` | - |
| 16 | C16 | ProfilePage | `src/app/profile/page.tsx`; `src/app/profile/[id]/page.tsx`; `src/app/profile/not-found.tsx`; `src/app/profile/preferences/page.tsx`; `src/components/ProfileView.tsx`; `src/components/PreferenceForm.tsx`; `src/components/AvailabilityEditor.tsx` | - |
| 17 | C17 | SessionPage | `src/app/sessions/[id]/page.tsx` | - |
| 18 | C18 | HostSessionPage | `src/app/sessions/new/page.tsx`; `src/components/HostSessionPanel.tsx`; `src/app/sessions/[id]/edit/page.tsx`; `src/components/EditSessionPanel.tsx`; `src/components/DeleteSessionButton.tsx`; `src/components/SessionFeedbackView.tsx` | - |
| 19 | C19 | ParticipantSessionPage | `src/components/ParticipantSessionPanel.tsx` | - |
| 20 | C20 | FeedbackForm | `src/components/FeedbackForm.tsx`; `src/app/sessions/[id]/feedback/page.tsx` | - |
| 21 | C21 | GroupChatPage | `src/app/sessions/[id]/chat/page.tsx`; `src/components/ChatRoom.tsx`; `src/lib/adapters/realtimeAdapter.ts`; `src/controllers/chatController.ts` | - |
| 22 | C22 | Notification | `src/models/notification.ts`; `src/supabase/migrations/20261113000000_session_reminders.sql`; `src/controllers/reminderController.ts`; `src/controllers/notificationController.ts`; `src/app/api/cron/reminders/route.ts`; `src/lib/adapters/cronAdapter.ts` | - |
| 23 | C23 | PopUpNotification | `src/components/PopUpNotification.tsx`; `src/app/layout.tsx`; `src/lib/adapters/realtimeAdapter.ts` | - |
| 24 | C24 | HistoryPage | `src/app/history/page.tsx`; `src/components/SessionHistoryView.tsx` | - |

## 3.3 Implementasi Antarmuka

Kolom *Nama File Executable* diisi `-` karena aplikasi web Next.js tidak menghasilkan berkas executable per layar (hasil *build* berada di `.next/`).

Tabel 3.3. Implementasi Antarmuka

| No | ID Antarmuka | Nama Antarmuka | Nama File Fisik | Nama File Executable |
| :--- | :--- | :--- | :--- | :--- |
| 1 | I-01 | Masuk | `src/app/login/page.tsx`; `src/components/LoginForm.tsx` | - |
| 2 | I-02 | Daftar Akun | `src/app/register/page.tsx`; `src/components/RegisterForm.tsx` | - |
| 3 | I-02a | Daftar Akun Gagal | `src/app/register/page.tsx`; `src/components/RegisterForm.tsx` (status galat validasi pada formulir) | - |
| 4 | I-03 | Beranda | `src/app/dashboard/page.tsx`; `src/components/Sidebar.tsx` | - |
| 5 | I-03a | Beranda (Preferensi Belum Diatur) | `src/app/dashboard/page.tsx` (peringatan preferensi saat `PREFERENCE_NOT_SET`) | - |
| 6 | I-04 | Discover | `src/app/discover/page.tsx`; `src/components/ParticipantSessionPanel.tsx` (`DiscoverCatalog`) | - |
| 7 | I-05 | Detail Sesi (Mentee) | `src/app/sessions/[id]/page.tsx`; `src/components/ParticipantSessionPanel.tsx` | - |
| 8 | I-05a | Detail Sesi (Mentor) | `src/app/sessions/[id]/page.tsx`; `src/components/ParticipantSessionPanel.tsx`; `src/components/DeleteSessionButton.tsx` | - |
| 9 | I-06 | Edit Sesi | `src/app/sessions/[id]/edit/page.tsx`; `src/components/EditSessionPanel.tsx` | - |
| 10 | I-07 | Profil | `src/app/profile/page.tsx`; `src/app/profile/[id]/page.tsx`; `src/app/profile/not-found.tsx`; `src/components/ProfileView.tsx` | - |
| 11 | I-08 | Edit Preferensi | `src/app/profile/preferences/page.tsx`; `src/components/PreferenceForm.tsx`; `src/components/AvailabilityEditor.tsx` | - |
| 12 | I-09 | History | `src/app/history/page.tsx`; `src/components/SessionHistoryView.tsx` | - |
| 13 | I-10 | Grup Obrolan | `src/app/sessions/[id]/chat/page.tsx`; `src/components/ChatRoom.tsx` | - |
| 14 | I-11 | Buat Sesi | `src/app/sessions/new/page.tsx`; `src/components/HostSessionPanel.tsx` | - |
| 15 | I-12 | Konfirmasi Hapus Sesi | `src/components/DeleteSessionButton.tsx` (dialog konfirmasi pada `src/app/sessions/[id]/page.tsx`) | - |
| 16 | I-13 | Konfirmasi Keluar Sesi | `src/components/ParticipantSessionPanel.tsx` (dialog konfirmasi pembatalan pada `src/app/sessions/[id]/page.tsx`) | - |
| 17 | I-14 | Konfirmasi Keterlaksanaan & Penilaian | `src/app/sessions/[id]/feedback/page.tsx`; `src/components/FeedbackForm.tsx`; `src/components/SessionHistoryView.tsx` | - |
| 18 | I-15 | Feedback Sesi | `src/app/sessions/[id]/feedback/page.tsx`; `src/components/SessionFeedbackView.tsx` | - |
| 19 | I-16 | Notifikasi Pengingat Sesi | `src/components/PopUpNotification.tsx` (dipasang global pada `src/app/layout.tsx`) | - |

Catatan perbedaan terhadap BAB 6 DPPL:
1. Seluruh layar `I-01` sampai `I-16` telah diimplementasikan (tidak ada layar yang dilewatkan). Rute akar `/` (`src/app/page.tsx`) mengalihkan pengguna ke `/dashboard` (`I-03`).
2. Pada `I-07` (Profil), kartu statistik sesi dan rating (`I07-03`) tidak diimplementasikan; sebagai tambahan, tersedia tombol dan formulir `Edit Profil` pada profil milik sendiri untuk memperbarui nama, universitas, program studi, dan bio.
3. Pada `I-14`, konfirmasi keterlaksanaan sesi tersedia melalui halaman Riwayat (`SessionHistoryView`) maupun `/sessions/[id]/feedback` (`FeedbackForm`), sementara pemberian rating dan komentar dilakukan melalui `FeedbackForm` pada `/sessions/[id]/feedback`.

## 3.4 File Lain

Daftar file lain yang dibuat selain file kelas dan antarmuka, misalnya file *utility*, *configuration*, *database schema/seed*, *file test*, atau *data*.

Seluruh path relatif terhadap akar repositori. Berkas kelas, *controller*, *adapter*, dan layar dicantumkan pada Tabel 3.2 dan 3.3.

Tabel 3.4. File Lain

| No | Nama File | Keterangan |
| :--- | :--- | :--- |
| 1 | `src/supabase/migrations/20261102000000_init.sql` | Skema awal: tabel `users`, `profiles`, `preferences`, `sessions`, `session_participants`, `group_chats`, `chat_messages`, `feedbacks`, `notifications`; kebijakan RLS; *trigger* pembuatan grup obrolan per sesi; publikasi Realtime untuk `chat_messages` dan `notifications` |
| 2 | `src/supabase/migrations/20261110000000_reject_overlapping_mentor_sessions.sql` | *Exclusion constraint* `sessions_no_mentor_time_overlap` (`btree_gist`) untuk menolak jadwal Mentor yang bertabrakan (KF06) |
| 3 | `src/supabase/migrations/20261111000000_add_session_edit_details.sql` | Kolom `material_tag` dan `meeting_link` pada `sessions` beserta batas panjangnya (KF17) |
| 4 | `src/supabase/migrations/20261112000000_delete_session.sql` | Fungsi `delete_session()` dan perubahan `notifications.id_session` menjadi *nullable* (`on delete set null`) (KF16) |
| 5 | `src/supabase/migrations/20261113000000_session_reminders.sql` | Fungsi `send_session_reminders()` untuk membuat notifikasi pengingat 15 menit sebelum sesi, hanya dapat dipanggil *service role* (KF09) |
| 6 | `src/supabase/migrations/20261114000000_group_chat_expiry.sql` | Kebijakan `chat_messages_insert` yang menolak pesan 48 jam setelah sesi selesai dan fungsi `close_expired_group_chats()` (KF12) |
| 7 | `src/supabase/migrations/20261115000000_session_capacity_guard.sql` | *Trigger* `enforce_session_capacity()` yang menolak peserta saat sesi penuh (`SESSION_FULL`, KF13) |
| 8 | `src/supabase/migrations/20261116000000_session_time_rules.sql` | *Check constraint* `sessions_same_day_duration` (KF20) dan *trigger* `enforce_participant_schedule()` (KF21) |
| 9 | `src/supabase/seed.sql` | Data awal: akun `mentor.demo`, `mentee.satu`, `mentee.dua` (kata sandi `password123`), profil, preferensi, dua sesi contoh beserta pesertanya, satu feedback, dan contoh pesan obrolan |
| 10 | `src/supabase/config.toml` | Konfigurasi Supabase lokal (port, PostgreSQL 17, Auth tanpa konfirmasi email) untuk `npm run db:start` |
| 11 | `src/middleware.ts` | *Middleware* Next.js yang memperbarui sesi Supabase Auth pada setiap permintaan, mengalihkan pengguna yang belum login ke `/login`, dan mengalihkan pengguna yang sudah login dari `/login` atau `/register` ke `/dashboard`; `/api/cron/*` dikecualikan |
| 12 | `src/lib/supabase/server.ts` | Pembuat klien Supabase sisi server: `createClient()` (berbasis *cookie* pengguna) dan `createAdminClient()` (*service role*) |
| 13 | `src/lib/supabase/client.ts` | Pembuat klien Supabase sisi peramban, dipakai `realtimeAdapter` |
| 14 | `src/lib/supabase/env.ts` | Membaca dan memvalidasi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| 15 | `src/lib/routes.ts` | Daftar *path* autentikasi (`/login`, `/register`) yang dipakai *middleware* dan tata letak |
| 16 | `src/models/types.ts` | Tipe baris tabel, tipe data domain, dan konstanta bersama (kapasitas 1–20, rating 1–5, pengingat 15 menit, retensi obrolan 48 jam) |
| 17 | `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `src/app/favicon.ico` | Tata letak akar (memasang `Sidebar` dan `PopUpNotification`), pengalihan `/` ke `/dashboard`, gaya global Tailwind, dan ikon situs |
| 18 | `src/components/ui.tsx`, `src/components/Sidebar.tsx` | Kelas gaya bersama (input, tombol) dan navigasi samping dengan tombol keluar |
| 19 | `src/app/api/cron/chat-cleanup/route.ts`, `src/controllers/chatCleanupController.ts` | *Route* cron yang dilindungi `CRON_SECRET` untuk menutup grup obrolan kedaluwarsa melalui `GroupChat.closeExpired()` |
| 20 | `src/package.json`, `src/package-lock.json` | Daftar dependensi dan skrip `dev`, `build`, `lint`, `typecheck`, `test`, `db:start`, `db:reset`, `db:status` |
| 21 | `src/next.config.ts`, `src/tsconfig.json`, `src/postcss.config.mjs`, `src/eslint.config.mjs`, `src/.prettierrc.json`, `src/.nvmrc` | Konfigurasi Next.js, TypeScript (alias `@/`), PostCSS/Tailwind, ESLint, Prettier, dan versi Node.js |
| 22 | `src/vitest.config.mts` | Konfigurasi Vitest: alias `@/`, pola `tests/**/*.test.ts`, lingkungan Node |
| 23 | `src/.env.example` | Templat variabel lingkungan: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET` |
| 24 | `src/README.md` | Panduan instalasi, menjalankan Supabase lokal, akun uji, dan pemicu cron manual |
| 25 | `.github/workflows/ci.yml` | CI GitHub Actions pada setiap *pull request* dan *push* ke `main`: `npm ci`, `lint`, `typecheck`, `test`, `build` |
| 26 | `src/tests/support/database.ts` | Membuat PostgreSQL *in-memory* (PGlite) dengan *stub* skema Supabase lalu menjalankan seluruh migrasi; *helper* `addUsers()` dan `asUser()` untuk menguji RLS |
| 27 | `src/tests/support/supabase.ts` | *Fake* klien Supabase (pencatat pemanggilan *query builder*, `rpc`, dan `auth`) untuk unit test kelas Model dan `authAdapter` (ditambahkan pada M10) |
| 28 | `src/tests/userController.test.ts`, `src/tests/validator.test.ts`, `src/tests/authAdapter.test.ts` | Unit test C12 UserControl, Validator, dan AuthAdapter |
| 29 | `src/tests/preference.test.ts`, `src/tests/profile.test.ts` | Unit test C09 Preference dan C10 Profile (ditambahkan pada M10) |
| 30 | `src/tests/chat.test.ts`, `src/tests/groupChatModel.test.ts`, `src/tests/chatMessage.test.ts`, `src/tests/groupChat.test.ts` | Unit test ChatController, C05 GroupChat, C08 ChatMessage, serta uji integrasi RLS dan fungsi grup obrolan pada PGlite |
| 31 | `src/tests/notification.test.ts`, `src/tests/notificationModel.test.ts`, `src/tests/sessionReminders.test.ts` | Unit test NotificationController, CronAdapter, *route* cron, C22 Notification, serta uji integrasi `send_session_reminders()` dan KNF03 pada PGlite |
| 32 | `src/tests/session.test.ts`, `src/tests/sessionController.test.ts`, `src/tests/sessionParticipationController.test.ts`, `src/tests/sessionCapacityGuard.test.ts`, `src/tests/sessionTimeRules.test.ts` | Unit test C04 Session dan C13 SessionControl, serta uji integrasi *trigger* kapasitas dan aturan waktu sesi pada PGlite |
| 33 | `src/tests/sessionHistory.test.ts`, `src/tests/sessionHistoryController.test.ts`, `src/tests/feedbackController.test.ts` | Unit test C07 SessionHistory, *controller* riwayat, dan C14 FeedbackControl |

<br>

---

# BAB 4: Hasil Pengujian

Bab ini melaporkan hasil pengujian P/L pada level unit, integrasi, dan sistem. Pengujian dilakukan pada tag release terakhir Tugas 9. Hasil aktual diisi berdasarkan pengamatan saat pengujian. Kesimpulan diisi `Pass` atau `Fail`, dan untuk `Fail` dilengkapi penyebab serta usulan perbaikan.

## 4.1 Strategi dan Kedalaman Pengujian Kelas

Setiap kelas perancangan pada Tabel 4.1 DPPL diklasifikasikan ke dalam tiga tingkat kedalaman pengujian. Tingkat **Mendalam** diberikan pada kelas yang memuat logika bisnis, perhitungan, validasi, aturan status, algoritma, integrasi eksternal, atau keamanan. Tingkat **Sedang** diberikan pada kelas yang hanya mengoordinasikan atau mendelegasikan proses. Tingkat **Tidak perlu** diberikan pada kelas tanpa logika, seperti *entity/DTO* dan kelas konfigurasi, yang teruji secara tidak langsung melalui test case use case. Seluruh kelas wajib dicantumkan beserta alasan penentuan tingkatnya.

Tabel 4.1.1. Identifikasi Tingkat Pengujian Kelas

| ID Kelas | Nama Kelas | Tingkat | Alasan | Test Case Terkait |
| :--- | :--- | :--- | :--- | :--- |
| *C01* | *User* | *Tidak perlu* | *Entity yang hanya menyimpan dan memetakan data akun (`idUser`, `username`, `email`). Registrasi, login, dan validasi email ditangani `UserControl` (C12) dan `AuthAdapter`* | *Tidak langsung: UC01-TC01 s.d. UC01-TC03, INT-TC05* |
| *C02* | *Mentor* | *Tidak perlu* | *Tidak menjadi kelas tersendiri pada implementasi (peran pada kolom `sessions.id_mentor`, B.1 M9). Logikanya ada pada `Session` (C04) dan `SessionControl` (C13)* | *Tidak langsung: TC UC03, UC11, UC12, UC13* |
| *C03* | *Mentee* | *Tidak perlu* | *Tidak menjadi kelas tersendiri pada implementasi (peran pada tabel `session_participants`, B.1 M9). Logikanya ada pada `Session` (C04), `SessionControl` (C13), dan `FeedbackControl` (C14)* | *Tidak langsung: TC UC04, UC07, UC10* |
| *C04* | *Session* | *Mendalam* | *Memuat aturan bisnis kapasitas (`checkCapacity()`, 1–20 peserta), irisan jadwal (`getSessionsByMentorInRange()`, `getSessionsByParticipantInRange()`), transisi status, `hasStarted()`, dan `needsConfirmation()` (aturan 48 jam)* | *C04-UT01 dst. (`session.test.ts`, `sessionCapacityGuard.test.ts`), INT-TC27 s.d. INT-TC29* |
| *C05* | *GroupChat* | *Mendalam* | *Memuat aturan keanggotaan (`isMember()`), status aktif, dan retensi 48 jam (`expiresAt`, pembersihan melalui Cron)* | *C05-UT01 s.d. C05-UT16, INT-TC16 s.d. INT-TC26* |
| *C06* | *Feedback* | *Sedang* | *Operasi simpan dan baca *feedback* (CRUD) dengan sedikit logika; validasi rating dan kelayakan berada di `FeedbackControl` (C14)* | *C06-UT01 dst. (`feedbackController.test.ts`)* |
| *C07* | *SessionHistory* | *Sedang* | *Mengambil sesi arsip pengguna dan mengelompokkannya per status (`getGroupedByStatus()`) tanpa aturan bisnis tambahan* | *C07-UT01 dst. (`sessionHistory.test.ts`, `sessionHistoryController.test.ts`), KNF05-TC01* |
| *C08* | *ChatMessage* | *Sedang* | *Membuat dan membaca pesan (CRUD) serta memetakan baris basis data; validasi isi pesan dan keanggotaan berada di `ChatController` dan RLS* | *C08-UT01 s.d. C08-UT10, INT-TC20 s.d. INT-TC26* |
| *C09* | *Preference* | *Mendalam* | *Memuat pembaruan preferensi yang divalidasi (`validatePreference()`) dan pemetaan data preferensi yang menjadi masukan *matchmaking** | *C09-UT01 s.d. C09-UT07, INT-TC06* |
| *C10* | *Profile* | *Sedang* | *Operasi buat, baca, dan ubah profil (CRUD) dengan sedikit logika* | *C10-UT01 s.d. C10-UT10, INT-TC05* |
| *C11* | *Dashboard* | *Tidak perlu* | *Halaman *view* yang hanya memuat dan menampilkan data. *Matchmaking* yang dipanggilnya diimplementasikan dan diuji pada `SessionControl` (C13)* | *Tidak langsung: TC UC04, UC14* |
| *C12* | *UserControl* | *Mendalam* | *Memuat validasi email domain universitas, persetujuan data, dan alur registrasi/login melalui `AuthAdapter` (keamanan dan integrasi eksternal)* | *C12-UT01 s.d. C12-UT46, VAL-UT01 s.d. VAL-UT07, INT-TC01 s.d. INT-TC06, KNF01-TC01, KNF04-TC01* |
| *C13* | *SessionControl* | *Mendalam* | *Memuat Algo-C13-01 s.d. Algo-C13-04: validasi waktu sesi (`validateSessionTime()`, tidak lintas hari, 10 menit–12 jam), konflik jadwal Mentor dan Mentee, kapasitas, *matchmaking* (`matchSession()`), dan konfirmasi sesi* | *C13-UT01 dst. (`sessionController.test.ts`, `sessionParticipationController.test.ts`, `sessionTimeRules.test.ts`), INT-TC27 s.d. INT-TC29, KNF02-TC01* |
| *C14* | *FeedbackControl* | *Mendalam* | *Memuat aturan kelayakan *feedback* (`checkFeedbackEligibility()`: hanya Mentee peserta, sesi selesai, belum pernah memberi) dan validasi rating 1–5 (`validateRating()`) sebelum `submitFeedback()`* | *C14-UT01 dst. (`feedbackController.test.ts`)* |
| *C15* | *LoginPage* | *Tidak perlu* | *Kelas *view* yang menampilkan formulir dan meneruskan masukan ke `UserControl`* | *Tidak langsung: UC01-TC01 s.d. UC01-TC03* |
| *C16* | *ProfilePage* | *Tidak perlu* | *Kelas *view* yang menampilkan profil dan formulir preferensi* | *Tidak langsung: UC02-TC01, UC02-TC02, TC UC15* |
| *C17* | *SessionPage* | *Tidak perlu* | *Kelas *view* untuk detail sesi dan konfirmasi keterlaksanaan; logikanya di `SessionControl`* | *Tidak langsung: TC UC05* |
| *C18* | *HostSessionPage* | *Tidak perlu* | *Kelas *view* untuk formulir buat, edit, hapus sesi dan daftar *feedback*; validasi di `SessionControl`* | *Tidak langsung: TC UC03, UC11, UC12, UC13* |
| *C19* | *ParticipantSessionPage* | *Tidak perlu* | *Kelas *view* untuk bergabung dan membatalkan keikutsertaan* | *Tidak langsung: TC UC04, UC10* |
| *C20* | *FeedbackForm* | *Tidak perlu* | *Kelas *view* yang menampilkan formulir rating dan komentar; validasi di `FeedbackControl`* | *Tidak langsung: TC UC07* |
| *C21* | *GroupChatPage* | *Tidak perlu* | *Kelas *view* yang menampilkan pesan dan menerima pembaruan Realtime* | *Tidak langsung: UC08-TC01 s.d. UC08-TC03, INT-TC30 s.d. INT-TC33* |
| *C22* | *Notification* | *Mendalam* | *Memuat pembentukan pengingat 15 menit sebelum sesi tanpa duplikat (Cron) dan status baca (`markAsRead()`)* | *C22-UT01 s.d. C22-UT19, INT-TC07 s.d. INT-TC15, KNF03-TC01, KNF03-TC02* |
| *C23* | *PopUpNotification* | *Tidak perlu* | *Kelas *view* yang menampilkan *pop-up* notifikasi* | *Tidak langsung: UC09-TC01, UC09-TC02, INT-TC34* |
| *C24* | *HistoryPage* | *Tidak perlu* | *Kelas *view* yang menampilkan daftar riwayat; pengelompokan di `SessionHistory`* | *Tidak langsung: TC UC06, KNF05-TC01* |
| *-* | *Validator (`lib/validator.ts`)* | *Mendalam* | *Modul pendukung tanpa ID kelas DPPL berisi fungsi validasi murni (`validateEmail()`, `validatePreference()`, `validateCapacity()`, `validateSessionTime()`, `validateRating()`, `hasScheduleConflict()`) yang dipakai banyak kelas* | *VAL-UT01 s.d. VAL-UT07* |

## 4.2 Pengujian Unit Kelas

Pengujian unit dilakukan pada kelas bertingkat Mendalam dan Sedang. Kelas Mendalam diuji pada seluruh operasi public dengan kasus normal, batas, dan negatif, serta mencapai *coverage* minimal 70%. Kelas Sedang diuji minimal dengan satu kasus normal dan satu kasus gagal pada operasi public utama.

Cara menjalankan unit test (dari folder `src/`): `npm test` untuk seluruh test, `npx vitest run tests/<berkas>.test.ts` untuk satu berkas, dan `npx vitest run --coverage` untuk laporan *coverage* (`@vitest/coverage-v8`).

Lokasi file test: `src/tests/`. Unit test kelas Model memakai *fake* klien Supabase (`src/tests/support/supabase.ts`) agar logika pemetaan baris, penanganan kode galat, dan parameter *query* teruji tanpa jaringan; *controller* diuji dengan Model dan *adapter* yang di-*mock*. Interaksi nyata dengan PostgreSQL dan Supabase diuji terpisah pada Subbab 4.3.

Kolom *Hasil Pengujian* diambil dari keluaran `npm test` pada branch `test/user-chat-notification` (tag `v9.2` ditambah test M10, tanpa perubahan kode aplikasi): **20 berkas, 226 test, seluruhnya lulus**. Nama test Vitest dicantumkan dalam tanda kutip agar setiap ID dapat ditelusuri ke berkas test.

### 4.2.1 Kelas Session

**ID Kelas:** C04  
**Nama Kelas:** Session (`src/models/session.ts`)  
**Tingkat:** Mendalam  
**Berkas test (bagian *matchmaking* & pencarian):** `src/tests/sessionParticipationController.test.ts`, `src/tests/sessionMatchSearch.test.ts` (baru pada M10)

Bagian `C04-UT01` s.d. `C04-UT15` di bawah menguji operasi `matchSession()` dan `searchSession()` (bagian Hugo). Operasi pembuatan, pengubahan, penghapusan, konfirmasi, kapasitas, dan partisipasi sesi dilanjutkan pada nomor ID berikutnya oleh Matthew dan Fabian.

Tabel 4.2.1. Hasil Pengujian Unit Kelas C04

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C04-UT01 | `matchSession()` | Normal | Preferensi tag `["Struktur Data", "Kalkulus"]`, slot Senin 08:00–12:00 WIB, format `DARING`; 4 kandidat (cocok tag, cocok topik fallback, tag salah, format salah) | Mengembalikan 2 sesi yang cocok terurut naik berdasarkan `scheduledTime` | "matches sessions by material tag intersection, WIB availability slot, and format" lulus | Pass |
| C04-UT02 | `matchSession()` | Normal | Preferensi format `BOTH` dengan kandidat `DARING` dan `LURING` | Kedua kandidat dikembalikan | "matches both DARING and LURING sessions when format preference is BOTH" lulus | Pass |
| C04-UT03 | `matchSession()` | Batas | Sesi Minggu 00:30–02:00 WIB (`2026-11-14T17:30:00Z`, batas hari UTC vs WIB) dan sesi di luar jam luang; preferensi `day: 0` (Minggu) 00:00–03:00 | Hanya sesi Minggu dini hari WIB yang cocok | "evaluates day (0 = Sunday) and time range in WIB (Asia/Jakarta, UTC+7)" lulus | Pass |
| C04-UT04 | `matchSession()` | Negatif | Kandidat sesi milik sendiri, sudah diikuti, penuh (`3/3`), sudah dimulai, dan 1 sesi valid | Hanya sesi valid yang dikembalikan | "excludes own sessions, already joined sessions, full sessions, and started sessions" lulus | Pass |
| C04-UT05 | `matchSession()` | Negatif | Preferensi tidak lengkap: `sessionFormatPreference: null`, `availability: []`, `materialTag: []`, atau tag hanya spasi | Mengembalikan `[]` | "returns empty array when preference is incomplete or tags are blank" lulus | Pass |
| C04-UT06 | `matchSession()` | Normal | Tag berspasi ganda dan beda huruf besar/kecil (`"  struktur   data "`, `"KALKULUS"`), urutan masukan terbalik | Tetap cocok dan diurutkan naik berdasarkan `scheduledTime` | "matches by tag or topic (case- and whitespace-insensitive) and sorts ascending by scheduledTime" lulus | Pass |
| C04-UT07 | `matchSession()` | Batas | Sesi tepat di batas slot 08:00–12:00 WIB vs mulai 07:59 WIB vs selesai 12:01 WIB | Hanya sesi tepat di batas 08:00–12:00 WIB yang cocok | "matches exact availability slot boundaries and rejects sessions 1 minute outside" lulus | Pass |
| C04-UT08 | `matchSession()` | Batas | Sesi 22:00–00:00 WIB (lintas hari) dibandingkan slot berakhir `23:59` vs `23:00` | Cocok hanya pada slot `23:59`, ditolak pada `23:00` | "handles cross-day boundary only when availability slot ends at 23:59" lulus | Pass |
| C04-UT09 | `matchSession()` | Negatif | Status `SELESAI`, `capacity = 0`, tanggal tidak valid, `endTime < scheduledTime`, `scheduledTime === now`, serta slot waktu tidak valid (`25:00`, `12:00–08:00`) | Semuanya ditolak (`[]`) | "rejects non-TERJADWAL status, invalid capacity, invalid timestamps, and malformed availability slots" lulus | Pass |
| C04-UT10 | `matchSession()` | Batas | Kapasitas 1 dengan `participantCount = 0` vs `participantCount = 1` | Sesi `0/1` diterima, `1/1` ditolak | "handles capacity boundary (capacity - 1 accepted, capacity rejected)" lulus | Pass |
| C04-UT11 | `searchSession()` | Normal | Filter terpisah menurut kata kunci topik (`"pohon"`), tag (`"rekayasa"`), format (`LURING`), tanggal (`2026-11-16`), dan hari WIB (`2`) | Setiap filter mengembalikan sesi yang sesuai | "filters by topic or material tag keyword, format, date, and WIB day" lulus | Pass |
| C04-UT12 | `searchSession()` | Batas | Kriteria kosong `{}` dan `{ format: "ALL", query: "   ", day: null }` | Mengembalikan seluruh sesi tanpa penyaringan | "returns all sessions when criteria are empty or format is ALL" lulus | Pass |
| C04-UT13 | `searchSession()` | Normal/Negatif | Kata kunci berspasi dan huruf besar (`"  POHON   biner "`) vs kata kunci tanpa kecocokan (`"fisika kuantum"`) | Cocok untuk `"pohon biner"`, mengembalikan `[]` jika tidak ada kecocokan | "normalizes query whitespace and letter case and returns empty array when nothing matches" lulus | Pass |
| C04-UT14 | `searchSession()` | Normal/Batas | `schedule` cocok melalui *fallback* `dateKey` WIB saat `session.schedule` kosong; kombinasi query + format + hari + tanggal; kombinasi yang tidak cocok | Mengembalikan sesi yang memenuhi seluruh kriteria atau `[]` | "matches schedule via WIB dateKey fallback and combines multiple filters" lulus | Pass |
| C04-UT15 | `searchSession()` | Batas | Filter `day: 1.5` (bukan bilangan bulat) | Filter hari diabaikan, seluruh sesi dikembalikan | "ignores non-integer day filters" lulus | Pass |

*[Matthew dan Fabian melanjutkan baris C04-UT16 dst. untuk operasi buat, ubah, hapus, konfirmasi, kapasitas, dan partisipasi sesi.]*

Tabel 4.2.1b. Ringkasan Cakupan Kelas C04 (bagian `matchSession()` dan `searchSession()`)

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL (bagian *matchmaking* & pencarian) | `matchSession()`, `searchSession()` |
| Operasi yang diuji | `matchSession()` (beserta fungsi bantu `matchesAvailability()`, `parseMinutes()`, `toWib()`, `normalizeTag()`) dan `searchSession()` |
| ID Algoritma yang tercakup | Algo-C04-01 (`matchSession()`), Algo-C04-02 (`searchSession()`) |
| Coverage (wajib ≥ 70%) | `models/session.ts` blok `matchSession()` & `searchSession()` (baris 122–249): **92,86% *statement*** (78/84) dan **93,55% cabang** (87/93) menggunakan `@vitest/coverage-v8`. Bukti `C04-C11-C16-unit.png` dan `coverage-hugo.png` pada 4.6 |

### 4.2.2 Kelas GroupChat

**ID Kelas:** C05  
**Nama Kelas:** GroupChat (`src/models/groupChat.ts`, dengan ChatController `src/controllers/chatController.ts` dan `src/controllers/chatCleanupController.ts`)  
**Tingkat:** Mendalam  
**Berkas test:** `src/tests/groupChatModel.test.ts` (baru pada M10), `src/tests/chat.test.ts`

Tabel 4.2.2. Hasil Pengujian Unit Kelas C05

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C05-UT01 | `findBySession()` | Normal | Baris `group_chats` sesi `s1` | Objek `GroupChat` aktif untuk `s1` | "maps the chat of the session" lulus | Pass |
| C05-UT02 | `findBySession()` | Batas | Grup tidak terlihat (RLS); ID bukan UUID | `null` | "returns null when the chat is hidden or the ID is not a UUID" lulus | Pass |
| C05-UT03 | `findBySession()` | Negatif | Galat basis data | Melempar galat | "throws other database errors" lulus | Pass |
| C05-UT04 | `findMenteeIds()` | Normal | Dua peserta | `["a", "b"]` terurut `joined_at` | "lists the participants in join order" lulus | Pass |
| C05-UT05 | `findMenteeIds()` | Negatif | Kueri gagal | Melempar galat | "throws when the query fails" lulus | Pass |
| C05-UT06 | `closeExpired()` | Normal | `now` tertentu | RPC `close_expired_group_chats` dengan `p_retention_hours = 48`, mengembalikan jumlah grup | "calls close_expired_group_chats with the 48-hour retention" lulus | Pass |
| C05-UT07 | `closeExpired()` | Negatif | RPC ditolak | Melempar galat | "throws when the function fails" lulus | Pass |
| C05-UT08 | `isActive()` | Normal | 1 jam sebelum sesi berakhir; 48 jam kurang 1 ms setelah berakhir | `true` | "is active during the session and until just before 48 hours after it ends" lulus | Pass |
| C05-UT09 | `isActive()` | Batas | Tepat 48 jam setelah sesi berakhir | `false` | "is inactive from exactly 48 hours after the session ends" lulus | Pass |
| C05-UT10 | `isActive()` | Negatif | Grup sudah ditutup (`is_active = false`) | `false` | "is inactive once the chat has been closed" lulus | Pass |
| C05-UT11 | `getGroupChat()` (ChatController) | Normal | Anggota membuka grup sesi | Data sesi, anggota (Mentor ditandai), nama pengirim termasuk mantan peserta, dan pesan | "returns the session, members, sender names, and messages for a member" lulus | Pass |
| C05-UT12 | `getGroupChat()` | Negatif | Pengguna bukan anggota (grup tidak terlihat) | `null` | "returns null when the user cannot see the chat" lulus | Pass |
| C05-UT13 | `getGroupChat()` | Negatif | Tanpa sesi login | `null` | "returns null without a session" lulus | Pass |
| C05-UT14 | `getGroupChat()` | Batas | Grup melewati masa aktif | `active = false` | "reports an expired chat as inactive" lulus | Pass |
| C05-UT15 | `GET /api/cron/chat-cleanup` | Negatif | Tanpa `CRON_SECRET` yang benar | HTTP 401, `closeExpired()` tidak dipanggil | "rejects calls without the cron secret" lulus | Pass |
| C05-UT16 | `GET /api/cron/chat-cleanup` | Normal | Dengan `CRON_SECRET` | HTTP 200 dan jumlah grup yang ditutup | "closes expired chats" lulus | Pass |

Tabel 4.2.2b. Ringkasan Cakupan Kelas C05

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `findBySession()`, `findById()`, `getId()`, `isActive()`, `isMember()`, `getMessages()`, `searchMessage()`, `displayMessage()`, `editMessage()`, `deleteMessage()` |
| Operasi yang diuji | `findBySession()`, `isActive()`, `findMenteeIds()`, `closeExpired()`; `getMessages()` sebagai `ChatMessage.findByGroupChat()` (C08-UT04 s.d. C08-UT06); `isMember()` diwujudkan sebagai fungsi SQL `is_session_member()` pada RLS dan diuji pada INT-TC13 s.d. INT-TC15. `findById()`/`getId()` digantikan properti `idGroupChat`; `displayMessage()` berada di `ChatRoom`. `searchMessage()`, `editMessage()`, `deleteMessage()` tidak diimplementasikan (DPPL revisi D) |
| ID Algoritma yang tercakup | Algo-C05-01, Q-C05-01, Q-C05-05 (melalui `close_expired_group_chats()`) |
| Coverage (wajib ≥ 70%) | `models/groupChat.ts`: 100%; `controllers/chatController.ts`: 100% baris, 85% cabang; `controllers/chatCleanupController.ts` dan `app/api/cron/chat-cleanup/route.ts`: 100%. Bukti `C05-unit.png` dan `coverage-david.png` |

### 4.2.3 Kelas Feedback

**Tingkat:** Sedang  

*[Diisi: Tabel 4.2.3. Hasil Pengujian Unit Kelas C06]*

### 4.2.4 Kelas SessionHistory

**Tingkat:** Sedang  

*[Diisi: Tabel 4.2.4. Hasil Pengujian Unit Kelas C07]*

### 4.2.5 Kelas ChatMessage

**ID Kelas:** C08  
**Nama Kelas:** ChatMessage (`src/models/chatMessage.ts`, dengan `sendMessage()` pada `src/controllers/chatController.ts`)  
**Tingkat:** Sedang  
**Berkas test:** `src/tests/chatMessage.test.ts` (baru pada M10), `src/tests/chat.test.ts`

Tabel 4.2.5. Hasil Pengujian Unit Kelas C08

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C08-UT01 | `create()` | Normal | `("g1", "u1", "Halo semua")` | *Insert* `{ id_group_chat, id_sender, text }`, mengembalikan `ChatMessage` | "inserts the message and maps the saved row" lulus | Pass |
| C08-UT02 | `create()` | Negatif | RLS menolak (`42501`) | Melempar `CHAT_CLOSED` | "reports CHAT_CLOSED when row level security refuses the insert" lulus | Pass |
| C08-UT03 | `create()` | Negatif | *Check constraint* teks | Melempar galat basis data | "throws other database errors" lulus | Pass |
| C08-UT04 | `findByGroupChat()` | Normal | Dua pesan | Dua pesan terurut `time_stamp` | "returns the messages of the chat ordered by time" lulus | Pass |
| C08-UT05 | `findByGroupChat()` | Batas | Grup tanpa pesan | `[]` | "returns an empty list for a chat without messages" lulus | Pass |
| C08-UT06 | `findByGroupChat()` | Negatif | Kueri gagal | Melempar galat | "throws when the query fails" lulus | Pass |
| C08-UT07 | `sendMessage()` | Normal | Pesan berspasi dari anggota login | Pesan di-*trim* lalu disimpan | "saves the trimmed message for the logged-in member" lulus | Pass |
| C08-UT08 | `sendMessage()` | Batas/Negatif | Pesan kosong; pesan 2.001 karakter (batas 2.000) | `EMPTY_MESSAGE`; `MESSAGE_TOO_LONG` tanpa akses basis data | "rejects empty and overlong messages before touching the database" lulus | Pass |
| C08-UT09 | `sendMessage()` | Negatif | `create()` melempar `CHAT_CLOSED` | `CHAT_EXPIRED` | "reports a chat the database refuses as ended" lulus | Pass |
| C08-UT10 | `sendMessage()` | Negatif | Tanpa login; galat lain | `NOT_AUTHENTICATED`; `SEND_FAILED` | "requires a logged-in user and reports database failures" lulus | Pass |

### 4.2.6 Kelas Preference

**ID Kelas:** C09  
**Nama Kelas:** Preference (`src/models/preference.ts`)  
**Tingkat:** Mendalam  
**Berkas test:** `src/tests/preference.test.ts` (baru pada M10)

Tabel 4.2.6. Hasil Pengujian Unit Kelas C09

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C09-UT01 | `getPreferenceByUser()` | Normal | Baris `preferences` milik `u1` | Objek `Preference` dengan tag, slot, dan format yang sama; kueri `eq("id_user", "u1")` | "maps the stored row of the user" lulus | Pass |
| C09-UT02 | `getPreferenceByUser()` | Batas | Pengguna belum punya preferensi | `null` | "returns null when the user has no preference yet" lulus | Pass |
| C09-UT03 | `getPreferenceByUser()` | Negatif | ID bukan UUID (galat `22P02`) | `null`, tidak melempar | "returns null for an ID that is not a UUID" lulus | Pass |
| C09-UT04 | `getPreferenceByUser()` | Negatif | Galat koneksi | Melempar galat dengan pesan basis data | "throws other database errors" lulus | Pass |
| C09-UT05 | `updatePreference()` | Normal | Tag, slot, format `DARING` | *Upsert* `{ id_user, material_tag, availability, session_format_preference }`, mengembalikan `Preference` | "upserts tags, availability, and format, then returns the saved preference" lulus | Pass |
| C09-UT06 | `updatePreference()` | Negatif | Basis data menolak (`23514`) | Melempar galat | "throws when the database rejects the row" lulus | Pass |
| C09-UT07 | `getPreferenceDetails()` | Batas | Tag dan slot kosong, format `null` | Nilai kosong dikembalikan apa adanya | "returns empty lists and a null format unchanged" lulus | Pass |

Tabel 4.2.6b. Ringkasan Cakupan Kelas C09

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `getPreferenceByUser()`, `getPreference()`, `getPreferenceDetails()`, `updatePreference()`, `isComplete()`, `getMaterialTag()`, `getAvailability()`, `getSessionFormatPreference()`, `getUserId()` |
| Operasi yang diuji | `getPreferenceByUser()`, `updatePreference()`, `getPreferenceDetails()`; `isComplete()` sebagai `validatePreference()` (VAL-UT05 s.d. VAL-UT07). `getPreference()` digabung ke `getPreferenceByUser()`, sedangkan *getter* menjadi properti `readonly` (Tabel B.5 M9) |
| ID Algoritma yang tercakup | Algo-C09-01, Q-C09-01, Q-C09-02 (diwujudkan sebagai *upsert*) |
| Coverage (wajib ≥ 70%) | `models/preference.ts`: 100% baris, cabang, dan fungsi. Bukti `C09-unit.png` dan `coverage-david.png` |

### 4.2.7 Kelas Profile

**ID Kelas:** C10  
**Nama Kelas:** Profile (`src/models/profile.ts`)  
**Tingkat:** Sedang  
**Berkas test:** `src/tests/profile.test.ts` (baru pada M10)

Tabel 4.2.7. Hasil Pengujian Unit Kelas C10

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C10-UT01 | `create()` | Normal | `idUser = u1` dan data profil | *Insert* kolom `id_user, name, university, study_program, bio`; `getProfileData()` sama dengan masukan | "inserts the profile and maps the saved row" lulus | Pass |
| C10-UT02 | `create()` | Negatif | *Duplicate key* | Melempar galat | "throws when the insert fails" lulus | Pass |
| C10-UT03 | `findByUser()` | Normal | Baris profil ada | Objek `Profile` dengan nama yang sama | "returns the profile of the user" lulus | Pass |
| C10-UT04 | `findByUser()` | Batas | Baris tidak ada; ID bukan UUID | `null` | "returns null when missing or when the ID is not a UUID" lulus | Pass |
| C10-UT05 | `findByUser()` | Negatif | *Timeout* | Melempar galat | "throws other database errors" lulus | Pass |
| C10-UT06 | `findByUsers()` | Batas | Daftar ID kosong | `[]` tanpa kueri | "skips the query for an empty list" lulus | Pass |
| C10-UT07 | `findByUsers()` | Normal | `["u1", "u2"]` | Dua profil; kueri `in("id_user", ...)` | "loads several profiles at once" lulus | Pass |
| C10-UT08 | `findByUsers()` | Negatif | Kueri gagal | Melempar galat | "throws when the query fails" lulus | Pass |
| C10-UT09 | `updateProfile()` | Normal | Bio kosong | *Upsert* data profil dan mengembalikan profil baru | "upserts the new identity data" lulus | Pass |
| C10-UT10 | `updateProfile()` | Negatif | RLS menolak | Melempar galat | "throws when the update fails" lulus | Pass |

### 4.2.8 Kelas UserControl

**ID Kelas:** C12  
**Nama Kelas:** UserControl (`src/controllers/userController.ts`, dengan `src/lib/adapters/authAdapter.ts`)  
**Tingkat:** Mendalam  
**Berkas test:** `src/tests/userController.test.ts`, `src/tests/authAdapter.test.ts`

Tabel 4.2.8. Hasil Pengujian Unit Kelas C12

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C12-UT01 | `processRegistration()` | Normal | `Mentee.Demo@std.stei.itb.ac.id`, kata sandi 10 karakter, username `Mentee_D`, nama berspasi, *consent* `true` | Akun Auth, baris `users`, dan `profiles` dibuat dengan email dan username huruf kecil serta nama yang di-*trim*; `needsConfirmation = false` | "creates the auth account, users row, and profile with normalized data" lulus | Pass |
| C12-UT02 | `processRegistration()` | Batas | Supabase Auth membuat akun tanpa sesi (`signedIn = false`) | Hasil `ok` dengan `needsConfirmation = true` | "reports when the new account must confirm its email first" lulus | Pass |
| C12-UT03 | `processRegistration()` | Negatif | Email `menteedemo@gmail.com` | `INVALID_UNIVERSITY_EMAIL`; Auth dan basis data tidak dipanggil | "rejects non-university email without touching auth or the database" lulus | Pass |
| C12-UT04 | `processRegistration()` | Batas/Negatif | Kata sandi `1234567` (7 karakter); *consent* `false` | `WEAK_PASSWORD`; `CONSENT_REQUIRED` | "requires a password of at least 8 characters and data consent" lulus | Pass |
| C12-UT05 | `processRegistration()` | Negatif | Email atau username sudah ada di `users`; Auth mengembalikan `user_already_exists` | `EMAIL_TAKEN` / `USERNAME_TAKEN` | "rejects an email or username that is already registered", "reports an email Supabase Auth already knows" lulus | Pass |
| C12-UT06 | `processRegistration()` | Negatif | Penyimpanan baris `users` gagal setelah akun Auth dibuat | `rollbackSignUp()` dipanggil, hasil `REGISTRATION_FAILED` | "rolls back the auth account when saving the rows fails" lulus | Pass |
| C12-UT07 | `authLogin()` | Normal | Email berhuruf besar dan berspasi, kata sandi benar | `signIn()` dipanggil dengan email huruf kecil, hasil `ok` | "signs in with a normalized email" lulus | Pass |
| C12-UT08 | `authLogin()` | Batas | Email atau kata sandi kosong | `INVALID_CREDENTIALS` tanpa memanggil Auth | "rejects empty input without calling Supabase Auth" lulus | Pass |
| C12-UT09 | `authLogin()` | Negatif | Auth melempar `INVALID_CREDENTIALS`, `EMAIL_NOT_CONFIRMED`, galat lain | Kode galat diteruskan; galat lain menjadi `LOGIN_FAILED` | "maps auth errors to login errors" lulus | Pass |
| C12-UT10 | `logout()` | Normal | Pengguna login menekan Keluar | `signOut()` dipanggil lalu dialihkan ke `/login` | "ends the session and returns to the login page" lulus | Pass |
| C12-UT11 | `getCurrentUser()` | Normal | Sesi aktif, baris `users` dan `profiles` ada | Mengembalikan ID, username, email, dan nama profil | "combines the user and profile name" lulus | Pass |
| C12-UT12 | `getCurrentUser()` | Batas | Tanpa sesi; sesi ada tetapi baris `users` belum ada | `null`; data dari sesi Auth dengan nama = email | "returns null without a session", "still returns the session when the users row is missing" lulus | Pass |
| C12-UT13 | `getCurrentUser()` | Negatif | Kueri `users`/`profiles` gagal | Tetap mengembalikan data sesi (tidak melempar) | "falls back to the session when the database query fails" lulus | Pass |
| C12-UT14 | `savePreference()` | Normal | Tag `[" Kalkulus ", "kalkulus", "Struktur  Data", ""]` | Tersimpan `["Kalkulus", "Struktur Data"]`: di-*trim*, spasi ganda dirapikan, duplikat (tanpa membedakan huruf) dan tag kosong dibuang | "saves trimmed, de-duplicated tags with the chosen format" lulus | Pass |
| C12-UT15 | `savePreference()` | Normal | Slot ketersediaan tidak urut dan ganda | Slot unik, terurut per hari dan jam | "saves availability slots sorted by day and time without duplicates" lulus | Pass |
| C12-UT16 | `savePreference()` | Batas | Slot `08:00–08:00` (selesai = mulai) dan `08:00–07:30` | `INVALID_AVAILABILITY` | "rejects slots whose end time is not after the start time" lulus | Pass |
| C12-UT17 | `savePreference()` | Negatif | Hari `7`, hari `1.5`, jam `8:00`, jam `24:00`, slot tanpa jam selesai | `INVALID_AVAILABILITY` | "rejects malformed slots" lulus | Pass |
| C12-UT18 | `savePreference()` | Batas | 51 slot (batas 50) | `INVALID_AVAILABILITY` | "rejects too many slots" lulus | Pass |
| C12-UT19 | `savePreference()` | Negatif | Tag hanya spasi, format kosong, atau tanpa slot | `INCOMPLETE_PREFERENCE` tanpa akses basis data | "rejects missing tags, format, or availability without touching the database" lulus | Pass |
| C12-UT20 | `savePreference()` | Batas | 21 tag (batas 20); tag 41 karakter (batas 40) | `INVALID_TAG` | "rejects too many or too long tags" lulus | Pass |
| C12-UT21 | `savePreference()` | Negatif | ID pengguna berbeda dengan sesi login | `UNAUTHORIZED` | "refuses to save another user's preference" lulus | Pass |
| C12-UT22 | `savePreference()` | Negatif | `Preference.updatePreference()` melempar galat | `PREFERENCE_FAILED` | "reports database failures" lulus | Pass |
| C12-UT23 | `fetchUserPreference()` | Normal/Batas | Preferensi tersimpan; belum ada preferensi | Data preferensi; `null` | "returns the stored preference, or null when none is set" lulus | Pass |
| C12-UT24 | `fetchUserPreference()` | Negatif | Kueri gagal | `PREFERENCE_FAILED` | "reports database failures" lulus | Pass |
| C12-UT25 | `fetchUserProfile()` | Normal | ID pengguna yang ada | Gabungan data akun dan profil | "combines the user account and profile details" lulus | Pass |
| C12-UT26 | `fetchUserProfile()` | Batas | Baris `profiles` belum ada | Nama = username, kolom lain kosong | "falls back to defaults when the profile row is missing" lulus | Pass |
| C12-UT27 | `fetchUserProfile()` | Negatif | ID kosong atau tidak ada | `USER_NOT_FOUND` | "returns USER_NOT_FOUND when the user ID is blank or does not exist" lulus | Pass |
| C12-UT28 | `fetchUserProfile()` | Negatif | Kueri gagal | `PROFILE_FAILED` | "reports database failures" lulus | Pass |
| C12-UT29 | `saveProfile()` | Normal | Data profil berspasi | Profil disimpan dengan nilai di-*trim* | "updates the profile with trimmed fields" lulus | Pass |
| C12-UT30 | `saveProfile()` | Batas/Negatif | Nama kosong; bio 301 karakter (batas 300) | `INCOMPLETE_PROFILE`; `BIO_TOO_LONG` | "rejects missing required fields or overly long bio without touching the database" lulus | Pass |
| C12-UT31 | `saveProfile()` | Negatif | ID pengguna lain | `UNAUTHORIZED` | "refuses to update another user's profile" lulus | Pass |
| C12-UT32 | `saveProfile()` | Negatif | Penyimpanan gagal | `PROFILE_FAILED` | "reports database failures" lulus | Pass |
| C12-UT33 | `authAdapter.signUp()` | Normal | Auth mengembalikan pengguna dengan/tanpa sesi | `{ idUser, signedIn: true/false }` | "returns the new user ID and whether a session was opened" lulus | Pass |
| C12-UT34 | `authAdapter.signUp()` | Negatif | Kode `user_already_exists`, `email_exists`, `weak_password` | `EMAIL_TAKEN`, `WEAK_PASSWORD` | "maps duplicate and weak password errors" lulus | Pass |
| C12-UT35 | `authAdapter.signUp()` | Batas | Pengguna dengan `identities` kosong (email sudah terdaftar) | `EMAIL_TAKEN` | "treats a user without identities as an existing email" lulus | Pass |
| C12-UT36 | `authAdapter.signUp()` | Negatif | Galat Auth lain | Pesan galat diteruskan | "passes other errors through" lulus | Pass |
| C12-UT37 | `authAdapter.signIn()` | Normal | Kredensial benar | Mengembalikan ID pengguna | "returns the ID of the signed-in user" lulus | Pass |
| C12-UT38 | `authAdapter.signIn()` | Negatif | `invalid_credentials`, `email_not_confirmed` | `INVALID_CREDENTIALS`, `EMAIL_NOT_CONFIRMED` | "maps wrong credentials and unconfirmed email" lulus | Pass |
| C12-UT39 | `authAdapter.signIn()` | Negatif | Galat Auth lain | Pesan galat diteruskan | "passes other errors through" lulus | Pass |
| C12-UT40 | `authAdapter.signOut()` | Normal | Sign-out berhasil | `signOut({ scope: "local" })`, *cookie* tidak dihapus manual | "signs out locally and keeps cookies when it succeeds" lulus | Pass |
| C12-UT41 | `authAdapter.signOut()` | Negatif | Sign-out gagal; *cookie* `sb-abc-auth-token` dan `theme` | Hanya *cookie* berawalan `sb-` yang dihapus | "clears only Supabase cookies when sign-out fails" lulus | Pass |
| C12-UT42 | `authAdapter.rollbackSignUp()` | Normal | ID akun baru | `admin.deleteUser()` lalu sign-out | "deletes the auth account and signs out" lulus | Pass |
| C12-UT43 | `authAdapter.rollbackSignUp()` | Negatif | `deleteUser()` gagal | Tetap sign-out, lalu melempar galat | "still signs out but reports a failed deletion" lulus | Pass |
| C12-UT44 | `authAdapter.getSessionUser()` | Normal | Sesi aktif | `{ id, email }`; `getSessionUserId()` = ID | "returns the logged-in user" lulus | Pass |
| C12-UT45 | `authAdapter.getSessionUser()` | Batas | Pengguna tanpa email | `email = ""` | "uses an empty email when Supabase has none" lulus | Pass |
| C12-UT46 | `authAdapter.getSessionUser()` | Negatif | Tanpa sesi | `null` | "returns null without a session" lulus | Pass |

Tabel 4.2.8b. Ringkasan Cakupan Kelas C12

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `authLogin()`, `getCurrentUser()`, `validateEmail()`, `processRegistration()`, `saveProfile()`, `savePreference()`, `fetchUserProfile()`, `fetchUserPreference()` |
| Operasi yang diuji | Seluruh operasi DPPL. `validateEmail()` diwujudkan di `lib/validator.ts` dan diuji pada 4.2.12. Ditambah `logout()` dan seluruh fungsi `authAdapter` (atribut `authAdapter` pada DPPL) |
| ID Algoritma yang tercakup | Algo-C12-01 (`processRegistration()`, `savePreference()`, `fetchUserProfile()`) |
| Coverage (wajib ≥ 70%) | `userController.ts`: 99,03% baris, 94,23% cabang, 97,58% *statement*; `authAdapter.ts`: 100% baris dan cabang (`@vitest/coverage-v8`, bukti `C12-unit.png` dan `coverage-david.png` pada 4.6) |

### 4.2.9 Kelas SessionControl

**Tingkat:** Mendalam  

*[Diisi: Tabel 4.2.9. Hasil Pengujian Unit Kelas C13 dan Tabel 4.2.9b. Ringkasan Cakupan Kelas C13]*

### 4.2.10 Kelas FeedbackControl

**Tingkat:** Mendalam  

*[Diisi: Tabel 4.2.10. Hasil Pengujian Unit Kelas C14 dan Tabel 4.2.10b. Ringkasan Cakupan Kelas C14]*

### 4.2.11 Kelas Notification

**ID Kelas:** C22  
**Nama Kelas:** Notification (`src/models/notification.ts`, dengan `src/controllers/notificationController.ts`, `src/controllers/reminderController.ts`, `src/lib/adapters/cronAdapter.ts`, `src/app/api/cron/reminders/route.ts`)  
**Tingkat:** Mendalam  
**Berkas test:** `src/tests/notificationModel.test.ts` (baru pada M10), `src/tests/notification.test.ts`

Tabel 4.2.11. Hasil Pengujian Unit Kelas C22

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C22-UT01 | `sendSessionReminders()` | Normal | `now`, `leadMinutes = 15`; RPC mengembalikan 3 | RPC `send_session_reminders` dengan `p_now` dan `p_lead_minutes = 15`; hasil 3 | "calls send_session_reminders with the lead time and returns the count" lulus | Pass |
| C22-UT02 | `sendSessionReminders()` | Batas | Tidak ada sesi jatuh tempo | 0 | "returns 0 when no session is due" lulus | Pass |
| C22-UT03 | `sendSessionReminders()` | Negatif | RPC ditolak | Melempar galat | "throws when the function fails" lulus | Pass |
| C22-UT04 | `getUnreadSince()` | Normal | `u1`, waktu batas | Filter `id_user = u1`, `is_read = false`, `timestamp >= since` | "filters unread notifications of the user since the given time" lulus | Pass |
| C22-UT05 | `getUnreadSince()` | Negatif | Kueri gagal | Melempar galat | "throws when the query fails" lulus | Pass |
| C22-UT06 | `markAsRead()` | Normal | Notifikasi milik pengguna | `update({ is_read: true })` dengan filter pemilik; `true` | "returns true when the notification of the user was updated" lulus | Pass |
| C22-UT07 | `markAsRead()` | Batas | Notifikasi pengguna lain (0 baris); ID bukan UUID | `false` | "returns false for a notification of another user or a malformed ID" lulus | Pass |
| C22-UT08 | `markAsRead()` | Negatif | Galat lain | Melempar galat | "throws other database errors" lulus | Pass |
| C22-UT09 | `openApp()` | Normal | `idSession = s1` | `/sessions/s1` | "links to the session detail page" lulus | Pass |
| C22-UT10 | `openApp()` | Batas | Sesi sudah dihapus (`idSession = null`) | `null` | "has no link when the session was deleted" lulus | Pass |
| C22-UT11 | `fetchRecentNotifications()` | Negatif | Tanpa login | `[]` tanpa kueri | "returns nothing without a session" lulus | Pass |
| C22-UT12 | `fetchRecentNotifications()` | Normal | Satu notifikasi belum dibaca | Item dengan `href = /sessions/s1`; batas waktu 15 menit sebelum sekarang | "returns unread notifications from the last 15 minutes with a link to the session" lulus | Pass |
| C22-UT13 | `markAsRead()` (controller) | Normal | ID notifikasi, pengguna login | `Notification.markAsRead(id, idUser)` dipanggil, `true` | "marks the notification of the logged-in user" lulus | Pass |
| C22-UT14 | `markAsRead()` (controller) | Negatif | Tanpa login | `false` tanpa akses basis data | "refuses without a session" lulus | Pass |
| C22-UT15 | `isCronRequest()` | Normal/Negatif | `Bearer <secret>`, `Bearer salah`, tanpa header | Hanya *secret* yang tepat diterima | "accepts only the configured bearer secret" lulus | Pass |
| C22-UT16 | `isCronRequest()` | Batas | `CRON_SECRET` tidak diatur | Semua permintaan ditolak | "rejects every request when CRON_SECRET is not set" lulus | Pass |
| C22-UT17 | `runCronJob()` | Negatif | *Job* melempar galat | HTTP 500 tanpa membocorkan pesan galat | "reports a failing job as 500 without leaking the error" lulus | Pass |
| C22-UT18 | `GET/POST /api/cron/reminders` | Negatif | *Secret* salah | HTTP 401, pengingat tidak dikirim | "rejects calls without the cron secret" lulus | Pass |
| C22-UT19 | `GET/POST /api/cron/reminders` | Normal | *Secret* benar | HTTP 200 `{ ok: true, sent: 3 }`, `leadMinutes = 15` | "sends reminders for sessions starting within 15 minutes" lulus | Pass |

Tabel 4.2.11b. Ringkasan Cakupan Kelas C22

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `create()`, `findById()`, `getNotificationsByUser()`, `markAsRead()`, `showContent()`, `getTime()`, `getNotificationId()`, `getSessionId()`, `getIsRead()`, `openApp()` |
| Operasi yang diuji | `create()` sebagai `sendSessionReminders()` (fungsi SQL membuat notifikasi seluruh partisipan), `getNotificationsByUser()` sebagai `getUnreadSince()`, `markAsRead()`, `openApp()`, ditambah *controller* dan *route* cron. `showContent()` berada di `PopUpNotification` (diuji lewat UC09-TC01); *getter* menjadi properti `readonly`; `findById()` tidak dibutuhkan karena notifikasi selalu diambil per pengguna |
| ID Algoritma yang tercakup | Algo-C22-01, Q-C22-01 (di dalam `send_session_reminders()`), Q-C22-03 (`markAsRead()` dengan filter pemilik), Q-C22-04 (dengan filter belum dibaca dan waktu) |
| Coverage (wajib ≥ 70%) | `models/notification.ts`, `controllers/notificationController.ts`, `controllers/reminderController.ts`, `lib/adapters/cronAdapter.ts`, `app/api/cron/reminders/route.ts`: masing-masing 100% baris, cabang, dan fungsi. Bukti `C22-unit.png` dan `coverage-david.png` |

### 4.2.12 Validator (validasi email dan preferensi)

**ID Kelas:** Validator (komponen tambahan M6, tanpa ID kelas; operasi `validateEmail()` milik C12 dan `isComplete()` milik C09 pada DPPL)  
**Nama Kelas:** Validator (`src/lib/validator.ts`)  
**Tingkat:** Mendalam  
**Berkas test:** `src/tests/validator.test.ts`

Subbab ini hanya memuat `validateEmail()` dan `validatePreference()`. `validateSessionTime()` diuji oleh Markus, sedangkan `validateCapacity()`, `validateRating()`, dan `hasScheduleConflict()` diuji bersama kelas pemakainya. ID memakai awalan `VAL` karena Validator tidak memiliki ID kelas; nomor setelah `VAL-UT07` dipakai anggota lain.

Tabel 4.2.12. Hasil Pengujian Unit Validator

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| VAL-UT01 | `validateEmail()` | Normal | `mentee.satu@mahasiswa.itb.ac.id`, `a@ui.ac.id` | `true` | "accepts university addresses" lulus | Pass |
| VAL-UT02 | `validateEmail()` | Batas | `"  Mentee.Satu@Mahasiswa.ITB.AC.ID  "` | `true` (spasi diabaikan, tidak peka huruf besar) | "ignores surrounding spaces and letter case" lulus | Pass |
| VAL-UT03 | `validateEmail()` | Negatif | `someone@gmail.com`, `fake@ac.id.evil.com`, `no-at-sign.ac.id` | `false` | "rejects non-university addresses" lulus | Pass |
| VAL-UT04 | `validateEmail()` | Batas | `a@ac.id` (tanpa nama institusi), `a@itb.ac.id.`, string kosong | `false` | "requires an institution name before ac.id" lulus | Pass |
| VAL-UT05 | `validatePreference()` | Normal | 1 tag, 1 slot, format `DARING` | `true` | "requires tags, availability, and format" lulus | Pass |
| VAL-UT06 | `validatePreference()` | Batas | Tepat 1 tag dan 1 slot dengan format `BOTH` dan `LURING` | `true` | "accepts the minimum of one tag and one slot, and the BOTH format" lulus | Pass |
| VAL-UT07 | `validatePreference()` | Negatif | Tag kosong; slot kosong; format `null`; semuanya kosong | `false` | "requires tags, availability, and format", "rejects a completely empty preference" lulus | Pass |

Tabel 4.2.12b. Ringkasan Cakupan Validator (bagian email dan preferensi)

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `validateEmail()` (C12), `isComplete()` (C09, diwujudkan sebagai `validatePreference()`) |
| Operasi yang diuji | `validateEmail()`, `validatePreference()` |
| ID Algoritma yang tercakup | Bagian validasi email pada Algo-C12-01 dan `isComplete()` pada Algo-C09-01 |
| Coverage (wajib ≥ 70%) | `lib/validator.ts`: 100% baris, cabang, dan fungsi (seluruh berkas, termasuk fungsi milik anggota lain). Bukti `Validator-unit.png` dan `coverage-david.png` |

### 4.2.13 Kelas Dashboard (pengujian unit tambahan)

**ID Kelas:** C11  
**Nama Kelas:** Dashboard (`src/app/dashboard/page.tsx`, `src/app/discover/page.tsx`)  
**Tingkat:** Tidak perlu pada 4.1 (diuji tambahan untuk verifikasi perilaku tampilan Beranda dan Discover)  
**Berkas test:** `src/tests/dashboard.test.ts` (baru pada M10)

Tabel 4.2.13. Hasil Pengujian Unit Kelas C11

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C11-UT01 | `DashboardPage()` | Normal | Pengguna login dengan 1 sesi aktif terdekat dan 1 rekomendasi sesi | Merender sapaan `"Halo, Mentee Satu!"`, daftar sesi aktif terdekat, tombol `"Buka Ruang Obrolan"`, rekomendasi sesi, dan tombol `"Gabung Sesi"` | "renders greeting, upcoming sessions, and recommendations for a logged-in user" lulus | Pass |
| C11-UT02 | `DashboardPage()` | Batas | `getUpcomingSessions()` kosong dan `findRecommendation()` mengembalikan `PREFERENCE_NOT_SET` | Merender status kosong sesi aktif, peringatan `"Preferensi belajar kamu belum diatur"`, dan tombol `"Atur Preferensi"` | "shows preference prompt when PREFERENCE_NOT_SET (UC14 Alt 1)" lulus | Pass |
| C11-UT03 | `DashboardPage()` | Batas | `findRecommendation()` mengembalikan `[]` | Merender pesan `"Belum ada sesi yang cocok dengan jadwalmu"` dan tautan `"Ubah Preferensi"` | "shows empty recommendation message when no sessions match (UC04 Alt 1)" lulus | Pass |
| C11-UT04 | `DashboardPage()` | Negatif | `getUpcomingSessions()` mengembalikan `UPCOMING_LOOKUP_FAILED` dan `findRecommendation()` mengembalikan `RECOMMENDATION_FAILED` | Merender *alert* `"Gagal memuat sesi aktif terdekat"` dan `"Gagal memuat rekomendasi sesi"` | "shows error alerts when upcoming or recommendation lookup fails" lulus | Pass |
| C11-UT05 | `DashboardPage()` | Negatif | `getCurrentUser()` mengembalikan `null` | Mengalihkan pengguna ke `/login` (`redirect("/login")`) | "redirects to /login when user is unauthenticated" lulus | Pass |
| C11-UT06 | `DiscoverPage()` | Normal | Pengguna login dengan 1 sesi terbuka dan 1 rekomendasi | Merender judul `"Discover"`, kartu sesi, dan jumlah `"1 sesi tersedia"` | "renders open sessions and recommendations catalog" lulus | Pass |
| C11-UT07 | `DiscoverPage()` | Negatif | `getOpenSessions()` gagal (`OPEN_SESSIONS_FAILED`); pengguna tanpa sesi (`null`) | Merender *alert* `"Gagal memuat daftar sesi"`; mengalihkan ke `/login` saat belum login | "shows error alert when open sessions fail to load and redirects when unauthenticated" lulus | Pass |

*Catatan cakupan C11 (`@vitest/coverage-v8`): `app/dashboard/page.tsx` mencapai 100% baris (88,23% statement, 75% cabang, 100% fungsi) dan `app/discover/page.tsx` mencapai 100% baris (80% statement, 75% cabang, 100% fungsi).*

### 4.2.14 Tampilan Profil (`ProfileView` / Kelas ProfilePage, pengujian unit tambahan)

**ID Kelas:** C16  
**Nama Kelas:** ProfilePage (`src/components/ProfileView.tsx`, `src/app/profile/page.tsx`, `src/app/profile/[id]/page.tsx`, `src/app/profile/not-found.tsx`)  
**Tingkat:** Tidak perlu pada 4.1 (diuji tambahan untuk tampilan `ProfileView` dan penanganan galat UC15)  
**Berkas test:** `src/tests/profileView.test.ts` (baru pada M10)

Tabel 4.2.14. Hasil Pengujian Unit `ProfileView` dan Halaman Profil

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C16-UT01 | `ProfileView` | Normal | Profil lengkap, preferensi format `BOTH`, 2 tag, slot hari Minggu & Senin, `isOwnProfile = true` | Merender nama, `@username`, universitas, prodi, bio, tag materi, format Daring & Luring, slot ketersediaan per hari, serta tombol `"Edit Profil"` dan `"Edit Preferensi"` | "renders user identity, bio, tags, formats, grouped availability, and edit buttons for own profile" lulus | Pass |
| C16-UT02 | `ProfileView` | Normal | Profil pengguna lain (`isOwnProfile = false`) | Menampilkan data profil tanpa tombol `"Edit Profil"` maupun `"Edit Preferensi"` | "hides edit buttons when viewing another user's profile" lulus | Pass |
| C16-UT03 | `ProfileView` | Batas | `name = ""`, `bio = ""`, `preference = null` | Merender teks fallback `"Belum ada bio."`, `"Belum ada tag materi."`, `"Belum diatur."`, dan `"Belum ada jadwal ketersediaan."` | "renders empty-state fallbacks when bio and preference are missing" lulus | Pass |
| C16-UT04 | `OwnProfilePage()` | Normal/Negatif | Pengguna login vs `getCurrentUser() = null` | Merender profil sendiri dengan `"Edit Profil"`; mengalihkan ke `/login` saat belum login | "renders own profile page and redirects to /login when unauthenticated" lulus | Pass |
| C16-UT05 | `UserProfilePage()` & `ProfileNotFound` | Negatif | `fetchUserProfile("missing-id")` mengembalikan `USER_NOT_FOUND` | Memanggil `notFound()` dan komponen `ProfileNotFound` menampilkan `"Profil pengguna tidak ditemukan"` | "calls notFound when profile does not exist and renders not-found message (UC15 Alt 1)" lulus | Pass |
| C16-UT06 | `UserProfilePage()` | Negatif | `fetchUserProfile("u2")` mengembalikan `PROFILE_FAILED` | Merender *alert* `"Gagal memuat profil"` | "shows error alert when profile lookup fails" lulus | Pass |

<br>

## 4.3 Pengujian Integrasi

Pengujian integrasi memeriksa interaksi antarkomponen yang melewati batas, yaitu *Controller* ke *Model*, aplikasi ke basis data, dan aplikasi ke sistem eksternal. Daftar antarmuka mengacu pada dokumen DPPL, dengan minimal satu test case untuk setiap antarmuka. Pengujian memakai komponen nyata, bukan *mock*. Apabila ada antarmuka tambahan yang belum didaftarkan pada dokumen DPPL, cantumkan juga.

Antarmuka diambil dari Tabel 2.3 dan Development View DPPL2 (paket *Application/Controller*, *Domain/Model*, *External Integration/Adapters*, *Persistence*), ditambah *middleware* dan *route* cron yang muncul pada implementasi (Tabel B.1 M9 nomor 10). ID antarmuka memakai `INT-IFXX` agar tidak bertabrakan dengan ID layar `I-XX` pada DPPL.

Pengujian memakai komponen nyata dengan dua cara:

1. **Aplikasi dan Supabase *hosted***: `npm run dev` (Next.js lokal) yang terhubung ke proyek Supabase tim (Auth, PostgreSQL, Realtime), diakses lewat peramban, `curl`, dan skrip Node.js `@supabase/supabase-js` dengan akun seed. Supabase lokal tidak dapat dijalankan karena Docker tidak tersedia (Subbab 3.1). Data uji yang dibuat: akun `hiupl.uji@mahasiswa.itb.ac.id` dan sesi "Uji HIUPL Obrolan dan Notifikasi" (ID `73454a03-dc92-4202-ae74-7efde03ac4b3`, Mentor `mentor.demo`, peserta `mentee.satu`, 19 November 2026 21.03–22.03 WIB).
2. **PostgreSQL *in-memory* (PGlite)**: `src/tests/support/database.ts` menjalankan **seluruh berkas migrasi asli** lalu menguji *trigger*, fungsi, dan kebijakan RLS dengan peran `authenticated` dan `service_role` yang sebenarnya. Tidak ada *mock* pada lapisan basis data. Perintah: `npx vitest run tests/groupChat.test.ts tests/sessionReminders.test.ts tests/sessionCapacityGuard.test.ts tests/sessionTimeRules.test.ts` (4 berkas, 18 test, seluruhnya lulus).

Tabel 4.3.1. Daftar Antarmuka Antarkomponen

| ID Antarmuka | Komponen Asal | Komponen Tujuan | Jenis Batas | Test Case |
| :--- | :--- | :--- | :--- | :--- |
| INT-IF01 | UserController (`processRegistration()`, `authLogin()`) melalui AuthAdapter | Supabase Auth | Aplikasi - Sistem eksternal | INT-TC01 s.d. INT-TC04 |
| INT-IF02 | UserController → User, Profile, Preference (Model) | PostgreSQL Supabase (`users`, `profiles`, `preferences`, RLS) | Controller - Model - Basis data | INT-TC05, INT-TC06 |
| INT-IF03 | Penjadwal/`curl` → CronAdapter (`/api/cron/reminders`) → reminderController → Notification | Fungsi SQL `send_session_reminders()`, tabel `notifications` | Sistem eksternal - Aplikasi - Basis data | INT-TC07 s.d. INT-TC15 |
| INT-IF04 | Penjadwal/`curl` → CronAdapter (`/api/cron/chat-cleanup`) → chatCleanupController → GroupChat | Fungsi SQL `close_expired_group_chats()` | Sistem eksternal - Aplikasi - Basis data | INT-TC16 s.d. INT-TC19 |
| INT-IF05 | ChatController → GroupChat, ChatMessage (Model) | Tabel `group_chats`, `chat_messages` (*trigger* pembuatan grup, RLS `is_session_member()`) | Controller - Model - Basis data | INT-TC20 s.d. INT-TC26 |
| INT-IF06 | SessionControl (`sessionController.ts`, `sessionParticipationController.ts`) → Session (Model) | *Trigger* dan *constraint* tabel `sessions`, `session_participants` | Controller - Model - Basis data | INT-TC27 s.d. INT-TC29 |
| INT-IF07 | RealtimeAdapter `subscribeToChatMessages()` (dipakai `ChatRoom`) | Supabase Realtime (`postgres_changes` pada `chat_messages`) | Aplikasi - Sistem eksternal | INT-TC30 s.d. INT-TC33 |
| INT-IF08 | RealtimeAdapter `subscribeToNotifications()` (dipakai `PopUpNotification`) | Supabase Realtime (`postgres_changes` pada `notifications`) | Aplikasi - Sistem eksternal | INT-TC34 |
| INT-IF09 | `middleware.ts` | Supabase Auth (sesi berbasis *cookie*) | Aplikasi - Sistem eksternal | INT-TC35 |

Antarmuka INT-IF06 dimiliki modul Matthew, Fabian, dan Markus. Antarmuka ini dicantumkan agar setiap antarmuka memiliki minimal satu test integrasi; rincian kasusnya ada pada pengujian unit dan use case milik masing-masing.

Tabel 4.3.2. Hasil Pengujian Integrasi

| ID Pengujian | ID Antarmuka | Skenario | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| INT-TC01 | INT-IF01 | Normal: registrasi akun universitas | Registrasi lewat `/register` dengan `hiupl.uji@mahasiswa.itb.ac.id` / `password123` (UC01-TC01) | Akun dibuat di `auth.users` dan sesi login terbentuk | Akun ada di `auth.users` (1 baris), sesi langsung aktif, pengguna masuk ke Beranda | Pass |
| INT-TC02 | INT-IF01 | Normal: login | Keluar, lalu login dengan akun yang sama (UC01-TC02) | Supabase Auth memverifikasi kredensial dan menyimpan sesi pada *cookie* | Login berhasil, Beranda menampilkan "Halo, Uji HIUPL!" | Pass |
| INT-TC03 | INT-IF01 | Gagal: email non-universitas lewat aplikasi | Registrasi `hiupl.uji@gmail.com` (UC01-TC03), lalu periksa `auth.users` dengan `auth.admin.listUsers()` | Permintaan tidak sampai ke Supabase Auth; tidak ada akun baru | 0 akun `hiupl.uji@gmail.com` di `auth.users` dan 0 baris di `public.users`; seluruh 6 akun di `auth.users` berdomain `.ac.id` | Pass |
| INT-TC04 | INT-IF01 | Gagal: email non-universitas langsung ke Supabase Auth | `supabase.auth.signUp({ email: "bypass.knf04@example.com" })` memakai *anon key* publik (melewati aplikasi) | Supabase Auth menolak domain non-universitas | **Diterima**: akun dibuat dengan sesi aktif, tanpa baris `public.users`, dan dapat membaca tabel `sessions` (4 baris). Akun uji langsung dihapus. Lihat KNF04-TC02 | Fail |
| INT-TC05 | INT-IF02 | Normal: data registrasi tersimpan | Setelah INT-TC01, baca `users` dan `profiles` langsung lewat PostgREST sebagai akun tersebut | Baris berisi username, email, nama, universitas, dan program studi yang sama dengan masukan | `users` = `hiupl_uji`, `hiupl.uji@mahasiswa.itb.ac.id`; `profiles` = Uji HIUPL, Institut Teknologi Bandung, Teknik Informatika | Pass |
| INT-TC06 | INT-IF02 | Normal: preferensi tersimpan dan terbaca ulang | Simpan preferensi lewat `/profile/preferences` (UC02-TC01), lalu baca `preferences` langsung | `material_tag`, `availability`, dan `session_format_preference` sama dengan isian | `["Struktur Data","Basis Data"]`, `[{day:1, 19:00–21:00}]`, `DARING`; halaman Profil menampilkan nilai yang sama | Pass |
| INT-TC07 | INT-IF03 | Gagal: tanpa *secret* | `curl -X POST /api/cron/reminders` tanpa header | HTTP 401, fungsi SQL tidak dipanggil | `{"error":"unauthorized"}` HTTP 401 | Pass |
| INT-TC08 | INT-IF03 | Gagal: *secret* salah | Header `Authorization: Bearer salah` | HTTP 401 | `{"error":"unauthorized"}` HTTP 401 | Pass |
| INT-TC09 | INT-IF03 | Normal: kirim pengingat | Sesi uji mulai 21.03 WIB; `curl` dengan `Bearer $CRON_SECRET` pukul 20.52.40 WIB | HTTP 200; satu notifikasi untuk Mentor dan setiap peserta | `{"ok":true,"sent":2}`; tabel `notifications` berisi "Sesi dimulai 11 menit lagi" untuk `mentor.demo` dan `mentee.satu` | Pass |
| INT-TC10 | INT-IF03 | Batas: dipanggil ulang | Panggilan kedua segera setelah INT-TC09 | Tidak ada notifikasi ganda | `{"ok":true,"sent":0}`; tetap satu notifikasi per akun | Pass |
| INT-TC11 | INT-IF03 | Normal (PGlite) | Sesi mulai 10 menit lagi dengan 2 peserta | 3 notifikasi (Mentor + 2 peserta) berjudul "Sesi dimulai 10 menit lagi", isi "Struktur Data · 19.00 WIB" | "notifies the mentor and every participant of a session starting within 15 minutes" lulus | Pass |
| INT-TC12 | INT-IF03 | Batas (PGlite) | Sesi mulai 4,5 menit dan tepat 15 menit lagi | Keduanya diingatkan (2 notifikasi) dengan sisa menit yang sebenarnya | "uses the minutes actually left, including the 15-minute edge" lulus | Pass |
| INT-TC13 | INT-IF03 | Gagal (PGlite) | Sesi 16 menit lagi, sudah dimulai 1 menit lalu, sudah diingatkan, atau berstatus `SELESAI` | Tidak ada notifikasi | "skips sessions that are too far ahead, already started, already reminded, or not scheduled" lulus | Pass |
| INT-TC14 | INT-IF03 | Batas (PGlite) | Fungsi dipanggil dua kali | Setiap sesi diingatkan sekali, `reminder_sent = true` | "reminds each session only once" lulus | Pass |
| INT-TC15 | INT-IF03 | Gagal (PGlite) | Fungsi dipanggil dengan peran `authenticated` | `permission denied`; hanya `service_role` yang boleh | "cannot be called by logged-in users, only by the service role" lulus | Pass |
| INT-TC16 | INT-IF04 | Gagal: tanpa *secret* | `curl -X POST /api/cron/chat-cleanup` tanpa header | HTTP 401 | `{"error":"unauthorized"}` HTTP 401 | Pass |
| INT-TC17 | INT-IF04 | Normal (PGlite) | Satu sesi selesai lebih dari 48 jam lalu dan satu sesi baru selesai | Hanya grup lama yang ditutup (`is_active = false`, `expires_at` terisi) dan pesannya dihapus; pesan grup baru tetap ada | "closes chats 48 hours after the session ends and deletes their messages" lulus | Pass |
| INT-TC18 | INT-IF04 | Batas (PGlite) | Fungsi dipanggil dua kali | Grup ditutup sekali (panggilan kedua = 0) | "closes each chat only once" lulus | Pass |
| INT-TC19 | INT-IF04 | Gagal (PGlite) | Dipanggil dengan peran `authenticated` | `permission denied` | "cannot be called by logged-in users, only by the service role" lulus | Pass |
| INT-TC20 | INT-IF05 | Normal (PGlite) | *Insert* sesi baru | *Trigger* membuat satu baris `group_chats` aktif (KF12) | "creates a chat for every new session" lulus | Pass |
| INT-TC21 | INT-IF05 | Normal (PGlite) | Mentor dan peserta membaca serta mengirim pesan | Keduanya dapat membaca grup dan mengirim pesan | "lets the mentor and participants read and post" lulus | Pass |
| INT-TC22 | INT-IF05 | Gagal (PGlite) | Pengguna bukan anggota membaca dan mengirim pesan | Grup tidak terlihat dan *insert* ditolak RLS | "hides the chat from non-members and rejects their messages" lulus | Pass |
| INT-TC23 | INT-IF05 | Gagal (PGlite) | `id_sender` milik orang lain; grup sudah ditutup | Ditolak RLS | "rejects messages sent as someone else or to a closed chat" lulus | Pass |
| INT-TC24 | INT-IF05 | Batas (PGlite) | Pesan dikirim tepat 48 jam setelah sesi selesai, sebelum *cleanup* berjalan | Ditolak | "rejects messages 48 hours after the session ends even before the cleanup runs" lulus | Pass |
| INT-TC25 | INT-IF05 | Gagal (PGlite) | Pesan kosong/spasi | Ditolak *check constraint* | "rejects empty messages" lulus | Pass |
| INT-TC26 | INT-IF05 | Normal: Supabase *hosted* | `mentee.satu` mengirim pesan lewat `ChatRoom`, `mentor.demo` mengirim lewat klien lain, lalu halaman dimuat ulang (UC08-TC01, UC08-TC02) | Semua pesan tersimpan dan tampil berurutan dengan nama pengirim | 6 pesan tampil berurutan dengan nama "Kamu" dan "Mentor Demo" | Pass |
| INT-TC27 | INT-IF06 | Gagal (PGlite) | Mentee bergabung ke sesi yang sudah penuh | `SESSION_FULL` (KF13) | "accepts mentees while a slot is free and rejects the next one with SESSION_FULL" lulus | Pass |
| INT-TC28 | INT-IF06 | Gagal (PGlite) | Sesi melewati tengah malam WIB, kurang dari 10 menit, atau lebih dari 12 jam | Ditolak `sessions_same_day_duration` (KF20) | "rejects sessions that cross midnight in WIB or last outside 10 minutes to 12 hours" lulus | Pass |
| INT-TC29 | INT-IF06 | Gagal (PGlite) | Mentee bergabung ke sesi yang beririsan dengan sesi yang sudah diikutinya | `PARTICIPANT_SCHEDULE_CONFLICT` (KF21) | "rejects joining a session that overlaps one the mentee already joined" lulus | Pass |
| INT-TC30 | INT-IF07 | Normal: pelanggan Realtime yang sudah login | Skrip `supabase-js` login sebagai `mentee.satu`, berlangganan `chat_messages` grup uji; `mentor.demo` mengirim "Tes realtime dari klien kedua" | Pesan diterima pelanggan | `status SUBSCRIBED`, lalu `RECEIVED Tes realtime dari klien kedua` | Pass |
| INT-TC31 | INT-IF07 | Gagal: pelanggan tanpa login | Skrip dengan *anon key* tanpa login berlangganan kanal yang sama; mentor mengirim "Probe anon" | Pesan tidak dikirim ke non-anggota (RLS) | `SUBSCRIBED`, tidak ada pesan diterima dalam 15 detik | Pass |
| INT-TC32 | INT-IF07 | Normal: `ChatRoom` setelah halaman dimuat penuh | `mentee.satu` membuka `/sessions/<id>/chat` (muat ulang penuh), lalu `mentor.demo` mengirim pesan dari klien lain | Pesan mentor muncul di layar `mentee.satu` tanpa muat ulang | Pesan **tidak muncul** setelah ditunggu lebih dari 20 detik (diulang dua kali: "Iya, siapkan contoh soalnya ya" dan "Sampai jumpa di sesi nanti"). Pesan baru tampil setelah halaman dimuat ulang | Fail |
| INT-TC33 | INT-IF07 | Batas: `ChatRoom` dipasang ulang lewat navigasi sisi klien | Dari halaman obrolan pindah ke Beranda lalu kembali tanpa muat ulang, kemudian mentor mengirim "Pesan ketiga untuk uji realtime" | Pesan muncul tanpa muat ulang | Pesan muncul dalam kurang dari 10 detik | Pass |
| INT-TC34 | INT-IF08 | Normal: *pop-up* pengingat | `mentee.satu` membuka halaman obrolan, lalu cron INT-TC09 membuat notifikasinya | *Pop-up* "Sesi dimulai ... menit lagi" muncul tanpa muat ulang | *Pop-up* **tidak muncul** di halaman yang sedang terbuka. *Pop-up* baru tampil saat pindah ke Beranda karena `PopUpNotification` mengambil notifikasi ketika dipasang | Fail |
| INT-TC35 | INT-IF09 | Gagal: akses tanpa login | `curl` tanpa *cookie* ke `/dashboard`, `/history`, dan `/api/cron/reminders` | Halaman aplikasi dialihkan ke `/login`; *route* cron tidak dialihkan dan diperiksa oleh CronAdapter | `/dashboard` dan `/history`: HTTP 307 ke `/login`; `/api/cron/reminders`: HTTP 401 JSON | Pass |

**Analisis Fail INT-TC32 dan INT-TC34**

- **Penyebab:** `subscribeToInserts()` pada `src/lib/adapters/realtimeAdapter.ts` langsung memanggil `.subscribe()` pada klien peramban ketika komponen dipasang. Saat halaman dimuat penuh, sesi login dari *cookie* belum terpasang pada koneksi Realtime, sehingga Supabase Realtime mengevaluasi RLS sebagai `anon` dan menyaring baris `chat_messages`/`notifications`. Hal ini sesuai dengan INT-TC31 (pelanggan tanpa login tidak menerima apa pun) dan INT-TC33 (setelah dipasang ulang, ketika sesi sudah dimuat, pesan diterima). Basis data dan publikasi Realtime sudah benar (INT-TC30).
- **Dampak:** KF12 (UC08 langkah 2, pesan tampil di layar seluruh anggota) dan KF09 (UC09, notifikasi tampil saat pengguna sedang memakai aplikasi) hanya terpenuhi setelah halaman dimuat ulang atau setelah berpindah halaman.
- **Usulan perbaikan:** sebelum `subscribe()`, ambil sesi dengan `await supabase.auth.getSession()` lalu panggil `supabase.realtime.setAuth(session.access_token)`. Perbarui token pada `onAuthStateChange`. Tambahkan test komponen yang memastikan `setAuth` dipanggil sebelum `subscribe`. Perbaikan dicatat sebagai *issue* dan tidak dikerjakan pada M10 sesuai aturan pengujian.

<br>

## 4.4 Pengujian Use Case

Pengujian use case dilakukan pada seluruh skenario normal dan alternatif sesuai Subbab 4.4 SKPL, dengan minimal satu test case untuk setiap skenario. Kolom ID KF menunjukkan KF yang diverifikasi oleh test case tersebut.

### 4.4.1 Use Case Mendaftarkan Akun dan Autentikasi

**ID Use Case:** UC01  
**Nama Use Case:** Mendaftarkan Akun dan Autentikasi  
**Lingkungan:** `npm run dev` (http://localhost:3000) dengan proyek Supabase *hosted*, peramban berbasis Chromium 1280×860, 19 November 2026 sekitar 20.40 WIB.

Tabel 4.4.1. Hasil Pengujian Use Case UC01

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC01-TC01 | KF01 | Normal (langkah 1–2: registrasi) | 1. Buka `/register`.<br>2. Isi email, username, kata sandi, nama, universitas, dan program studi, lalu centang persetujuan data.<br>3. Klik "Simpan". | Email: `hiupl.uji@mahasiswa.itb.ac.id`<br>Username: `hiupl_uji`<br>Kata sandi: `password123`<br>Nama: Uji HIUPL<br>Universitas: Institut Teknologi Bandung<br>Prodi: Teknik Informatika | Sistem memvalidasi email universitas, merekam persetujuan data, membuat akun baru, lalu **mengarahkan pengguna ke halaman Login** | Akun berhasil dibuat (baris `auth.users`, `users`, dan `profiles` ada, lihat INT-TC01 dan INT-TC05). Namun pengguna **langsung masuk dan diarahkan ke Beranda** ("Halo, Uji HIUPL!"), bukan ke halaman Login | Fail. **Penyebab:** konfirmasi email Supabase Auth nonaktif sehingga `signUp()` langsung membuat sesi, dan `RegisterForm` menjalankan `router.replace("/")` ketika `needsConfirmation = false`. **Usulan:** panggil `signOut()` setelah registrasi lalu arahkan ke `/login` dengan pesan sukses, atau revisi langkah 2 skenario SKPL menjadi "langsung masuk ke Beranda" bila perilaku ini disepakati |
| UC01-TC02 | KF02 | Normal (langkah 3–4: login) | 1. Klik ikon Keluar.<br>2. Pada `/login` masukkan email dan kata sandi.<br>3. Klik "Masuk". | Email: `hiupl.uji@mahasiswa.itb.ac.id`<br>Kata sandi: `password123` | Sistem memverifikasi kredensial, memberikan hak akses, dan menampilkan Beranda | Pengguna dialihkan ke `/dashboard` dengan sapaan "Halo, Uji HIUPL!", nama dan email tampil di *sidebar* | Pass |
| UC01-TC03 | KF01 | Alternatif 1: Email Universitas Tidak Valid | 1. Buka `/register`.<br>2. Isi data dengan email publik dan centang persetujuan.<br>3. Klik "Simpan". | Email: `hiupl.uji@gmail.com`<br>Username: `hiupl_gmail`<br>Kata sandi: `password123` | Sistem menolak masukan dan menampilkan "Harap gunakan email institusi universitas yang valid" | Tampil *alert* "Pendaftaran gagal. Harap gunakan email universitas yang valid." dan pesan "Harap gunakan email universitas yang valid" di bawah kolom email. Tidak ada akun yang dibuat (INT-TC03). Teks sedikit berbeda dari SKPL ("institusi universitas" menjadi "universitas") tanpa mengubah makna | Pass |

### 4.4.2 Use Case Mengelola Preferensi Profil

**ID Use Case:** UC02  
**Nama Use Case:** Mengelola Preferensi Profil  
**Akun:** `hiupl.uji@mahasiswa.itb.ac.id` (belum memiliki preferensi)

Tabel 4.4.2. Hasil Pengujian Use Case UC02

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC02-TC01 | KF03, KF04 | Normal | 1. Buka "Profil", klik "Edit Preferensi".<br>2. Tambahkan dua tag materi (Enter), pilih format "Daring", klik "Tambah Slot" dan isi hari serta jam.<br>3. Klik "Simpan".<br>4. Kembali ke "Profil". | Tag: Struktur Data, Basis Data<br>Format: Daring<br>Slot: Senin 19.00–21.00 | Sistem memvalidasi, menyimpan tag, format, dan kalender ke basis data, lalu menampilkan "Preferensi berhasil disimpan" | Tampil "Preferensi berhasil disimpan". Halaman Profil menampilkan tag Struktur Data dan Basis Data, format Daring, serta ketersediaan Senin 19:00–21:00. Baris `preferences` di basis data sama (INT-TC06) | Pass |
| UC02-TC02 | KF03, KF04 | Alternatif 1: Menyimpan Preferensi Tanpa Memilih Preferensi | 1. Buka "Profil", klik "Edit Preferensi".<br>2. Biarkan tag, format, dan slot kosong.<br>3. Klik "Simpan". | Semua pilihan kosong | Sistem menunda penyimpanan dan menampilkan "Silahkan Isi Semua Pilihan Preferensi" | Tampil *alert* "Silahkan Isi Semua Pilihan Preferensi" dan tidak ada data tersimpan (Profil tetap "Belum ada tag materi") | Pass |

*[Anggota lain menambahkan subbab 4.4.3 di sini.]*

### 4.4.4 Use Case Mencari dan Bergabung ke Sesi

**ID Use Case:** UC04  
**Nama Use Case:** Mencari dan Bergabung ke Sesi  
**Akun:** `mentee.satu@mahasiswa.itb.ac.id` (kata sandi `password123`)

Tabel 4.4.4. Hasil Pengujian Use Case UC04

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC04-TC01 | KF07, KF08 | Normal | 1. Login sebagai `mentee.satu` dengan preferensi yang cocok dengan sesi tersedia.<br>2. Buka `/discover` atau bagian "Rekomendasi Sesi untukmu" di Beranda.<br>3. Pilih sesi rekomendasi "Aljabar Linear Session" (Sabtu, 21 November 2026 11.16–19.16 WIB, Luring, Mentor Demo), lalu klik "Gabung Sesi". | Akun `mentee.satu`, sesi "Aljabar Linear Session" | Sistem menampilkan rekomendasi sesi yang cocok; setelah klik "Gabung Sesi", Mentee masuk daftar peserta dan tampil pesan "Berhasil bergabung" | Sesi "Aljabar Linear Session" muncul pada bagian Rekomendasi. Setelah menekan "Gabung Sesi" pada detail sesi, tampil *alert* hijau "Berhasil bergabung" dan tombol berubah menjadi "Buka Ruang Obrolan" serta "Batalkan Keikutsertaan" (bukti `UC04-TC01-a.png`, `UC04-TC01-b.png`) | Pass |
| UC04-TC02 | KF07 | Alternatif 1: Tidak Ada Rekomendasi Sesi yang Cocok | 1. Atur preferensi `mentee.satu` agar tidak beririsan dengan sesi yang tersedia.<br>2. Buka `/discover`.<br>3. Amati bagian "Rekomendasi Sesi untukmu" dan klik "Ubah Preferensi". | Preferensi tanpa irisan sesi tersedia | Sistem menampilkan pesan "Belum ada sesi yang cocok dengan jadwalmu" beserta tombol "Ubah Preferensi" yang mengarahkan ke `/profile/preferences` | Pada `/discover`, bagian "Rekomendasi Sesi untukmu" menampilkan "Belum ada sesi yang cocok dengan jadwalmu" dengan tombol "Ubah Preferensi" yang mengarahkan ke `/profile/preferences`, sementara bagian "Semua Sesi" tetap menampilkan 1 sesi terbuka (bukti `UC04-TC02.png`) | Pass |

*[Markus menambahkan Alternatif 2 (jadwal Mentee bertabrakan) dan Fabian menambahkan skenario sesi penuh (KF13) pada Tabel 4.4.4.]*

*[Anggota lain menambahkan subbab 4.4.5 s.d. 4.4.7 di sini, sesuai nomor use case.]*

### 4.4.8 Use Case Berkomunikasi Menggunakan Grup Obrolan Sementara

**ID Use Case:** UC08  
**Nama Use Case:** Berkomunikasi Menggunakan Grup Obrolan Sementara  
**Akun:** `mentee.satu` di peramban; `mentor.demo` mengirim pesan dari klien `supabase-js` terpisah sebagai anggota grup kedua.  
**Data:** sesi uji "Uji HIUPL Obrolan dan Notifikasi" (19 November 2026 21.03–22.03 WIB) dan sesi seed "Kalkulus" (6 November 2026, sudah lebih dari 48 jam).

Tabel 4.4.8. Hasil Pengujian Use Case UC08

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC08-TC01 | KF12 | Normal (langkah 1: membuka grup) | 1. Login sebagai `mentee.satu`.<br>2. Pada Beranda klik "Buka Ruang Obrolan" pada sesi uji. | Sesi uji | Sistem menampilkan grup obrolan beserta riwayat pesannya | Halaman obrolan menampilkan judul sesi, status "Aktif", info sesi, daftar anggota (Mentor Demo sebagai Mentor, Mentee Satu sebagai "Kamu"), dan riwayat pesan berurutan. Catatan: aplikasi tidak memiliki menu "Pesan" seperti pada SKPL; grup dibuka dari tombol "Buka Ruang Obrolan" di Beranda atau detail sesi | Pass |
| UC08-TC02 | KF12 | Normal (langkah 2: mengirim pesan) | 1. Ketik pesan, klik tombol kirim.<br>2. Dari klien `mentor.demo` kirim balasan ke grup yang sama.<br>3. Amati layar `mentee.satu` tanpa memuat ulang. | "Halo kak, nanti bahas pohon AVL ya?"<br>Balasan: "Iya, siapkan contoh soalnya ya" | Pesan tersimpan dan tampil di layar obrolan **seluruh anggota** grup | Pesan `mentee.satu` tersimpan dan langsung tampil sebagai "Kamu 20.49". Balasan mentor tersimpan di basis data, tetapi **tidak tampil** di layar `mentee.satu` sampai halaman dimuat ulang | Fail. **Penyebab:** langganan Realtime dibuat sebelum token login terpasang sehingga pesan anggota lain disaring RLS (INT-TC32). **Usulan:** panggil `supabase.realtime.setAuth()` dengan *access token* sebelum `subscribe()` pada `realtimeAdapter.ts` |
| UC08-TC03 | KF12 | Alternatif 1: Grup Obrolannya Sudah Berakhir | 1. Login sebagai `mentee.satu`.<br>2. Buka `/sessions/bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb/chat`. | Sesi "Kalkulus", selesai 6 November 2026 20.33 WIB | Sistem menonaktifkan akses dan menampilkan "Group chat untuk sesi ini telah berakhir" | Label "Berakhir", pesan "Group chat untuk sesi ini telah berakhir", kolom input "Obrolan sudah berakhir" dinonaktifkan | Pass |

### 4.4.9 Use Case Menerima Notifikasi Sesi

**ID Use Case:** UC09  
**Nama Use Case:** Menerima Notifikasi Sesi  
**Akun:** `mentee.satu` (peserta sesi uji yang dimulai 21.03 WIB).

Tabel 4.4.9. Hasil Pengujian Use Case UC09

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC09-TC01 | KF09 | Normal (langkah 1: pengingat terkirim) | 1. Buat sesi uji yang dimulai 14 menit kemudian (20.49 WIB) dengan `mentee.satu` sebagai peserta.<br>2. Biarkan `mentee.satu` membuka aplikasi.<br>3. Tunggu hingga 20.52 WIB, lalu panggil `POST /api/cron/reminders` dengan `CRON_SECRET`.<br>4. Amati layar, lalu pindah ke Beranda. | Sesi mulai 21.03 WIB | Ketika 15 menit sebelum sesi dimulai, sistem mendeteksi pemicu waktu dan mengirim notifikasi pengingat ke akun partisipan | Tidak ada penjadwal yang memanggil *endpoint*: panggilan manual pukul 20.52 WIB masih menghasilkan `sent: 2`, artinya pengingat belum dikirim sejak sesi masuk jendela 15 menit pukul 20.49 WIB. Setelah dipanggil manual, notifikasi "Sesi dimulai 11 menit lagi" terbentuk untuk Mentor dan peserta (INT-TC09), tetapi *pop-up* baru tampil setelah pindah ke Beranda, tidak di halaman yang sedang terbuka (INT-TC34) | Fail. **Penyebab:** (1) belum ada penjadwal yang memanggil `/api/cron/reminders` setiap menit (KNF03-TC02); (2) langganan Realtime `notifications` tanpa token login (INT-TC34). **Usulan:** pasang Supabase Cron (`pg_cron` + `pg_net`) atau Vercel Cron setiap 1 menit, dan perbaiki `realtimeAdapter.ts` seperti pada UC08-TC02 |
| UC09-TC02 | KF09 | Normal (langkah 2: menekan notifikasi) | 1. Pada *pop-up* pengingat klik "Lihat Detail". | Notifikasi sesi uji | Sistem mengarahkan pengguna ke halaman detail sesi | Pengguna diarahkan ke `/sessions/73454a03-...` yang menampilkan topik, tanggal, jam 21.03–22.03 WIB, format, tautan, peserta, dan tombol "Buka Ruang Obrolan". Notifikasi ditandai `is_read = true` | Pass |

*[Anggota lain menambahkan subbab 4.4.10 s.d. 4.4.13 di sini.]*

### 4.4.14 Use Case Membuka Beranda Utama

**ID Use Case:** UC14  
**Nama Use Case:** Membuka Beranda Utama  
**Akun:** `mentee.satu@mahasiswa.itb.ac.id`

Tabel 4.4.14. Hasil Pengujian Use Case UC14

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC14-TC01 | KF07 | Normal | 1. Login sebagai `mentee.satu` yang sudah memiliki preferensi belajar.<br>2. Akses `/dashboard`.<br>3. Amati isi halaman Beranda. | Akun `mentee.satu` dengan preferensi terisi | Sistem menampilkan sapaan pengguna, daftar "Sesi Aktif Terdekat", dan kartu "Rekomendasi Sesi untukmu" hasil *matchmaking* | Beranda menampilkan sapaan "Halo, Mentee Satu!", 2 sesi pada "Sesi Aktif Terdekat" ("Struktur Data" dan "Uji HIUPL Obrolan dan Notifikasi"), serta kartu rekomendasi "Aljabar Linear Session" dengan tombol "Gabung Sesi" (bukti `UC14-TC01.png`) | Pass |
| UC14-TC02 | KF07 | Alternatif 1: Preferensi Belum Diatur (Khusus Mentee) | 1. Login sebagai Mentee tanpa preferensi cocok / belum mengatur preferensi.<br>2. Buka `/dashboard`.<br>3. Amati bagian Rekomendasi dan tombol pengaturan preferensi. | Akun Mentee pada `/dashboard` | Bagian "Sesi Aktif Terdekat" tetap tampil, sedangkan bagian Rekomendasi menampilkan ajakan mengatur/mengubah preferensi beserta tombol menuju `/profile/preferences` | "Sesi Aktif Terdekat" tetap tampil; bagian "Rekomendasi Sesi untukmu" menampilkan status kosong dengan tombol "Ubah Preferensi" menuju `/profile/preferences` (bukti `UC14-TC02.png`). Skenario `PREFERENCE_NOT_SET` ("Preferensi belajar kamu belum diatur" + tombol "Atur Preferensi") juga terverifikasi lulus pada unit test `C11-UT02` | Pass |

### 4.4.15 Use Case Melihat Profil

**ID Use Case:** UC15  
**Nama Use Case:** Melihat Profil  
**Akun:** `mentee.satu@mahasiswa.itb.ac.id`

Tabel 4.4.15. Hasil Pengujian Use Case UC15

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC15-TC01 | KF19 | Normal | 1. Login sebagai `mentee.satu`, buka halaman profil sendiri (`/profile`).<br>2. Buka halaman profil Mentor Demo (`/profile/<id>`) melalui tautan "Lihat profil" pada detail sesi. | Profil sendiri (`mentee.satu`) dan profil pengguna lain (`mentor.demo`) | Halaman Profil menampilkan nama, `@username`, universitas, program studi, bio, tag materi, format belajar, dan ketersediaan waktu; tombol "Edit Profil" dan "Edit Preferensi" hanya tampil pada profil sendiri | Profil sendiri menampilkan "Mentee Satu" (`@mentee_satu`, ITB · Sistem dan Teknologi Informasi, tag "Struktur Data", format "Luring", slot Senin/Rabu/Jumat/Sabtu) beserta tombol "Edit Profil" dan "Edit Preferensi". Profil "Mentor Demo" (`@mentor_demo`, ITB · Teknik Informatika, bio "Suka mengajar struktur data.") tampil tanpa tombol edit (bukti `UC15-TC01-a.png`, `UC15-TC01-b.png`) | Pass |
| UC15-TC02 | KF19 | Alternatif 1: Profil Tidak Ditemukan | 1. Login, lalu akses URL `/profile/<id-tidak-valid>` untuk pengguna yang tidak terdaftar. | ID pengguna tidak terdaftar | Sistem menampilkan halaman 404 dengan pesan "Profil pengguna tidak ditemukan" dan tombol "Kembali ke Beranda" | Tampil halaman 404 dengan label "404", judul "Profil pengguna tidak ditemukan", keterangan "Pengguna yang kamu cari tidak terdaftar atau akun telah dihapus.", dan tombol "Kembali ke Beranda" (bukti `UC15-TC02.png`) | Pass |

<br>

## 4.5 Pengujian Kebutuhan Non-Fungsional (KNF)

Setiap KNF pada Tabel 3.2 SKPL diuji secara terukur berdasarkan parameter yang telah didefinisikan. Setiap pengujian memuat target terukur, metode dan alat yang sesuai dengan parameter (misalnya Chrome DevTools untuk *response time* dan inspeksi basis data untuk *security*), serta hasil aktual berupa angka atau data. KNF yang belum dipenuhi atau tidak diimplementasikan dicantumkan beserta alasan dan rencana perbaikan.

Tabel 4.5. Hasil Pengujian KNF

| ID Pengujian | ID KNF | Parameter | Target Terukur | Metode dan Alat | Hasil Aktual | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| KNF01-TC01 | KNF01 | *Security* | Kolom `auth.users.encrypted_password` berisi hash bcrypt (awalan `$2a$`/`$2b$`, panjang 60), bukan *plain-text* | Supabase Studio, SQL Editor: `select email, left(encrypted_password, 4) as awalan, length(encrypted_password) as panjang, encrypted_password = 'password123' as plain from auth.users;` | Seluruh 6 akun di `auth.users` memiliki `encrypted_password` berawalan `$2a$` (bcrypt) dengan panjang 60 karakter. Kolom `plain` bernilai `false` untuk keenam akun, termasuk 4 akun yang kata sandinya diketahui `password123` (`mentor.demo`, `mentee.satu`, `mentee.dua`, `hiupl.uji`), sehingga kata sandi tidak tersimpan sebagai *plain-text* | Pass |
| KNF01-TC02 | KNF01 | *Security* | Tidak ada kolom kata sandi pada skema `public`; aplikasi tidak menyimpan kata sandi | Membaca satu baris `public.users` dengan *service role* untuk melihat seluruh kolom; `grep -rin password src/supabase/migrations/`; menelusuri kode: kata sandi hanya diteruskan ke `supabase.auth.signUp()`/`signInWithPassword()` di `authAdapter.ts` | Kolom `public.users`: `id_user, username, email, data_consent_at, created_at`. `grep` tidak menemukan kolom kata sandi pada 8 migrasi. Kata sandi tidak pernah ditulis ke tabel aplikasi | Pass |
| KNF03-TC01 | KNF03 | *Reliability* | ≥ 99% partisipan sesi yang jatuh tempo menerima tepat satu notifikasi | Uji integrasi PGlite (migrasi asli): 100 sesi dengan waktu mulai tersebar 1–15 menit lagi, masing-masing 1 Mentor + 2 peserta (300 penerima), lalu `send_session_reminders(now, 15)` dua kali (`tests/sessionReminders.test.ts`, "KNF03 delivery rate") | 300 dari 300 notifikasi terbentuk (**100%**), 300 pasangan (sesi, pengguna) unik, panggilan kedua 0 notifikasi (tanpa duplikat). Pada Supabase *hosted* (INT-TC09) 2 dari 2 partisipan menerima notifikasi | Pass |
| KNF03-TC02 | KNF03 | *Reliability* (ketepatan waktu) | Pengingat terkirim tepat saat sesi masuk jendela 15 menit, tanpa tindakan manual | Sesi uji dibuat pukul 20.49 WIB (mulai 21.03 WIB, sudah di dalam jendela 15 menit). *Endpoint* tidak dipanggil selama 3 menit, lalu dipanggil manual dan hasilnya diperiksa; konfigurasi repositori juga diperiksa | Panggilan `curl` manual pukul 20.52 WIB masih menghasilkan `sent: 2` dengan judul "Sesi dimulai 11 menit lagi". Artinya selama 20.49–20.52 WIB belum ada pemanggilan apa pun, karena fungsi hanya mengirim untuk sesi dengan `reminder_sent = false`. Repositori juga tidak memuat penjadwal (`pg_cron`, `vercel.json`, atau Supabase Cron) | Fail. **Penyebab:** *route* cron sudah ada tetapi tidak ada penjadwal yang memanggilnya. **Usulan:** jadwalkan `POST /api/cron/reminders` dan `/api/cron/chat-cleanup` setiap 1 menit dengan Supabase Cron (`pg_cron` + `pg_net`) atau Vercel Cron setelah *deploy*, lalu ulangi KNF03-TC02 |
| KNF04-TC01 | KNF04 | *Security* | Registrasi email non-universitas ditolak dan tidak ada akun baru | Registrasi `hiupl.uji@gmail.com` lewat `/register` (UC01-TC03), lalu periksa `auth.users` (`auth.admin.listUsers()`) dan `public.users` dengan *service role* | Ditolak dengan pesan "Harap gunakan email universitas yang valid". 0 baris di `auth.users` dan `public.users`; seluruh 6 akun di `auth.users` berdomain `.ac.id` | Pass |
| KNF04-TC02 | KNF04 | *Security* | Akun non-universitas tidak dapat dibuat melalui jalur mana pun | Memanggil `supabase.auth.signUp()` langsung dengan *anon key* publik (yang memang dikirim ke peramban) memakai `bypass.knf04@example.com` | **Akun dibuat** dengan sesi aktif, tanpa baris `public.users`, dan dapat membaca tabel `sessions` (4 baris). Akun uji dihapus segera setelah pengujian | Fail. **Penyebab:** validasi domain hanya dilakukan `processRegistration()`; Supabase Auth menerima pendaftaran publik dari klien mana pun. **Usulan:** tolak domain non-`.ac.id` di sisi Supabase dengan *Before User Created Hook* atau *trigger* pada `auth.users`, atau nonaktifkan *public sign-up* dan buat akun hanya dari server dengan *service role*; tambahkan juga syarat baris `public.users` pada kebijakan RLS |
| KNF02-TC01 | KNF02 | *Response time* | Rekomendasi sesi pada Beranda tampil < 3 detik (3.000 ms) | Chrome DevTools (tab Network, *Disable cache* aktif) saat memuat `/dashboard` dengan akun `mentee.satu` yang memiliki preferensi; diukur 5 kali lalu dihitung rata-rata dan maksimum | 5 kali pengukuran respons `/dashboard`: **675 ms, 700 ms, 729 ms, 666 ms, 949 ms**. Rata-rata: **743,8 ms** (0,74 detik), maksimum: **949 ms** (0,95 detik). Pada tangkapan layar `KNF02-TC01.png`, *DOMContentLoaded* 2,07 detik dan *Load* 2,74 detik — seluruhnya di bawah batas 3 detik | Pass |
| KNF05-TC01 | KNF05 | *Response time* | *[Diisi Markus]* | *[...]* | *[...]* | *[...]* |

Catatan KNF01-TC01: kolom `encrypted_password` berada pada skema `auth` yang tidak diekspos PostgREST maupun Admin API, sehingga hanya dapat dibaca melalui SQL Editor Supabase Dashboard (atau `psql` pada Supabase lokal). Kueri dijalankan oleh David pada proyek Supabase *hosted* tim pada 20 November 2026.

<br>

## 4.6 Tangkapan Layar dan Bukti Hasil Pengujian

Bukti pengujian dilampirkan sesuai ID Pengujian pada Subbab 4.2 sampai 4.5, berupa tangkapan layar aplikasi, keluaran *test runner*, laporan *coverage* untuk setiap kelas Mendalam, atau hasil alat ukur.

Tabel 4.6. Bukti Hasil Pengujian

| ID Pengujian | Bukti Hasil Pengujian |
| :--- | :--- |
| C12-UT01 – C12-UT46 | <img src="./assets/C12-unit.png" width="90%"> |
| VAL-UT01 – VAL-UT07 | <img src="./assets/Validator-unit.png" width="90%"> |
| C09-UT01 – C09-UT07 | <img src="./assets/C09-unit.png" width="90%"> |
| C10-UT01 – C10-UT10 | <img src="./assets/C10-unit.png" width="90%"> |
| C05-UT01 – C05-UT16 | <img src="./assets/C05-unit.png" width="90%"> |
| C08-UT01 – C08-UT10 | <img src="./assets/C08-unit.png" width="90%"> |
| C22-UT01 – C22-UT19 | <img src="./assets/C22-unit.png" width="90%"> |
| C12, C09, C05, C22, Validator (coverage) | <img src="./assets/coverage-david.png" width="90%"> |
| C04-UT01 – C04-UT15, C11-UT01 – C11-UT07, C16-UT01 – C16-UT06 | <img src="./assets/C04-C11-C16-unit.png" width="90%"> |
| C04 (`matchSession`, `searchSession`), C11, C16 (coverage) | <img src="./assets/coverage-hugo.png" width="90%"> |
| INT-TC01, INT-TC02 | Lihat UC01-TC01 dan UC01-TC02 |
| INT-TC03 – INT-TC06 | <img src="./assets/INT-auth-db.png" width="90%"> |
| INT-TC07 – INT-TC10, INT-TC16 | <img src="./assets/INT-cron.png" width="90%"> |
| INT-TC11 – INT-TC15, INT-TC17 – INT-TC25, INT-TC27 – INT-TC29 | <img src="./assets/INT-pglite.png" width="90%"> |
| INT-TC26 | Lihat UC08-TC01 dan UC08-TC02 |
| INT-TC30 – INT-TC33 | <img src="./assets/INT-realtime.png" width="90%"><br>Tampilan peramban: UC08-TC02 |
| INT-TC34 | Lihat UC09-TC01 |
| INT-TC35 | <img src="./assets/INT-middleware.png" width="90%"> |
| UC01-TC01 | <img src="./assets/UC01-TC01-a.png" width="45%"> <img src="./assets/UC01-TC01-b.png" width="45%"><br>Formulir registrasi terisi; setelah "Simpan" pengguna langsung masuk ke Beranda |
| UC01-TC02 | <img src="./assets/UC01-TC02-a.png" width="45%"> <img src="./assets/UC01-TC02-b.png" width="45%"><br>Formulir login; Beranda setelah login |
| UC01-TC03 | <img src="./assets/UC01-TC03.png" width="45%"> |
| UC02-TC01 | <img src="./assets/UC02-TC01-a.png" width="45%"> <img src="./assets/UC02-TC01-b.png" width="45%"><br>Pesan "Preferensi berhasil disimpan"; halaman Profil setelah disimpan |
| UC02-TC02 | <img src="./assets/UC02-TC02.png" width="45%"> |
| UC04-TC01 | <img src="./assets/UC04-TC01-a.png" width="45%"> <img src="./assets/UC04-TC01-b.png" width="45%"><br>Detail sesi peserta dan pesan "Berhasil bergabung" setelah bergabung ke "Aljabar Linear Session" |
| UC04-TC02 | <img src="./assets/UC04-TC02.png" width="45%"> |
| UC08-TC01 | <img src="./assets/UC08-TC01-a.png" width="45%"> <img src="./assets/UC08-TC01-b.png" width="45%"><br>Tombol "Buka Ruang Obrolan" di Beranda; grup obrolan beserta riwayat pesan |
| UC08-TC02 | <img src="./assets/UC08-TC02-a.png" width="45%"> <img src="./assets/UC08-TC02-b.png" width="45%"><br>Pesan sendiri langsung tampil; balasan Mentor (sudah tersimpan) tidak tampil tanpa muat ulang |
| UC08-TC03 | <img src="./assets/UC08-TC03.png" width="45%"> |
| UC09-TC01 | <img src="./assets/UC09-TC01.png" width="45%"><br>*Pop-up* baru tampil setelah pindah ke Beranda; keluaran cron pada INT-cron.png |
| UC09-TC02 | <img src="./assets/UC09-TC02.png" width="45%"> |
| UC14-TC01 | <img src="./assets/UC14-TC01.png" width="45%"> |
| UC14-TC02 | <img src="./assets/UC14-TC02.png" width="45%"> |
| UC15-TC01 | <img src="./assets/UC15-TC01-a.png" width="45%"> <img src="./assets/UC15-TC01-b.png" width="45%"><br>Profil sendiri (`mentee.satu`, dengan tombol edit) dan profil pengguna lain (`mentor.demo`, tanpa tombol edit) |
| UC15-TC02 | <img src="./assets/UC15-TC02.png" width="45%"> |
| KNF01-TC01 | <img src="./assets/KNF01-TC01.png" width="70%"><br>Hasil kueri pada SQL Editor Supabase Dashboard |
| KNF01-TC02 | <img src="./assets/KNF01-TC02.png" width="90%"> |
| KNF02-TC01 | <img src="./assets/KNF02-TC01.png" width="90%"><br>Pengukuran Chrome DevTools Network pada `/dashboard` (5 kali ukur: rata-rata 743,8 ms, maks 949 ms) |
| KNF03-TC01, KNF03-TC02 | <img src="./assets/KNF03.png" width="90%"> |
| KNF04-TC01, KNF04-TC02 | <img src="./assets/KNF04.png" width="90%"><br>Tampilan penolakan: UC01-TC03 |
| *...* | *...* |

<br>

---

# BAB 5: Traceability

Petakan setiap KF ke KNF, use case, kelas perancangan, file implementasi, dan test case. Tabel traceability berikut akan menjadi sarana verifikasi KF. Setiap KF memiliki minimal satu test case dan dinyatakan terpenuhi apabila **seluruh** test case terkaitnya berkesimpulan `Pass`. KF yang tidak diimplementasikan tetap dicantumkan beserta alasannya.

Tabel 5.1. Matriks Kerunutan KF terhadap Implementasi dan Pengujian

| KF ID | KNF Terkait | Use Case ID | Kelas Terkait | Implementasi File Terkait | Test Case (UC) | Test Case (Unit/Integrasi/KNF) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *KF05* | *KNF01* | *UC03* | *C02 - Pesanan* | *`src/...`* | *UC03-TC01* | *C02-UT05, INT-TC04, KNF01-TC01* |
| *KF01* | *-* | *UC01<br>UC02* | *[C01 - Nama kelas]<br>[C02 - Nama kelas]* | *[path/ke/file1]<br>[path/ke/file2]* | *UC01-TC01, UC01-TC02<br>UC02-TC01* | *-* |
| *KF02* | *[KNFXX atau -]* | *[UCXX]* | *[CXX - Nama kelas]* | *[path/ke/file]* | *[UCXX-TCYY]* | *[CXX-UTYY, INT-TCYY, KNFXX-TCYY atau -]* |
| *KFXX* | *-* | *[UCXX atau -]* | *[CXX - Nama kelas atau -]* | *Tidak diimplementasikan: [alasan]* | *-* | *-* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Tabel 5.2. Matriks Kerunutan KNF terhadap Pengujian

| ID KNF | Parameter | KF/UC Terkait | Test Case |
| :--- | :--- | :--- | :--- |
| *KNF01* | *Reliability* | *KF05 / UC03* | *KNF01-TC01* |
| *KNFXX* | *[Parameter]* | *[KFXX / UCXX atau -]* | *[KNFXX-TCYY]* |
| *...* | *...* | *...* | *...* |