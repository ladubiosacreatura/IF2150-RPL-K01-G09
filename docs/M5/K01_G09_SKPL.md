<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 5
<br>
SPESIFIKASI KEBUTUHAN PERANGKAT LUNAK (SKPL)
</h1>
<br>

## PeerUP

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

## Daftar Perubahan

| Revisi | Deskripsi |
| :--- | :--- |
| *A* | *Memperbaiki penempatan aktor pada Kebutuhan Pengguna Awal (US-21 dan US-22) di mana Mentee melakukan pembatalan sesi dan Mentor melakukan penghapusan sesi.* |
| *B* | *Menyeragamkan aturan batas waktu penonaktifan dan penghapusan Group Chat menjadi 48 jam setelah sesi berakhir di seluruh skenario dan batasan perangkat lunak.* |
| *C* | *Menyelaraskan pesan peringatan pada skenario alternatif pembatasan kapasitas peserta sesi belajar agar konsisten dengan aturan bisnis (maksimal 20 peserta).* |
| *D* | *Mengoreksi urutan subbab pada pemodelan Use Case dan merapikan pemetaan Kebutuhan Fungsional (Traceability) agar seluruh KF (terutama KF02, KF04, KF06, KF08, KF13, KF14) terpetakan dengan kelas yang mengimplementasikannya.* |
| *E* | *Melengkapi Subbab 2.2 dengan daftar komponen eksternal (Supabase dan Vercel) yang berinteraksi dengan perangkat lunak.* |
| *F* | *Revisi November 2026: Menetapkan pemberi penilaian pada UC07 dan kelas C06 hanya Mentee; memperbaiki pemetaan KF19 menjadi R26 saja; mengganti penomoran aktor menjadi AKXX agar tidak bentrok dengan ID Aktivitas (AXX); menyeragamkan istilah Mentor pada KF dan skenario; memperbaiki ID kelas HistoryPage (C24) pada Subbab 5.2.6, teks alternatif gambar, nama UC10, dan salah ketik.* |
<br>
| *G* | *Revisi November 2026: Mengubah parameter KNF04 menjadi Security, menyamakan pemetaan use case C09, C12, dan C23 pada Subbab 5.1 dengan BAB 6, serta menyeragamkan nama atribut/operasi kelas.* |

# BAB 1: Pendahuluan

## 1.1 Tujuan Penulisan Dokumen
Dokumen Spesifikasi Kebutuhan Perangkat Lunak (SKPL) ini ditulis untuk mendefinisikan secara lengkap, rinci, dan terstruktur seluruh kebutuhan fungsional, kebutuhan non-fungsional, batasan sistem, pemodelan *use case*, serta pemodelan kelas dari perangkat lunak **PeerUP**. Dokumen ini ditujukan bagi:
1. **Tim Pengembang (Developer):** Sebagai acuan teknis utama dalam mengimplementasikan kode program, merancang basis data, dan mengintegrasikan antarmuka perangkat lunak.
2. **Penguji Perangkat Lunak (Tester / QA):** Sebagai dasar pengujian untuk memvalidasi apakah seluruh fitur dan skenario telah berjalan sesuai spesifikasi.
3. **Dosen dan/atau Asisten Pengampu IF2150:** Sebagai dokumen evaluasi akademik terhadap perancangan rekayasa perangkat lunak yang dilakukan oleh Kelompok ini.

## 1.2 Lingkup Masalah
**PeerUP** adalah platform web pembelajaran kolaboratif (*peer-to-peer tutoring*) yang dirancang untuk mengatasi ketimpangan akses bimbingan belajar berbiaya mahal serta isolasi sosial di kalangan pelajar dan mahasiswa. Di tengah maraknya platform *EdTech* berlangganan yang bersifat satu arah dan pencarian teman belajar manual yang tidak terstruktur, PeerUP hadir sebagai fasilitator otomatis yang mempertemukan *Mentee* (pelajar yang membutuhkan bimbingan) dengan *Mentor* (tutor sebaya) berdasarkan kecocokan materi, ketersediaan jadwal, dan format belajar (daring/luring), dilengkapi dengan fitur ruang obrolan grup sementara (*temporary group chat*), pengingat jadwal otomatis, serta sistem *feedback*.

## 1.3 Definisi, Istilah, dan Singkatan
Semua definisi dan singkatan yang digunakan dalam dokumen ini beserta penjelasannya disajikan pada Tabel 1.3.

Tabel 1.3. Definisi Istilah dan Singkatan

| Singkatan, Akronim, atau Istilah | Penjelasan |
| :--- | :--- |
| *P/L* | *Singkatan dari Perangkat Lunak, yaitu aplikasi yang memberikan perintah kepada komputer untuk menjalankan tugas tertentu.* |
| *SKPL* | *Singkatan dari Spesifikasi Kebutuhan Perangkat Lunak, yaitu dokumen yang merangkum kriteria-kriteria yang diperlukan untuk membangun aplikasi menjalankan tugasnya.* |
| *KF* | *Singkatan dari Kebutuhan Fungsional.* |
| *KNF* | *Singkatan dari Kebutuhan Non-Fungsional.* |
| *UC* | *Singkatan dari Use Case.* |
| *EARS* | *Easy Approach to Requirements Syntax, yaitu pola penulisan kebutuhan agar konsisten dan mudah diuji.* |
| *Mentor / Tutor* | *Pengguna sebaya yang memiliki penguasaan materi lebih baik dan membuka sesi belajar untuk membimbing pengguna lain.* |
| *Mentee* | *Pengguna (siswa/mahasiswa) yang mencari bantuan pemahaman materi dan bergabung ke dalam sesi belajar.* |
| *Matchmaking* | *Proses pencocokan otomatis antara preferensi materi serta jadwal kosong Mentee dengan sesi belajar yang tersedia.* | 
| *BaaS* | *Backend-as-a-Service, layanan cloud yang menyediakan infrastruktur backend siap pakai seperti basis data, autentikasi, dan komunikasi real-time.* |

## 1.4 Aturan Penomoran
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

## 1.5 Referensi
1. Dokumentasi Perangkat Lunak *Topic Brainstorming* (Tugas 1), *Requirement Gathering* (Tugas 2), *Use Case & Scenario Use Case* (Tugas 3), dan *Class Diagram* (Tugas 4) Kelompok G09 IF2150 Rekayasa Perangkat Lunak.
2. Mavin, A., Wilkinson, P., Harwood, A., & Novak, M. (2009). *Easy Approach to Requirements Syntax (EARS)*. 17th IEEE International Requirements Engineering Conference.
3. Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP).
4. Undang-Undang Republik Indonesia Nomor 1 Tahun 2024 tentang Perubahan Kedua atas UU ITE.

## 1.6 Deskripsi Umum Dokumen (Ikhtisar)
Dokumen SKPL ini dibagi menjadi enam bab utama:
- **BAB 1: Pendahuluan**, menjelaskan tujuan penulisan dokumen, lingkup masalah, definisi dan singkatan, aturan penomoran, referensi, serta ikhtisar dokumen.
- **BAB 2: Deskripsi Perangkat Lunak**, menguraikan deskripsi umum sistem beserta *Activity Diagram* proses bisnis, deskripsi umum perangkat lunak dan komponen eksternal, karakteristik pengguna, batasan perangkat lunak, serta lingkungan operasi perangkat lunak.
- **BAB 3: Deskripsi Kebutuhan Perangkat Lunak**, merinci seluruh Kebutuhan Fungsional (KF) dan Kebutuhan Non-Fungsional (KNF).
- **BAB 4: Pemodelan Use Case**, memuat identifikasi aktor, identifikasi *use case*, *Use Case Diagram*, serta skenario normal dan alternatif untuk masing-masing *use case*.
- **BAB 5: Pemodelan Kelas**, menyajikan identifikasi kelas (arsitektur *Boundary, Controller, Entity*), diagram kelas per *use case*, serta diagram kelas keseluruhan beserta atribut dan operasinya.
- **BAB 6: Traceability**, memetakan keterlacakan antara ID Kelas, ID Use Case, dan ID Kebutuhan Fungsional.

---

# BAB 2: Deskripsi Perangkat Lunak

## 2.1 Deskripsi Umum Sistem
PeerUP adalah sebuah perangkat lunak berbasis platform digital yang dirancang untuk memfasilitasi pembelajaran kolaboratif (*peer-to-peer tutoring*). PeerUP akan menjadi platform untuk mempertemukan pelajar yang membutuhkan bantuan pemahaman materi tertentu dengan tutor sebaya yang memiliki penguasaan materi lebih baik, jadwal yang selaras, dan preferensi belajar yang cocok. Hal ini akan membuat kedua belah pihak dapat belajar bersama dan bahkan membuat *study group* sendiri.

Secara naratif, alur kerja sistem ini dimulai ketika pengguna (tutor ataupun pelajar) membuat sebuah akun dan mengatur profil mereka. Siswa (*Mentee*) kemudian dapat mengisi preferensi sesi tutoring (kebutuhan materi, ketersediaan waktu, sesi daring/luring) dan memilih sesi yang tersedia. Sementara itu tutor (*Mentor*) dapat membuat sesi dengan menyertakan keterangan (topik materi, jadwal sesi, format sesi daring/luring, kapasitas maksimum peserta). Sistem akan mencocokkan para mentee dengan mentor yang sesuai dengan preferensi satu sama lain. Selain itu, sebuah ruang obrolan grup sesi sementara (*temporary group chat*) akan dibuat oleh sistem untuk menjadi sarana mereka berkomunikasi tentang sesi mereka. Setelah ini, mereka dapat merencanakan sesi belajar bersama mereka sesuai dengan persetujuan satu sama lain. Setelah sesinya selesai, para mentee dapat memberikan *feedback* terhadap sesi dan mentornya.

Dari sisi mahasiswa atau peserta didik, mereka mengekspektasikan sebuah metode pembelajaran yang efektif dan mudah dibentuk. Selain itu, mereka juga mengekspektasikan sebuah lingkungan belajar yang lebih interaktif, organik, dan mudah dibentuk, bukan sekadar dipaparkan materi secara pasif satu arah. Dengan adanya platform ini, mereka dapat dengan mudah membentuk *study group* sendiri dan mendapatkan pembelajaran yang natural dari orang-orang sebaya mereka.

Sementara itu, dari sisi tutor, ekspektasinya adalah mendapatkan wadah untuk menambah pengalaman mengajar (*volunteering experience*), memperluas relasi, dan berpotensi mendapatkan insentif tambahan secara mandiri.

Harapan dari penerapan solusi ini adalah platform ini mampu memfasilitasi para pelajar untuk menemukan *study buddy* atau grup belajar yang paling cocok dengan preferensi mereka masing-masing, menggantikan batasan biaya bimbingan dan subskripsi aplikasi pembelajaran yang mahal, demi mewujudkan kegiatan menuntut ilmu bersama-sama.

Berikut adalah gambaran proses bisnis utama perangkat lunak PeerUP dalam bentuk *Activity Diagram*:

<p align="center">
<img alt="Activity Diagram Registrasi dan Autentikasi Pengguna" src="./assets/diagram/diagram-proses-bisnis-1.png" width="70%">
</p>
<p align="center">
<i>Gambar 1. Activity Diagram Registrasi dan Autentikasi Pengguna</i>
</p>
<br>

<p align="center">
<img alt="Activity Diagram Pembuatan Sesi Mentor dan Pencarian Sesi Mentee" src="./assets/diagram/diagram-proses-bisnis-2.png" width="70%">
</p>
<p align="center">
<i>Gambar 2. Activity Diagram Pembuatan Sesi Mentor dan Pencarian Sesi Mentee</i>
</p>
<br>

<p align="center">
<img alt="Activity Diagram Group Chat dan Feedback Sesi" src="./assets/diagram/diagram-proses-bisnis-3.png" width="70%">
</p>
<p align="center">
<i>Gambar 3. Activity Diagram Pelaksanaan Sesi, Group Chat, dan Feedback</i>
</p>
<br>

<p align="center">
<img alt="Activity Diagram Riwayat Sesi" src="./assets/diagram/diagram-proses-bisnis-4.png" width="70%">
</p>
<p align="center">
<i>Gambar 4. Activity Diagram Manajemen Riwayat Sesi</i>
</p>

## 2.2 Deskripsi Umum Perangkat Lunak
PeerUP merupakan aplikasi web interaktif yang mendukung seluruh aktivitas pembelajaran kolaboratif sebaya. Perangkat lunak mencakup manajemen akun pengguna berbasis email universitas, manajemen profil dan preferensi materi/waktu, pembuatan dan pengelolaan sesi bimbingan oleh Mentor, pencarian serta pencocokan sesi secara cerdas (*matchmaking algorithm*) untuk Mentee, komunikasi obrolan real-time berbasis sesi (*group chat* sementara), notifikasi pengingat otomatis, konfirmasi keterlaksanaan sesi, serta sistem evaluasi dan ulasan (*feedback*).

Perangkat lunak berinteraksi dengan komponen eksternal berikut:
1. **Supabase Auth:** Layanan manajemen autentikasi untuk menangani registrasi pengguna, sesi *login*, serta pengelolaan kata sandi secara aman.
2. **Supabase PostgreSQL & Cron:** Layanan basis data relasional berbasis *cloud* untuk menyimpan data aplikasi serta menjalankan pemeriksaan jadwal sesi otomatis, pemrosesan pengingat (*reminder*), dan pembersihan data *group chat* yang telah melewati batas waktu penyimpanan (48 jam).
3. **Supabase Realtime:** Layanan komunikasi berbasis *WebSocket* untuk mendukung pengiriman dan penerimaan pesan pada fitur *group chat* sementara secara *real-time*.
4. **Vercel:** Layanan *cloud hosting* dan *deployment* untuk menjalankan aplikasi web Next.js.

## 2.3 Pengguna dan Kebutuhan Pengguna Perangkat Lunak

| Aktor | Deskripsi |
| :--- | :--- |
| *Mentee (Siswa/Mahasiswa)* | *Pengguna yang bertindak sebagai pihak yang membutuhkan bimbingan atau rekan belajar. Mentee berinteraksi dengan sistem untuk mengatur preferensi materi dan jadwal, mencari rekomendasi sesi (matchmaking), bergabung ke dalam sesi, serta memberikan penilaian (rating) setelah sesi selesai.* |
| *Mentor (Tutor)* | *Pengguna sebaya yang memiliki penguasaan materi lebih dan bersedia meluangkan waktu untuk mengajar. Mentor berinteraksi dengan sistem untuk membuat sesi belajar baru, menetapkan jadwal dan batas maksimum peserta, serta mengonfirmasi keterlaksanaan sesi.* |

## 2.4 Batasan Perangkat Lunak
1. *Registrasi akun hanya dapat dilakukan menggunakan email yang berdomain institusi universitas yang valid.*
2. *Kapasitas peserta dalam setiap sesi belajar dibatasi minimal satu partisipan dan maksimal dua puluh orang partisipan.*
3. *Sistem mencegah Mentor untuk membuat dua sesi pada rentang waktu yang saling bertabrakan (overlapping).*
4. *Ruang obrolan grup (group chat) bersifat sementara dan datanya otomatis dinonaktifkan serta dibersihkan dari sistem 48 jam setelah sesi belajar berakhir.*
5. *Perangkat lunak beroperasi pada peramban web browser dan memerlukan koneksi internet aktif.*
6. *Kata sandi pengguna wajib dienkripsi menggunakan fungsi hashing kriptografi yang aman (seperti bcrypt atau Argon2) sebelum disimpan dalam basis data, dan tidak disimpan dalam bentuk plain-text.*
7. *Pengelolaan data pribadi pengguna harus sesuai dengan UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP) dan UU No. 1 Tahun 2024 (UU ITE).*

## 2.5 Lingkungan Operasi Perangkat Lunak
| Komponen | Spesifikasi |
| :--- | :--- |
| *Client* | *Web browser modern seperti Google Chrome, Mozilla Firefox, Microsoft Edge, atau Safari yang mendukung JavaScript dan koneksi WebSocket.* |
| *Frontend* | *Next.js dengan TypeScript dan Tailwind CSS.* |
| *Backend* | *Next.js Server-Side menggunakan Server Actions / API Routes yang terintegrasi dengan Supabase Client SDK.* |
| *DBMS* | *PostgreSQL yang dikelola melalui layanan Supabase.* |
| *Server & Hosting* | *Lingkungan lokal (Node.js) untuk pengembangan/pengujian serta Vercel sebagai layanan cloud hosting aplikasi Next.js jika diperlukan* |
| *Authentication* | *Supabase Auth untuk registrasi dan autentikasi pengguna serta pengelolaan password secara aman. Validasi domain email institusi universitas dilakukan pada sisi aplikasi.* |
| *Real-time Communication* | *Supabase Realtime berbasis WebSocket untuk mendukung komunikasi group chat sementara secara real-time.* |
| *Scheduled Task* | *Supabase Cron untuk menjalankan pemeriksaan jadwal sesi, memproses pengingat sesi, dan melakukan pembersihan data group chat yang telah melewati batas waktu penyimpanan.* |
| *OS* | *Cross-platform, yaitu Windows, Linux, macOS, Android, dan iOS selama perangkat memiliki web browser modern dan koneksi internet aktif.* |
| *Deployment* | *Aplikasi di-deploy melalui local (dapat di-deploy dari vercel jika diperlukan), sedangkan basis data, autentikasi, komunikasi real-time, dan scheduled task dikelola melalui Supabase.* |

---

# BAB 3: Deskripsi Kebutuhan Perangkat Lunak

## 3.1 Kebutuhan Fungsional (KF)
Tabel 3.1. Kebutuhan Fungsional

| ID KF | ID Kebutuhan | Penjelasan |
| :--- | :--- | :--- |
| *KF01* | *R01, R02, R04* | *Ketika pengguna melakukan registrasi akun baru, sistem harus memvalidasi alamat email universitas, memvalidasi pembuatan akunnya, dan membuat akun baru.* |
| *KF02* | *R03, R05* | *Ketika pengguna memasukkan kredensial yang sesuai dengan basis data sistem untuk login ke perangkat lunak, sistem harus memberikan hak akses akun pengguna dan mengarahkan pengguna ke beranda.* |
| *KF03* | *R17* | *Sistem harus merekam dan memodifikasi tag preferensi materi pelajaran pada profil pengguna (Mentor dan Mentee).* |
| *KF04* | *R18* | *Sistem harus menyimpan data ketersediaan waktu yang dipilih pengguna ke dalam kalender internal sistem.* |
| *KF05* | *R06* | *Ketika Mentor menekan tombol simpan sesi baru, sistem harus merekam detail sesi: topik, jadwal, format (daring/luring), dan batas peserta.* |
| *KF06* | *R07* | *Jika Mentor mengatur waktu sesi yang saling bertabrakan, maka sistem harus menolak masukan dan menampilkan peringatan.* |
| *KF07* | *R19* | *Ketika pengguna masuk ke aplikasi, sistem harus menampilkan hasil matchmaking jadwal dan materi dalam bentuk daftar rekomendasi di halaman Beranda.* |
| *KF08* | *R08, R20* | *Ketika Mentee memilih untuk mengikuti sebuah sesi, sistem harus mendaftarkannya sebagai anggota dan memunculkan informasi detail sesi tersebut.* |
| *KF09* | *R09* | *Ketika waktu menunjukkan 15 menit sebelum sesi dimulai, sistem harus mengirimkan notifikasi pengingat kepada seluruh partisipan sesi tersebut.* |
| *KF10* | *R11, R12, R14* | *Ketika sebuah sesi telah selesai ataupun melewati batas waktu pelaksanaannya, sistem harus menampilkan formulir konfirmasi otomatis dan formulir penilaian.* |
| *KF11* | *R13* | *Ketika pengguna menekan navigasi Riwayat, sistem harus menampilkan daftar riwayat sesi yang pernah diikuti atau dibuat (berstatus Selesai atau Batal) pada halaman khusus Riwayat.* |
| *KF12* | *R15, R16* | *Ketika sebuah sesi berhasil dibentuk dan disetujui, sistem harus secara otomatis membuat group chat sementara bagi pesertanya.* |
| *KF13* | *R21* | *Jika jumlah partisipan sesi telah mencapai batas kapasitas maksimum yang ditetapkan Mentor, sistem harus menolak permintaan bergabung dari Mentee selanjutnya dan menampilkan notifikasi sesi penuh.* |
| *KF14* | *R22* | *Jika Mentor memasukkan jumlah partisipan yang tidak valid saat pembuatan sesi (minimum 1 partisipan dan maksimum 20 partisipan), sistem harus menolak masukan dan menampilkan peringatan.* |
| *KF15* | *R23* | *Ketika Mentee mengonfirmasi pembatalan keikutsertaan pada suatu sesi, maka sistem harus menghapus data Mentee tersebut dari basis data pendaftar sesi.* |
| *KF16* | *R23* | *Ketika Mentor mengonfirmasi penghapusan sesi buatannya, sistem harus menghapus sesi tersebut dan memperbarui basis data agar tidak lagi ditampilkan.* |
| *KF17* | *R24* | *Ketika Mentor menyimpan pembaruan data sesi, sistem harus merekam revisi tersebut ke dalam basis data agar rincian terbaru segera ditampilkan.* |
| *KF18* | *R25* | *Ketika Mentor mengakses riwayat sesi yang telah selesai, sistem harus menampilkan riwayat penilaian yang diberikan oleh Mentee.* |
| *KF19* | *R26* | *Ketika pengguna menekan nama atau foto profil, sistem harus menampilkan halaman detail profil pengguna yang memuat informasi identitas dan tag materi.* |

## 3.2 Kebutuhan Non-Fungsional (KNF)
Tabel 3.2. Kebutuhan Non-Fungsional

| ID KNF | ID Kebutuhan | Parameter | Deskripsi Kebutuhan |
| :--- | :--- | :--- | :--- |
| *KNF01* | *R03* | *Security* | *Kata sandi pengguna harus di-hash menggunakan algoritma kriptografi yang aman (seperti bcrypt/Argon2) sebelum disimpan dalam basis data dan tidak disimpan dalam bentuk plain-text.* |
| *KNF02* | *R19* | *Response Time* | *Sistem pencocokan jadwal (matchmaking) berdasarkan irisan materi dan waktu kosong pengguna harus menampilkan hasil rekomendasi dalam waktu kurang dari 3 detik.* |
| *KNF03* | *R09* | *Reliability* | *Pengiriman notifikasi pengingat sesi (15 menit sebelum sesi dimulai) harus terkirim secara tepat waktu dengan tingkat keberhasilan minimal 99%.* |
| *KNF04* | *R02* | *Security* | *Ketika pengguna meregistrasikan akun non universitas, sistem harus menolak registrasi akun.* |
| *KNF05* | *R13* | *Response Time* | *Waktu loading saat membuka riwayat sesi pengguna tidak boleh lebih dari 3 detik.* |

---

# BAB 4: Pemodelan Use Case

## 4.1 Identifikasi Aktor

| ID Aktor | Aktor | Deskripsi |
| :--- | :--- | :--- |
| *AK01* | *Mentee (Siswa/Mahasiswa)* | *Pengguna yang bertindak sebagai pihak yang membutuhkan bimbingan atau rekan belajar. Mentee berinteraksi dengan sistem untuk mengatur preferensi materi dan jadwal, mencari rekomendasi sesi (matchmaking), bergabung ke dalam sesi, serta memberikan penilaian (rating) setelah sesi selesai.* |
| *AK02* | *Mentor (Tutor)* | *Pengguna sebaya yang memiliki penguasaan materi lebih dan bersedia meluangkan waktu untuk mengajar. Mentor berinteraksi dengan sistem untuk membuat sesi belajar baru, menetapkan jadwal dan batas maksimum peserta, serta mengonfirmasi keterlaksanaan sesi.* |

## 4.2 Identifikasi Use Case

| ID UC | Nama Use Case | Deskripsi Singkat | Aktor | ID KF |
| :--- | :--- | :--- | :--- | :--- |
| *UC01* | *Mendaftarkan Akun dan Autentikasi* | *Pengguna mendaftarkan akun baru menggunakan email universitas dan login ke dalam perangkat lunak.* | *Mentor, Mentee* | *KF01, KF02* |
| *UC02* | *Mengelola Preferensi Profil* | *Pengguna mengatur dan menyimpan tag materi pelajaran serta ketersediaan waktu mereka masing-masing.* | *Mentee, Mentor* | *KF03, KF04* |
| *UC03* | *Membuat Sesi Belajar* | *Mentor mengatur detail sesi baru seperti topik, jadwal, format, dan batasan jumlah peserta.* | *Mentor* | *KF05, KF06, KF14* |
| *UC04* | *Mencari dan Bergabung ke Sesi* | *Mentee melihat daftar rekomendasi sesi yang cocok dengan preferensinya, lalu mendaftar ke sesi yang dia inginkan.* | *Mentee* | *KF07, KF08, KF13* |
| *UC05* | *Mengonfirmasi Keterlaksanaan Sesi* | *Pengguna menandai dan mengonfirmasi apakah sesi yang telah dijadwalkan benar-benar terlaksana.* | *Mentor, Mentee* | *KF10* |
| *UC06* | *Melihat Riwayat Sesi* | *Pengguna melihat daftar arsip sesi yang telah selesai atau dibatalkan pada halaman khusus riwayat.* | *Mentor, Mentee* | *KF11, KF18* |
| *UC07* | *Memberikan Penilaian Sehabis Sesi* | *Mentee memberi penilaian dan catatan terhadap sesi yang telah dikonfirmasi selesai.* | *Mentee* | *KF10* |
| *UC08* | *Berkomunikasi Menggunakan Grup Obrolan Sementara* | *Pengguna bertukar pesan dalam grup obrolan sementara yang dibuat untuk suatu sesi belajar.* | *Mentor, Mentee* | *KF12* |
| *UC09* | *Menerima Notifikasi Sesi* | *Pengguna mendapatkan pengingat otomatis sebelum sesi belajar dimulai.* | *Mentor, Mentee* | *KF09* |
| *UC10* | *Membatalkan Keikutsertaan Sesi* | *Mentee dapat membatalkan pengikutsertaan sesi yang sudah didaftarkan sebelumnya.* | *Mentee* | *KF15* |
| *UC11* | *Menghapus Sesi* | *Mentor dapat menghapus sesi yang sudah dibuat sebelumnya.* | *Mentor* | *KF16* |
| *UC12* | *Mengedit Sesi* | *Mentor dapat mengedit sesi yang sudah dibuat sebelumnya untuk mengganti jadwal atau rincian sesi.* | *Mentor* | *KF17, KF06, KF14* |
| *UC13* | *Melihat Feedback Sesi* | *Mentor dapat mengakses dan membaca feedback yang dirancang oleh Mentee pada sesi yang telah selesai.* | *Mentor* | *KF18* |
| *UC14* | *Membuka Beranda Utama* | *Pengguna melihat jadwal sesi terdekat dan rekomendasi matchmaking saat masuk ke aplikasi.* | *Mentor, Mentee* | *KF07* |
| *UC15* | *Melihat Profil* | *Pengguna melihat informasi detail biodata diri sendiri atau orang lain.* | *Mentor, Mentee* | *KF19* |

## 4.3 Use Case Diagram

<p align="center">
<img alt="Use Case Diagram PeerUP" src="./assets/diagram/RPL_Use Case Diagram.webp" width="70%">
</p>
<p align="center">
<i>Gambar 5. Use Case Diagram PeerUP</i>
</p>

## 4.4 Skenario Use Case
### 4.4.1 Skenario UC01
 
**Nama Use Case:** *Mendaftarkan Akun dan Autentikasi*
 
**Skenario Normal**
 
| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna memilih opsi "Daftar", lalu memasukkan alamat email universitas, kata sandi, dan data profil* | *Sistem memvalidasi format email universitas dan merekam persetujuan data* |
| 2 | *Pengguna menekan "Simpan"* | *Sistem membuat akun baru, lalu mengarahkan pengguna ke halaman Login* |
| 3 | *Pengguna memasukkan email dan kata sandi di halaman Login, lalu menekan "Masuk"* | *Sistem memverifikasi kredensial yang dimasukkan* |
| 4 | *Pengguna menunggu proses masuk* | *Sistem memberikan hak akses akunnya dan menampilkan halaman beranda aplikasi* |
 
<br>

**Skenario Alternatif 1: Email Universitas Tidak Valid**
 
| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna memilih opsi "Daftar", lalu memasukkan email publik (misal: @gmail.com) dan data profil* | *Sistem memvalidasi format email* |
| 2 | *Pengguna melihat notifikasi peringatan* | *Sistem menolak masukan dan menampilkan notifikasi "Harap gunakan email institusi universitas yang valid"* |

### 4.4.2 Skenario UC02
 
**Nama Use Case:** *Mengelola Preferensi Profil*
 
**Skenario Normal**
 
| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna membuka halaman "Profil" dan memilih opsi "Edit Preferensi"* | *Sistem menampilkan antarmuka pemilihan preferensi: tag materi pelajaran, format, kalender ketersediaan waktu* |
| 2 | *Pengguna memilih beberapa tag materi, memilih format sesi yang diinginkan, dan menandai blok waktu kosong pada kalender, lalu menekan "Simpan"* | *Sistem memvalidasi perubahan* |
| 3 | *Pengguna melihat pembaruan profil* | *Sistem merekam pembaruan tag, pemilihan format, dan menyimpan kalender waktu ke database, lalu memunculkan notifikasi "Preferensi berhasil disimpan"* |

<br>

**Skenario Alternatif 1: Menyimpan Preferensi Tanpa Memilih Preferensi**
 
| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna membuka halaman "Profil" dan memilih opsi "Edit Preferensi"* | *Sistem menampilkan antarmuka pemilihan* |
| 2 | *Pengguna mengosongkan sebagian atau seluruh pilihan preferensi, lalu menekan "Simpan"* | *Sistem mendeteksi bahwa pilihan preferensi masih kosong* |
| 3 | *Pengguna melihat notifikasi peringatan* | *Sistem menunda penyimpanan dan menampilkan notifikasi peringatan "Silahkan Isi Semua Pilihan Preferensi"* |

### 4.4.3 Skenario UC03

**Nama Use Case:** *Membuat Sesi Belajar*

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Mentor memilih menu "Buat Sesi Baru"* | *Sistem menampilkan formulir pembuatan sesi (topik, jadwal, format daring/luring, dan batas peserta)* |
| 2 | *Mentor mengisi seluruh form dengan valid dan menekan "Simpan"* | *Sistem memvalidasi masukan formulir* |
| 3 | *Mentor menunggu konfirmasi* | *Sistem merekam detail sesi ke dalam database dan menampilkan pesan "Sesi berhasil dibuat"* |

<br>

**Skenario Alternatif 1: Kapasitas Peserta Melebihi Batas Maksimum**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Mentor memilih menu "Buat Sesi Baru"* | *Sistem menampilkan formulir pembuatan sesi (topik, jadwal, format daring/luring, dan batas peserta)* |
| 2 | *Mentor mengisi form namun memasukkan batas peserta sebanyak 135 orang, lalu menekan "Simpan"* | *Sistem memvalidasi masukan formulir dan mendeteksi pelanggaran batas aturan bisnis (maksimal 20)* |
| 3 | *Mentor melihat peringatan* | *Sistem menolak masukan, tidak menyimpan data, dan menampilkan pesan kesalahan "Kapasitas maksimal adalah 20 orang"* |
| 4 | *Mentor memperbaiki angka menjadi 9 orang dan menekan "Simpan"* | *Sistem kembali ke langkah 3 pada Skenario Normal* |

<br>

**Skenario Alternatif 2: Kapasitas Peserta Kurang dari Batas Minimum**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Mentor memilih menu "Buat Sesi Baru"* | *Sistem menampilkan formulir pembuatan sesi (topik, jadwal, format daring/luring, dan batas peserta)* |
| 2 | *Mentor mengisi form namun memasukkan batas peserta sebanyak 0 orang, lalu menekan "Simpan"* | *Sistem memvalidasi masukan formulir dan mendeteksi pelanggaran batas aturan* |
| 3 | *Mentor melihat peringatan* | *Sistem menolak masukan, tidak menyimpan data, dan menampilkan pesan kesalahan "Kapasitas minimum adalah 1 orang"* |
| 4 | *Mentor memperbaiki angka menjadi 9 orang dan menekan "Simpan"* | *Sistem kembali ke langkah 3 pada Skenario Normal* |

<br>

**Skenario Alternatif 3: Waktu Sesi Bertabrakan**   

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Mentor memilih menu "Buat Sesi Baru"* | *Sistem menampilkan formulir pembuatan sesi (topik, jadwal, format daring/luring, dan batas peserta)* |
| 2 | *Mentor mengisi form namun memilih jadwal yang bertabrakan dengan sesi miliknya yang lain, lalu menekan "Simpan"* | *Sistem memvalidasi masukan formulir dan mendeteksi adanya tabrakan jadwal* |
| 3 | *Mentor melihat peringatan* | *Sistem menolak masukan, tidak menyimpan data, dan menampilkan pesan kesalahan "Jadwal bertabrakan dengan sesi lain"* |
| 4 | *Mentor mengubah jam/tanggal pada formulir dan menekan "Simpan" sehingga jadwalnya tidak bertabrakan lagi* | *Sistem kembali ke langkah 3 pada Skenario Normal* |


### 4.4.4 Skenario UC04

**Nama Use Case:** *Mencari dan Bergabung ke Sesi*

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Mentee membuka halaman "Cari Sesi"* | *Sistem mencocokkan (matchmaking) data profil Mentee dengan sesi yang tersedia* |
| 2 | *Mentee melihat daftar* | *Sistem menampilkan daftar rekomendasi sesi berdasarkan irisan kecocokan materi dan jadwal kosong"* |
| 3 | *Mentee memilih salah satu sesi dan menekan "Gabung Sesi"* | *Sistem memvalidasi ketersediaan slot pada sesi tersebut* |
| 4 | *Mentee menunggu konfirmasi* | *Sistem menambahkan Mentee ke dalam daftar partisipan sesi tersebut dan menampilkan notifikasi "Berhasil bergabung"* |

<br>

**Skenario Alternatif 1: Tidak Ada Rekomendasi Sesi yang Cocok**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Mentee membuka halaman "Cari Sesi"* | *Sistem mencoba mencocokkan (matchmaking) data profil Mentee dengan sesi yang tersedia* |
| 2 | *Mentee melihat halaman kosong* | *Sistem tidak menemukan irisan materi atau jadwal yang cocok, lalu menampilkan pesan "Belum ada sesi yang cocok dengan jadwalmu"* |
| 3 | *Mentee menekan tombol "Ubah Preferensi"* | *Sistem mengarahkan Mentee ke halaman pengaturan profil untuk mengubah ketersediaan waktu* |

### 4.4.5 Skenario UC05
 
**Nama Use Case:** *Mengonfirmasi Keterlaksanaan Sesi*
 
**Skenario Normal**
 
| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna membuka software setelah sesi selesai berdasarkan waktu yang tercatat pada sistem* | *Sistem menampilkan tombol konfirmasi "Terlaksana" dan "Tidak Terlaksana" pada sesi terkait* |
| 2 | *Pengguna memilih "Terlaksana"* | *Sistem mencatat status sesi menjadi "Selesai" beserta waktu konfirmasi* |
| 3 | *Pengguna menerima konfirmasi* | *Sistem menampilkan pesan "Status sesi berhasil diperbarui"* |
 
 
<br>

**Skenario Alternatif 1: Sesi Ditandai Tidak Terlaksana**
 
| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna membuka software setelah sesi selesai berdasarkan waktu yang tercatat pada sistem* | *Sistem menampilkan tombol konfirmasi "Terlaksana" dan "Tidak Terlaksana" pada sesi terkait* |
| 2 | *Pengguna memilih "Tidak Terlaksana"* | *Sistem menampilkan kolom alasan singkat yang bersifat opsional* |
| 3 | *Pengguna mengisi alasan atau melewatinya, lalu menekan "Kirim"* | *Sistem mencatat status sesi menjadi "Tidak Terlaksana" beserta alasan yang diisi (optional)* |
| 4 | *Pengguna menerima konfirmasi* | *Sistem menampilkan pesan "Status sesi berhasil diperbarui"* |

### 4.4.6 Skenario UC06
 
**Nama Use Case:** *Melihat Riwayat Sesi*
 
**Skenario Normal**
 
| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna menekan tombol "Riwayat" pada bilah navigasi di Beranda* | *Sistem mengambil seluruh data sesi milik pengguna yang berstatus "Selesai", "Tidak Terlaksana", atau "Dibatalkan" dari database* |
| 2 | *Pengguna menunggu pemuatan data* | *Sistem menampilkan halaman Riwayat yang berisi daftar arsip sesi masa lalu, dikelompokkan berdasarkan status akhirnya (Berlangsung, Terlaksana, dan Tidak Terlaksana)* |
| 3 | *Pengguna memilih salah satu sesi dari daftar* | *Sistem menampilkan detail sesi tersebut, termasuk peran Pengguna (Mentor/Mentee), materi, jadwal, dan status* |
 
<br>

**Skenario Alternatif 1: Riwayat Kosong**
 
| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna menekan tombol "Riwayat" pada bilah navigasi di Beranda* | *Sistem mencari data riwayat sesi di database dan mendeteksi bahwa pengguna belum memiliki sesi yang berstatus selesai atau dibatalkan* |
| 2 | *Pengguna melihat halaman riwayat* | *Sistem menampilkan pesan "Belum ada sesi" * |

### 4.4.7 Skenario UC07
 
**Nama Use Case:** *Memberikan Penilaian Sehabis Sesi*
 
**Skenario Normal**
 
| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Mentee membuka sesi yang telah berstatus "Selesai"* | *Sistem menampilkan form feedback beserta catatan opsional* |
| 2 | *Mentee memberi feedback dan menuliskan catatan, lalu menekan "Kirim"* | *Sistem memvalidasi bahwa feedback telah diisi* |
| 3 | *Mentee menunggu konfirmasi* | *Sistem menyimpan feedback dan menampilkan pesan "Terima kasih atas feedback Anda"* |
 
<br>

**Skenario Alternatif 1: Pengguna Tidak Mengisi Form Feedback**
 
| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Mentee membuka sesi yang telah berstatus "Selesai"* | *Sistem menampilkan form feedback beserta catatan opsional dan tombol "Skip"* |
| 2 | *Mentee menekan tombol "Skip" tanpa mengisi feedback* | *Sistem menutup form tanpa menyimpan feedback dan status sesi tetap "Selesai"* |

### 4.4.8 Skenario UC08
 
**Nama Use Case:** *Berkomunikasi Menggunakan Grup Obrolan Sementara*
 
**Skenario Normal**
 
| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna membuka menu "Pesan" dan memilih grup obrolan dari sesi yang telah terbentuk* | *Sistem menampilkan grup obrolan beserta riwayat pesan di dalamnya* |
| 2 | *Pengguna mengetikkan pesan, lalu menekan "Kirim"* | *Sistem menyimpan pesan ke database dan menampilkannya di layar obrolan seluruh anggota grup sesi terkait* |

<br>

**Skenario Alternatif 1: Grup Obrolannya Sudah Berakhir**
 
| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna mencoba membuka obrolan grup dari sesi yang telah selesai lebih dari 48 jam lalu* | *Sistem mendeteksi masa aktif sesi telah berakhir dan datanya sudah dihapus* |
| 2 | *Pengguna melihat peringatan dan mencoba membuka grup obrolan tersebut* | *Sistem menonaktifkan akses dan menampilkan pesan "Group chat untuk sesi ini telah berakhir"* |

### 4.4.9 Skenario UC09
 
**Nama Use Case:** *Menerima Notifikasi Sesi*
 
**Skenario Normal**
 
| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna sedang mengoperasikan perangkatnya saat waktu menunjukkan 15 menit sebelum sesi dimulai* | *Sistem mendeteksi pemicu waktu dan mengirimkan notifikasi pengingat ke akun partisipan terkait* |
| 2 | *Pengguna menekan notifikasi pengingat tersebut* | *Sistem mengarahkan pengguna ke halaman detail sesi belajar tersebut* |

(Catatan: UC09 tidak memiliki skenario alternatif karena ini murni sistem penyebaran informasi ke Pengguna).

### 4.4.10 Skenario UC10

**Nama Use Case:** *Membatalkan Keikutsertaan Sesi*
 
**Skenario Normal**
 
| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Mentee membuka detail sesi terdaftar yang belum dimulai.* | *Sistem menampilkan detail informasi sesi tersebut beserta tombol "Batalkan Keikutsertaan"* |
| 2 | *Mentee menekan tombol "Batalkan Keikutsertaan"* | *Sistem menampilkan pesan konfirmasi pembatalan* |
| 3 | *Mentee mengonfirmasi pembatalan dengan menekan "Ya, Batalkan"* | *Sistem menghapus data mentee tersebut dari database pendaftar sesi dan pesan "Berhasil Membatalkan Keikutsertaan" muncul* |

<br>

**Skenario Alternatif 1: Mentee tidak jadi membatalkan sesi**
 
| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Mentee membuka detail sesi terdaftar yang belum dimulai.* | *Sistem menampilkan detail informasi sesi tersebut beserta tombol "Batalkan Keikutsertaan"* |
| 2 | *Mentee menekan tombol "Batalkan Keikutsertaan"* | *Sistem menampilkan pesan konfirmasi pembatalan* |
| 3 | *Mentee menekan tombol "Kembali"* | *Sistem menutup pesan dan tidak melakukan perubahan apapun* |

### 4.4.11 Skenario UC11

**Nama Use Case:** *Menghapus Sesi*
 
**Skenario Normal**
 
| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Mentor membuka detail sesi yang telah dia buat* | *Sistem menampilkan detail informasi sesi tersebut beserta tombol "Hapus Sesi"* |
| 2 | *Mentor menekan tombol "Hapus Sesi"* | *Sistem menampilkan pesan konfirmasi penghapusan sesi* |
| 3 | *Mentor mengonfirmasi penghapusan sesi dengan menekan tombol "Ya, Hapus"* | *Sistem menghapus dan menonaktifkan sesi tersebut, muncul pesan "Sesi Berhasil Dihapus"* |

<br>

**Skenario Alternatif 1: Mentor tidak jadi menghapus sesi**
 
| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Mentor membuka detail sesi yang telah dia buat* | *Sistem menampilkan detail informasi sesi tersebut beserta tombol "Hapus Sesi"* |
| 2 | *Mentor menekan tombol "Hapus Sesi"* | *Sistem menampilkan pesan konfirmasi penghapusan sesi* |
| 3 | *Mentor menekan tombol "Batal"* | *Sistem menutup pesan dan tidak terjadi perubahan apapun* |

### 4.4.12 Skenario UC12

**Nama Use Case:** *Mengedit Sesi*

**Skenario Normal**
 
| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Mentor membuka detail sesi yang telah dia buat* | *Sistem menampilkan detail informasi sesi tersebut beserta tombol "Edit Sesi"* |
| 2 | *Mentor menekan tombol "Edit Sesi"* | *Sistem menampilkan formulir yang sudah terisi dengan data sesi saat ini (topik, jadwal, batas peserta, dan lain-lain) serta tombol "Simpan Perubahan"* |
| 3 | *Mentor mengedit formulir yang ditampilkan dan mengonfirmasi perubahan dengan menekan tombol "Simpan Perubahan"* | *Sistem memperbarui database dengan data yang telah direvisi agar tampilan sesuai, lalu memunculkan pesan "Data Sesi Berhasil Diperbarui"* |

<br>

**Skenario Alternatif 1: Jadwal yang Direvisi Mentor Bertabrakan dengan Sesi Lain**
 
| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Mentor membuka detail sesi yang telah dia buat* | *Sistem menampilkan detail informasi sesi tersebut beserta tombol "Edit Sesi"* |
| 2 | *Mentor menekan tombol "Edit Sesi"* | *Sistem menampilkan formulir yang sudah terisi dengan data sesi saat ini (topik, jadwal, batas peserta, dan lain-lain) serta tombol "Simpan Perubahan"* |
| 3 | *Mentor mengubah jadwal sesi yang telah dibuat ke waktu yang berbenturan dengan sesi lain miliknya, lalu mengonfirmasi perubahan tersebut.* | *Sistem mendeteksi adanya tabrakan jadwal antarsesi dan menampilkan pesan peringatan tabrakan jadwal* |
| 4 | *Mentor menyesuaikan kembali jadwalnya ke waktu yang sesuai dan mengonfirmasi perubahan* | *Sistem memperbarui database dengan data yang telah direvisi agar tampilan sesuai, lalu memunculkan pesan "Data Sesi Berhasil Diperbarui"* |

<br>

**Skenario Alternatif 2: Jumlah Partisipan yang Direvisi Mentor Lebih Sedikit Batas Minimum yang Diperbolehkan**
 
| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Mentor membuka detail sesi yang telah dia buat* | *Sistem menampilkan detail informasi sesi tersebut beserta tombol "Edit Sesi"* |
| 2 | *Mentor menekan tombol "Edit Sesi"* | *Sistem menampilkan formulir yang sudah terisi dengan data sesi saat ini (topik, jadwal, batas peserta, dan lain-lain) serta tombol "Simpan Perubahan"* |
| 3 | *Mentor melakukan pengeditan terhadap batas maksimum peserta menjadi lebih sedikit dari batas minimum yang diperbolehkan dan mengonfirmasi perubahan tersebut* | *Sistem mendeteksi bahwa jumlah partisipan yang dimasukkan mentor lebih sedikit dari yang diperbolehkan, lalu menampilkan pesan peringatan jumlah partisipan terlalu sedikit* |
| 4 | *Mentor menyesuaikan kembali batas pesertanya, lalu mengonfirmasi perubahan* | *Sistem memperbarui database dengan data yang telah direvisi agar tampilan sesuai, lalu memunculkan pesan "Data sesi berhasil diperbarui"* |

### 4.4.13 Skenario UC13

**Nama Use Case:** *Melihat Feedback Sesi*

**Skenario Normal**
 
| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Mentor membuka detail sesi yang telah selesai pada riwayat sesi* | *Sistem menampilkan detail informasi sesi tersebut beserta tombol "Lihat Feedback"* |
| 2 | *Mentor menekan tombol "Lihat Feedback"* | *Sistem menampilkan semua feedback yang dibuat Mentee pada sesi tersebut (ditarik dari database Feedback)* |

<br>

(Catatan: UC13 tidak memiliki skenario alternatif).

### 4.4.14 Skenario UC14

**Nama Use Case:** *Membuka Beranda Utama*

**Skenario Normal**
 
| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna berhasil melakukan login atau mengakses tautan awal aplikasi* | *Sistem memverifikasi sesi aktif, mengambil data sesi terdekat pengguna, dan menjalankan algoritma pencocokan (matchmaking) dengan preferensi Mentee* |
| 2 | *Pengguna menunggu pemuatan data* | *Sistem menampilkan halaman Beranda yang berisi pesan sapaan, daftar Sesi Aktif Terdekat, dan kartu-kartu Rekomendasi Sesi (matchmaking)* |

<br>

**Skenario Alternatif 1: Preferensi Belum Diatur (Khusus Mentee)**
 
| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Mentee berhasil melakukan login* | *Sistem memverifikasi sesi dan mendeteksi bahwa data preferensi Mentee masih kosong* |
| 2 | *Mentee melihat halaman Beranda* | *Sistem menampilkan Sesi Aktif Terdekat (jika ada), namun pada bagian Rekomendasi menampilkan pesan peringatan untuk mengatur preferensi belajar mentee halaman Profil agar rekomendasi dapat diberikan beserta tombol "Atur Preferensi"* |

<br>

### 4.4.15 Skenario UC15

**Nama Use Case:** *Melihat Profil*

**Skenario Normal**
 
| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna menekan ikon "Profil" miliknya sendiri di bilah navigasi, atau menekan nama pengguna lain di dalam antarmuka aplikasi* | *Sistem menerima permintaan dan mengambil data identitas (nama, bio, program studi, universitas, tag materi) berdasarkan ID pengguna tersebut dari database* |
| 2 | *Pengguna menunggu pemuatan data* | *Sistem menampilkan halaman Profil yang memuat seluruh detail data diri dari pengguna yang dipilih tersebut* |

**Skenario Alternatif 1: Profil Tidak Ditemukan**
 
| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna menekan nama pengguna lain melalui tautan eksternal atau riwayat obrolan lama* | *Sistem mencoba mengambil data profil dari database dan mendeteksi bahwa ID pengguna tersebut tidak valid atau akun telah dihapus* |
| 2 | *Pengguna melihat pesan peringatan* | *Sistem menampilkan pesan "Profil pengguna tidak ditemukan" dan menghentikan proses pemuatan halaman profil* |
 
---

---

# BAB 5: Pemodelan Kelas

## 5.1 Identifikasi Kelas

| ID Kelas | Nama Kelas | Deskripsi Kelas | ID Use Case |
| :--- | :--- | :--- | :--- |
| *C01* | *User* | *Kelas parent yang merepresentasikan pengguna aplikasi (Mentor, Mentee) yang menyimpan informasi akun dasar seperti profil, email university, kata sandi, preferensi materi, dan schedule.* | *UC01, UC02, UC05, UC06, UC07, UC08, UC09, UC14, UC15* |
| *C02* | *Mentor* | *Kelas turunan dari User yang merepresentasikan tutor sebaya. Kelas ini memiliki hak untuk membuat sesi baru, mengedit sesi, dan menghapus sesi.* | *UC01, UC02, UC03, UC05, UC06, UC07, UC08, UC09, UC11, UC12, UC13, UC14, UC15* |
| *C03* | *Mentee* | *Kelas turunan dari User yang merepresentasikan siswa. Memiliki hak untuk mencari rekomendasi sesi, mendaftarkan ke sesi, serta membatalkan ikutsertaan sesi.* | *UC01, UC02, UC04, UC05, UC06, UC07, UC08, UC09, UC10, UC14, UC15* |
| *C04* | *Session* | *Kelas yang merepresentasikan sesi belajar yang menyimpan atribut seperti topic materi, schedule, capacity, daftar peserta, dan status sesi.* | *UC03, UC04, UC05, UC06, UC07, UC08, UC09, UC10, UC11, UC12, UC13, UC14* |
| *C05* | *GroupChat* | *Kelas yang merepresentasikan ruang obrolan sementara untuk komunikasi antar pengguna.* | *UC08* |
| *C06* | *Feedback* | *Kelas yang merepresentasikan rating dan ulasan yang diberikan oleh Mentee pada saat sebuah sesi belajar telah selesai.* | *UC07, UC13* |
| *C07* | *SessionHistory* | *Kelas yang menyimpan kumpulan riwayat sesi milik seorang pengguna dengan mengelompokkannya berdasarkan status (Berlangsung, Terlaksana, Tidak Terlaksana).* | *UC05, UC06, UC10, UC11, UC12, UC13* |
| *C08* | *ChatMessage* | *Kelas yang merepresentasikan pesan yang dikirimkan oleh pengguna ke dalam sebuah GroupChat. Menyimpan informasi pengirim, isi pesan teks, dan timestamp pesan dikirim.* | *UC08* |
| *C09* | *Preference* | *Kelas yang menyimpan pengaturan pengguna, seperti tag mata pelajaran, ketersediaan jadwal pada kalender, dan preferensi metode belajar (luring/daring) agar digunakan oleh algoritma matchmaking.* | *UC02, UC04, UC14, UC15* |
| *C10* | *Profile* | *Kelas yang merepresentasikan data identitas pengguna (nama, universitas, program studi, bio) yang dihubungkan dengan akun User.* | *UC01, UC02, UC15* |
| *C11* | *Dashboard* | *Kelas antarmuka utama yang menampilkan rangkuman jadwal sesi terdekat, notifikasi, dan rekomendasi matchmaking untuk Mentee.* | *UC01, UC04, UC06, UC09, UC14* |
| *C12* | *UserControl* | *Kelas pengontrol yang mengautentikasi login, memvalidasi format email, dan pembaruan profil pengguna.* | *UC01, UC02, UC15* |
| *C13* | *SessionControl* | *Kelas pengontrol yang menangani tabrakan jadwal, menjalankan algoritma matchmaking, dan memproses pendaftaran atau pembuatan sesi.* | *UC03, UC04, UC05, UC06, UC10, UC11, UC12, UC14* |
| *C14* | *FeedbackControl* | *Kelas pengontrol yang memvalidasi feedback dan rating untuk mentor.* | *UC07, UC13* |
| *C15* | *LoginPage* | *Kelas antarmuka tempat pengguna dapat memasukkan kredensial untuk membuat akun atau masuk ke akun.* | *UC01* |
| *C16* | *ProfilePage* | *Kelas antarmuka tempat pengguna dapat mengelola data profil seperti identitas dan preferensi.* | *UC02, UC15* |
| *C17* | *SessionPage* | *Kelas antarmuka tempat pengguna dapat melihat rincian detail sesi dan mengakses group chat.* | *UC03, UC04, UC05, UC10, UC11, UC12* |
| *C18* | *HostSessionPage* | *Kelas turunan dari SessionPage sebagai tempat Mentor dapat melakukan pembaruan data atau penghapusan.* | *UC03, UC05, UC11, UC12, UC13* |
| *C19* | *ParticipantSessionPage* | *Kelas turunan dari SessionPage tempat Mentee dapat membatalkan untuk mengikuti sesi.* | *UC04, UC05, UC10* |
| *C20* | *FeedbackForm* | *Kelas antarmuka dalam bentuk formulir yang diisi Mentee sebagai penilaian terhadap Mentor sehabis sesi.* | *UC07, UC13* |
| *C21* | *GroupChatPage* | *Kelas antarmuka yang menampilkan antarmuka kotak pesan dan riwayat obrolan antarpengguna.* | *UC08* |
| *C22* | *Notification* | *Kelas yang merepresentasikan pesan pengingat dari sistem yang menyimpan detail pesan, waktu, dan status terbaca.* | *UC09* |
| *C23* | *PopUpNotification* | *Kelas yang menampilkan notifikasi pada layar pengguna untuk mengingatkan pengguna akan sesi yang akan segera dimulai, sekaligus akan membawa pengguna ke aplikasi apabila ditekan.* | *UC09* |
| *C24* | *HistoryPage* | *Kelas antarmuka tempat pengguna dapat melihat daftar lengkap arsip sesi masa lalunya yang berstatus selesai, batal, atau tidak terlaksana.* | *UC06* |

## 5.2 Diagram Kelas per Use Case
### 5.2.1 Use Case UC01

**Nama Use Case:** *Mendaftarkan Akun dan Autentikasi*

#### Identifikasi Kelas 

| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C01* | *User* | *Kelas parent yang merepresentasikan pengguna aplikasi (Mentor, Mentee) yang menyimpan informasi akun dasar seperti profil, email university, kata sandi, preferensi materi, dan schedule.* |
| *C02* | *Mentor* | *Kelas turunan dari User yang merepresentasikan tutor sebaya. Kelas ini memiliki hak untuk membaut sesi baru, mengedit sesi, dan menghapus sesi.* |
| *C03* | *Mentee* | *Kelas turunan dari User yang merepresentasikan siswa. Memiliki hak untuk mencari rekomendasi sesi, mendaftarkan ke sesi, serta membatalkan ikutsertaan sesi* |
| *C12* | *UserControl* | *Kelas pengontrol yang mengautentikasi login, memvalidasi format email, dan pembaruan profil pengguna* |
| *C15* | *LoginPage* | *Kelas antarmuka tempat pengguna dapat memasukkan kredensial untuk mebuat akun atau masuk ke akun.* | 

#### Diagram Kelas

<p align="center">
<img alt="Class Diagram UC01" src="./assets/diagram/diagram-uc01.png" width="70%">
</p>
<p align="center">
<i>Gambar 6. Diagram Kelas Use Case UC01</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C01* | *User* | *idUser, username, profile, email, passwordHash* | *register(), login(), logout(), saveAccount()* |
| *C02* | *Mentor* | *listSessionsMade* | *inherit dari User* |
| *C03* | *Mentee* | *listSessionsJoined* | *inherit dari User* |
| *C12* | *UserControl* | *-* | *validateEmail(), authLogin(), processRegistration()* |
| *C15* | *LoginPage* | *-* | *showForm(), submitForm()* |


### 5.2.2 Use Case UC02
 
**Nama Use Case:** *Mengelola Preferensi Profil*
 
#### Identifikasi Kelas
 
| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C01* | *User* | *Kelas parent yang merepresentasikan pengguna aplikasi (Mentor, Mentee) yang menyimpan informasi akun dasar seperti profil, email university, kata sandi, preferensi materi, dan schedule.* |
| *C02* | *Mentor* | *Kelas turunan dari User yang merepresentasikan tutor sebaya. Kelas ini memiliki hak untuk membaut sesi baru, mengedit sesi, dan menghapus sesi.* |
| *C03* | *Mentee* | *Kelas turunan dari User yang merepresentasikan siswa. Memiliki hak untuk mencari rekomendasi sesi, mendaftarkan ke sesi, serta membatalkan ikutsertaan sesi* |
| *C09* | *Preference* | *Kelas yang menyimpan pengaturan pengguna, seperti tag mata pelajaran, ketersediaan jadwal pada kalender, dan preferensi metode belajar (luring/daring) agar digunakan oleh algoritma matchmaking.* |
| *C10* | *Profile* | *Kelas yang merepresentasikan data identitas pengguna (nama, university, program studi, bio) yang dihubungkan dengan akun User.* |
| *C12* | *UserControl* | *Kelas pengontrol yang mengautentikasi login, memvalidasi format email, dan mengelola pembaruan profil pengguna.* |
| *C16* | *ProfilePage* | *Kelas antarmuka tempat pengguna dapat melihat dan mengelola data profil seperti identitas dan preferensi.* |

#### Diagram Kelas
 
<p align="center">
<img alt="Class Diagram UC02" src="./assets/diagram/diagram-uc02.png" width="70%">
</p>
<p align="center">
<i>Gambar 7. Diagram Kelas Use Case UC02</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C01* | *User* | *idUser, username, profile, email, passwordHash* | *getProfile()* |
| *C02* | *Mentor* | *-* | *inherit dari User* |
| *C03* | *Mentee* | *-* | *inherit dari User* |
| *C09* | *Preference* | *materialTag, availability, sessionFormatPreference* | *updatePreference()* |
| *C10* | *Profile* | *name, university, studyProgram, bio* | *updateProfile()* |
| *C12* | *UserControl* | *-* | *saveProfile(), savePreference()* |
| *C16* | *ProfilePage* | *-* | *displayProfile(), submitUpdate()* |



### 5.2.3 Use Case UC03

**Nama Use Case:** *Membuat Sesi Belajar*

#### Identifikasi Kelas

| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C02* | *Mentor* | *Kelas turunan dari User yang merepresentasikan tutor sebaya. Kelas ini memiliki hak untuk membuat sesi baru, mengedit sesi, dan menghapus sesi.* |
| *C04* | *Session* | *Kelas yang merepresentasikan sesi belajar yang menyimpan atribut seperti topic materi, schedule, capacity, daftar peserta, dan status sesi.* |
| *C13* | *SessionControl* | *Kelas pengontrol yang menangani tabrakan jadwal, menjalankan algoritma matchmaking, dan memproses pendaftaran atau pembuatan sesi.* |
| *C17* | *SessionPage* | *Kelas antarmuka tempat pengguna dapat melihat rincian detail sesi dan mengakses group chat.* |
| *C18* | *HostSessionPage* | *Kelas turunan dari SessionPage sebagai tempat Mentor dapat melakukan pembuatan sesi, pembaruan data, atau penghapusan.* |

#### Diagram Kelas

<p align="center">
<img alt="Class Diagram UC03" src="./assets/diagram/diagram-uc03.png" width="70%">
</p>
<p align="center">
<i>Gambar 8. Diagram Kelas Use Case UC03</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C02* | *Mentor* | *listSessionsMade* | *inherit dari User* |
| *C04* | *Session* | *idSession, topic, schedule, format, capacity, userList, status* | *saveSession()* |
| *C13* | *SessionControl* | *-* | *validateScheduleConflict(), processSessionCreation()* |
| *C17* | *SessionPage* | *-* | *showSessionDetails()* |
| *C18* | *HostSessionPage* | *-* | *showCreateForm(), submitSessionData()* |

 

### 5.2.4 Use Case UC04
 
**Nama Use Case:** *Mencari dan Bergabung ke Sesi*
 
#### Identifikasi Kelas
 
| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C03* | *Mentee* | *Kelas turunan dari User yang merepresentasikan siswa. Memiliki hak untuk mencari rekomendasi sesi, mendaftarkan ke sesi, serta membatalkan ikutsertaan sesi* |
| *C04* | *Session* | *Kelas yang merepresentasikan sesi belajar yang menyimpan atribut seperti topic materi, schedule, capacity, daftar peserta, dan status sesi* |
| *C07* | *SessionHistory* | *Kelas yang menyimpan kumpulan riwayat sesi milik seorang pengguna dengan mengelompokkannya berdasarkan status (Berlangsung, Terlaksana, Tidak Terlaksana).* |
| *C09* | *Preference* | *Kelas yang menyimpan pengaturan pengguna, seperti tag mata pelajaran, ketersediaan jadwal pada kalender, dan preferensi metode belajar (luring/daring) agar digunakan oleh algoritma matchmaking.* |
| *C11* | *Dashboard* | *Kelas antarmuka utama yang menampilkan rangkuman jadwal sesi terdekat, notifikasi, dan rekomendasi matchmaking untuk Mentee.* |
| *C13* | *SessionControl* | *Kelas pengontrol yang menangani tabrakan jadwal, menjalankan algoritma matchmaking, dan memproses pendaftaran atau pembuatan sesi.* |
| *C19* | *ParticipantSessionPage* | *Kelas turunan dari SessionPage tempat Mentee dapat membatalkan untuk mengikuti sesi* |
 
#### Diagram Kelas
 
<p align="center">
<img alt="Class Diagram UC04" src="./assets/diagram/diagram-uc04.png" width="70%">
</p>
<p align="center">
<i>Gambar 9. Diagram Kelas Use Case UC04</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C03* | *Mentee* | *attendedSessions* | *inherit dari User* |
| *C04* | *Session* | *idSession, topic, schedule, format, capacity, userList, status* | *addParticipant(), checkCapacity()* |
| *C07* | *SessionHistory* | *historyList* | *addSessionToHistory()* |
| *C09* | *Preference* | *materialTag, availability, sessionFormatPreference* | *getPreference()* |
| *C11* | *Dashboard* | *listSessions* | *showRecommendation()* |
| *C13* | *SessionControl* | *-* | *findRecommendation(), validateCapacity(), processRegistration()* |
| *C19* | *ParticipantSessionPage* | *-* | *showSessionDetails(), submitJoinRequest()* |



### 5.2.5 Use Case UC05
 
**Nama Use Case:** *Mengonfirmasi Keterlaksanaan Sesi*
 
#### Identifikasi Kelas
 
| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C02* | *Mentor* | *Kelas turunan dari User (Entity) yang bertindak sebagai tutor yang mengonfirmasi sesi.* |
| *C03* | *Mentee* | *Kelas turunan dari User (Entity) yang bertindak sebagai siswa yang mengonfirmasi sesi.* |
| *C04* | *Session* | *Kelas yang merepresentasikan data sesi belajar (Entity) yang akan diperbarui status keterlaksanaannya.* |
| *C13* | *SessionControl* | *Kelas pengontrol (Controller) yang bertugas menerima input konfirmasi dari antarmuka dan memperbarui status pada entitas Session.* |
| *C17* | *SessionPage* | *Kelas antarmuka (Boundary) tempat pengguna menekan tombol konfirmasi "Terlaksana" atau "Tidak Terlaksana".* |
 

#### Diagram Kelas
 
<p align="center">
<img alt="Class Diagram UC05" src="./assets/diagram/diagram-uc05.png" width="70%">
</p>
<p align="center">
<i>Gambar 10. Diagram Kelas Use Case UC05</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |  
| *C02* | *Mentor* | *listSessionsMade* | *inherit dari User* |
| *C03* | *Mentee* | *listSessionsJoined* | *inherit dari User* |
| *C04* | *Session* | *idSession, topic, schedule, status, reasonNotConducted.* | *setStatus(), getStatus()* |
| *C13* | *SessionControl* | *-* | *processSessionConfirmation(), updateSessionStatus()* |
| *C17* | *SessionPage* | *confirmationPrompt* | *showConfirmationPrompt(), submitConfirmation()* |
 


### 5.2.6 Use Case UC06
 
**Nama Use Case:** *Melihat Riwayat Sesi*
 
#### Identifikasi Kelas
 
| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C02* | *Mentor* | *Kelas turunan dari User (Entity) yang memiliki daftar riwayat sesi.* |
| *C03* | *Mentee* | *Kelas turunan dari User (Entity) yang memiliki daftar riwayat sesi.* |
| *C04* | *Session* | *Kelas entitas tunggal (Entity) yang rinciannya ditampilkan di dalam riwayat.* | 
| *C07* | *SessionHistory* | *Kelas koleksi (Entity) yang menyimpan arsip sesi berstatus Selesai, Tidak Terlaksana, atau Dibatalkan.* |
| *C13* | *SessionControl* | *Kelas pengontrol (Controller) yang bertugas mengambil (fetch) data arsip dari entitas riwayat untuk dikirimkan ke antarmuka.* | 
| *C24* | *HistoryPage* | *Kelas antarmuka (Boundary) baru tempat pengguna melihat daftar sesi masa lalunya secara lengkap.* | 
 
#### Diagram Kelas
 
<p align="center">
<img alt="Class Diagram UC06" src="./assets/diagram/diagram-uc06.png" width="70%">
</p>
<p align="center">
<i>Gambar 11. Diagram Kelas Use Case UC06</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C02* | *Mentor* | *listSessionsMade* | *inherit dari User* |
| *C03* | *Mentee* | *listSessionsJoined* | *inherit dari User* |
| *C04* | *Session* | *idSession, topic, schedule, status* | *getSessionDetails()* |
| *C07* | *SessionHistory* | *completedSessions, cancelledSessions* | *getArchivedSessions()* |
| *C13* | *SessionControl* | *-* | *fetchUserHistory()* |
| *C24* | *HistoryPage* | *historyList* | *displayHistoryList(), showEmptyState()* | 


### 5.2.7 Use Case UC07
 
**Nama Use Case:** *Memberikan Penilaian Sehabis Sesi*
 
#### Identifikasi Kelas
 
| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C01* | *User* | *Kelas parent yang merepresentasikan pengguna aplikasi (Mentor, Mentee) yang menyimpan informasi akun dasar seperti profil, email university, kata sandi, preferensi materi, dan schedule.* |
| *C02* | *Mentor* | *Kelas turunan dari User yang merepresentasikan tutor sebaya. Kelas ini menjadi pihak yang menerima penilaian dan ulasan dari Mentee setelah sesi selesai.* |
| *C03* | *Mentee* | *Kelas turunan dari User yang merepresentasikan siswa. Memiliki hak untuk memberikan rating dan ulasan terhadap Mentor setelah mengikuti sesi belajar.* |
| *C04* | *Session* | *Kelas yang merepresentasikan sesi belajar yang menyimpan atribut seperti topic materi, schedule, capacity, daftar peserta, dan status sesi.* |
| *C06* | *Feedback* | *Kelas yang merepresentasikan rating dan ulasan yang diberikan oleh Mentee terhadap Mentor setelah sebuah sesi belajar selesai.* |
| *C07* | *SessionHistory* | *Kelas yang menyimpan kumpulan riwayat sesi milik seorang pengguna dengan mengelompokkannya berdasarkan status (Berlangsung, Terlaksana, Tidak Terlaksana).* |
| *C14* | *FeedbackControl* | *Kelas pengontrol yang memvalidasi feedback dan rating yang diberikan oleh Mentee serta memproses penyimpanan feedback.* |
| *C20* | *FeedbackForm* | *Kelas antarmuka dalam bentuk formulir yang digunakan Mentee untuk mengisi rating dan ulasan terhadap Mentor setelah sesi selesai.* |
 
#### Diagram Kelas
 
<p align="center">
<img alt="Class Diagram UC07" src="./assets/diagram/diagram-uc07.png" width="70%">
</p>
<p align="center">
<i>Gambar 12. Diagram Kelas Use Case UC07</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C02* | *Mentor* | *feedbackList* | *receiveFeedback()* |
| *C03* | *Mentee* | *attendedSessions* | *giveFeedback(), checkCompletedSession()* |
| *C04* | *Session* | *idSession, topic, schedule, format, capacity, userList, status* | *getSessionStatus(), isCompleted()* |
| *C06* | *Feedback* | *idFeedback, rating, comment, date* | *setRating(), setComment(), getRating(), getComment()* |
| *C07* | *SessionHistory* | *historyList* | *getCompletedSessions()* |
| *C14* | *FeedbackControl* | *feedbackList* | *validateFeedback(), submitFeedback(), saveFeedback()* |
| *C20* | *FeedbackForm* | *rating, comment* | *showForm(), submitFeedback()* |


### 5.2.8 Use Case UC08
 
**Nama Use Case:** *Berkomunikasi Menggunakan Grup Obrolan Sementara*
 
#### Identifikasi Kelas
 
| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C05* | *GroupChat* | *Kelas yang merepresentasikan ruang obrolan sementara untuk komunikasi antar pengguna.* |
| *C21* | *GroupChatPage* | *Kelas antarmuka yang menampilkan antarmuka kotak pesan dan riwayat obrolan antarpengguna.* |
| *C04* | *Session* | *Kelas yang merepresentasikan sesi belajar yang menyimpan atribut seperti topik materi, jadwal, kapasitas, daftar peserta, dan status sesi* |
| *C08* | *ChatMessage* | *Kelas yang merepresentasikan pesan yang dikirimkan oleh pengguna ke dalam sebuah GroupChat. Menyimpan informasi pengirim, isi pesan teks, dan timestamp pesan dikirim.* |
| *C01* | *User* | *Kelas parent yang merepresentasikan pengguna aplikasi (Mentor, Mentee) yang menyimpan informasi akun dasar seperti profil, email universitas, kata sandi, preferensi materi, dan jadwal.* |
 
#### Diagram Kelas
 
<p align="center">
<img alt="Class Diagram UC08" src="./assets/diagram/diagram-uc08.png" width="70%">
</p>
<p align="center">
<i>Gambar 13. Diagram Kelas Use Case UC08</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C05* | *GroupChat* | *listChatMessage, listMentee, Mentor* | *searchMessage(), editMessage(), deleteMessage()* |
| *C21* | *GroupChatPage* | *-* | *displayMessage()* |
| *C04* | *Session* | *groupChat* | *openGroupChat()* |
| *C08* | *ChatMessage* | *sender, timeStamp, text* | *getSender(), getTime(), getText()* |
| *C01* | *User* | *listSession* | *openSessionDashboard(), createMessage(), sendMessage()* |


### 5.2.9 Use Case UC09
 
**Nama Use Case:** *Menerima notifikasi sesi*
 
#### Identifikasi Kelas
 
| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C22* | *Notification* | *Kelas yang merepresentasikan pesan pengingat dari sistem yang menyimpan detail pesan, waktu, dan status terbaca* |
| *C04* | *Session* | *Kelas yang merepresentasikan sesi belajar yang menyimpan atribut seperti topik materi, jadwal, kapasitas, daftar peserta, dan status sesi* |
| *C11* | *Dashboard* | *Kelas antarmuka utama yang menampilkan rangkuman jadwal sesi terdekat, notifikasi, dan rekomendasi matchmaking untuk Mentee.* |
| *C01* | *User* | *Kelas parent yang merepresentasikan pengguna aplikasi (Mentor, Mentee) yang menyimpan informasi akun dasar seperti profil, email universitas, kata sandi, preferensi materi, dan jadwal.* |
 
#### Diagram Kelas
 
<p align="center">
<img alt="Class Diagram UC09" src="./assets/diagram/diagram-uc09.png" width="70%">
</p>
<p align="center">
<i>Gambar 14. Diagram Kelas Use Case UC09</i>
</p>
<br>
 
| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C22* | *Notification* | *notificationId, title, content, timestamp, isRead* | *markAsRead(), showContent(), getTime(), openApp()* |
| *C04* | *Session* | *scheduledTime* | *pushNotification()* |
| *C11* | *Dashboard* | *-* | *showSession(), matchMakeSession(), searchSession(), checkSchedule()* |
| *C01* | *User* | *-* | *openDashboard()* |


### 5.2.10 Use Case UC10
 
**Nama Use Case:** *Membatalkan Keikutsertaan Sesi*
 
#### Identifikasi Kelas
 
| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C04* | *Session* | *Kelas yang merepresentasikan sesi belajar yang menyimpan atribut seperti topik materi, jadwal, kapasitas, daftar peserta, dan status sesi* |
| *C19* | *ParticipantSessionPage* | *Kelas turunan dari SessionPage tempat Mentee dapat membatalkan untuk mengikuti sesi* |
| *C07* | *SessionHistory* | *Kelas yang menyimpan kumpulan riwayat sesi milik seorang pengguna dengan mengelompokkannya berdasarkan status (Berlangsung, Terlaksana, Tidak Terlaksana).* |
| *C13* | *SessionControl* | *Kelas pengontrol yang menangani tabrakan jadwal, menjalankan algoritma matchmaking, dan memproses pendaftaran atau pembuatan sesi.* |
| *C03* | *Mentee* | *Kelas turunan dari User yang merepresentasikan siswa. Memiliki hak untuk mencari rekomendasi sesi, mendaftarkan ke sesi, serta membatalkan ikutsertaan sesi* |
 
#### Diagram Kelas
 
<p align="center">
<img alt="Class Diagram UC10" src="./assets/diagram/diagram-uc10.png" width="70%">
</p>
<p align="center">
<i>Gambar 15. Diagram Kelas Use Case UC10</i>
</p>
<br>
 
| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C04* | *Session* | *listMentee* | *removeMentee()* |
| *C19* | *ParticipantSessionPage* | *-* | *-* |
| *C07* | *SessionHistory* | *oncomingSession* | *-* |
| *C13* | *SessionControl* | *sessionHistory* | *cancelSession()* |
| *C03* | *Mentee* | *listSession* | *-* |


### 5.2.11 Use Case UC11
 
**Nama Use Case:** *Menghapus Sesi*
 
#### Identifikasi Kelas
 
| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C04* | *Session* | *Kelas yang merepresentasikan sesi belajar yang menyimpan atribut seperti topik materi, jadwal, kapasitas, daftar peserta, dan status sesi* |
| *C13* | *SessionControl* | *Kelas pengontrol yang menangani tabrakan jadwal, menjalankan algoritma matchmaking, dan memproses pendaftaran atau pembuatan sesi.* |
| *C07* | *SessionHistory* | *Kelas yang menyimpan kumpulan riwayat sesi milik seorang pengguna dengan mengelompokkannya berdasarkan status (Berlangsung, Terlaksana, Tidak Terlaksana).* |
| *C18* | *HostSessionPage* | *Kelas turunan dari SessionPage sebagai tempat Mentor dapat melakukan pembaruan data atau penghapusan.* |
| *C02* | *Mentor* | *Kelas turunan dari User yang merepresentasikan tutor sebaya. Kelas ini memiliki hak untuk membaut sesi baru, mengedit sesi, dan menghapus sesi.* |
 
#### Diagram Kelas
 
<p align="center">
<img alt="Class Diagram UC11" src="./assets/diagram/diagram-uc11.png" width="70%">
</p>
<p align="center">
<i>Gambar 16. Diagram Kelas Use Case UC11</i>
</p>
<br>
 
| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C04* | *Session* | *sessionId* | *getSessionId()* |
| *C13* | *SessionControl* | *sessionHistory* | *deleteSession()* |
| *C07* | *SessionHistory* | *oncomingSession* | *-* |
| *C18* | *HostSessionPage* | *-* | *-* |
| *C02* | *Mentor* | *listSession* | *-* |


### 5.2.12 Use Case UC12
 
**Nama Use Case:** *Mengedit Sesi*
 
#### Identifikasi Kelas
 
| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C04* | *Session* | *Kelas yang merepresentasikan sesi belajar yang menyimpan atribut seperti topik materi, jadwal, kapasitas, daftar peserta, dan status sesi* |
| *C13* | *SessionControl* | *Kelas pengontrol yang menangani tabrakan jadwal, menjalankan algoritma matchmaking, dan memproses pendaftaran atau pembuatan sesi.* |
| *C07* | *SessionHistory* | *Kelas yang menyimpan kumpulan riwayat sesi milik seorang pengguna dengan mengelompokkannya berdasarkan status (Berlangsung, Terlaksana, Tidak Terlaksana).* |
| *C18* | *HostSessionPage* | *Kelas turunan dari SessionPage sebagai tempat Mentor dapat melakukan pembaruan data atau penghapusan.* |
| *C02* | *Mentor* | *Kelas turunan dari User yang merepresentasikan tutor sebaya. Kelas ini memiliki hak untuk membaut sesi baru, mengedit sesi, dan menghapus sesi.* |
 
#### Diagram Kelas
 
<p align="center">
<img alt="Class Diagram UC12" src="./assets/diagram/diagram-uc12.png" width="70%">
</p>
<p align="center">
<i>Gambar 17. Diagram Kelas Use Case UC12</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C04* | *Session* | *sessionTitle, description, preference, schedule* | *editTitle(), editDescription(), editPreference(), editSchedule()* |
| *C13* | *SessionControl* | *session* | *editSession()* |
| *C07* | *SessionHistory* | *oncomingSession* | *updateOncomingSession()* |
| *C18* | *HostSessionPage* | *-* | *-* |
| *C02* | *Mentor* | *listsession* | *-* |



### 5.2.13 Use Case UC13
 
**Nama Use Case:** *Melihat Feedback Sesi*
 
#### Identifikasi Kelas
 
| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C02* | *Mentor* | *Kelas turunan dari User yang merepresentasikan tutor sebaya. Kelas ini memiliki hak untuk melihat feedback dari sesi yang telah selesai.* |
| *C04* | *Session* | *Kelas yang merepresentasikan sesi belajar yang telah selesai dan memiliki feedback tertaut.* |
| *C06* | *Feedback* | *Kelas yang merepresentasikan rating dan ulasan yang diberikan oleh Mentee pada saat sebuah sesi belajar telah selesai.* |
| *C07* | *SessionHistory* | *Kelas yang menyimpan kumpulan riwayat sesi milik seorang pengguna, tempat Mentor mengakses sesi yang telah selesai.* |
| *C14* | *FeedbackControl* | *Kelas pengontrol yang mengambil data feedback dan rating untuk mentor berdasarkan ID sesi.* |
| *C18* | *HostSessionPage* | *Kelas turunan dari SessionPage yang menampilkan detail sesi sekaligus antarmuka untuk melihat daftar feedback.* |
 
#### Diagram Kelas
 
<p align="center">
<img alt="Class Diagram UC13" src="./assets/diagram/diagram-uc13.png" width="70%">
</p>
<p align="center">
<i>Gambar 18. Diagram Kelas Use Case UC13</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C02* | *Mentor* | *feedbackList* | *inherit dari User, viewFeedback()* |
| *C04* | *Session* | *idSession, status* | *getSessionID(), isCompleted()* |
| *C06* | *Feedback* | *idFeedback, rating, comment, date* | *getRating(), getComment(), getDate()* |
| *C07* | *SessionHistory* | *listSession* | *getCompletedSessions()* |
| *C14* | *FeedbackControl* | *-* | *retrieveFeedbackBySession()* |
| *C18* | *HostSessionPage* | *-* | *showFeedbackList()* |

---


### 5.2.14 Use Case UC14
 
**Nama Use Case:** *Membuka Beranda Utama*
 
#### Identifikasi Kelas
 
| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- 
| *C01* | *User* | *Kelas parent yang merepresentasikan pengguna aplikasi (Mentor, Mentee) yang menyimpan informasi akun dasar seperti profil, email university, kata sandi, preferensi materi, dan schedule.* |
| *C02* | *Mentor* | *Kelas turunan dari User yang merepresentasikan tutor sebaya. Mentor dapat melihat beranda utama yang menampilkan informasi sesi yang relevan bagi pengguna.* |
| *C03* | *Mentee* | *Kelas turunan dari User yang merepresentasikan siswa. Mentee dapat melihat jadwal sesi terdekat dan rekomendasi sesi berdasarkan preferensi.* |
| *C04* | *Session* | *Kelas yang merepresentasikan sesi belajar yang menyimpan atribut seperti topic materi, schedule, capacity, daftar peserta, dan status sesi.* |
| *C09* | *Preference* | *Kelas yang menyimpan pengaturan pengguna, seperti tag mata pelajaran, ketersediaan jadwal pada kalender, dan preferensi metode belajar (luring/daring) yang digunakan dalam proses matchmaking.* |
| *C11* | *Dashboard* | *Kelas antarmuka utama yang menampilkan rangkuman jadwal sesi terdekat, notifikasi, dan rekomendasi matchmaking untuk pengguna.* |
| *C13* | *SessionControl* | *Kelas pengontrol yang menangani pengambilan data sesi terdekat serta menjalankan algoritma matchmaking dengan mencocokkan data Session dan Preference untuk menghasilkan rekomendasi sesi.* |
 
#### Diagram Kelas
 
<p align="center">
<img alt="Class Diagram UC14" src="./assets/diagram/diagram-uc14.png" width="70%">
</p>
<p align="center">
<i>Gambar 19. Diagram Kelas Use Case UC14</i>
</p>
<br>

 
| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C01* | *User* | *idUser, email, passwordHash* | *isActive()* |
| *C02* | *Mentor* | *attendedSessions* | *inherit dari user* |
| *C03* | *Mentee* | *attendedSessions* | *inherit dari user* |
| *C04* | *Session* | *idSession, topic, schedule, format, capacity, userList, status* | *getSessionDetails()* |
| *C09* | *Preference* | *materialTag, availability, sessionTypePreference* | *getPreference()* |
| *C11* | *Dashboard* | *upcomingSessions, sessionRecommendation* | *showSession(), matchMakeSession(), searchSession(), showRecommendation()* |
| *C13* | *SessionControl* | *sessionList* | *getUpcomingSessions(), findRecommendation(), matchSession()* |



### 5.2.15 Use Case UC15
 
**Nama Use Case:** *Melihat Profil*
 
#### Identifikasi Kelas
 
| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C01* | *User* | *Kelas parent yang merepresentasikan pengguna aplikasi, yang datanya akan diambil untuk ditampilkan.* |
| *C09* | *Preference* | *Kelas yang menyimpan pengaturan pengguna, seperti tag mata pelajaran dan ketersediaan jadwal yang ditampilkan pada profil.* |
| *C10* | *Profile* | *Kelas yang merepresentasikan data identitas pengguna (nama, universitas, program studi, bio) yang dihubungkan dengan akun User.* |
| *C12* | *UserControl* | *Kelas pengontrol yang mengambil data identitas dan preferensi pengguna dari basis data berdasarkan ID pengguna.* |
| *C16* | *ProfilePage* | *Kelas antarmuka tempat pengguna dapat melihat informasi detail biodata diri sendiri atau orang lain.* |
 
#### Diagram Kelas
 
<p align="center">
<img alt="Class Diagram UC15" src="./assets/diagram/diagram-uc15.png" width="70%">
</p>
<p align="center">
<i>Gambar 20. Diagram Kelas Use Case UC15</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C01* | *User* | *idUser, username* | *getUserID()* |
| *C09* | *Preference* | *materialTag, availability, sessionFormatPreference* | *getPreferenceDetails()* |
| *C10* | *Profile* | *name, university, studyProgram, bio* | *getProfileData()* |
| *C12* | *UserControl* | *-* | *fetchUserProfile()* |
| *C16* | *ProfilePage* | *-* | *displayProfileData(), displayPreferenceData()* |


## 5.3 Diagram Kelas Keseluruhan

<p align="center">
<img alt="Class Diagram Keseluruhan" src="./assets/diagram/diagram-ucXX-Diagram Kelas Keseluruhan.png" width="70%">
</p>
<p align="center">
<i>Gambar 21. Diagram Kelas Keseluruhan</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C01* | *User* | *idUser, username, email, passwordHash* | *register(), login(), logout(), saveAccount(), getProfile(), openDashboard(), openSessionDashboard(), checkSchedule(), getUserID(), isActive(), createMessage(), sendMessage()* |
| *C02* | *Mentor* | *listSessionsMade, feedbackList* | *receiveFeedback(), viewFeedback()* |
| *C03* | *Mentee* | *attendedSessions, listSessionsJoined* | *giveFeedback(), checkCompletedSession()* |
| *C04* | *Session* | *idSession, topic, schedule, scheduledTime, format, capacity, userList, status, reasonNotConducted, groupChat* | *saveSession(), addParticipant(), checkCapacity(), getSessionDetails(), getSessionStatus(), setStatus(), getStatus(), isCompleted(), openGroupChat(), pushNotification(), getSessionID(), editTitle(), editDescription(), editPreference(), editSchedule()* |
| *C05* | *GroupChat* | *listChatMessage, listMentee, mentor* | *searchMessage(), displayMessage(), editMessage(), deleteMessage()* |
| *C06* | *Feedback* | *idFeedback, rating, comment, date* | *setRating(), setComment(), getRating(), getComment(), getDate()* |
| *C07* | *SessionHistory* | *historyList, completedSessions, cancelledSessions, oncomingSession* | *getArchivedSessions(), getCompletedSessions(), addSessionToHistory(), updateOncomingSession()* |
| *C08* | *ChatMessage* | *sender, timeStamp, text* | *getSender(), getTime(), getText()* |
| *C09* | *Preference* | *materialTag, availability, sessionFormatPreference* | *getPreference(), getPreferenceDetails(), updatePreference()* |
| *C10* | *Profile* | *name, university, studyProgram, bio* | *getProfileData(), updateProfile()* |
| *C11* | *Dashboard* | *upcomingSessions, sessionRecommendation, listSessions* | *showSession(), matchMakeSession(), searchSession(), showRecommendation(), checkSchedule()* |
| *C12* | *UserControl* | *-* | *authLogin(), validateEmail(), processRegistration(), saveProfile(), savePreference(), fetchUserProfile()* |
| *C13* | *SessionControl* | *sessionList, sessionHistory, session* | *processSessionCreation(), validateScheduleConflict(), validateCapacity(), processRegistration(), processSessionConfirmation(), updateSessionStatus(), fetchUserHistory(), getUpcomingSessions(), findRecommendation(), matchSession(), editSession(), cancelSession(), deleteSession()* |
| *C14* | *FeedbackControl* | *feedbackList* | *validateFeedback(), submitFeedback(), saveFeedback(), retrieveFeedbackBySession()* |
| *C15* | *LoginPage* | *-* | *showForm(), submitForm()* |
| *C16* | *ProfilePage* | *-* | *displayProfileData(), displayPreferenceData(), submitUpdate()* |
| *C17* | *SessionPage* | *confirmationPrompt* | *showSessionDetails(), showConfirmationPrompt(), submitConfirmation()* |
| *C18* | *HostSessionPage* | *-* | *showCreateForm(), submitSessionData(), showFeedbackList()* |
| *C19* | *ParticipantSessionPage* | *-* | *showSessionDetails(), submitJoinRequest()* |
| *C20* | *FeedbackForm* | *rating, comment* | *showForm(), submitFeedback()* |
| *C21* | *GroupChatPage* | *-* | *displayMessage()* |
| *C22* | *Notification* | *notificationId, title, content, timestamp, isRead* | *markAsRead(), showContent(), getTime(), openApp()* |
| *C23* | *PopUpNotification* | *-* | *markAsRead(), showContent(), getTime(), openApp()* |
| *C24* | *HistoryPage* | *historyList* | *displayHistoryList(), showEmptyState()* |

---
# BAB 6: Traceability
Matriks keterlacakan berikut mencocokkan setiap Kebutuhan Fungsional (KF), Use Case (UC), dan Kelas yang saling berkaitan dan mengimplementasikan kebutuhan tersebut.

| ID Kelas | ID Use Case | ID KF |
| :--- | :--- | :--- |
| *C01* | *UC01, UC02, UC05, UC06, UC07, UC08, UC09, UC14, UC15* | *KF01, KF02, KF03, KF04, KF10, KF11, KF18, KF12, KF09, KF07, KF19* |
| *C02* | *UC01, UC02, UC03, UC05, UC06, UC07, UC08, UC09, UC11, UC12, UC13, UC14, UC15* | *KF01, KF02, KF03, KF04, KF05, KF06, KF14, KF10, KF11, KF18, KF12, KF09, KF16, KF17, KF07, KF19* |
| *C03* | *UC01, UC02, UC04, UC05, UC06, UC07, UC08, UC09, UC10, UC14, UC15* | *KF01, KF02, KF03, KF04, KF07, KF08, KF13, KF10, KF11, KF18, KF12, KF09, KF15, KF19* |
| *C04* | *UC03, UC04, UC05, UC06, UC07, UC08, UC09, UC10, UC11, UC12, UC13, UC14* | *KF05, KF06, KF14, KF07, KF08, KF13, KF10, KF11, KF18, KF12, KF09, KF15, KF16, KF17* |
| *C05* | *UC08* | *KF12* |
| *C06* | *UC07, UC13* | *KF10, KF18* |
| *C07* | *UC05, UC06, UC10, UC11, UC12, UC13* | *KF10, KF11, KF18, KF15, KF16, KF17, KF06, KF14* |
| *C08* | *UC08* | *KF12* |
| *C09* | *UC02, UC04, UC14, UC15* | *KF03, KF04, KF07, KF08, KF13, KF19* |
| *C10* | *UC01, UC02, UC15* | *KF01, KF02, KF03, KF04, KF19* |
| *C11* | *UC01, UC04, UC06, UC09, UC14* | *KF01, KF02, KF07, KF08, KF13, KF11, KF18, KF09* |
| *C12* | *UC01, UC02, UC15* | *KF01, KF02, KF03, KF04, KF19* |
| *C13* | *UC03, UC04, UC05, UC06, UC10, UC11, UC12, UC14* | *KF05, KF06, KF14, KF07, KF08, KF13, KF10, KF11, KF18, KF15, KF16, KF17* |
| *C14* | *UC07, UC13* | *KF10, KF18* |
| *C15* | *UC01* | *KF01, KF02* |
| *C16* | *UC02, UC15* | *KF03, KF04, KF19* |
| *C17* | *UC03, UC04, UC05, UC10, UC11, UC12* | *KF05, KF06, KF14, KF07, KF08, KF13, KF10, KF15, KF16, KF17* |
| *C18* | *UC03, UC05, UC11, UC12, UC13* | *KF05, KF06, KF14, KF10, KF16, KF17, KF18* |
| *C19* | *UC04, UC05, UC10* | *KF07, KF08, KF13, KF10, KF15* |
| *C20* | *UC07, UC13* | *KF10, KF18* |
| *C21* | *UC08* | *KF12* |
| *C22* | *UC09* | *KF09* |
| *C23* | *UC09* | *KF09* |
| *C24* | *UC06* | *KF11, KF18* |

---