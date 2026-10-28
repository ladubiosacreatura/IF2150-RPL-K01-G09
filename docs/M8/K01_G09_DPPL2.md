<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 5
<br>
DESKRIPSI PERANCANGAN PERANGKAT LUNAK (DPPL)
</h1>
<br>

## PeerUP

### 

<img alt="Arsitektur MVC PeerUP" src="./assets/Logo_PeerUP.jpeg" width="30%">


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
| *A* | *Deskripsikan perubahan yang dilakukan dari dokumen sebelumnya pada dokumen ini. Jika tidak terdapat perubahan, harap kosongkan tabel.* |
| *B* |  |
| *C* |  |
| ... |  |

---


# BAB 1: Pendahuluan

## 1.1 Tujuan Penulisan Dokumen
Dokumen Deskripsi Perancangan Perangkat Lunak (DPPL) ini ditulis untuk mendefinisikan secara lengkap, rinci, dan terstruktur perancangan arsitektur, realisasi *use case*, perancangan kelas, perancangan rinci kelas (operasi, atribut, algoritma, dan *query*), perancangan antarmuka, serta matriks kerunutan dari perangkat lunak **PeerUP**. Dokumen ini ditujukan bagi:
1. **Tim Pengembang (Developer):** Sebagai acuan teknis utama dalam mengimplementasikan kode program, merancang basis data, dan mengintegrasikan antarmuka perangkat lunak.
2. **Penguji Perangkat Lunak (Tester / QA):** Sebagai dasar pengujian untuk memvalidasi apakah seluruh fitur dan skenario telah berjalan sesuai spesifikasi perancangan.
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
| *DPPL* | *Singkatan dari Deskripsi Perancangan Perangkat Lunak, yaitu dokumen yang merinci arsitektur, realisasi use case, spesifikasi rinci kelas, serta perancangan antarmuka perangkat lunak.* |
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
| *Aktor* | *AXX* | *XX menyatakan dua digit nomor urut aktor pada pemodelan use case (contoh: A01).* |
| *Use Case* | *UCXX* | *XX menyatakan dua digit nomor urut use case (contoh: UC01).* |
| *Kelas* | *CXX* | *XX menyatakan dua digit nomor urut kelas pada diagram kelas (contoh: C01).* |
| *Algoritma* | *Algo-CXX-YY* | *CXX menyatakan ID kelas dan YY menyatakan nomor urut algoritma pada kelas tersebut (contoh: Algo-C01-01).* |
| *Query* | *Q-CXX-YY* | *CXX menyatakan ID kelas dan YY menyatakan nomor urut query pada kelas tersebut (contoh: Q-C01-01).* |
| *Antarmuka* | *I-XX* | *XX menyatakan dua digit nomor urut rancangan layar antarmuka (contoh: I-01).* |

## 1.5 Referensi
1. Dokumentasi Perangkat Lunak *Topic Brainstorming* (Tugas 1), *Requirement Gathering* (Tugas 2), *Use Case & Scenario Use Case* (Tugas 3), *Class Diagram* (Tugas 4), serta *Spesifikasi Kebutuhan Perangkat Lunak (SKPL)* Kelompok G09 IF2150 Rekayasa Perangkat Lunak.
2. Mavin, A., Wilkinson, P., Harwood, A., & Novak, M. (2009). *Easy Approach to Requirements Syntax (EARS)*. 17th IEEE International Requirements Engineering Conference.
3. Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP).
4. Undang-Undang Republik Indonesia Nomor 1 Tahun 2024 tentang Perubahan Kedua atas UU ITE.

## 1.6 Deskripsi Umum Dokumen (Ikhtisar)
Dokumen DPPL ini dibagi menjadi tujuh bab utama:
- **BAB 1: Pendahuluan**, menjelaskan tujuan penulisan dokumen, lingkup masalah, definisi dan singkatan, aturan penomoran, referensi, serta ikhtisar dokumen.
- **BAB 2: Perancangan Arsitektur**, menguraikan rancangan lingkungan implementasi, *style/pattern* arsitektur acuan (MVC & *Client-Server*), identifikasi komponen/modul/subsistem, serta model arsitektur (*Development View* dan *Physical View*).
- **BAB 3: Realisasi Use Case**, menyajikan identifikasi kelas perancangan, *Sequence Diagram* (skenario normal dan alternatif), serta diagram kelas untuk setiap *use case* (`UC01`–`UC15`).
- **BAB 4: Diagram Kelas Keseluruhan**, memuat diagram kelas perancangan keseluruhan beserta tabel daftar kelas, atribut, dan operasinya.
- **BAB 5: Perancangan Rinci Kelas**, merinci spesifikasi operasi, atribut, algoritma (*pseudocode*), serta *query* basis data untuk seluruh kelas (`C01`–`C24`).
- **BAB 6: Perancangan Antarmuka**, menyajikan rancangan layar antarmuka (`I-01`–`I-16`) beserta spesifikasi objek antarmukanya.
- **BAB 7: Matriks Kerunutan**, memetakan keterlacakan antara setiap kelas perancangan (`C01`–`C24`) dengan *use case* yang diimplementasikannya.

---

# BAB 2: Perancangan Arsitektur

## 2.1 Rancangan Lingkungan Implementasi

| Komponen | Spesifikasi |
| :--- | :--- |
| *Sistem Operasi Pengembangan* | *Windows, Linux, atau macOS yang mendukung Node.js dan perkakas pengembangan web.* |
| *Sistem Operasi Client* | *Cross-platform, yaitu Windows, Linux, macOS, Android, dan iOS selama perangkat memiliki peramban web modern serta koneksi internet aktif.* |
| *Bahasa Pemrograman* | *TypeScript untuk kode frontend dan backend Next.js. SQL digunakan untuk definisi skema, constraint, query, dan kebijakan basis data yang diperlukan pada PostgreSQL/Supabase.* |
| *Framework & UI* | *Next.js berbasis React dengan Tailwind CSS untuk penyusunan tampilan antarmuka.* |
| *Runtime & Backend* | *Node.js untuk menjalankan lingkungan pengembangan lokal. Next.js Server Actions dan Route Handlers/API Routes menjadi titik masuk pemrosesan sisi server dan terintegrasi dengan Supabase Client SDK.* |
| *DBMS* | *PostgreSQL yang dikelola melalui layanan Supabase sebagai penyimpanan data persisten.* |
| *Authentication* | *Supabase Auth untuk registrasi, login, dan pengelolaan sesi autentikasi. Validasi domain email universitas dilakukan oleh logika aplikasi pada sisi tepercaya.* |
| *Real-time Communication* | *Supabase Realtime berbasis WebSocket untuk mendukung penerimaan pembaruan pesan secara real-time sesuai otorisasi pengguna.* |
| *Scheduled Task* | *Supabase Cron untuk memicu pekerjaan pengingat sesi 15 menit sebelum sesi dimulai dan pengelolaan masa retensi group chat. Dalam rancangan ini, pemicu Cron diteruskan ke endpoint internal Next.js yang dilindungi autentikasi server-side.* |
| *Server & Hosting* | *Pengembangan dan pengujian dapat dijalankan secara lokal menggunakan Node.js. Vercel direncanakan sebagai hosting aplikasi Next.js pada lingkungan deployment; keputusan ini harus disamakan dengan target deployment final tim.* |
| *Development Tools* | *Node.js dan package manager proyek; editor kode yang disepakati tim (misalnya Visual Studio Code); Git dan GitHub untuk kontrol versi; Supabase Dashboard/CLI untuk pengelolaan layanan; serta draw.io dan PlantUML untuk penyusunan diagram.* |
| *Filing System* | *Sistem berkas lokal pada sistem operasi pengembang digunakan untuk menyimpan kode sumber, konfigurasi, dan aset statis. Kode sumber dikelola melalui repositori Git. Data aplikasi yang persisten disimpan pada PostgreSQL/Supabase, bukan pada sistem berkas lokal server aplikasi.* |

## 2.2 Style/Pattern Arsitektur Acuan

### 2.2.1 Style/Pattern Arsitektur yang Dipilih
Perangkat lunak PeerUp akan memakai *style* **Model-View-Controller (MVC)** yang berjalan di atas **Client-Server Architecture**. *Style* *Client-Server* memisahkan sistem menjadi sisi *frontend* dan sisi *backend*, sementara *MVC* mengatur struktur pada kode perangkat lunaknya. Berikut adalah rincian peran setiap bagiannya.

1. **Client (Sisi Pengguna):**
   * Mewadahi lapisan **View**, yang bertanggung jawab menampilkan antarmuka, menyajikan informasi, dan menangkap *input* atau interaksi dari pengguna.
2. **Server (Sisi Pemrosesan & Basis Data):**
   * Mewadahi lapisan **Controller**, yang bertindak sebagai pengatur logika bisnis, memvalidasi aturan sistem, dan menjadi perantara antara *View* dengan *Model*.
   * Mewadahi lapisan **Model**, yang merepresentasikan struktur entitas data dan aturan penyimpanannya.
   * Mewadahi lapisan **Helper** dan **Integrasi Eksternal (Adapter)** untuk mendelegasikan tugas-tugas spesifik seperti validasi, autentikasi, serta tugas terjadwal (*cron*) tanpa membebani *Controller* utama.

### 2.2.2 Alasan Pemilihan Style/Pattern Arsitektur
Kombinasi *MVC* dan *Client-Server* dipilih karena sesuai dengan karakteristik teknis, pemodelan objek, dan pemenuhan spesifikasi Kebutuhan Non-Fungsional (KNF) pada dokumen PeerUP:

1. **Karakteristik Pengguna & Proses Bisnis:** Dua aktor utama (*Mentor* dan *Mentee*) akan banyak berinteraksi secara bersamaan (*real-time*) pada antarmuka dinamis (pencarian sesi, pembuatan sesi, ruang obrolan) yang semuanya mengakses dan mengubah keadaan data (sesi) yang sama. Pemisahan *Client-Server* memastikan data tetap tersinkronisasi secara terpusat.
2. **Keselarasan dengan Pemodelan Kelas:** Desain perangkat lunak pada dokumen menggunakan pola *Boundary-Controller-Entity* (BCE). Pola ini terpetakan secara langsung ke dalam arsitektur *View-Controller-Model*, sehingga mempermudah lokalisasi dampak apabila terjadi perubahan pada satu komponen (misalnya perubahan antarmuka tidak akan merusak algoritma *matchmaking*).
3. **Pemenuhan 5 Kebutuhan Non-Fungsional (KNF):**
   * **KNF01 (Keamanan Hashing) & KNF04 (Reliabilitas Validasi Email):** Pemisahan arsitektur menempatkan `Validator` dan integrasi autentikasi di sisi server (*Controller/Adapter*) sehingga sistem keamanan dan validasi tidak dapat dimanipulasi dari peramban *Client*.
   * **KNF02 (Waktu Respons Matchmaking < 3 detik) & KNF05 (Waktu Respons Riwayat < 3 detik):** Komputasi pencocokan algoritma dan penarikan data yang berat dilakukan secara efisien oleh *Controller* di server, sehingga *Client (View)* hanya bertugas merender hasil akhirnya saja.
   * **KNF03 (Reliabilitas Notifikasi 15 Menit):** Logika waktu (*Cron*) dipusatkan di sisi server, memastikan pemicu notifikasi otomatis berjalan $\ge 99\%$ meskipun *Client* sedang menutup aplikasinya.

### 2.2.3 Penerapan Pattern MVC pada Perangkat Lunak PeerUP

<p align="center">
<img alt="Arsitektur MVC PeerUP" src="./assets/diagram/M6_Diagram-MVC.jpg" width="80%">
</p>
<p align="center">
<i>Gambar 1. Penerapan Arsitektur MVC pada PeerUP</i>
</p>

Gambar 1 menjabarkan siklus interaksi komponen PeerUP di dalam struktur MVC. Aliran data dimulai ketika **View** menerima *input* dari pengguna dan mengirimkannya ke **Controller**. Selanjutnya, **Controller** mendelegasikan validasi aturan bisnis atau permintaan layanan *cloud* kepada lapisan **Helper / Integrasi Eksternal**, lalu menerima respons layanannya kembali. Setelah data divalidasi, **Controller** mengirimkan perintah untuk merekam atau mengubah data (*state*) pada **Model**. **Model** akan menyimpan perubahan tersebut ke dalam **Database** secara persisten, lalu mengembalikan status keberhasilan operasi kepada **Controller**. Pada tahap akhir, **Controller** merespons kembali ke **View** untuk memperbarui tampilan layar pengguna sesuai data terbaru.

### 2.2.4 Kaitan Teknologi Lingkungan Operasi dengan Style/Pattern Arsitektur
1. **Frontend (Next.js Client Components & Tailwind CSS):**
   Mewujudkan seluruh lapisan *View* yang berjalan di sisi *Client* (peramban web). *Frontend* menangani tampilan visual, pengisian formulir, dan penangkapan aksi pengguna secara independen dari logika di pusat data.
2. **Backend (Next.js Server Actions & API Routes):**
   Mewujudkan lapisan *Controller* yang berjalan terpusat di server. Logika bisnis dieksekusi di sisi *backend* untuk menangani pemeriksaan tabrakan jadwal, algoritma rekomendasi sesi (*matchmaking*), validasi batas kapasitas, dan verifikasi sebelum data diteruskan ke basis data.
3. **DBMS (Supabase PostgreSQL):**
   Layanan PostgreSQL pada Supabase menjadi titik penyimpanan persisten (*Database*) untuk seluruh entitas *Model* melalui aturan integritas relasional, mewakili keadaan (*state*) tunggal dari seluruh data aplikasi.
4. **Integrasi Eksternal:**
   Layanan infrastruktur pihak ketiga digolongkan sebagai *Adapter* (Pendukung) di dalam payung server pusat, yaitu:
   * **Supabase Auth:** Terhubung dengan `UserController` (via `AuthAdapter`) untuk registrasi pengguna dan validasi token sesi klien.
   * **Supabase Realtime:** Terhubung dengan `ChatController` (via `RealtimeAdapter`) menggunakan protokol WebSocket agar pembaruan pesan di *View* tampil secara instan (*real-time*).
   * **Supabase Cron:** Terhubung (via `CronAdapter`) untuk memicu `NotificationController` membuat pengingat otomatis, dan `ChatController` untuk membersihkan obrolan yang sudah mencapai batas retensi 48 jam.
   * **Vercel:** Berperan sebagai infrastruktur operasi (*hosting platform*) untuk menjalankan dan mendistribusikan aplikasi Next.js ke pengguna.

---

##   2.3 Identifikasi Komponen / Modul / Subsistem

Tabel 2.3. Identifikasi Komponen/Modul/Subsistem

| Nama Komponen/Modul/Subsistem | Kelas yang Dicakup | Jenis | Penjelasan |
| :--- | :--- | :--- | :--- |
| *LoginView* | *C15 (LoginPage)* | *View* | *Menampilkan formulir registrasi dan login, lalu meneruskan masukan ke UserController. Mendukung UC01.* |
| *ProfileView* | *C16 (ProfilePage)* | *View* | *Menampilkan profil, formulir pengubahan tag materi, ketersediaan waktu, dan format sesi. Mendukung UC02 dan UC15.* |
| *DashboardView* | *C11 (Dashboard)* | *View* | *Menampilkan sesi aktif terdekat, rekomendasi matchmaking, dan navigasi pencarian sesi. Mendukung UC04 dan UC14.* |
| *SessionView* | *C17 (SessionPage), C18 (HostSessionPage), C19 (ParticipantSessionPage)* | *View* | *Menampilkan detail sesi untuk Mentor (membuat, mengedit, dan menghapus sesi) maupun Mentee (bergabung dan membatalkan keikutsertaan). Mendukung UC03, UC04, UC05, UC10, UC11, UC12, dan UC13.* |
| *FeedbackView* | *C20 (FeedbackForm)* | *View* | *Menampilkan formulir rating dan ulasan setelah sesi selesai beserta opsi untuk melewati pengisian feedback. Mendukung UC07.* |
| *GroupChatView* | *C21 (GroupChatPage)* | *View* | *Menampilkan kotak pesan dan riwayat obrolan grup sesi. Mendukung UC08.* |
| *HistoryView* | *C24 (HistoryPage)* | *View* | *Menampilkan daftar riwayat sesi berstatus Selesai, Tidak Terlaksana, atau Dibatalkan. Mendukung UC06.* |
| *NotificationView* | *C23 (PopUpNotification)* | *View* | *Menampilkan notifikasi pengingat sesi serta menyediakan navigasi ke detail sesi terkait. Mendukung UC09.* |
| *UserController* | *C12 (UserControl)* | *Controller* | *Mengoordinasikan registrasi, login, pembaruan profil dan preferensi, serta pengambilan data profil pengguna. Mendukung UC01, UC02, dan UC15.* |
| *SessionController* | *C13 (SessionControl)* | *Controller* | *Mengoordinasikan pembuatan, pengubahan, dan penghapusan sesi; validasi jadwal; matchmaking; pendaftaran dan pembatalan keikutsertaan; konfirmasi keterlaksanaan; serta pengambilan riwayat sesi. Mendukung UC03, UC04, UC05, UC06, UC10, UC11, UC12, dan UC14.* |
| *FeedbackController* | *C14 (FeedbackControl)* | *Controller* | *Mengoordinasikan validasi dan penyimpanan ulasan serta pengambilan daftar feedback per sesi untuk Mentor. Mendukung UC07 dan UC13.* |
| *ChatController* | *— (Komponen tambahan M6; bukan kelas tersendiri)* | *Controller* | *Mengoordinasikan pengiriman pesan, pemeriksaan hak akses peserta, dan pengelolaan masa aktif ruang obrolan. Mendukung UC08.* |
| *NotificationController* | *— (Komponen tambahan M6; bukan kelas tersendiri)* | *Controller* | *Mengoordinasikan pembuatan notifikasi pengingat 15 menit sebelum sesi dimulai dan penyampaian hasilnya ke NotificationView. Mendukung UC09.* |
| *User* | *C01 (User), C02 (Mentor), C03 (Mentee)* | *Model* | *Merepresentasikan akun pengguna secara umum beserta spesialisasinya, yaitu Mentor dan Mentee, serta data dan perilaku domain terkait pengguna.* |
| *Profile* | *C10 (Profile)* | *Model* | *Merepresentasikan data identitas pengguna, termasuk nama, universitas, program studi, dan bio.* |
| *Preference* | *C09 (Preference)* | *Model* | *Menyimpan tag materi, ketersediaan waktu, dan preferensi metode belajar sebagai dasar matchmaking.* |
| *Session* | *C04 (Session)* | *Model* | *Merepresentasikan sesi belajar beserta topik, jadwal, format, kapasitas, peserta, dan statusnya.* |
| *SessionHistory* | *C07 (SessionHistory)* | *Model* | *Merepresentasikan kumpulan arsip sesi pengguna yang dikelompokkan berdasarkan statusnya.* |
| *GroupChat* | *C05 (GroupChat), C08 (ChatMessage)* | *Model* | *Merepresentasikan ruang obrolan sesi beserta kumpulan pesan di dalamnya.* |
| *Feedback* | *C06 (Feedback)* | *Model* | *Merepresentasikan data rating dan ulasan teks yang diberikan setelah sesi belajar selesai.* |
| *Notification* | *C22 (Notification)* | *Model* | *Merepresentasikan data pesan pengingat beserta isi, waktu, dan status terbaca.* |
| *Validator* | *— (Komponen tambahan M6; bukan kelas tersendiri)* | *Pendukung* | *Memvalidasi masukan dan aturan bisnis yang digunakan bersama, termasuk domain email universitas, kelengkapan preferensi, kapasitas peserta 1–20 orang, tabrakan jadwal, dan validitas feedback sesuai aturan sistem.* |
| *AuthAdapter* | *— (Komponen tambahan M6; bukan kelas tersendiri)* | *Integrasi Eksternal* | *Menghubungkan UserController dengan Supabase Auth untuk registrasi, login, dan pengelolaan sesi autentikasi. Pengelolaan kredensial ditangani oleh Supabase Auth.* |
| *RealtimeAdapter* | *— (Komponen tambahan M6; bukan kelas tersendiri)* | *Integrasi Eksternal* | *Menghubungkan ChatController dengan Supabase Realtime melalui WebSocket untuk pengiriman dan penerimaan pesan secara real-time.* |
| *CronAdapter* | *— (Komponen tambahan M6; bukan kelas tersendiri)* | *Integrasi Eksternal* | *Menerima pemicu terjadwal dari Supabase Cron dan meneruskannya ke NotificationController untuk pengingat sesi serta ChatController untuk pengelolaan masa aktif chat sesuai aturan retensi yang ditetapkan.* |
| *Database* | *— (Komponen penyimpanan M6; bukan kelas)* | *Penyimpanan Data* | *Menyediakan penyimpanan persisten bagi data Model menggunakan PostgreSQL yang dikelola melalui Supabase.* |

## 2.4 Model Arsitektur Perangkat Lunak

Untuk menggambarkan arsitektur perangkat lunak PeerUP dari sudut pandang yang berbeda, dipilih dua architectural view, yaitu **Development View** dan **Physical View**. Development View digunakan untuk menjelaskan organisasi statis modul dan dependensi antarkomponen, sedangkan Physical View digunakan untuk menggambarkan penempatan perangkat lunak pada lingkungan eksekusi dan jalur komunikasi antar-node.

### 2.4.1 Development View (Package Diagram)

Development View dipilih untuk memperlihatkan bagaimana 26 komponen arsitektur pada Tabel 2.3 dikelompokkan ke dalam paket-paket fungsional dari sudut pandang pengembangan perangkat lunak. Package Diagram digunakan untuk menggambarkan pengelompokan komponen menjadi paket Presentation / View, Application / Controller, Domain / Model, Shared Support, External Integration / Adapters, dan Persistence.


<p align="center">
<img alt="Devolopment View P/L PeerUp" src="./assets/diagram/M6_Diagram-Devolopment-View.png" width="80%">
</p>
<p align="center">
<i>Gambar 2. Development View (Package Diagram) pada Perangkat Lunak PeerUP</i>
</p>

Gambar 2 memperlihatkan pengorganisasian modul dan ketergantungan antarpaket. Garis putus-putus menunjukkan dependency, yaitu ketergantungan suatu paket terhadap layanan atau elemen yang disediakan paket lain. Paket Presentation / View bergantung pada Application / Controller untuk memproses aksi pengguna. Paket Application / Controller menggunakan Domain / Model untuk operasi domain serta Shared Support untuk validasi yang digunakan bersama. Application / Controller juga bergantung pada modul External Integration / Adapters dan Persistence sesuai kebutuhan layanan eksternal dan penyimpanan data.

Layanan Supabase ditampilkan sebagai sistem eksternal untuk memperjelas batas antara modul kode PeerUP dan layanan yang digunakannya. Nama komponen pada diagram diselaraskan dengan Tabel 2.3, sedangkan nama kelas dicantumkan sebagai pemetaan komponen.

## 2.4.2 Physical View (Deployment Diagram)

Physical View dipilih untuk menggambarkan penempatan perangkat lunak PeerUP pada perangkat pengguna, lingkungan hosting aplikasi, dan layanan cloud yang digunakan. Deployment Diagram memperlihatkan node, lingkungan eksekusi, artefak perangkat lunak, serta jalur komunikasi antarnode sesuai lingkungan operasi yang ditetapkan pada dokumen ini.

<p align="center">
<img alt="Physical View P/L PeerUp" src="./assets/diagram/M6_Diagram-Physical-View.png" width="80%">
</p>
<p align="center">
<i>Gambar 3. Physical View (Deployment Diagram) pada Perangkat Lunak PeerUP</i>
</p>

Gambar 3 menggambarkan tiga kelompok lingkungan operasi utama:

1. **Perangkat pengguna («device»):** menjalankan web browser sebagai lingkungan eksekusi untuk memuat antarmuka PeerUP dan menangani interaksi pengguna.
2. **Vercel Cloud Hosting:** menyediakan lingkungan deployment Next.js untuk menjalankan kode aplikasi sisi server, termasuk Server Actions dan Route Handlers yang diperlukan.
3. **Supabase Cloud Services:** menyediakan layanan autentikasi, komunikasi real-time, penjadwalan pekerjaan, serta PostgreSQL sebagai penyimpanan data persisten.

Komunikasi antara browser dan aplikasi Next.js dilakukan melalui HTTPS. Koneksi browser ke Supabase Realtime melalui WSS digunakan apabila client berlangganan pembaruan pesan secara langsung. Pekerjaan terjadwal dari Supabase Cron dapat memicu endpoint internal Next.js melalui HTTP/HTTPS sesuai mekanisme autentikasi yang ditetapkan. Akses data dilakukan melalui mekanisme Supabase yang digunakan dalam implementasi.

Dengan demikian, Development View menjelaskan organisasi dan dependensi modul, sedangkan Physical View menjelaskan penempatan serta komunikasi antarlingkungan eksekusi. Kedua view menggambarkan sistem PeerUP yang sama dari sudut pandang berbeda.

---

# BAB 3: Realisasi Use Case

## 3.1 Use Case Mendaftarkan Akun dan Autentikasi

**ID Use Case:** *UC01*  
**Nama Use Case:** *Mendaftarkan Akun dan Autentikasi*

### 3.1.1 Identifikasi Kelas

Kelas *LoginPage* pada SKPL direalisasikan sebagai komponen *LoginView* sesuai Tabel 2.3. Pengelolaan kredensial yang pada SKPL berada pada atribut `passwordHash` serta operasi `register()` dan `login()` di kelas *User* dipindahkan ke Supabase Auth melalui *AuthAdapter*, sehingga kata sandi tidak disimpan pada basis data aplikasi. Validasi domain email universitas yang pada SKPL berada di `UserControl.validateEmail()` dipindahkan ke kelas pendukung *Validator*. Data identitas yang diisi pada formulir registrasi (dibungkus sebagai `ProfileData`) disimpan sebagai *Profile*, dan setiap *User* yang terdaftar dapat berperan sebagai *Mentor* (saat membuka sesi belajar) maupun *Mentee* (saat bergabung ke dalam sesi belajar). Setelah autentikasi berhasil, pengguna diarahkan ke *DashboardView* yang pemuatan isinya dijelaskan pada UC14.

Tabel 3.1. Identifikasi Kelas Use Case UC01

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *LoginView* | *C15 (LoginPage)* |
| 2 | *DashboardView* | *C11 (Dashboard)* |
| 3 | *UserController* | *C12 (UserControl)* |
| 4 | *Validator* | *C12 (UserControl), khusus validasi domain email universitas* |
| 5 | *AuthAdapter* | *— (komponen integrasi eksternal, Tabel 2.3), menggantikan passwordHash, register(), dan login() pada C01 (User)* |
| 6 | *User* | *C01 (User)* |
| 7 | *Profile* | *C10 (Profile)* |
| 8 | *Mentor* | *C02 (Mentor)* |
| 9 | *Mentee* | *C03 (Mentee)* |

### 3.1.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC01 Skenario Normal" src="./assets/diagram/seq-uc01-normal.png" width="90%">
</p>
<p align="center">
<i>Gambar 3.1.1. Sequence Diagram UC01 - Skenario Normal</i>
</p>

Pengguna memilih opsi "Daftar" sehingga *LoginView* menampilkan formulir registrasi. Setelah pengguna mengisi email universitas, kata sandi, dan data profil lalu menekan "Simpan", *UserController* meminta *Validator* memastikan email menggunakan domain institusi universitas, kemudian mendaftarkan kredensial ke Supabase Auth melalui *AuthAdapter*. Identitas yang dikembalikan Supabase Auth digunakan sebagai `idUser` ketika *User* dan *Profile* disimpan ke basis data beserta rekaman persetujuan data. *LoginView* lalu mengarahkan pengguna ke halaman Login. Saat pengguna memasukkan email dan kata sandi lalu menekan "Masuk", *UserController* memverifikasi kredensial melalui *AuthAdapter*, mengambil data *User*, dan menyerahkan kendali ke *DashboardView* untuk menampilkan halaman beranda (UC14).

- **Skenario Alternatif 1: Email Universitas Tidak Valid**

<p align="center">
<img alt="Sequence Diagram UC01 Skenario Alternatif 1" src="./assets/diagram/seq-uc01-alt1.png" width="80%">
</p>
<p align="center">
<i>Gambar 3.1.2. Sequence Diagram UC01 - Email Universitas Tidak Valid</i>
</p>

Pengguna memasukkan email publik, misalnya `@gmail.com`, sehingga `validateEmail()` pada *Validator* bernilai `false`. *UserController* mengembalikan galat `INVALID_UNIVERSITY_EMAIL` tanpa memanggil *AuthAdapter* maupun menyimpan data ke basis data. *LoginView* menampilkan notifikasi "Harap gunakan email institusi universitas yang valid" dan mempertahankan isi formulir. Setelah pengguna mengirim ulang dengan email universitas, alur berlanjut seperti skenario normal.

### 3.1.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC01" src="./assets/diagram/diagram-uc01.png" width="70%">
</p>
<p align="center">
<i>Gambar 3.1.3. Diagram Kelas Mendaftarkan Akun dan Autentikasi</i>
</p>

## 3.2 Use Case Mengelola Preferensi Profil

**ID Use Case:** *UC02*  
**Nama Use Case:** *Mengelola Preferensi Profil*

### 3.2.1 Identifikasi Kelas

Kelas *ProfilePage* pada SKPL direalisasikan sebagai komponen *ProfileView* sesuai Tabel 2.3. Pemeriksaan kelengkapan pilihan preferensi yang pada SKPL tersirat di `UserControl.savePreference()` dipindahkan ke kelas pendukung *Validator*. Tag materi, format sesi, dan kalender ketersediaan waktu disimpan pada *Preference* (masukan formulir dibungkus sebagai `PreferenceData`), sedangkan *Profile* menyediakan data identitas yang ditampilkan pada halaman Profil sesuai UC15. Preferensi yang lengkap membuat `isComplete()` bernilai `true` sehingga dapat digunakan oleh *matchmaking* pada UC04 dan UC14.

Tabel 3.2. Identifikasi Kelas Use Case UC02

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *ProfileView* | *C16 (ProfilePage)* |
| 2 | *UserController* | *C12 (UserControl)* |
| 3 | *Validator* | *C12 (UserControl), khusus pemeriksaan kelengkapan preferensi* |
| 4 | *Preference* | *C09 (Preference)* |
| 5 | *Profile* | *C10 (Profile)* |
| 6 | *User* | *C01 (User)* |
| 7 | *Mentor* | *C02 (Mentor)* |
| 8 | *Mentee* | *C03 (Mentee)* |

### 3.2.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC02 Skenario Normal" src="./assets/diagram/seq-uc02-normal.png" width="80%">
</p>
<p align="center">
<i>Gambar 3.2.1. Sequence Diagram UC02 - Skenario Normal</i>
</p>

Pengguna membuka halaman "Profil", yang memuat data profil dan preferensi seperti pada UC15, lalu memilih "Edit Preferensi". *ProfileView* menampilkan antarmuka pemilihan tag materi, format sesi, dan kalender ketersediaan waktu. Setelah pengguna menentukan pilihannya dan menekan "Simpan", *UserController* meminta *Validator* memastikan seluruh pilihan telah terisi, lalu memperbarui *Preference* pengguna di basis data melalui `updatePreference()`. *ProfileView* menampilkan preferensi terbaru beserta notifikasi "Preferensi berhasil disimpan".

- **Skenario Alternatif 1: Menyimpan Preferensi Tanpa Memilih Preferensi**

<p align="center">
<img alt="Sequence Diagram UC02 Skenario Alternatif 1" src="./assets/diagram/seq-uc02-alt1.png" width="80%">
</p>
<p align="center">
<i>Gambar 3.2.2. Sequence Diagram UC02 - Menyimpan Preferensi Tanpa Memilih Preferensi</i>
</p>

Pengguna mengosongkan sebagian atau seluruh pilihan preferensi lalu menekan "Simpan". *Validator* mendeteksi pilihan yang masih kosong sehingga *UserController* mengembalikan galat `INCOMPLETE_PREFERENCE` dan menunda penyimpanan tanpa mengubah basis data. *ProfileView* menampilkan notifikasi "Silahkan Isi Semua Pilihan Preferensi" dan antarmuka pemilihan tetap terbuka.

### 3.2.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC02" src="./assets/diagram/diagram-uc02.png" width="70%">
</p>
<p align="center">
<i>Gambar 3.2.3. Diagram Kelas Mengelola Preferensi Profil</i>
</p>

## 3.3 Use Case Membuat Sesi Belajar

**ID Use Case:** *UC03*  
**Nama Use Case:** *Membuat Sesi Belajar*

### 3.3.1 Identifikasi Kelas

Seperti pada UC12, kelas *SessionPage* dan *HostSessionPage* direalisasikan dalam satu komponen *SessionView* sesuai Tabel 2.3, sedangkan validasi kapasitas (1–20 peserta) dan tabrakan jadwal yang pada SKPL berada di *SessionControl* dipindahkan ke kelas pendukung *Validator*. Masukan formulir dibungkus dalam kelas *SessionData* agar parameter operasi tetap ringkas. Mentor yang mengirim formulir dicatat sebagai host sesi melalui `idMentor`, dan sesi baru berstatus Terjadwal.

Tabel 3.3. Identifikasi Kelas Use Case UC03

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *SessionView* | *C17 (SessionPage), C18 (HostSessionPage)* |
| 2 | *SessionController* | *C13 (SessionControl)* |
| 3 | *Validator* | *C13 (SessionControl), khusus validasi kapasitas dan tabrakan jadwal* |
| 4 | *Session* | *C04 (Session)* |
| 5 | *SessionData* | *— (kelas data perancangan untuk masukan formulir pembuatan sesi)* |
| 6 | *User* | *C01 (User)* |
| 7 | *Mentor* | *C02 (Mentor)* |

### 3.3.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC03 Skenario Normal" src="./assets/diagram/seq-uc03-normal.png" width="80%">
</p>
<p align="center">
<i>Gambar 3.3.1. Sequence Diagram UC03 - Skenario Normal</i>
</p>

Mentor memilih menu "Buat Sesi Baru" sehingga *SessionView* menampilkan formulir topik, jadwal, format daring/luring, dan batas peserta. Saat Mentor menekan "Simpan", *SessionController* meminta *Validator* memeriksa kapasitas peserta, mengambil sesi Mentor pada rentang waktu yang sama, lalu meminta *Validator* memastikan tidak ada tabrakan jadwal. Setelah kedua pemeriksaan lolos, *Session* baru disimpan ke basis data dan *SessionView* menampilkan detail sesi beserta pesan "Sesi berhasil dibuat".

- **Skenario Alternatif 1: Kapasitas Peserta Melebihi Batas Maksimum**

<p align="center">
<img alt="Sequence Diagram UC03 Skenario Alternatif 1" src="./assets/diagram/seq-uc03-alt1.png" width="80%">
</p>
<p align="center">
<i>Gambar 3.3.2. Sequence Diagram UC03 - Kapasitas Peserta Melebihi Batas Maksimum</i>
</p>

Mentor memasukkan batas peserta 135 orang sehingga `validateCapacity()` bernilai `false`. *SessionController* mengembalikan galat `INVALID_CAPACITY` sebelum pemeriksaan jadwal dilakukan dan tidak menyimpan data. *SessionView* menampilkan pesan "Kapasitas maksimal adalah 20 orang". Setelah Mentor memperbaiki angka menjadi 9 orang dan menekan "Simpan", alur berlanjut seperti skenario normal.

- **Skenario Alternatif 2: Kapasitas Peserta Kurang dari Batas Minimum**

<p align="center">
<img alt="Sequence Diagram UC03 Skenario Alternatif 2" src="./assets/diagram/seq-uc03-alt2.png" width="80%">
</p>
<p align="center">
<i>Gambar 3.3.3. Sequence Diagram UC03 - Kapasitas Peserta Kurang dari Batas Minimum</i>
</p>

Mentor memasukkan batas peserta 0 orang sehingga `validateCapacity()` bernilai `false`. *SessionController* mengembalikan galat `INVALID_CAPACITY` tanpa menyimpan data, dan *SessionView* menampilkan pesan "Kapasitas minimum adalah 1 orang". Setelah Mentor memperbaiki angka menjadi 9 orang dan menekan "Simpan", alur berlanjut seperti skenario normal.

- **Skenario Alternatif 3: Waktu Sesi Bertabrakan**

<p align="center">
<img alt="Sequence Diagram UC03 Skenario Alternatif 3" src="./assets/diagram/seq-uc03-alt3.png" width="80%">
</p>
<p align="center">
<i>Gambar 3.3.4. Sequence Diagram UC03 - Waktu Sesi Bertabrakan</i>
</p>

Kapasitas lolos validasi, tetapi `hasScheduleConflict()` pada *Validator* bernilai `true` karena jadwal beririsan dengan sesi lain milik Mentor yang sama. *SessionController* mengembalikan galat `SCHEDULE_CONFLICT` tanpa menyimpan data, dan *SessionView* menampilkan pesan "Jadwal bertabrakan dengan sesi lain". Setelah Mentor mengubah jam atau tanggal dan menekan "Simpan", alur berlanjut seperti skenario normal.

### 3.3.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC03" src="./assets/diagram/diagram-uc03.png" width="70%">
</p>
<p align="center">
<i>Gambar 3.3.5. Diagram Kelas Membuat Sesi Belajar</i>
</p>

## 3.4 Use Case Mencari dan Bergabung ke Sesi

**ID Use Case:** *UC04*  
**Nama Use Case:** *Mencari dan Bergabung ke Sesi*

### 3.4.1 Identifikasi Kelas

Halaman "Cari Sesi" merupakan bagian dari *DashboardView* (realisasi *Dashboard* pada SKPL) yang menampilkan rekomendasi hasil *matchmaking*, sedangkan *ParticipantSessionPage* direalisasikan sebagai bagian dari *SessionView* sesuai Tabel 2.3. Algoritma *matchmaking* tetap berada di *SessionController* dan memakai *Preference* Mentee, sama dengan UC14. Pemeriksaan slot yang pada SKPL berada di `SessionControl.validateCapacity()` dan `Session.checkCapacity()` direalisasikan melalui `checkCapacity()` pada *Session*. *SessionHistory* tidak diperbarui secara eksplisit karena daftar sesi mendatang diturunkan langsung dari data peserta *Session*.

Tabel 3.4. Identifikasi Kelas Use Case UC04

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *DashboardView* | *C11 (Dashboard)* |
| 2 | *SessionView* | *C17 (SessionPage), C19 (ParticipantSessionPage)* |
| 3 | *SessionController* | *C13 (SessionControl)* |
| 4 | *Preference* | *C09 (Preference)* |
| 5 | *Session* | *C04 (Session), C07 (SessionHistory)* |
| 6 | *User* | *C01 (User)* |
| 7 | *Mentee* | *C03 (Mentee)* |

### 3.4.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC04 Skenario Normal" src="./assets/diagram/seq-uc04-normal.png" width="90%">
</p>
<p align="center">
<i>Gambar 3.4.1. Sequence Diagram UC04 - Skenario Normal</i>
</p>

Mentee membuka halaman "Cari Sesi", lalu *DashboardView* meminta rekomendasi ke *SessionController*. *SessionController* mengambil *Preference* Mentee, memastikan preferensinya lengkap, mengambil sesi terbuka yang belum dimulai, lalu mencocokkan irisan tag materi, jadwal kosong, dan format belajar melalui `matchSession()`. *DashboardView* menampilkan daftar rekomendasi. Setelah Mentee memilih sebuah sesi, *SessionView* menampilkan detailnya. Saat Mentee menekan "Gabung Sesi", *SessionController* memvalidasi ketersediaan slot melalui `checkCapacity()`, lalu menambahkan Mentee ke daftar partisipan sesi dan *SessionView* menampilkan notifikasi "Berhasil bergabung".

- **Skenario Alternatif 1: Tidak Ada Rekomendasi Sesi yang Cocok**

<p align="center">
<img alt="Sequence Diagram UC04 Skenario Alternatif 1" src="./assets/diagram/seq-uc04-alt1.png" width="80%">
</p>
<p align="center">
<i>Gambar 3.4.2. Sequence Diagram UC04 - Tidak Ada Rekomendasi Sesi yang Cocok</i>
</p>

`matchSession()` tidak menemukan irisan materi atau jadwal yang cocok sehingga *SessionController* mengembalikan daftar rekomendasi kosong. *DashboardView* menampilkan pesan "Belum ada sesi yang cocok dengan jadwalmu" beserta tombol "Ubah Preferensi". Saat tombol ditekan, Mentee diarahkan ke halaman pengaturan profil untuk mengubah ketersediaan waktu (UC02).

### 3.4.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC04" src="./assets/diagram/diagram-uc04.png" width="70%">
</p>
<p align="center">
<i>Gambar 3.4.3. Diagram Kelas Mencari dan Bergabung ke Sesi</i>
</p>

## 3.5 Use Case Mengonfirmasi Keterlaksanaan Sesi

**ID Use Case:** *UC05*  
**Nama Use Case:** *Mengonfirmasi Keterlaksanaan Sesi*

### 3.5.1 Identifikasi Kelas

Kelas *SessionPage* pada SKPL direalisasikan sebagai komponen *SessionView* sesuai Tabel 2.3. Operasi `processSessionConfirmation()` dan `updateSessionStatus()` pada *SessionControl* digabung menjadi satu operasi `processSessionConfirmation()` pada *SessionController*, yang menerima status keterlaksanaan beserta alasan opsional. Konfirmasi dapat dilakukan oleh Mentor maupun Mentee yang terlibat dalam sesi, sehingga pemeriksaan hak akses menggunakan `involves()` pada *Session*.

Tabel 3.5. Identifikasi Kelas Use Case UC05

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *SessionView* | *C17 (SessionPage)* |
| 2 | *SessionController* | *C13 (SessionControl)* |
| 3 | *Session* | *C04 (Session)* |
| 4 | *User* | *C01 (User)* |
| 5 | *Mentor* | *C02 (Mentor)* |
| 6 | *Mentee* | *C03 (Mentee)* |

### 3.5.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC05 Skenario Normal" src="./assets/diagram/seq-uc05-normal.png" width="80%">
</p>
<p align="center">
<i>Gambar 3.5.1. Sequence Diagram UC05 - Skenario Normal</i>
</p>

Pengguna membuka sesi yang waktunya telah berakhir, lalu *SessionView* menampilkan detail sesi beserta tombol "Terlaksana" dan "Tidak Terlaksana" karena status sesi belum dikonfirmasi. Saat pengguna memilih "Terlaksana", *SessionController* memastikan pengguna terlibat dalam sesi dan sesi memang menunggu konfirmasi, lalu mengubah status *Session* menjadi Selesai beserta waktu konfirmasi. *SessionView* kemudian menampilkan pesan "Status sesi berhasil diperbarui". Sesi berstatus Selesai dapat dilanjutkan dengan pengisian feedback pada UC07.

- **Skenario Alternatif 1: Sesi Ditandai Tidak Terlaksana**

<p align="center">
<img alt="Sequence Diagram UC05 Skenario Alternatif 1" src="./assets/diagram/seq-uc05-alt1.png" width="80%">
</p>
<p align="center">
<i>Gambar 3.5.2. Sequence Diagram UC05 - Sesi Ditandai Tidak Terlaksana</i>
</p>

Saat pengguna memilih "Tidak Terlaksana", *SessionView* menampilkan kolom alasan yang bersifat opsional. Setelah pengguna menekan "Kirim", *SessionController* menjalankan pemeriksaan yang sama dengan skenario normal, lalu mengubah status *Session* menjadi Tidak Terlaksana beserta alasan (jika diisi) dan waktu konfirmasi.

### 3.5.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC05" src="./assets/diagram/diagram-uc05.png" width="70%">
</p>
<p align="center">
<i>Gambar 3.5.3. Diagram Kelas Mengonfirmasi Keterlaksanaan Sesi</i>
</p>

## 3.6 Use Case Melihat Riwayat Sesi

**ID Use Case:** *UC06*  
**Nama Use Case:** *Melihat Riwayat Sesi*

### 3.6.1 Identifikasi Kelas

Kelas *HistoryPage* pada SKPL direalisasikan sebagai *HistoryView*. Pada tahap perancangan, *SessionHistory* tidak disimpan sebagai tabel tersendiri, melainkan dibentuk oleh *SessionController* dari daftar *Session* milik atau yang diikuti pengguna dengan status akhir Selesai, Tidak Terlaksana, atau Dibatalkan. *SessionHistory* kemudian mengelompokkan sesi tersebut berdasarkan statusnya untuk ditampilkan.

Tabel 3.6. Identifikasi Kelas Use Case UC06

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *HistoryView* | *C24 (HistoryPage)* |
| 2 | *SessionView* | *C17 (SessionPage)* |
| 3 | *SessionController* | *C13 (SessionControl)* |
| 4 | *Session* | *C04 (Session)* |
| 5 | *SessionHistory* | *C07 (SessionHistory)* |
| 6 | *User* | *C01 (User)* |
| 7 | *Mentor* | *C02 (Mentor)* |
| 8 | *Mentee* | *C03 (Mentee)* |

### 3.6.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC06 Skenario Normal" src="./assets/diagram/seq-uc06-normal.png" width="80%">
</p>
<p align="center">
<i>Gambar 3.6.1. Sequence Diagram UC06 - Skenario Normal</i>
</p>

Pengguna menekan "Riwayat", lalu *HistoryView* meminta riwayat ke *SessionController*. *SessionController* mengambil seluruh *Session* milik atau yang diikuti pengguna dengan status akhir Selesai, Tidak Terlaksana, atau Dibatalkan, lalu membentuk objek *SessionHistory* dari daftar tersebut. *HistoryView* menampilkan sesi yang dikelompokkan berdasarkan status melalui `getGroupedByStatus()`. Proses pemuatan dirancang selesai dalam waktu kurang dari 3 detik sesuai KNF05. Saat pengguna memilih salah satu sesi, *SessionView* menampilkan detail sesi tersebut, termasuk peran pengguna, materi, jadwal, dan status.

- **Skenario Alternatif 1: Riwayat Kosong**

<p align="center">
<img alt="Sequence Diagram UC06 Skenario Alternatif 1" src="./assets/diagram/seq-uc06-alt1.png" width="70%">
</p>
<p align="center">
<i>Gambar 3.6.2. Sequence Diagram UC06 - Riwayat Kosong</i>
</p>

Apabila pengguna belum memiliki sesi dengan status akhir, *SessionHistory* yang dibentuk bernilai kosong sehingga `isEmpty()` mengembalikan `true`. *HistoryView* menampilkan pesan "Belum ada sesi".

### 3.6.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC06" src="./assets/diagram/diagram-uc06.png" width="70%">
</p>
<p align="center">
<i>Gambar 3.6.3. Diagram Kelas Melihat Riwayat Sesi</i>
</p>

## 3.7 Use Case Memberikan Penilaian Sehabis Sesi

**ID Use Case:** *UC07*  
**Nama Use Case:** *Memberikan Penilaian Sehabis Sesi*

### 3.7.1 Identifikasi Kelas

Kelas *FeedbackForm* pada SKPL direalisasikan sebagai *FeedbackView*, sedangkan validasi isi feedback dipindahkan dari *FeedbackControl* ke kelas pendukung *Validator*. Sesuai deskripsi kelas pada SKPL dan UC13, feedback diberikan oleh Mentee terhadap sesi yang telah diikutinya. *FeedbackController* memastikan sesi telah selesai, Mentee terdaftar sebagai peserta, dan Mentee belum pernah memberikan feedback untuk sesi tersebut.

Tabel 3.7. Identifikasi Kelas Use Case UC07

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *SessionView* | *C17 (SessionPage)* |
| 2 | *FeedbackView* | *C20 (FeedbackForm)* |
| 3 | *FeedbackController* | *C14 (FeedbackControl)* |
| 4 | *Validator* | *C14 (FeedbackControl), khusus validasi feedback* |
| 5 | *Session* | *C04 (Session), C07 (SessionHistory)* |
| 6 | *Feedback* | *C06 (Feedback)* |
| 7 | *User* | *C01 (User)* |
| 8 | *Mentor* | *C02 (Mentor)* |
| 9 | *Mentee* | *C03 (Mentee)* |

### 3.7.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC07 Skenario Normal" src="./assets/diagram/seq-uc07-normal.png" width="90%">
</p>
<p align="center">
<i>Gambar 3.7.1. Sequence Diagram UC07 - Skenario Normal</i>
</p>

Mentee membuka sesi berstatus Selesai. *SessionView* meminta *FeedbackController* memeriksa kelayakan pemberian feedback, yaitu sesi telah selesai, Mentee terdaftar sebagai peserta, dan Mentee belum pernah memberikan feedback untuk sesi tersebut. Jika layak, *FeedbackView* menampilkan formulir rating dan catatan opsional. Saat Mentee menekan "Kirim", *FeedbackController* mengulang pemeriksaan kelayakan, meminta *Validator* memastikan rating telah diisi, lalu menyimpan *Feedback* baru ke basis data. *FeedbackView* menutup formulir dan menampilkan pesan "Terima kasih atas feedback Anda".

- **Skenario Alternatif 1: Pengguna Tidak Mengisi Form Feedback**

<p align="center">
<img alt="Sequence Diagram UC07 Skenario Alternatif 1" src="./assets/diagram/seq-uc07-alt1.png" width="80%">
</p>
<p align="center">
<i>Gambar 3.7.2. Sequence Diagram UC07 - Pengguna Tidak Mengisi Form Feedback</i>
</p>

Mentee menekan "Skip" tanpa mengisi formulir. *FeedbackView* hanya menutup formulir tanpa mengirim permintaan ke *FeedbackController*, sehingga feedback tidak disimpan dan status sesi tetap Selesai.

### 3.7.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC07" src="./assets/diagram/diagram-uc07.png" width="70%">
</p>
<p align="center">
<i>Gambar 3.7.3. Diagram Kelas Memberikan Penilaian Sehabis Sesi</i>
</p>

## 3.8 Use Case Berkomunikasi Menggunakan Grup Obrolan Sementara

**ID Use Case:** *UC08*  
**Nama Use Case:** *Berkomunikasi Menggunakan Grup Obrolan Sementara*

### 3.8.1 Identifikasi Kelas

Pada tahap perancangan, logika obrolan yang pada SKPL tersebar di kelas *User* (`createMessage()`, `sendMessage()`) dan *Session* (`openGroupChat()`) dipusatkan pada *ChatController*. Pengiriman pesan secara *real-time* ke anggota lain ditangani oleh *RealtimeAdapter* yang terhubung dengan Supabase Realtime melalui WebSocket. Masa aktif grup obrolan (48 jam setelah sesi selesai) dikelola oleh *CronAdapter*, yang memicu *ChatController* untuk menghapus pesan dan menandai grup obrolan berakhir.

Tabel 3.8. Identifikasi Kelas Use Case UC08

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *GroupChatView* | *C21 (GroupChatPage)* |
| 2 | *ChatController* | *— (komponen tambahan M6), menggantikan createMessage() dan sendMessage() pada C01 (User) serta openGroupChat() pada C04 (Session)* |
| 3 | *GroupChat* | *C05 (GroupChat)* |
| 4 | *ChatMessage* | *C08 (ChatMessage)* |
| 5 | *RealtimeAdapter* | *— (komponen integrasi eksternal, Tabel 2.3)* |
| 6 | *CronAdapter* | *— (komponen integrasi eksternal, Tabel 2.3)* |

### 3.8.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC08 Skenario Normal" src="./assets/diagram/seq-uc08-normal.png" width="90%">
</p>
<p align="center">
<i>Gambar 3.8.1. Sequence Diagram UC08 - Skenario Normal</i>
</p>

Pengguna membuka grup obrolan sebuah sesi melalui *GroupChatView*. *ChatController* mengambil *GroupChat* milik sesi tersebut, memastikan grup obrolan masih aktif dan pengguna adalah anggotanya, lalu memuat riwayat pesan dan mendaftarkan pengguna ke kanal *real-time* melalui *RealtimeAdapter*. Saat pengguna mengirim pesan, *ChatController* memeriksa ulang hak akses, menyimpan *ChatMessage* baru ke basis data, lalu menyiarkannya melalui *RealtimeAdapter* sehingga pesan langsung tampil di layar seluruh anggota grup.

- **Skenario Alternatif 1: Grup Obrolannya Sudah Berakhir**

<p align="center">
<img alt="Sequence Diagram UC08 Skenario Alternatif 1" src="./assets/diagram/seq-uc08-alt1.png" width="80%">
</p>
<p align="center">
<i>Gambar 3.8.2. Sequence Diagram UC08 - Grup Obrolan Sudah Berakhir</i>
</p>

Grup obrolan yang sesinya telah selesai lebih dari 48 jam sudah dibersihkan oleh pekerjaan terjadwal: pesannya dihapus dan statusnya ditandai berakhir. Ketika pengguna mencoba membukanya, `isActive()` bernilai `false` sehingga *ChatController* mengembalikan galat `CHAT_EXPIRED`. *GroupChatView* menampilkan pesan "Group chat untuk sesi ini telah berakhir" dan menonaktifkan kolom pengiriman pesan.

### 3.8.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC08" src="./assets/diagram/diagram-uc08.png" width="70%">
</p>
<p align="center">
<i>Gambar 3.8.3. Diagram Kelas Berkomunikasi Menggunakan Grup Obrolan Sementara</i>
</p>

## 3.9 Use Case Menerima Notifikasi Sesi

**ID Use Case:** *UC09*  
**Nama Use Case:** *Menerima Notifikasi Sesi*

### 3.9.1 Identifikasi Kelas

Pemicu waktu pengingat yang pada SKPL berada di `Session.pushNotification()` direalisasikan sebagai pekerjaan terjadwal Supabase Cron yang diterima *CronAdapter* dan diteruskan ke *NotificationController*. Notifikasi disimpan sebagai *Notification* di basis data, lalu dikirim ke perangkat pengguna melalui *RealtimeAdapter* agar pop-up dapat langsung tampil. *Dashboard* dan *PopUpNotification* pada SKPL direalisasikan sebagai *NotificationView*, sedangkan navigasi ke detail sesi ditangani *SessionView*.

Tabel 3.9. Identifikasi Kelas Use Case UC09

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *NotificationView* | *C23 (PopUpNotification), C11 (Dashboard)* |
| 2 | *SessionView* | *C17 (SessionPage)* |
| 3 | *CronAdapter* | *— (komponen integrasi eksternal, Tabel 2.3), menggantikan pemicu pushNotification() pada C04 (Session)* |
| 4 | *NotificationController* | *— (komponen tambahan M6)* |
| 5 | *Session* | *C04 (Session)* |
| 6 | *Notification* | *C22 (Notification)* |
| 7 | *RealtimeAdapter* | *— (komponen integrasi eksternal, Tabel 2.3)* |

### 3.9.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC09 Skenario Normal" src="./assets/diagram/seq-uc09-normal.png" width="90%">
</p>
<p align="center">
<i>Gambar 3.9.1. Sequence Diagram UC09 - Skenario Normal</i>
</p>

Supabase Cron memanggil endpoint internal setiap menit. *CronAdapter* memverifikasi bahwa permintaan berasal dari Cron, lalu meminta *NotificationController* mengirim pengingat. *NotificationController* mengambil sesi yang akan dimulai dalam 15 menit dan belum diingatkan, membuat *Notification* untuk setiap partisipan (Mentor dan Mentee), lalu mengirimkannya melalui *RealtimeAdapter* sehingga *NotificationView* menampilkan pop-up. Setelah semua partisipan sebuah sesi diberi notifikasi, sesi ditandai sudah diingatkan agar tidak terjadi notifikasi ganda dan sesi yang gagal dapat diproses ulang pada pemicu berikutnya (KNF03). Saat pengguna menekan notifikasi, notifikasi ditandai terbaca dan pengguna diarahkan ke halaman detail sesi.

SKPL tidak mendefinisikan skenario alternatif untuk UC09, sehingga hanya skenario normal yang dimodelkan.

### 3.9.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC09" src="./assets/diagram/diagram-uc09.png" width="70%">
</p>
<p align="center">
<i>Gambar 3.9.2. Diagram Kelas Menerima Notifikasi Sesi</i>
</p>

## 3.10 Use Case Membatalkan Keikutsertaan Sesi

**ID Use Case:** *UC10*  
**Nama Use Case:** *Membatalkan Keikutsertaan Sesi*

### 3.10.1 Identifikasi Kelas

Kelas *ParticipantSessionPage* dan *SessionPage* direalisasikan dalam komponen *SessionView* sesuai Tabel 2.3. Pembatalan dilakukan dengan menghapus Mentee dari daftar pendaftar *Session* melalui `removeParticipant()`. Kelas *SessionHistory* tidak diperbarui secara eksplisit karena daftar sesi mendatang Mentee diturunkan langsung dari data pendaftar sesi.

Tabel 3.10. Identifikasi Kelas Use Case UC10

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *SessionView* | *C17 (SessionPage), C19 (ParticipantSessionPage)* |
| 2 | *SessionController* | *C13 (SessionControl)* |
| 3 | *Session* | *C04 (Session), C07 (SessionHistory)* |
| 4 | *User* | *C01 (User)* |
| 5 | *Mentee* | *C03 (Mentee)* |

### 3.10.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC10 Skenario Normal" src="./assets/diagram/seq-uc10-normal.png" width="80%">
</p>
<p align="center">
<i>Gambar 3.10.1. Sequence Diagram UC10 - Skenario Normal</i>
</p>

Mentee membuka detail sesi yang telah didaftarinya, lalu *SessionView* menampilkan tombol "Batalkan Keikutsertaan" karena Mentee terdaftar dan sesi belum dimulai. Setelah Mentee mengonfirmasi dengan menekan "Ya, Batalkan", *SessionController* memastikan Mentee memang terdaftar dan sesi belum dimulai, lalu menghapus Mentee dari daftar pendaftar sesi di basis data. Karena keanggotaan grup obrolan mengikuti daftar peserta, akses Mentee ke grup obrolan sesi tersebut ikut tercabut. *SessionView* kemudian menampilkan pesan "Berhasil Membatalkan Keikutsertaan".

- **Skenario Alternatif 1: Mentee Tidak Jadi Membatalkan Sesi**

<p align="center">
<img alt="Sequence Diagram UC10 Skenario Alternatif 1" src="./assets/diagram/seq-uc10-alt1.png" width="70%">
</p>
<p align="center">
<i>Gambar 3.10.2. Sequence Diagram UC10 - Mentee Tidak Jadi Membatalkan Sesi</i>
</p>

Setelah pesan konfirmasi tampil, Mentee menekan "Kembali". *SessionView* hanya menutup pesan konfirmasi tanpa mengirim permintaan ke *SessionController*, sehingga Mentee tetap terdaftar pada sesi.

### 3.10.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC10" src="./assets/diagram/diagram-uc10.png" width="70%">
</p>
<p align="center">
<i>Gambar 3.10.3. Diagram Kelas Membatalkan Keikutsertaan Sesi</i>
</p>

## 3.11 Use Case Menghapus Sesi

**ID Use Case:** *UC11*  
**Nama Use Case:** *Menghapus Sesi*

### 3.11.1 Identifikasi Kelas

Seperti pada UC12, kelas *HostSessionPage* dan *SessionPage* direalisasikan dalam komponen *SessionView* sesuai Tabel 2.3. Penghapusan sesi dirancang sebagai *soft delete*: *Session* tidak dihapus dari basis data, melainkan statusnya diubah menjadi Dibatalkan melalui `markAsDeleted()`. Dengan demikian sesi tidak lagi ditampilkan sebagai sesi aktif, tetapi tetap muncul pada riwayat peserta dengan status Dibatalkan (UC06). Kelas *SessionHistory* tidak perlu diperbarui secara eksplisit karena riwayat diturunkan langsung dari status *Session*.

Tabel 3.11. Identifikasi Kelas Use Case UC11

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *SessionView* | *C17 (SessionPage), C18 (HostSessionPage)* |
| 2 | *SessionController* | *C13 (SessionControl)* |
| 3 | *Session* | *C04 (Session), C07 (SessionHistory)* |
| 4 | *User* | *C01 (User)* |
| 5 | *Mentor* | *C02 (Mentor)* |

### 3.11.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC11 Skenario Normal" src="./assets/diagram/seq-uc11-normal.png" width="80%">
</p>
<p align="center">
<i>Gambar 3.11.1. Sequence Diagram UC11 - Skenario Normal</i>
</p>

Mentor membuka detail sesi melalui *SessionView*, yang menampilkan tombol "Hapus Sesi" karena pengguna adalah host sesi. Setelah Mentor menekan tombol tersebut, *SessionView* menampilkan pesan konfirmasi. Saat Mentor menekan "Ya, Hapus", *SessionController* memastikan Mentor adalah pemilik sesi, lalu memanggil `markAsDeleted()` pada *Session* untuk mengubah statusnya di basis data. *SessionView* kemudian menutup konfirmasi dan menampilkan pesan "Sesi Berhasil Dihapus".

- **Skenario Alternatif 1: Mentor Tidak Jadi Menghapus Sesi**

<p align="center">
<img alt="Sequence Diagram UC11 Skenario Alternatif 1" src="./assets/diagram/seq-uc11-alt1.png" width="70%">
</p>
<p align="center">
<i>Gambar 3.11.2. Sequence Diagram UC11 - Mentor Tidak Jadi Menghapus Sesi</i>
</p>

Setelah pesan konfirmasi tampil, Mentor menekan "Batal". *SessionView* hanya menutup pesan konfirmasi tanpa mengirim permintaan ke *SessionController*, sehingga data sesi tidak berubah.

### 3.11.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC11" src="./assets/diagram/diagram-uc11.png" width="70%">
</p>
<p align="center">
<i>Gambar 3.11.3. Diagram Kelas Menghapus Sesi</i>
</p>

## 3.12 Use Case Mengedit Sesi

**ID Use Case:** *UC12*  
**Nama Use Case:** *Mengedit Sesi*

### 3.12.1 Identifikasi Kelas

Pada tahap perancangan, kelas *HostSessionPage* dan *SessionPage* direalisasikan dalam satu komponen *SessionView* sesuai Tabel 2.3, sedangkan validasi kapasitas dan tabrakan jadwal yang pada SKPL berada di *SessionControl* dipindahkan ke kelas pendukung *Validator*. Kelas *SessionHistory* tidak lagi diperbarui secara eksplisit karena daftar sesi mendatang diturunkan langsung dari data *Session* di basis data. Data masukan formulir dibungkus dalam kelas *SessionData* agar parameter operasi tetap ringkas.

Tabel 3.12. Identifikasi Kelas Use Case UC12

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *SessionView* | *C17 (SessionPage), C18 (HostSessionPage)* |
| 2 | *SessionController* | *C13 (SessionControl)* |
| 3 | *Validator* | *C13 (SessionControl), khusus validasi kapasitas dan tabrakan jadwal* |
| 4 | *Session* | *C04 (Session)* |
| 5 | *SessionData* | *— (kelas data perancangan untuk masukan formulir edit sesi)* |
| 6 | *User* | *C01 (User)* |
| 7 | *Mentor* | *C02 (Mentor)* |

### 3.12.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC12 Skenario Normal" src="./assets/diagram/seq-uc12-normal.png" width="90%">
</p>
<p align="center">
<i>Gambar 3.12.1. Sequence Diagram UC12 - Skenario Normal</i>
</p>

Mentor membuka detail sesi melalui *SessionView*, yang meminta data sesi ke *SessionController*. Setelah Mentor menekan "Edit Sesi", *SessionView* menampilkan formulir yang sudah terisi data sesi saat ini. Saat Mentor menekan "Simpan Perubahan", *SessionController* memastikan Mentor adalah pemilik sesi, meminta *Validator* memeriksa kapasitas (1–20 peserta) dan tabrakan jadwal terhadap sesi Mentor yang lain, lalu memperbarui *Session* di basis data dan mengembalikan data terbaru untuk ditampilkan bersama pesan "Data Sesi Berhasil Diperbarui".

- **Skenario Alternatif 1: Jadwal yang Direvisi Mentor Bertabrakan dengan Sesi Lain**

<p align="center">
<img alt="Sequence Diagram UC12 Skenario Alternatif 1" src="./assets/diagram/seq-uc12-alt1.png" width="90%">
</p>
<p align="center">
<i>Gambar 3.12.2. Sequence Diagram UC12 - Jadwal Bertabrakan dengan Sesi Lain</i>
</p>

*Validator* mendeteksi tabrakan jadwal sehingga *SessionController* menolak pembaruan dengan galat `SCHEDULE_CONFLICT` tanpa mengubah basis data. *SessionView* menampilkan peringatan dan mempertahankan isi formulir. Setelah Mentor menyesuaikan jadwal dan mengirim ulang, alur berlanjut seperti skenario normal.

- **Skenario Alternatif 2: Jumlah Partisipan yang Direvisi Mentor Lebih Sedikit dari Batas Minimum**

<p align="center">
<img alt="Sequence Diagram UC12 Skenario Alternatif 2" src="./assets/diagram/seq-uc12-alt2.png" width="90%">
</p>
<p align="center">
<i>Gambar 3.12.3. Sequence Diagram UC12 - Jumlah Partisipan di Bawah Batas Minimum</i>
</p>

*Validator* menyatakan kapasitas tidak valid sehingga *SessionController* mengembalikan galat `INVALID_CAPACITY` sebelum pemeriksaan jadwal dilakukan. *SessionView* menampilkan peringatan jumlah partisipan terlalu sedikit. Setelah Mentor memperbaiki batas peserta, alur berlanjut seperti skenario normal.

### 3.12.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC12" src="./assets/diagram/diagram-uc12.png" width="70%">
</p>
<p align="center">
<i>Gambar 3.12.4. Diagram Kelas Mengedit Sesi</i>
</p>

## 3.13 Use Case Melihat Feedback Sesi

**ID Use Case:** *UC13*  
**Nama Use Case:** *Melihat Feedback Sesi*

### 3.13.1 Identifikasi Kelas

Mentor membuka sesi yang telah selesai dari halaman riwayat, sehingga *HistoryView* dilibatkan sebagai titik awal navigasi. Daftar riwayat sudah dimuat pada UC06, sehingga kelas *SessionHistory* tidak dipanggil kembali pada use case ini. Pengambilan feedback ditangani oleh *FeedbackController*, yang juga memeriksa bahwa sesi telah selesai dan dimiliki oleh Mentor yang meminta.

Tabel 3.13. Identifikasi Kelas Use Case UC13

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *HistoryView* | *C24 (HistoryPage), C07 (SessionHistory)* |
| 2 | *SessionView* | *C18 (HostSessionPage)* |
| 3 | *SessionController* | *C13 (SessionControl)* |
| 4 | *FeedbackController* | *C14 (FeedbackControl)* |
| 5 | *Session* | *C04 (Session)* |
| 6 | *Feedback* | *C06 (Feedback)* |
| 7 | *User* | *C01 (User)* |
| 8 | *Mentor* | *C02 (Mentor)* |
| 9 | *Mentee* | *C03 (Mentee)* |

### 3.13.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC13 Skenario Normal" src="./assets/diagram/seq-uc13-normal.png" width="90%">
</p>
<p align="center">
<i>Gambar 3.13.1. Sequence Diagram UC13 - Skenario Normal</i>
</p>

Mentor memilih sesi berstatus Selesai pada *HistoryView*, lalu *SessionView* menampilkan detail sesi beserta tombol "Lihat Feedback". Saat tombol ditekan, *FeedbackController* memastikan sesi dimiliki Mentor tersebut dan telah selesai, lalu mengambil seluruh *Feedback* untuk sesi itu dari basis data. *SessionView* menampilkan daftar rating dan ulasan, atau keadaan kosong apabila belum ada Mentee yang memberikan feedback.

SKPL tidak mendefinisikan skenario alternatif untuk UC13, sehingga hanya skenario normal yang dimodelkan.

### 3.13.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC13" src="./assets/diagram/diagram-uc13.png" width="70%">
</p>
<p align="center">
<i>Gambar 3.13.2. Diagram Kelas Melihat Feedback Sesi</i>
</p>

## 3.14 Use Case Membuka Beranda Utama

**ID Use Case:** *UC14*  
**Nama Use Case:** *Membuka Beranda Utama*

### 3.14.1 Identifikasi Kelas

Verifikasi sesi aktif pengguna dilakukan oleh *UserController* melalui *AuthAdapter* yang terhubung ke Supabase Auth. Pengambilan sesi terdekat dan algoritma *matchmaking* tetap berada di *SessionController*, sedangkan *Dashboard* pada SKPL direalisasikan sebagai *DashboardView* yang hanya menampilkan hasil.

Tabel 3.14. Identifikasi Kelas Use Case UC14

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *DashboardView* | *C11 (Dashboard)* |
| 2 | *UserController* | *C12 (UserControl)* |
| 3 | *AuthAdapter* | *— (komponen integrasi eksternal, Tabel 2.3)* |
| 4 | *SessionController* | *C13 (SessionControl)* |
| 5 | *User* | *C01 (User)* |
| 6 | *Mentor* | *C02 (Mentor)* |
| 7 | *Mentee* | *C03 (Mentee)* |
| 8 | *Session* | *C04 (Session)* |
| 9 | *Preference* | *C09 (Preference)* |

### 3.14.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC14 Skenario Normal" src="./assets/diagram/seq-uc14-normal.png" width="90%">
</p>
<p align="center">
<i>Gambar 3.14.1. Sequence Diagram UC14 - Skenario Normal</i>
</p>

*DashboardView* meminta data pengguna yang sedang masuk ke *UserController*, yang memverifikasi sesi autentikasi melalui *AuthAdapter* lalu mengambil data *User* untuk pesan sapaan. Selanjutnya *SessionController* mengambil daftar sesi aktif terdekat milik atau yang diikuti pengguna. Untuk rekomendasi, *SessionController* mengambil *Preference* pengguna, memastikan preferensinya lengkap, mengambil sesi yang masih terbuka, lalu menjalankan `matchSession()` berdasarkan tag materi, ketersediaan waktu, dan format belajar. Proses ini dirancang selesai dalam waktu kurang dari 3 detik sesuai KNF02.

- **Skenario Alternatif 1: Preferensi Belum Diatur (Khusus Mentee)**

<p align="center">
<img alt="Sequence Diagram UC14 Skenario Alternatif 1" src="./assets/diagram/seq-uc14-alt1.png" width="90%">
</p>
<p align="center">
<i>Gambar 3.14.2. Sequence Diagram UC14 - Preferensi Belum Diatur</i>
</p>

Verifikasi sesi dan pemuatan sesi terdekat berjalan seperti skenario normal. Ketika `isComplete()` pada *Preference* bernilai `false`, *SessionController* tidak menjalankan *matchmaking* dan mengembalikan galat `PREFERENCE_NOT_SET`. *DashboardView* menampilkan pesan peringatan beserta tombol "Atur Preferensi" yang mengarah ke halaman Profil.

### 3.14.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC14" src="./assets/diagram/diagram-uc14.png" width="70%">
</p>
<p align="center">
<i>Gambar 3.14.3. Diagram Kelas Membuka Beranda Utama</i>
</p>

## 3.15 Use Case Melihat Profil

**ID Use Case:** *UC15*  
**Nama Use Case:** *Melihat Profil*

### 3.15.1 Identifikasi Kelas

Halaman profil digunakan untuk melihat profil sendiri maupun pengguna lain, sehingga *ProfileView* menerima `idUser` sebagai parameter. Data identitas dan tag materi disimpan pada kelas yang berbeda, yaitu *Profile* dan *Preference*, sehingga *UserController* menyediakan dua operasi pengambilan data.

Tabel 3.15. Identifikasi Kelas Use Case UC15

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *ProfileView* | *C16 (ProfilePage)* |
| 2 | *UserController* | *C12 (UserControl)* |
| 3 | *User* | *C01 (User)* |
| 4 | *Profile* | *C10 (Profile)* |
| 5 | *Preference* | *C09 (Preference)* |

### 3.15.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC15 Skenario Normal" src="./assets/diagram/seq-uc15-normal.png" width="80%">
</p>
<p align="center">
<i>Gambar 3.15.1. Sequence Diagram UC15 - Skenario Normal</i>
</p>

Pengguna menekan ikon Profil miliknya atau nama pengguna lain, lalu *ProfileView* meminta data profil ke *UserController*. *UserController* memastikan *User* dengan `idUser` tersebut ada, lalu mengambil *Profile* (nama, universitas, program studi, bio). *ProfileView* kemudian meminta *Preference* untuk menampilkan tag materi, lalu menampilkan seluruh data pada halaman Profil.

- **Skenario Alternatif 1: Profil Tidak Ditemukan**

<p align="center">
<img alt="Sequence Diagram UC15 Skenario Alternatif 1" src="./assets/diagram/seq-uc15-alt1.png" width="70%">
</p>
<p align="center">
<i>Gambar 3.15.2. Sequence Diagram UC15 - Profil Tidak Ditemukan</i>
</p>

Apabila `findById()` tidak menemukan pengguna karena ID tidak valid atau akun telah dihapus, *UserController* mengembalikan galat `USER_NOT_FOUND`. *ProfileView* menampilkan pesan "Profil pengguna tidak ditemukan" dan tidak melanjutkan pemuatan data profil maupun preferensi.

### 3.15.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC15" src="./assets/diagram/diagram-uc15.png" width="70%">
</p>
<p align="center">
<i>Gambar 3.15.3. Diagram Kelas Melihat Profil</i>
</p>

Sumber PlantUML untuk seluruh sequence diagram pada subbab 3.5–3.15 tersedia di folder `assets/diagram/src/`.

<br>

---

# BAB 4: Diagram Kelas Keseluruhan

## 4.1 Diagram Kelas

<p align="center">
<img alt="Class Diagram Keseluruhan" src="./assets/diagram/diagram-ucXX-Diagram Kelas Keseluruhan.png" width="70%">
</p>
<p align="center">
<i>Gambar 4.1. Diagram Kelas Perancangan Keseluruhan PeerUP</i>
</p>

Tabel 4.1. Daftar Kelas Perancangan Keseluruhan

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C01* | *User* | *idUser, username, email, activeSession* | *create(), findById(), register(), login(), logout(), saveAccount(), getProfile(), openDashboard(), openSessionDashboard(), checkSchedule(), getUserID(), getUsername(), getEmail(), isActive(), createMessage(), sendMessage()* |
| *C02* | *Mentor* | *listSessionsMade, feedbackList* | *createFrom(), getById(), getSessionsMade(), receiveFeedback(), viewFeedback()* |
| *C03* | *Mentee* | *attendedSessions, listSessionsJoined* | *createFrom(), getById(), getSessionsJoined(), giveFeedback(), checkCompletedSession()* |
| *C04* | *Session* | *idSession, idMentor, topic, description, schedule, scheduledTime, format, capacity, userList, status, reasonNotConducted, reminderSent, groupChat* | *saveSession(), getSessionById(), getSessionsByMentorInRange(), getAvailableSessions(), getUpcomingByUser(), getArchivedByUser(), findStartingBetween(), addParticipant(), removeParticipant(), checkCapacity(), isParticipant(), isOwnedBy(), involves(), hasStarted(), needsConfirmation(), getSessionDetails(), getSessionStatus(), setStatus(), getStatus(), isCompleted(), markAsDeleted(), markReminderSent(), openGroupChat(), pushNotification(), getSessionID(), getTopic(), getFormat(), getScheduledTime(), editTitle(), editDescription(), editPreference(), editSchedule()* |
| *C05* | *GroupChat* | *idGroupChat, idSession, listChatMessage, listMentee, mentor, active, expiresAt* | *findBySession(), findById(), getId(), isActive(), isMember(), getMessages(), searchMessage(), displayMessage(), editMessage(), deleteMessage()* |
| *C06* | *Feedback* | *idFeedback, idSession, idMentee, rating, comment, date* | *save(), getFeedbackBySession(), existsBySessionAndAuthor(), setRating(), setComment(), getRating(), getComment(), getDate()* |
| *C07* | *SessionHistory* | *idUser, historyList, completedSessions, cancelledSessions, oncomingSession* | *getArchivedSessions(), getCompletedSessions(), getGroupedByStatus(), isEmpty(), addSessionToHistory(), updateOncomingSession()* |
| *C08* | *ChatMessage* | *idMessage, idGroupChat, sender, timeStamp, text* | *create(), findByGroupChat(), getSender(), getTime(), getText()* |
| *C09* | *Preference* | *idUser, materialTag, availability, sessionFormatPreference* | *getPreferenceByUser(), getPreference(), getPreferenceDetails(), updatePreference(), isComplete(), getMaterialTag(), getAvailability(), getSessionFormatPreference(), getUserId()* |
| *C10* | *Profile* | *idUser, name, university, studyProgram, bio* | *create(), findByUser(), getProfileData(), updateProfile(), getName(), getUniversity(), getStudyProgram(), getBio()* |
| *C11* | *Dashboard* | *upcomingSessions, sessionRecommendation, listSessions, userControl, sessionControl* | *loadDashboard(), showGreeting(), showSession(), openSearchSession(), matchMakeSession(), searchSession(), showRecommendation(), showPreferenceWarning(), showEmptyState(), selectSession(), navigateToProfile(), checkSchedule()* |
| *C12* | *UserControl* | *authAdapter, validator* | *authLogin(), getCurrentUser(), validateEmail(), processRegistration(), saveProfile(), savePreference(), fetchUserProfile(), fetchUserPreference()* |
| *C13* | *SessionControl* | *sessionList, sessionHistory, session* | *processSessionCreation(), validateScheduleConflict(), validateCapacity(), processRegistration(), processSessionConfirmation(), updateSessionStatus(), fetchUserHistory(), getUpcomingSessions(), findRecommendation(), matchSession(), getSessionDetail(), editSession(), cancelSession(), deleteSession()* |
| *C14* | *FeedbackControl* | *feedbackList* | *checkFeedbackEligibility(), validateFeedback(), submitFeedback(), saveFeedback(), retrieveFeedbackBySession()* |
| *C15* | *LoginPage* | *formMode, emailInput, passwordInput, profileInput, warningMessage, userControl* | *showForm(), clickRegister(), submitForm(), showWarning(), redirectToLogin(), loadDashboard()* |
| *C16* | *ProfilePage* | *targetUserId, currentProfile, currentPreference, isEditingPreference, feedbackBanner, userControl* | *openProfile(), displayProfileData(), displayPreferenceData(), clickEditPreference(), showPreferenceForm(), submitUpdate(), showWarning(), showSuccessMessage(), showNotFound()* |
| *C17* | *SessionPage* | *confirmationPrompt, currentSession, reasonInput, isReasonFieldVisible, sessionControl* | *openSessionDetail(), showSessionDetails(), showConfirmationPrompt(), closeConfirmationPrompt(), clickConducted(), clickNotConducted(), showReasonField(), submitConfirmation(), showSuccessMessage(), showWarning()* |
| *C18* | *HostSessionPage* | *sessionFormData, sessionFeedbackList, isEditMode, feedbackControl* | *clickCreateSession(), showCreateForm(), submitSessionData(), clickEditSession(), showEditForm(), submitSessionUpdate(), clickDeleteSession(), confirmDelete(), cancelDelete(), clickViewFeedback(), showFeedbackList(), showEmptyFeedback()* |
| *C19* | *ParticipantSessionPage* | *isRegisteredParticipant, idMentee* | *showSessionDetails(), submitJoinRequest(), clickCancelParticipation(), confirmCancelParticipation(), clickBack()* |
| *C20* | *FeedbackForm* | *idSession, idMentee, rating, comment, isOpen, feedbackControl* | *showForm(), submitFeedback(), clickSkip(), closeForm(), showThankYou()* |
| *C21* | *GroupChatPage* | *idGroupChat, messageList, messageInput, isInputDisabled* | *openGroupChat(), displayMessages(), displayMessage(), sendMessage(), onMessageReceived(), showChatExpired(), disableMessageInput()* |
| *C22* | *Notification* | *notificationId, idUser, idSession, title, content, timestamp, isRead* | *create(), findById(), getNotificationsByUser(), markAsRead(), showContent(), getTime(), getNotificationId(), getSessionId(), getIsRead(), openApp()* |
| *C23* | *PopUpNotification* | *activeNotification, isVisible* | *onNotificationReceived(), showPopUp(), showContent(), getTime(), clickNotification(), markAsRead(), openApp()* |
| *C24* | *HistoryPage* | *historyList, selectedStatusFilter, sessionControl, sessionPage* | *openHistory(), displayHistoryList(), showEmptyState(), selectSession()* |

<br>

---

# BAB 5: Perancangan Rinci Kelas

Tabel 5.1. Daftar Kelas Perancangan dan Kelas Analisis Terkait

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
| :--- | :--- | :--- |
| 1 | *User* | *C01 (User)* |
| 2 | *Mentor* | *C02 (Mentor)* |
| 3 | *Mentee* | *C03 (Mentee)* |
| 4 | *Session* | *C04 (Session)* |
| 5 | *GroupChat* | *C05 (GroupChat)* |
| 6 | *Feedback* | *C06 (Feedback)* |
| 7 | *SessionHistory* | *C07 (SessionHistory)* |
| 8 | *ChatMessage* | *C08 (ChatMessage)* |
| 9 | *Preference* | *C09 (Preference)* |
| 10 | *Profile* | *C10 (Profile)* |
| 11 | *Dashboard (DashboardView)* | *C11 (Dashboard)* |
| 12 | *UserControl (UserController)* | *C12 (UserControl)* |
| 13 | *SessionControl (SessionController)* | *C13 (SessionControl)* |
| 14 | *FeedbackControl (FeedbackController)* | *C14 (FeedbackControl)* |
| 15 | *LoginPage (LoginView)* | *C15 (LoginPage)* |
| 16 | *ProfilePage (ProfileView)* | *C16 (ProfilePage)* |
| 17 | *SessionPage (SessionView)* | *C17 (SessionPage)* |
| 18 | *HostSessionPage (SessionView)* | *C18 (HostSessionPage)* |
| 19 | *ParticipantSessionPage (SessionView)* | *C19 (ParticipantSessionPage)* |
| 20 | *FeedbackForm (FeedbackView)* | *C20 (FeedbackForm)* |
| 21 | *GroupChatPage (GroupChatView)* | *C21 (GroupChatPage)* |
| 22 | *Notification* | *C22 (Notification)* |
| 23 | *PopUpNotification (NotificationView)* | *C23 (PopUpNotification)* |
| 24 | *HistoryPage (HistoryView)* | *C24 (HistoryPage)* |

## 5.1 Kelas User

**Nama Kelas:** *User*  
**ID Kelas:** *C01*

Tabel 5.1.1. Operasi Kelas User

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `create(idUser: string, username: string, email: string): Promise<User>` | `public` | Operasi CRUD (Create) pada kelas entitas untuk menyimpan rekaman akun pengguna baru ke dalam tabel `users` beserta persetujuan privasi data. |
| `findById(idUser: string): Promise<User \| null>` | `public` | Operasi getter statis (Read) untuk mencari dan mengambil objek entitas `User` dari basis data berdasarkan `idUser`. |
| `register(email: string, password: string): Promise<User>` | `public` | Meneruskan registrasi ke `UserControl`; kredensial ditangani oleh Supabase Auth melalui `AuthAdapter`. |
| `login(email: string, password: string): Promise<User>` | `public` | Meneruskan autentikasi ke `UserControl` / Supabase Auth. |
| `logout(): Promise<void>` | `public` | Mengakhiri sesi autentikasi aktif melalui `AuthAdapter`. |
| `saveAccount(): Promise<void>` | `public` | Operasi setter/persistensi (Update) untuk memperbarui data akun pengguna ke dalam basis data. |
| `getProfile(): Promise<Profile \| null>` | `public` | Operasi getter untuk mengembalikan objek `Profile` yang terkait dengan akun pengguna (`Profile.findByUser(this.idUser)`). |
| `openDashboard(): void` | `public` | Meminta navigasi ke beranda utama (`Dashboard`) setelah autentikasi berhasil. |
| `openSessionDashboard(): void` | `public` | Membuka tampilan beranda sesi pengguna. |
| `checkSchedule(session: Session): Promise<boolean>` | `public` | Memeriksa apakah jadwal sesi yang dipilih tidak berbenturan dengan jadwal ketersediaan pengguna. |
| `getUserID(): string` | `public` | Operasi getter untuk mengembalikan identitas unik pengguna (`idUser`). |
| `getUsername(): string` | `public` | Operasi getter untuk mengembalikan nama pengguna (`username`). |
| `getEmail(): string` | `public` | Operasi getter untuk mengembalikan alamat email institusi pengguna (`email`). |
| `isActive(): boolean` | `public` | Memeriksa apakah sesi autentikasi pengguna saat ini masih aktif. |
| `createMessage(chat: GroupChat, text: string): Promise<ChatMessage>` | `public` | Membentuk dan menyimpan objek `ChatMessage` baru dari pengguna untuk ruang obrolan sesi (`ChatMessage.create()`). |
| `sendMessage(chat: GroupChat, message: ChatMessage): Promise<void>` | `public` | Menambahkan pesan ke dalam ruang obrolan grup yang aktif dan memverifikasi keanggotaan pengguna. |

Tabel 5.1.2. Atribut Kelas User

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `idUser` | `protected` | `string` |
| `username` | `protected` | `string` |
| `email` | `protected` | `string` |
| `activeSession` | `protected` | `boolean` |

### 5.1.1 Algoritma/Query

**Nama Kelas:** *User*  
**Nama Operasi:** `create(idUser: string, username: string, email: string): Promise<User>`, `findById(idUser: string): Promise<User | null>`, dan `getUserID(): string`  
**ID Algoritma:** *Algo-C01-01*

```text
STATIC FUNCTION create(idUser: string, username: string, email: string): Promise<User>
    row <- AWAIT Database.executeQuery(Q-C01-01, [idUser, username, email])
    RETURN NEW User(row.id_user, row.username, row.email, TRUE)
END FUNCTION

STATIC FUNCTION findById(idUser: string): Promise<User | null>
    row <- AWAIT Database.executeQuery(Q-C01-02, [idUser])
    IF row IS NULL THEN
        RETURN NULL
    END IF
    RETURN NEW User(row.id_user, row.username, row.email, TRUE)
END FUNCTION

FUNCTION saveAccount(): Promise<void>
    AWAIT Database.executeQuery(Q-C01-03, [THIS.username, THIS.email, THIS.idUser])
END FUNCTION

FUNCTION getUserID(): string
    RETURN THIS.idUser
END FUNCTION

FUNCTION isActive(): boolean
    RETURN THIS.activeSession == TRUE
END FUNCTION
```

Tabel 5.1.3. Query Operasi Kelas User

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-C01-01* | `INSERT INTO users (id_user, username, email) VALUES ($1, $2, $3);` | Menyimpan data akun pengguna baru ke dalam tabel `users` (operasi Create pada `create`). |
| *Q-C01-02* | `SELECT * FROM users WHERE id_user = $1;` | Mengambil data pengguna berdasarkan `id_user` (operasi Read pada `findById`). |
| *Q-C01-03* | `UPDATE users SET username = $1, email = $2 WHERE id_user = $3;` | Memperbarui data akun pengguna pada tabel `users` (operasi Update pada `saveAccount`). |


## 5.2 Kelas Mentor

**Nama Kelas:** *Mentor*  
**ID Kelas:** *C02*

Tabel 5.2.1. Operasi Kelas Mentor

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `createFrom(user: User): Mentor` | `public` | Menginstansiasi objek spesialisasi `Mentor` dari objek induk `User`. |
| `getById(idMentor: string): Promise<Mentor \| null>` | `public` | Operasi getter statis (Read) untuk mengambil objek `Mentor` beserta daftar sesi yang dibuatnya dari basis data. |
| `getSessionsMade(): Promise<Session[]>` | `public` | Operasi getter untuk mengambil daftar seluruh sesi belajar yang dibuat oleh Mentor (`Session.getSessionsByMentor(this.idUser)`). |
| `receiveFeedback(feedback: Feedback): void` | `public` | Menambahkan objek `Feedback` yang terkait dengan sesi milik Mentor ke dalam koleksi `feedbackList`. |
| `viewFeedback(): Promise<Feedback[]>` | `public` | Operasi getter untuk mengambil dan mengembalikan daftar seluruh `Feedback` dari sesi-sesi yang diampu oleh Mentor. |

Tabel 5.2.2. Atribut Kelas Mentor

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `listSessionsMade` | `private` | `Session[]` |
| `feedbackList` | `private` | `Feedback[]` |

### 5.2.1 Algoritma/Query

**Nama Kelas:** *Mentor*  
**Nama Operasi:** `receiveFeedback(feedback: Feedback): void` dan `viewFeedback(): Promise<Feedback[]>`  
**ID Algoritma:** *Algo-C02-01*

```text
STATIC FUNCTION getById(idMentor: string): Promise<Mentor | null>
    row <- AWAIT Database.executeQuery(Q-C02-01, [idMentor])
    IF row IS NULL THEN
        RETURN NULL
    END IF
    RETURN NEW Mentor(row.id_user, row.username, row.email)
END FUNCTION

FUNCTION receiveFeedback(feedback: Feedback): void
    IF feedback IS NOT NULL THEN
        APPEND feedback TO THIS.feedbackList
    END IF
END FUNCTION

FUNCTION viewFeedback(): Promise<Feedback[]>
    rows <- AWAIT Database.executeQuery(Q-C02-02, [THIS.idUser])
    THIS.feedbackList <- MAP rows TO Feedback
    RETURN COPY(THIS.feedbackList)
END FUNCTION
```

Tabel 5.2.3. Query Operasi Kelas Mentor

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-C02-01* | `SELECT * FROM users WHERE id_user = $1;` | Mengambil data pengguna yang bertindak sebagai Mentor berdasarkan `id_user` (operasi Read pada `getById`). |
| *Q-C02-02* | `SELECT * FROM feedbacks WHERE id_mentor = $1;` | Mengambil daftar seluruh penilaian (*feedback*) untuk sesi-sesi yang dibuat oleh Mentor (operasi Read pada `viewFeedback`). |

## 5.3 Kelas Mentee

**Nama Kelas:** *Mentee*  
**ID Kelas:** *C03*

Tabel 5.3.1. Operasi Kelas Mentee

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `createFrom(user: User): Mentee` | `public` | Menginstansiasi objek spesialisasi `Mentee` dari objek induk `User`. |
| `getById(idMentee: string): Promise<Mentee \| null>` | `public` | Operasi getter statis (Read) untuk mengambil objek `Mentee` berdasarkan ID pengguna dari basis data. |
| `getSessionsJoined(): Promise<Session[]>` | `public` | Operasi getter untuk mengambil daftar sesi belajar yang diikuti oleh Mentee. |
| `giveFeedback(idSession: string, rating: number, comment?: string): Promise<Feedback>` | `public` | Memeriksa apakah sesi telah selesai dan dihadiri (`checkCompletedSession()`), lalu meneruskan pengiriman penilaian ke `FeedbackControl.submitFeedback()`. |
| `checkCompletedSession(idSession: string): Promise<boolean>` | `public` | Memeriksa pada basis data apakah sesi dengan `idSession` terdapat dalam daftar sesi yang diikuti Mentee dan berstatus `SELESAI`. |

Tabel 5.3.2. Atribut Kelas Mentee

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `attendedSessions` | `private` | `Session[]` |
| `listSessionsJoined` | `private` | `Session[]` |

### 5.3.1 Algoritma/Query

**Nama Kelas:** *Mentee*  
**Nama Operasi:** `getById(idMentee: string): Promise<Mentee | null>`, `giveFeedback(idSession: string, rating: number, comment?: string): Promise<Feedback>`, dan `checkCompletedSession(idSession: string): Promise<boolean>`  
**ID Algoritma:** *Algo-C03-01*

```text
STATIC FUNCTION getById(idMentee: string): Promise<Mentee | null>
    row <- AWAIT Database.executeQuery(Q-C03-01, [idMentee])
    IF row IS NULL THEN
        RETURN NULL
    END IF
    RETURN NEW Mentee(row.id_user, row.username, row.email)
END FUNCTION

FUNCTION giveFeedback(idSession: string, rating: number, comment?: string): Promise<Feedback>
    isCompleted <- AWAIT THIS.checkCompletedSession(idSession)
    IF NOT isCompleted THEN
        THROW Error("SESSION_NOT_COMPLETED_OR_NOT_ATTENDED")
    END IF
    RETURN AWAIT feedbackControl.submitFeedback(idSession, THIS.getUserID(), rating, comment)
END FUNCTION

FUNCTION checkCompletedSession(idSession: string): Promise<boolean>
    row <- AWAIT Database.executeQuery(Q-C03-02, [idSession, THIS.idUser])
    RETURN row IS NOT NULL
END FUNCTION
```

Tabel 5.3.3. Query Operasi Kelas Mentee

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-C03-01* | `SELECT * FROM users WHERE id_user = $1;` | Mengambil data pengguna yang bertindak sebagai Mentee berdasarkan `id_user` (operasi Read pada `getById`). |
| *Q-C03-02* | `SELECT * FROM session_participants WHERE id_session = $1 AND id_mentee = $2;` | Memeriksa apakah Mentee terdaftar sebagai peserta pada sesi tersebut (operasi Read pada `checkCompletedSession`). |

## 5.4 Kelas Session

**Nama Kelas:** *Session*  
**ID Kelas:** *C04*

Tabel 5.4.1. Operasi Kelas Session

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `saveSession(): Promise<Session>` | `public` | Operasi CRUD (Create/Update) untuk menyimpan objek sesi baru atau memperbarui perubahan data sesi ke dalam tabel `sessions`. |
| `getSessionById(idSession: string): Promise<Session \| null>` | `public` | Operasi getter statis (Read) untuk mengambil satu objek `Session` beserta daftar pesertanya dari basis data berdasarkan `idSession`. |
| `getSessionsByMentorInRange(idMentor: string, startTime: Date, endTime: Date): Promise<Session[]>` | `public` | Operasi getter statis (Read) untuk mengambil daftar sesi aktif milik seorang Mentor pada rentang waktu tertentu guna pemeriksaan konflik jadwal. |
| `getAvailableSessions(now: Date): Promise<Session[]>` | `public` | Operasi getter statis (Read) untuk mengambil seluruh kandidat sesi berstatus `TERJADWAL` yang belum dimulai dan masih memiliki slot kuota. |
| `getUpcomingByUser(idUser: string): Promise<Session[]>` | `public` | Operasi getter statis (Read) untuk mengambil daftar sesi aktif terdekat yang dimiliki (sebagai Mentor) atau diikuti (sebagai Mentee) oleh pengguna. |
| `getArchivedByUser(idUser: string): Promise<Session[]>` | `public` | Operasi getter statis (Read) untuk mengambil seluruh sesi milik atau yang diikuti pengguna dengan status akhir (`SELESAI`, `TIDAK_TERLAKSANA`, atau `DIBATALKAN`). |
| `findStartingBetween(startWindow: Date, endWindow: Date): Promise<Session[]>` | `public` | Operasi getter statis (Read) untuk mengambil sesi terjadwal yang akan dimulai dalam 15 menit ke depan dan belum dikirimkan pengingat notifikasi. |
| `addParticipant(idMentee: string): Promise<boolean>` | `public` | Operasi CRUD (Create) untuk menambahkan Mentee ke dalam daftar peserta sesi (`session_participants`) apabila kuota masih tersedia. |
| `removeParticipant(idMentee: string): Promise<boolean>` | `public` | Operasi CRUD (Delete) untuk menghapus Mentee dari daftar pendaftar sesi saat membatalkan keikutsertaan. |
| `checkCapacity(): boolean` | `public` | Memeriksa apakah jumlah peserta saat ini masih lebih kecil dari kapasitas maksimum sesi. |
| `isParticipant(idMentee: string): boolean` | `public` | Memeriksa apakah seorang Mentee terdaftar di dalam `userList` sesi ini. |
| `isOwnedBy(idMentor: string): boolean` | `public` | Memeriksa apakah pengguna dengan `idMentor` adalah host pembuat sesi ini. |
| `involves(idUser: string): boolean` | `public` | Memeriksa apakah pengguna terlibat dalam sesi ini, baik sebagai Mentor pembuat sesi maupun Mentee peserta sesi. |
| `hasStarted(): boolean` | `public` | Memeriksa apakah waktu mulai sesi (`scheduledTime`) telah terlewati. |
| `needsConfirmation(now: Date): boolean` | `public` | Memeriksa apakah waktu sesi telah berakhir namun statusnya masih `TERJADWAL` sehingga membutuhkan konfirmasi keterlaksanaan. |
| `getSessionDetails(): SessionData` | `public` | Operasi getter untuk mengembalikan bungkusan rincian data sesi (`SessionData`). |
| `getSessionStatus(): SessionStatus` | `public` | Operasi getter untuk mengembalikan status sesi saat ini. |
| `setStatus(status: SessionStatus, reason?: string): Promise<Session>` | `public` | Operasi setter (Update) untuk memperbarui status keterlaksanaan sesi beserta alasan opsional di basis data. |
| `getStatus(): SessionStatus` | `public` | Operasi getter untuk mengembalikan nilai atribut `status`. |
| `isCompleted(): boolean` | `public` | Memeriksa apakah status sesi bernilai `SELESAI`. |
| `markAsDeleted(): Promise<boolean>` | `public` | Operasi setter (*soft delete* / Update) untuk mengubah status sesi menjadi `DIBATALKAN` di basis data. |
| `markReminderSent(): Promise<boolean>` | `public` | Operasi setter (Update) untuk menandai bahwa notifikasi pengingat 15 menit untuk sesi ini telah dikirim. |
| `openGroupChat(): Promise<GroupChat \| null>` | `public` | Mengambil objek `GroupChat` yang terhubung dengan sesi ini (`GroupChat.findBySession(this.idSession)`). |
| `pushNotification(): Promise<void>` | `public` | Membuat pengingat `Notification` untuk seluruh partisipan sesi. |
| `getSessionID(): string` | `public` | Operasi getter untuk mengembalikan identitas unik sesi (`idSession`). |
| `getTopic(): string` | `public` | Operasi getter untuk mengembalikan topik materi sesi (`topic`). |
| `getFormat(): SessionFormat` | `public` | Operasi getter untuk mengembalikan format pelaksanaan sesi (`format`). |
| `getScheduledTime(): Date` | `public` | Operasi getter untuk mengembalikan waktu terjadwal sesi (`scheduledTime`). |
| `editTitle(title: string): void` | `public` | Operasi setter untuk memperbarui judul/topik sesi pada objek. |
| `editDescription(description: string): void` | `public` | Operasi setter untuk memperbarui deskripsi sesi pada objek. |
| `editPreference(format: SessionFormat, capacity: number): void` | `public` | Operasi setter untuk memperbarui format dan batas kapasitas sesi pada objek. |
| `editSchedule(schedule: Date, scheduledTime: Date): void` | `public` | Operasi setter untuk memperbarui tanggal dan waktu jadwal sesi pada objek. |

Tabel 5.4.2. Atribut Kelas Session

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `idSession` | `private` | `string` |
| `idMentor` | `private` | `string` |
| `topic` | `private` | `string` |
| `description` | `private` | `string` |
| `schedule` | `private` | `Date` |
| `scheduledTime` | `private` | `Date` |
| `format` | `private` | `SessionFormat` |
| `capacity` | `private` | `number` |
| `userList` | `private` | `User[]` |
| `status` | `private` | `SessionStatus` |
| `reasonNotConducted` | `private` | `string \| null` |
| `reminderSent` | `private` | `boolean` |
| `groupChat` | `private` | `GroupChat \| null` |

### 5.4.1 Algoritma/Query

**Nama Kelas:** *Session*  
**Nama Operasi:** `saveSession(): Promise<Session>`, `addParticipant(idMentee: string): Promise<boolean>`, `removeParticipant(idMentee: string): Promise<boolean>`, `setStatus(status: SessionStatus, reason?: string): Promise<Session>`, dan `markAsDeleted(): Promise<boolean>`  
**ID Algoritma:** *Algo-C04-01*

```text
FUNCTION saveSession(): Promise<Session>
    IF THIS.idSession IS NULL THEN
        row <- AWAIT Database.executeQuery(Q-C04-01, [
            THIS.idMentor, THIS.topic, THIS.description,
            THIS.schedule, THIS.scheduledTime, THIS.format, THIS.capacity
        ])
        THIS.idSession <- row.id_session
        THIS.status <- row.status
    ELSE
        AWAIT Database.executeQuery(Q-C04-02, [
            THIS.topic, THIS.description, THIS.schedule,
            THIS.scheduledTime, THIS.format, THIS.capacity, THIS.idSession
        ])
    END IF
    RETURN THIS
END FUNCTION

FUNCTION addParticipant(idMentee: string): Promise<boolean>
    IF THIS.status != SessionStatus.TERJADWAL OR NOT THIS.checkCapacity() THEN
        RETURN FALSE
    END IF
    IF THIS.isParticipant(idMentee) THEN
        RETURN FALSE
    END IF
    AWAIT Database.executeQuery(Q-C04-08, [THIS.idSession, idMentee])
    mentee <- AWAIT Mentee.getById(idMentee)
    APPEND mentee TO THIS.userList
    RETURN TRUE
END FUNCTION

FUNCTION removeParticipant(idMentee: string): Promise<boolean>
    AWAIT Database.executeQuery(Q-C04-09, [THIS.idSession, idMentee])
    REMOVE user FROM THIS.userList WHERE user.getUserID() == idMentee
    RETURN TRUE
END FUNCTION

FUNCTION setStatus(status: SessionStatus, reason?: string): Promise<Session>
    THIS.status <- status
    THIS.reasonNotConducted <- reason
    AWAIT Database.executeQuery(Q-C04-10, [status, reason, THIS.idSession])
    RETURN THIS
END FUNCTION

FUNCTION markAsDeleted(): Promise<boolean>
    THIS.status <- SessionStatus.DIBATALKAN
    AWAIT Database.executeQuery(Q-C04-11, [THIS.idSession])
    RETURN TRUE
END FUNCTION

FUNCTION checkCapacity(): boolean
    RETURN LENGTH(THIS.userList) < THIS.capacity AND THIS.capacity >= 1 AND THIS.capacity <= 20
END FUNCTION
```

Tabel 5.4.3. Query Operasi Kelas Session

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-C04-01* | `INSERT INTO sessions (id_mentor, topic, description, schedule, scheduled_time, format, capacity, status) VALUES ($1, $2, $3, $4, $5, $6, $7, 'TERJADWAL');` | Menyimpan sesi belajar baru ke dalam tabel `sessions` (operasi Create pada `saveSession`). |
| *Q-C04-02* | `UPDATE sessions SET topic = $1, description = $2, schedule = $3, scheduled_time = $4, format = $5, capacity = $6 WHERE id_session = $7;` | Memperbarui rincian data sesi yang diedit oleh Mentor (operasi Update pada `saveSession`). |
| *Q-C04-03* | `SELECT * FROM sessions WHERE id_session = $1;` | Mengambil data sesi berdasarkan `id_session` (operasi Read pada `getSessionById`). |
| *Q-C04-04* | `SELECT * FROM sessions WHERE id_mentor = $1 AND status = 'TERJADWAL' AND scheduled_time BETWEEN $2 AND $3;` | Mengambil sesi aktif milik Mentor pada rentang waktu tertentu untuk memeriksa konflik jadwal (operasi Read pada `getSessionsByMentorInRange`). |
| *Q-C04-05* | `SELECT * FROM sessions WHERE status = 'TERJADWAL' AND scheduled_time > $1;` | Mengambil kandidat sesi terbuka yang belum dimulai untuk proses *matchmaking* (operasi Read pada `getAvailableSessions`). |
| *Q-C04-06* | `SELECT * FROM sessions WHERE id_mentor = $1 AND status = 'TERJADWAL';` | Mengambil daftar sesi aktif terdekat milik atau yang diikuti pengguna (operasi Read pada `getUpcomingByUser`). |
| *Q-C04-07* | `SELECT * FROM sessions WHERE id_mentor = $1 AND status IN ('SELESAI', 'TIDAK_TERLAKSANA', 'DIBATALKAN');` | Mengambil riwayat arsip sesi berstatus akhir milik atau yang diikuti pengguna (operasi Read pada `getArchivedByUser`). |
| *Q-C04-08* | `INSERT INTO session_participants (id_session, id_mentee) VALUES ($1, $2);` | Menambahkan Mentee ke daftar partisipan sesi (operasi Create pada `addParticipant`). |
| *Q-C04-09* | `DELETE FROM session_participants WHERE id_session = $1 AND id_mentee = $2;` | Menghapus Mentee dari daftar partisipan sesi saat membatalkan keikutsertaan (operasi Delete pada `removeParticipant`). |
| *Q-C04-10* | `UPDATE sessions SET status = $1, reason_not_conducted = $2 WHERE id_session = $3;` | Memperbarui status keterlaksanaan sesi beserta alasan opsional (operasi Update pada `setStatus`). |
| *Q-C04-11* | `UPDATE sessions SET status = 'DIBATALKAN' WHERE id_session = $1;` | Menandai sesi sebagai `DIBATALKAN` (*soft delete*) saat dihapus oleh Mentor (operasi Update pada `markAsDeleted`). |
| *Q-C04-12* | `SELECT * FROM sessions WHERE status = 'TERJADWAL' AND reminder_sent = FALSE AND scheduled_time BETWEEN $1 AND $2;` | Mengambil sesi yang akan dimulai dalam 15 menit dan belum diingatkan (operasi Read pada `findStartingBetween`). |
| *Q-C04-13* | `UPDATE sessions SET reminder_sent = TRUE WHERE id_session = $1;` | Menandai bahwa pengingat notifikasi sesi telah dikirimkan (operasi Update pada `markReminderSent`). |

## 5.5 Kelas GroupChat

**Nama Kelas:** *GroupChat*  
**ID Kelas:** *C05*

Tabel 5.5.1. Operasi Kelas GroupChat

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `findBySession(idSession: string): Promise<GroupChat \| null>` | `public` | Operasi getter statis (Read) untuk mengambil objek `GroupChat` berdasarkan `idSession`. |
| `findById(idGroupChat: string): Promise<GroupChat \| null>` | `public` | Operasi getter statis (Read) untuk mengambil objek `GroupChat` berdasarkan `idGroupChat`. |
| `getId(): string` | `public` | Operasi getter untuk mengembalikan identitas unik ruang obrolan (`idGroupChat`). |
| `isActive(): boolean` | `public` | Memeriksa apakah ruang obrolan sementara masih aktif (belum melewati batas retensi 48 jam setelah sesi selesai). |
| `isMember(idUser: string): boolean` | `public` | Memeriksa apakah pengguna merupakan anggota ruang obrolan (Mentor pengampu atau Mentee yang terdaftar pada sesi). |
| `getMessages(): Promise<ChatMessage[]>` | `public` | Operasi getter (Read) untuk mengambil daftar seluruh pesan dalam ruang obrolan dari basis data secara kronologis. |
| `searchMessage(keyword: string): ChatMessage[]` | `public` | Menyaring pesan dalam riwayat obrolan berdasarkan kata kunci teks. |
| `displayMessage(): ChatMessage[]` | `public` | Mengembalikan daftar pesan terurut secara kronologis untuk dirender oleh antarmuka. |
| `editMessage(idMessage: string, text: string): Promise<boolean>` | `public` | Operasi setter (Update) untuk memperbarui isi teks pesan milik pengirim di dalam ruang obrolan aktif. |
| `deleteMessage(idMessage: string): Promise<boolean>` | `public` | Operasi CRUD (Delete) untuk menghapus pesan dari ruang obrolan atau membersihkan pesan saat masa retensi 48 jam berakhir. |

Tabel 5.5.2. Atribut Kelas GroupChat

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `idGroupChat` | `private` | `string` |
| `idSession` | `private` | `string` |
| `listChatMessage` | `private` | `ChatMessage[]` |
| `listMentee` | `private` | `Mentee[]` |
| `mentor` | `private` | `Mentor` |
| `active` | `private` | `boolean` |
| `expiresAt` | `private` | `Date \| null` |

### 5.5.1 Algoritma/Query

**Nama Kelas:** *GroupChat*  
**Nama Operasi:** `findBySession(idSession: string): Promise<GroupChat | null>`, `getMessages(): Promise<ChatMessage[]>`, dan `searchMessage(keyword: string): ChatMessage[]`  
**ID Algoritma:** *Algo-C05-01*

```text
STATIC FUNCTION findBySession(idSession: string): Promise<GroupChat | null>
    row <- AWAIT Database.executeQuery(Q-C05-01, [idSession])
    IF row IS NULL THEN
        RETURN NULL
    END IF
    RETURN NEW GroupChat(row.id_group_chat, row.id_session, row.is_active, row.expires_at)
END FUNCTION

FUNCTION getMessages(): Promise<ChatMessage[]>
    THIS.listChatMessage <- AWAIT ChatMessage.findByGroupChat(THIS.idGroupChat)
    RETURN THIS.displayMessage()
END FUNCTION

FUNCTION searchMessage(keyword: string): ChatMessage[]
    normalizedKeyword <- LOWERCASE(TRIM(keyword))
    RETURN FILTER THIS.listChatMessage WHERE
        normalizedKeyword IN LOWERCASE(message.getText())
END FUNCTION

FUNCTION displayMessage(): ChatMessage[]
    RETURN SORT COPY(THIS.listChatMessage) BY message.getTime() ASCENDING
END FUNCTION

FUNCTION isActive(): boolean
    RETURN THIS.active == TRUE AND (THIS.expiresAt IS NULL OR NOW() < THIS.expiresAt)
END FUNCTION
```

Tabel 5.5.3. Query Operasi Kelas GroupChat

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-C05-01* | `SELECT * FROM group_chats WHERE id_session = $1;` | Mengambil data ruang obrolan berdasarkan `id_session` (operasi Read pada `findBySession`). |
| *Q-C05-02* | `SELECT * FROM group_chats WHERE id_group_chat = $1;` | Mengambil data ruang obrolan berdasarkan `id_group_chat` (operasi Read pada `findById`). |
| *Q-C05-03* | `UPDATE chat_messages SET text = $1 WHERE id_message = $2;` | Memperbarui isi pesan pada ruang obrolan (operasi Update pada `editMessage`). |
| *Q-C05-04* | `DELETE FROM chat_messages WHERE id_message = $1;` | Menghapus pesan tertentu dari ruang obrolan (operasi Delete pada `deleteMessage`). |
| *Q-C05-05* | `UPDATE group_chats SET is_active = FALSE WHERE id_group_chat = $1;` | Menonaktifkan ruang obrolan sementara yang telah melewati masa aktif 48 jam setelah sesi selesai. |

## 5.6 Kelas Feedback

**Nama Kelas:** *Feedback*  
**ID Kelas:** *C06*

Tabel 5.6.1. Operasi Kelas Feedback

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `save(): Promise<Feedback>` | `public` | Operasi CRUD (Create) pada kelas entitas untuk menyimpan objek penilaian (`Feedback`) baru ke dalam tabel `feedbacks`. |
| `getFeedbackBySession(idSession: string): Promise<Feedback[]>` | `public` | Operasi getter statis (Read) untuk mengambil daftar seluruh `Feedback` yang terkait dengan suatu `idSession`. |
| `existsBySessionAndAuthor(idSession: string, idMentee: string): Promise<boolean>` | `public` | Operasi getter statis (Read) untuk memeriksa apakah Mentee sudah pernah memberikan *feedback* pada sesi tersebut. |
| `setRating(rating: number): void` | `public` | Operasi setter untuk menetapkan nilai *rating* dalam rentang integer 1–5. |
| `setComment(comment?: string): void` | `public` | Operasi setter untuk menetapkan teks ulasan atau komentar opsional. |
| `getRating(): number` | `public` | Operasi getter untuk mengembalikan nilai *rating*. |
| `getComment(): string` | `public` | Operasi getter untuk mengembalikan teks komentar ulasan. |
| `getDate(): Date` | `public` | Operasi getter untuk mengembalikan waktu pembuatan *feedback* (`date`). |

Tabel 5.6.2. Atribut Kelas Feedback

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `idFeedback` | `private` | `string` |
| `idSession` | `private` | `string` |
| `idMentee` | `private` | `string` |
| `rating` | `private` | `number` |
| `comment` | `private` | `string` |
| `date` | `private` | `Date` |

### 5.6.1 Algoritma/Query

**Nama Kelas:** *Feedback*  
**Nama Operasi:** `setRating(rating: number): void`, `save(): Promise<Feedback>`, dan `getFeedbackBySession(idSession: string): Promise<Feedback[]>`  
**ID Algoritma:** *Algo-C06-01*

```text
FUNCTION setRating(rating: number): void
    IF rating < 1 OR rating > 5 OR rating IS NOT INTEGER THEN
        THROW Error("INVALID_RATING")
    END IF
    THIS.rating <- rating
END FUNCTION

FUNCTION setComment(comment?: string): void
    THIS.comment <- comment
END FUNCTION

FUNCTION save(): Promise<Feedback>
    row <- AWAIT Database.executeQuery(Q-C06-01, [THIS.idSession, THIS.idMentee, THIS.rating, THIS.comment])
    THIS.idFeedback <- row.id_feedback
    THIS.date <- row.date
    RETURN THIS
END FUNCTION

STATIC FUNCTION getFeedbackBySession(idSession: string): Promise<Feedback[]>
    rows <- AWAIT Database.executeQuery(Q-C06-02, [idSession])
    RETURN MAP rows TO Feedback
END FUNCTION

STATIC FUNCTION existsBySessionAndAuthor(idSession: string, idMentee: string): Promise<boolean>
    row <- AWAIT Database.executeQuery(Q-C06-03, [idSession, idMentee])
    RETURN row IS NOT NULL
END FUNCTION
```

Tabel 5.6.3. Query Operasi Kelas Feedback

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-C06-01* | `INSERT INTO feedbacks (id_session, id_mentee, rating, comment) VALUES ($1, $2, $3, $4);` | Menyimpan penilaian dan ulasan baru dari Mentee ke tabel `feedbacks` (operasi Create pada `save`). |
| *Q-C06-02* | `SELECT * FROM feedbacks WHERE id_session = $1;` | Mengambil seluruh daftar *feedback* untuk suatu sesi (operasi Read pada `getFeedbackBySession`). |
| *Q-C06-03* | `SELECT * FROM feedbacks WHERE id_session = $1 AND id_mentee = $2;` | Memeriksa apakah Mentee telah mengirimkan *feedback* pada sesi tersebut (operasi Read pada `existsBySessionAndAuthor`). |

## 5.7 Kelas SessionHistory

**Nama Kelas:** *SessionHistory*  
**ID Kelas:** *C07*

Tabel 5.7.1. Operasi Kelas SessionHistory

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `getArchivedSessions(): Session[]` | `public` | Operasi getter untuk mengembalikan daftar seluruh sesi berstatus akhir (`SELESAI`, `TIDAK_TERLAKSANA`, `DIBATALKAN`) dalam riwayat pengguna. |
| `getCompletedSessions(): Session[]` | `public` | Operasi getter untuk mengembalikan daftar sesi yang berstatus `SELESAI`. |
| `getGroupedByStatus(): Record<SessionStatus, Session[]>` | `public` | Operasi getter untuk mengelompokkan daftar sesi riwayat berdasarkan status akhirnya (`SELESAI`, `TIDAK_TERLAKSANA`, `DIBATALKAN`) untuk ditampilkan oleh `HistoryPage`. |
| `isEmpty(): boolean` | `public` | Memeriksa apakah pengguna belum memiliki arsip sesi berstatus akhir (`historyList` kosong). |
| `addSessionToHistory(session: Session): void` | `public` | Menambahkan objek sesi berstatus akhir ke dalam koleksi riwayat dan mengelompokkannya ke daftar status terkait. |
| `updateOncomingSession(sessions: Session[]): void` | `public` | Operasi setter untuk memperbarui daftar sesi mendatang (`oncomingSession`). |

Tabel 5.7.2. Atribut Kelas SessionHistory

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `idUser` | `private` | `string` |
| `historyList` | `private` | `Session[]` |
| `completedSessions` | `private` | `Session[]` |
| `cancelledSessions` | `private` | `Session[]` |
| `oncomingSession` | `private` | `Session[]` |

### 5.7.1 Algoritma/Query

**Nama Kelas:** *SessionHistory*  
**Nama Operasi:** `addSessionToHistory(session: Session): void`, `getGroupedByStatus(): Record<SessionStatus, Session[]>`, dan `isEmpty(): boolean`  
**ID Algoritma:** *Algo-C07-01*

```text
FUNCTION addSessionToHistory(session: Session): void
    IF session IS NULL OR session.getSessionStatus() NOT IN {SELESAI, TIDAK_TERLAKSANA, DIBATALKAN} THEN
        RETURN
    END IF
    APPEND session TO THIS.historyList
    IF session.getSessionStatus() == SELESAI THEN
        APPEND session TO THIS.completedSessions
    END IF
    IF session.getSessionStatus() == DIBATALKAN THEN
        APPEND session TO THIS.cancelledSessions
    END IF
END FUNCTION

FUNCTION getGroupedByStatus(): Record<SessionStatus, Session[]>
    RETURN {
        SELESAI: THIS.completedSessions,
        TIDAK_TERLAKSANA: FILTER THIS.historyList WHERE session.getSessionStatus() == TIDAK_TERLAKSANA,
        DIBATALKAN: THIS.cancelledSessions
    }
END FUNCTION

FUNCTION isEmpty(): boolean
    RETURN LENGTH(THIS.historyList) == 0
END FUNCTION
```

## 5.8 Kelas ChatMessage

**Nama Kelas:** *ChatMessage*  
**ID Kelas:** *C08*

Tabel 5.8.1. Operasi Kelas ChatMessage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `create(idGroupChat: string, idSender: string, text: string): Promise<ChatMessage>` | `public` | Operasi CRUD (Create) pada kelas entitas untuk menyimpan pesan obrolan baru ke dalam tabel `chat_messages` dan mengembalikan objek `ChatMessage`. |
| `findByGroupChat(idGroupChat: string): Promise<ChatMessage[]>` | `public` | Operasi getter statis (Read) untuk mengambil daftar seluruh pesan pada suatu `GroupChat` secara kronologis. |
| `getSender(): User` | `public` | Operasi getter untuk mengembalikan objek pengguna pengirim pesan (`sender`). |
| `getTime(): Date` | `public` | Operasi getter untuk mengembalikan waktu pengiriman pesan (`timeStamp`). |
| `getText(): string` | `public` | Operasi getter untuk mengembalikan isi teks pesan (`text`). |

Tabel 5.8.2. Atribut Kelas ChatMessage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `idMessage` | `private` | `string` |
| `idGroupChat` | `private` | `string` |
| `sender` | `private` | `User` |
| `timeStamp` | `private` | `Date` |
| `text` | `private` | `string` |

### 5.8.1 Algoritma/Query

**Nama Kelas:** *ChatMessage*  
**Nama Operasi:** `create(idGroupChat: string, idSender: string, text: string): Promise<ChatMessage>` dan `getText(): string`  
**ID Algoritma:** *Algo-C08-01*

```text
STATIC FUNCTION create(idGroupChat: string, idSender: string, text: string): Promise<ChatMessage>
    row <- AWAIT Database.executeQuery(Q-C08-01, [idGroupChat, idSender, text])
    senderUser <- AWAIT User.findById(idSender)
    RETURN NEW ChatMessage(row.id_message, row.id_group_chat, senderUser, row.time_stamp, row.text)
END FUNCTION

STATIC FUNCTION findByGroupChat(idGroupChat: string): Promise<ChatMessage[]>
    rows <- AWAIT Database.executeQuery(Q-C08-02, [idGroupChat])
    RETURN MAP rows TO ChatMessage
END FUNCTION

FUNCTION getSender(): User
    RETURN THIS.sender
END FUNCTION

FUNCTION getTime(): Date
    RETURN THIS.timeStamp
END FUNCTION

FUNCTION getText(): string
    RETURN THIS.text
END FUNCTION
```

Tabel 5.8.3. Query Operasi Kelas ChatMessage

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-C08-01* | `INSERT INTO chat_messages (id_group_chat, id_sender, text) VALUES ($1, $2, $3);` | Menyimpan pesan obrolan baru ke dalam tabel `chat_messages` (operasi Create pada `create`). |
| *Q-C08-02* | `SELECT * FROM chat_messages WHERE id_group_chat = $1;` | Mengambil daftar riwayat pesan dalam sebuah ruang obrolan (operasi Read pada `findByGroupChat`). |

## 5.9 Kelas Preference

**Nama Kelas:** *Preference*  
**ID Kelas:** *C09*

Tabel 5.9.1. Operasi Kelas Preference

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `getPreferenceByUser(idUser: string): Promise<Preference \| null>` | `public` | Operasi getter statis (Read) untuk mengambil objek `Preference` milik pengguna tertentu berdasarkan `idUser` dari basis data. |
| `getPreference(): Preference` | `public` | Operasi getter untuk mengembalikan instans objek preferensi pengguna saat ini. |
| `getPreferenceDetails(): PreferenceData` | `public` | Operasi getter untuk mengembalikan bungkusan data tag materi, ketersediaan waktu, dan preferensi format sesi belajar. |
| `updatePreference(data: PreferenceData): Promise<Preference>` | `public` | Operasi setter/CRUD (Upsert/Update) untuk memperbarui atribut preferensi dan menyimpannya ke dalam tabel `preferences` di basis data. |
| `isComplete(): boolean` | `public` | Memeriksa apakah seluruh komponen preferensi (tag materi, ketersediaan waktu, dan format sesi) sudah diatur oleh pengguna sebagai prasyarat *matchmaking*. |
| `getMaterialTag(): string[]` | `public` | Operasi getter untuk mengembalikan daftar tag materi pelajaran (`materialTag`). |
| `getAvailability(): Availability[]` | `public` | Operasi getter untuk mengembalikan daftar jadwal ketersediaan waktu pengguna (`availability`). |
| `getSessionFormatPreference(): SessionFormat` | `public` | Operasi getter untuk mengembalikan preferensi format pelaksanaan sesi (`sessionFormatPreference`). |
| `getUserId(): string` | `public` | Operasi getter untuk mengembalikan ID pemilik preferensi (`idUser`). |

Tabel 5.9.2. Atribut Kelas Preference

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `idUser` | `private` | `string` |
| `materialTag` | `private` | `string[]` |
| `availability` | `private` | `Availability[]` |
| `sessionFormatPreference` | `private` | `SessionFormat` |

### 5.9.1 Algoritma/Query

**Nama Kelas:** *Preference*  
**Nama Operasi:** `getPreferenceByUser(idUser: string): Promise<Preference | null>`, `updatePreference(data: PreferenceData): Promise<Preference>`, dan `isComplete(): boolean`  
**ID Algoritma:** *Algo-C09-01*

```text
STATIC FUNCTION getPreferenceByUser(idUser: string): Promise<Preference | null>
    row <- AWAIT Database.executeQuery(Q-C09-01, [idUser])
    IF row IS NULL THEN
        RETURN NULL
    END IF
    RETURN NEW Preference(row.id_user, row.material_tag, row.availability, row.session_format_preference)
END FUNCTION

FUNCTION updatePreference(data: PreferenceData): Promise<Preference>
    IF data.materialTag IS EMPTY OR data.availability IS EMPTY OR data.sessionFormatPreference IS NULL THEN
        THROW Error("INCOMPLETE_PREFERENCE")
    END IF
    THIS.materialTag <- data.materialTag
    THIS.availability <- data.availability
    THIS.sessionFormatPreference <- data.sessionFormatPreference
    AWAIT Database.executeQuery(Q-C09-02, [
        THIS.materialTag, THIS.availability, THIS.sessionFormatPreference, THIS.idUser
    ])
    RETURN THIS
END FUNCTION

FUNCTION isComplete(): boolean
    RETURN LENGTH(THIS.materialTag) > 0 AND LENGTH(THIS.availability) > 0 AND THIS.sessionFormatPreference IS NOT NULL
END FUNCTION
```

Tabel 5.9.3. Query Operasi Kelas Preference

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-C09-01* | `SELECT * FROM preferences WHERE id_user = $1;` | Mengambil data preferensi belajar pengguna berdasarkan `id_user` (operasi Read pada `getPreferenceByUser`). |
| *Q-C09-02* | `UPDATE preferences SET material_tag = $1, availability = $2, session_format_preference = $3 WHERE id_user = $4;` | Memperbarui tag materi, ketersediaan waktu, dan format sesi pada tabel `preferences` (operasi Update pada `updatePreference`). |

## 5.10 Kelas Profile

**Nama Kelas:** *Profile*  
**ID Kelas:** *C10*

Tabel 5.10.1. Operasi Kelas Profile

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `create(idUser: string, data: ProfileData): Promise<Profile>` | `public` | Operasi CRUD (Create) pada kelas entitas untuk menyimpan data profil identitas pengguna baru ke dalam tabel `profiles`. |
| `findByUser(idUser: string): Promise<Profile \| null>` | `public` | Operasi getter statis (Read) untuk mengambil objek `Profile` berdasarkan `idUser` dari basis data. |
| `getProfileData(): ProfileData` | `public` | Operasi getter untuk mengembalikan data identitas profil pengguna (`name`, `university`, `studyProgram`, `bio`). |
| `updateProfile(data: ProfileData): Promise<Profile>` | `public` | Operasi setter/CRUD (Update) untuk memperbarui nama, universitas, program studi, dan bio pengguna di basis data. |
| `getName(): string` | `public` | Operasi getter untuk mengembalikan nama lengkap pengguna (`name`). |
| `getUniversity(): string` | `public` | Operasi getter untuk mengembalikan nama universitas pengguna (`university`). |
| `getStudyProgram(): string` | `public` | Operasi getter untuk mengembalikan program studi pengguna (`studyProgram`). |
| `getBio(): string` | `public` | Operasi getter untuk mengembalikan deskripsi singkat pengguna (`bio`). |

Tabel 5.10.2. Atribut Kelas Profile

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `idUser` | `private` | `string` |
| `name` | `private` | `string` |
| `university` | `private` | `string` |
| `studyProgram` | `private` | `string` |
| `bio` | `private` | `string` |

### 5.10.1 Algoritma/Query

**Nama Kelas:** *Profile*  
**Nama Operasi:** `create(idUser: string, data: ProfileData): Promise<Profile>`, `findByUser(idUser: string): Promise<Profile | null>`, dan `updateProfile(data: ProfileData): Promise<Profile>`  
**ID Algoritma:** *Algo-C10-01*

```text
STATIC FUNCTION create(idUser: string, data: ProfileData): Promise<Profile>
    row <- AWAIT Database.executeQuery(Q-C10-01, [
        idUser, TRIM(data.name), TRIM(data.university), TRIM(data.studyProgram), TRIM(data.bio)
    ])
    RETURN NEW Profile(row.id_user, row.name, row.university, row.study_program, row.bio)
END FUNCTION

STATIC FUNCTION findByUser(idUser: string): Promise<Profile | null>
    row <- AWAIT Database.executeQuery(Q-C10-02, [idUser])
    IF row IS NULL THEN
        RETURN NULL
    END IF
    RETURN NEW Profile(row.id_user, row.name, row.university, row.study_program, row.bio)
END FUNCTION

FUNCTION updateProfile(data: ProfileData): Promise<Profile>
    THIS.name <- TRIM(data.name)
    THIS.university <- TRIM(data.university)
    THIS.studyProgram <- TRIM(data.studyProgram)
    THIS.bio <- TRIM(data.bio)
    AWAIT Database.executeQuery(Q-C10-03, [THIS.name, THIS.university, THIS.studyProgram, THIS.bio, THIS.idUser])
    RETURN THIS
END FUNCTION
```

Tabel 5.10.3. Query Operasi Kelas Profile

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-C10-01* | `INSERT INTO profiles (id_user, name, university, study_program, bio) VALUES ($1, $2, $3, $4, $5);` | Menyimpan data identitas profil pengguna baru ke dalam tabel `profiles` saat registrasi (operasi Create pada `create`). |
| *Q-C10-02* | `SELECT * FROM profiles WHERE id_user = $1;` | Mengambil data profil identitas pengguna berdasarkan `id_user` (operasi Read pada `findByUser`). |
| *Q-C10-03* | `UPDATE profiles SET name = $1, university = $2, study_program = $3, bio = $4 WHERE id_user = $5;` | Memperbarui data identitas profil pengguna pada tabel `profiles` (operasi Update pada `updateProfile`). |

## 5.11 Kelas Dashboard

**Nama Kelas:** *Dashboard*  
**ID Kelas:** *C11*

Tabel 5.11.1. Operasi Kelas Dashboard

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `loadDashboard(): Promise<void>` | `public` | Memuat halaman beranda utama dengan memverifikasi pengguna aktif melalui `UserControl.getCurrentUser()`, mengambil sesi terdekat, dan memuat rekomendasi sesi melalui `SessionControl`. |
| `showGreeting(username: string): void` | `public` | Menampilkan pesan sapaan personal kepada pengguna yang sedang aktif pada bagian atas beranda. |
| `showSession(sessions: Session[]): void` | `public` | Merender daftar kartu sesi aktif terdekat (`upcomingSessions`) ke layar beranda. |
| `openSearchSession(): Promise<void>` | `public` | Membuka tampilan eksplorasi pencarian sesi dan meminta daftar rekomendasi *matchmaking* melalui `SessionControl.findRecommendation()`. |
| `matchMakeSession(preference: Preference, candidates: Session[]): Session[]` | `public` | Meneruskan pencocokan kandidat sesi terhadap preferensi Mentee melalui `SessionControl`. |
| `searchSession(criteria: SearchCriteria): Session[]` | `public` | Menyaring daftar sesi yang ditampilkan berdasarkan kata kunci topik atau filter format belajar. |
| `showRecommendation(sessions: Session[]): void` | `public` | Menampilkan daftar kartu rekomendasi sesi hasil *matchmaking* (`sessionRecommendation`) pada beranda. |
| `showPreferenceWarning(): void` | `public` | Menampilkan pesan peringatan beserta tombol "Atur Preferensi" apabila preferensi belajar Mentee belum diatur (`PREFERENCE_NOT_SET`). |
| `showEmptyState(message: string): void` | `public` | Menampilkan pesan keadaan kosong ("Belum ada sesi yang cocok dengan jadwalmu") beserta tombol "Ubah Preferensi" apabila tidak ada rekomendasi sesi yang cocok. |
| `selectSession(idSession: string): void` | `public` | Menangani aksi pengguna saat memilih salah satu kartu sesi dan mengarahkan ke `SessionPage.openSessionDetail(idSession)`. |
| `navigateToProfile(idUser: string): void` | `public` | Mengarahkan pengguna ke halaman pengaturan profil (`ProfilePage.openProfile(idUser)`) saat menekan tombol "Atur Preferensi" atau "Ubah Preferensi". |
| `checkSchedule(session: Session): boolean` | `public` | Memeriksa kecocokan jadwal sesi terhadap ketersediaan waktu pengguna. |

Tabel 5.11.2. Atribut Kelas Dashboard

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `upcomingSessions` | `private` | `Session[]` |
| `sessionRecommendation` | `private` | `Session[]` |
| `listSessions` | `private` | `Session[]` |
| `userControl` | `private` | `UserControl` |
| `sessionControl` | `private` | `SessionControl` |

### 5.11.1 Algoritma/Query

**Nama Kelas:** *Dashboard*  
**Nama Operasi:** `loadDashboard(): Promise<void>` dan `openSearchSession(): Promise<void>`  
**ID Algoritma:** *Algo-C11-01*

```text
FUNCTION loadDashboard(): Promise<void>
    user <- AWAIT THIS.userControl.getCurrentUser()
    THIS.showGreeting(user.getUsername())

    THIS.upcomingSessions <- AWAIT THIS.sessionControl.getUpcomingSessions(user.getUserID())
    THIS.showSession(THIS.upcomingSessions)

    TRY
        THIS.sessionRecommendation <- AWAIT THIS.sessionControl.findRecommendation(user.getUserID())
        THIS.showRecommendation(THIS.sessionRecommendation)
    CATCH error
        IF error.message == "PREFERENCE_NOT_SET" THEN
            THIS.showPreferenceWarning()
        END IF
    END TRY
END FUNCTION

FUNCTION openSearchSession(): Promise<void>
    user <- AWAIT THIS.userControl.getCurrentUser()
    recommendations <- AWAIT THIS.sessionControl.findRecommendation(user.getUserID())
    THIS.sessionRecommendation <- recommendations
    IF LENGTH(recommendations) == 0 THEN
        THIS.showEmptyState("Belum ada sesi yang cocok dengan jadwalmu")
    ELSE
        THIS.showRecommendation(recommendations)
    END IF
END FUNCTION
```

## 5.12 Kelas UserControl

**Nama Kelas:** *UserControl*  
**ID Kelas:** *C12*

Tabel 5.12.1. Operasi Kelas UserControl

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `authLogin(email: string, password: string): Promise<User>` | `public` | Mengoordinasikan autentikasi kredensial pengguna melalui `AuthAdapter.signIn()`, lalu mengambil objek entitas `User` (`User.findById(idUser)`). |
| `getCurrentUser(): Promise<User>` | `public` | Memverifikasi sesi aktif melalui `AuthAdapter.getSessionUserId()` dan mengambil objek `User` yang sedang masuk untuk ditampilkan pada beranda utama. |
| `validateEmail(email: string): boolean` | `public` | Memeriksa apakah alamat email menggunakan format dan domain institusi universitas yang valid. |
| `processRegistration(email: string, password: string, dataProfil: ProfileData): Promise<User>` | `public` | Memvalidasi domain email universitas (`validateEmail()`), mendaftarkan kredensial ke Supabase Auth melalui `AuthAdapter.signUp()`, lalu mendelegasikan penyimpanan akun dan profil ke kelas entitas `User.create()` dan `Profile.create()`. |
| `saveProfile(idUser: string, data: ProfileData): Promise<Profile>` | `public` | Mengoordinasikan pembaruan data identitas profil pengguna dengan mengambil entitas `Profile.findByUser(idUser)` dan memanggil metode `profile.updateProfile(data)`. |
| `savePreference(idUser: string, data: PreferenceData): Promise<Preference>` | `public` | Memvalidasi kelengkapan pilihan preferensi belajar, lalu mendelegasikan penyimpanan perubahan ke metode entitas `preference.updatePreference(data)`. |
| `fetchUserProfile(idUser: string): Promise<Profile>` | `public` | Memastikan akun pengguna ada melalui `User.findById(idUser)`, lalu mengambil objek identitas `Profile` melalui getter entitas `Profile.findByUser(idUser)`. |
| `fetchUserPreference(idUser: string): Promise<Preference \| null>` | `public` | Mengambil objek `Preference` pengguna melalui metode getter entitas `Preference.getPreferenceByUser(idUser)` untuk ditampilkan pada halaman profil. |

Tabel 5.12.2. Atribut Kelas UserControl

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `authAdapter` | `private` | `AuthAdapter` |
| `validator` | `private` | `Validator` |

### 5.12.1 Algoritma/Query

**Nama Kelas:** *UserControl*  
**Nama Operasi:** `processRegistration(email: string, password: string, dataProfil: ProfileData): Promise<User>`, `savePreference(idUser: string, data: PreferenceData): Promise<Preference>`, dan `fetchUserProfile(idUser: string): Promise<Profile>`  
**ID Algoritma:** *Algo-C12-01*

```text
FUNCTION processRegistration(email: string, password: string, dataProfil: ProfileData): Promise<User>
    IF NOT THIS.validateEmail(email) THEN
        THROW Error("INVALID_UNIVERSITY_EMAIL")
    END IF

    idUser <- AWAIT THIS.authAdapter.signUp(email, password)
    user <- AWAIT User.create(idUser, dataProfil.username, email)
    AWAIT Profile.create(idUser, dataProfil)
    RETURN user
END FUNCTION

FUNCTION savePreference(idUser: string, data: PreferenceData): Promise<Preference>
    IF NOT THIS.validator.validatePreference(data) THEN
        THROW Error("INCOMPLETE_PREFERENCE")
    END IF

    preference <- AWAIT Preference.getPreferenceByUser(idUser)
    IF preference IS NULL THEN
        preference <- NEW Preference(idUser, [], [], NULL)
    END IF

    RETURN AWAIT preference.updatePreference(data)
END FUNCTION

FUNCTION fetchUserProfile(idUser: string): Promise<Profile>
    user <- AWAIT User.findById(idUser)
    IF user IS NULL THEN
        THROW Error("USER_NOT_FOUND")
    END IF

    profile <- AWAIT Profile.findByUser(idUser)
    RETURN profile
END FUNCTION
```

## 5.13 Kelas SessionControl

**Nama Kelas:** *SessionControl*  
**ID Kelas:** *C13*

Tabel 5.13.1. Operasi Kelas SessionControl

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `processSessionCreation(idMentor: string, data: SessionData): Promise<Session>` | `public` | Mengoordinasikan alur pembuatan sesi baru dengan memvalidasi kapasitas dan konflik jadwal terlebih dahulu, lalu mendelegasikan pembuatan objek sesi baru ke kelas entitas `Session` (`Session.saveSession()` / `Session.create()`). |
| `validateScheduleConflict(idMentor: string, startTime: Date, endTime: Date, excludeSessionId?: string): Promise<boolean>` | `public` | Memeriksa apakah jadwal sesi yang diajukan bertabrakan dengan sesi aktif lain milik Mentor yang sama, dengan mengambil daftar sesi dari entitas `Session` (`Session.getSessionsByMentorInRange()`). |
| `validateCapacity(capacity: number): boolean` | `public` | Memeriksa apakah kapasitas maksimum peserta sesi berada dalam rentang aturan bisnis yang diizinkan (1 hingga 20 peserta). |
| `processRegistration(idSession: string, idMentee: string): Promise<boolean>` | `public` | Mengoordinasikan pendaftaran Mentee ke dalam sebuah sesi dengan mengambil objek `Session`, memeriksa ketersediaan kuota (`session.checkCapacity()`), dan memanggil metode entitas `session.addParticipant(idMentee)`. |
| `processSessionConfirmation(idSession: string, idUser: string, isConducted: boolean, reason?: string): Promise<Session>` | `public` | Mengoordinasikan konfirmasi keterlaksanaan sesi yang waktunya telah berakhir setelah memverifikasi keterlibatan pengguna pada objek `Session`. |
| `updateSessionStatus(session: Session, status: SessionStatus, reason?: string): Promise<Session>` | `private` | Menginstruksikan objek entitas `Session` untuk memperbarui status keterlaksanaannya beserta alasan opsional melalui metode setter entitas `session.setStatus(status, reason)`. |
| `fetchUserHistory(idUser: string): Promise<SessionHistory>` | `public` | Mengambil arsip sesi berstatus akhir melalui kelas entitas `Session` (`Session.getArchivedByUser(idUser)`) dan menginstansiasi objek `SessionHistory` untuk dikembalikan ke antarmuka. |
| `getUpcomingSessions(idUser: string): Promise<Session[]>` | `public` | Mengoordinasikan pengambilan daftar sesi aktif terdekat yang dimiliki atau diikuti oleh pengguna melalui metode entitas `Session.getUpcomingByUser(idUser)`. |
| `findRecommendation(idMentee: string): Promise<Session[]>` | `public` | Mengoordinasikan pencarian rekomendasi sesi dengan mengambil objek `Preference` milik Mentee dan daftar kandidat sesi terbuka dari entitas `Session`, lalu menjalankan algoritma pencocokan `matchSession()`. |
| `matchSession(preference: Preference, candidates: Session[]): Session[]` | `private` | Menjalankan logika algoritma *matchmaking* untuk menyaring dan mengurutkan kandidat sesi berdasarkan irisan tag materi, ketersediaan jadwal, dan kesesuaian format belajar. |
| `getSessionDetail(idSession: string, idUser: string): Promise<Session>` | `public` | Mengoordinasikan pengambilan informasi rinci suatu sesi berdasarkan ID melalui metode getter entitas `Session.getSessionById(idSession)`. |
| `editSession(idSession: string, idMentor: string, data: SessionData): Promise<Session>` | `public` | Mengoordinasikan pembaruan data sesi oleh Mentor pemilik sesi setelah lolos validasi kapasitas dan jadwal, dengan memanggil metode mutator pada entitas `Session`. |
| `cancelSession(idSession: string, idMentee: string): Promise<boolean>` | `public` | Mengoordinasikan pembatalan keikutsertaan Mentee pada sesi yang belum dimulai dengan memanggil operasi penghapusan partisipan pada entitas `Session` (`session.removeParticipant(idMentee)`). |
| `deleteSession(idSession: string, idMentor: string): Promise<boolean>` | `public` | Mengoordinasikan penghapusan (*soft delete*) sesi oleh Mentor pemilik sesi dengan memanggil metode `session.markAsDeleted()` pada objek entitas `Session`. |

Tabel 5.13.2. Atribut Kelas SessionControl

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `sessionList` | `private` | `Session[]` |
| `sessionHistory` | `private` | `SessionHistory \| null` |
| `session` | `private` | `Session \| null` |

### 5.13.1 Algoritma/Query

**Nama Kelas:** *SessionControl*  
**Nama Operasi:** `processSessionCreation(idMentor: string, data: SessionData): Promise<Session>`  
**ID Algoritma:** *Algo-C13-01*

```text
FUNCTION processSessionCreation(idMentor: string, data: SessionData): Promise<Session>
    IF NOT THIS.validateCapacity(data.capacity) THEN
        THROW Error("INVALID_CAPACITY")
    END IF

    hasConflict <- AWAIT THIS.validateScheduleConflict(idMentor, data.startTime, data.endTime)
    IF hasConflict THEN
        THROW Error("SCHEDULE_CONFLICT")
    END IF

    newSession <- NEW Session(idMentor, data.topic, data.schedule, data.format, data.capacity)
    savedSession <- AWAIT newSession.saveSession()
    THIS.session <- savedSession
    RETURN savedSession
END FUNCTION
```

**Nama Kelas:** *SessionControl*  
**Nama Operasi:** `findRecommendation(idMentee: string): Promise<Session[]>` dan `matchSession(preference: Preference, candidates: Session[]): Session[]`  
**ID Algoritma:** *Algo-C13-02*

```text
FUNCTION findRecommendation(idMentee: string): Promise<Session[]>
    preference <- AWAIT Preference.getPreferenceByUser(idMentee)
    IF preference IS NULL OR NOT preference.isComplete() THEN
        THROW Error("PREFERENCE_NOT_SET")
    END IF

    candidates <- AWAIT Session.getAvailableSessions(NOW())
    THIS.sessionList <- THIS.matchSession(preference, candidates)
    RETURN THIS.sessionList
END FUNCTION

FUNCTION matchSession(preference: Preference, candidates: Session[]): Session[]
    matchedSessions <- EMPTY LIST OF Session
    prefTags <- preference.getMaterialTag()
    prefAvailability <- preference.getAvailability()
    prefFormat <- preference.getSessionFormatPreference()

    FOR EACH candidate IN candidates DO
        IF candidate.checkCapacity() AND NOT candidate.isParticipant(preference.getUserId()) THEN
            tagMatch <- candidate.getTopic() IN prefTags
            formatMatch <- (prefFormat == "BOTH") OR (candidate.getFormat() == prefFormat)
            timeMatch <- prefAvailability.overlapsWith(candidate.getScheduledTime())

            IF tagMatch AND formatMatch AND timeMatch THEN
                APPEND candidate TO matchedSessions
            END IF
        END IF
    END FOR

    RETURN matchedSessions
END FUNCTION
```

**Nama Kelas:** *SessionControl*  
**Nama Operasi:** `processSessionConfirmation(idSession: string, idUser: string, isConducted: boolean, reason?: string): Promise<Session>`  
**ID Algoritma:** *Algo-C13-03*

```text
FUNCTION processSessionConfirmation(idSession: string, idUser: string, isConducted: boolean, reason?: string): Promise<Session>
    targetSession <- AWAIT Session.getSessionById(idSession)
    IF targetSession IS NULL THEN
        THROW Error("SESSION_NOT_FOUND")
    END IF

    IF NOT targetSession.involves(idUser) THEN
        THROW Error("UNAUTHORIZED_USER")
    END IF

    IF NOT targetSession.needsConfirmation(NOW()) THEN
        THROW Error("SESSION_NOT_AWAITING_CONFIRMATION")
    END IF

    IF isConducted THEN
        targetStatus <- SessionStatus.SELESAI
        targetReason <- NULL
    ELSE
        targetStatus <- SessionStatus.TIDAK_TERLAKSANA
        targetReason <- reason
    END IF

    RETURN AWAIT THIS.updateSessionStatus(targetSession, targetStatus, targetReason)
END FUNCTION
```

## 5.14 Kelas FeedbackControl

**Nama Kelas:** *FeedbackControl*  
**ID Kelas:** *C14*

Tabel 5.14.1. Operasi Kelas FeedbackControl

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `checkFeedbackEligibility(idSession: string, idMentee: string): Promise<boolean>` | `public` | Memeriksa kelayakan Mentee dalam memberikan penilaian pada suatu sesi (memastikan sesi berstatus Selesai, Mentee terdaftar sebagai partisipan, dan Mentee belum pernah mengirim *feedback* pada sesi tersebut). |
| `validateFeedback(rating: number, comment?: string): boolean` | `public` | Memvalidasi masukan penilaian agar nilai *rating* berada pada rentang integer 1 hingga 5 dan panjang ulasan teks tidak melebihi batas karakter maksimum. |
| `submitFeedback(idSession: string, idMentee: string, rating: number, comment?: string): Promise<Feedback>` | `public` | Mengoordinasikan pengiriman *feedback* dari antarmuka dengan memverifikasi kelayakan serta validitas input sebelum meneruskannya ke operasi `saveFeedback()`. |
| `saveFeedback(idSession: string, idMentee: string, rating: number, comment?: string): Promise<Feedback>` | `private` | Menginstansiasi objek entitas `Feedback`, mengatur nilai atributnya melalui setter (`setRating()`, `setComment()`), dan memanggil metode persistensi pada entitas `Feedback` (`feedback.save()`). |
| `retrieveFeedbackBySession(idSession: string, idMentor: string): Promise<Feedback[]>` | `public` | Memverifikasi kepemilikan sesi oleh Mentor dan status selesai pada entitas `Session`, lalu mengambil daftar objek `Feedback` melalui metode getter entitas `Feedback.getFeedbackBySession(idSession)`. |

Tabel 5.14.2. Atribut Kelas FeedbackControl

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `feedbackList` | `private` | `Feedback[]` |

### 5.14.1 Algoritma/Query

**Nama Kelas:** *FeedbackControl*  
**Nama Operasi:** `submitFeedback(idSession: string, idMentee: string, rating: number, comment?: string): Promise<Feedback>`  
**ID Algoritma:** *Algo-C14-01*

```text
FUNCTION submitFeedback(idSession: string, idMentee: string, rating: number, comment?: string): Promise<Feedback>
    isEligible <- AWAIT THIS.checkFeedbackEligibility(idSession, idMentee)
    IF NOT isEligible THEN
        THROW Error("FEEDBACK_NOT_ELIGIBLE")
    END IF

    IF NOT THIS.validateFeedback(rating, comment) THEN
        THROW Error("INVALID_FEEDBACK_DATA")
    END IF

    savedFeedback <- AWAIT THIS.saveFeedback(idSession, idMentee, rating, comment)
    APPEND savedFeedback TO THIS.feedbackList
    RETURN savedFeedback
END FUNCTION

FUNCTION saveFeedback(idSession: string, idMentee: string, rating: number, comment?: string): Promise<Feedback>
    feedbackObj <- NEW Feedback(idSession, idMentee)
    feedbackObj.setRating(rating)
    feedbackObj.setComment(comment)
    RETURN AWAIT feedbackObj.save()
END FUNCTION
```

**Nama Kelas:** *FeedbackControl*  
**Nama Operasi:** `retrieveFeedbackBySession(idSession: string, idMentor: string): Promise<Feedback[]>`  
**ID Algoritma:** *Algo-C14-02*

```text
FUNCTION retrieveFeedbackBySession(idSession: string, idMentor: string): Promise<Feedback[]>
    session <- AWAIT Session.getSessionById(idSession)
    IF session IS NULL THEN
        THROW Error("SESSION_NOT_FOUND")
    END IF

    IF NOT session.isOwnedBy(idMentor) THEN
        THROW Error("FORBIDDEN_NOT_HOST")
    END IF

    IF NOT session.isCompleted() THEN
        THROW Error("SESSION_NOT_COMPLETED")
    END IF

    THIS.feedbackList <- AWAIT Feedback.getFeedbackBySession(idSession)
    RETURN THIS.feedbackList
END FUNCTION
```

## 5.15 Kelas LoginPage

**Nama Kelas:** *LoginPage*  
**ID Kelas:** *C15*

Tabel 5.15.1. Operasi Kelas LoginPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `showForm(mode: "LOGIN" \| "REGISTER"): void` | `public` | Menampilkan antarmuka formulir autentikasi sesuai mode yang dipilih pengguna (masuk akun atau pendaftaran akun baru). |
| `clickRegister(): void` | `public` | Menangani interaksi pengguna saat memilih tab atau tombol pendaftaran akun dan mengalihkan tampilan formulir ke mode `"REGISTER"`. |
| `submitForm(): Promise<void>` | `public` | Mengambil masukan kredensial dan data profil dari state formulir, lalu meneruskannya ke `UserControl.authLogin()` atau `UserControl.processRegistration()`. |
| `showWarning(message: string): void` | `public` | Menampilkan pesan peringatan atau galat validasi (seperti domain email bukan institusi universitas) pada layar dengan tetap mempertahankan isian formulir. |
| `redirectToLogin(): void` | `public` | Mengarahkan pengguna kembali ke tampilan formulir masuk (login) setelah proses registrasi berhasil dilakukan. |
| `loadDashboard(): void` | `public` | Mengarahkan navigasi pengguna ke halaman beranda utama (`Dashboard`) setelah autentikasi berhasil diverifikasi. |

Tabel 5.15.2. Atribut Kelas LoginPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `formMode` | `private` | `"LOGIN" \| "REGISTER"` |
| `emailInput` | `private` | `string` |
| `passwordInput` | `private` | `string` |
| `profileInput` | `private` | `ProfileData \| null` |
| `warningMessage` | `private` | `string \| null` |
| `userControl` | `private` | `UserControl` |

### 5.15.1 Algoritma/Query

**Nama Kelas:** *LoginPage*  
**Nama Operasi:** `submitForm(): Promise<void>`  
**ID Algoritma:** *Algo-C15-01*

```text
FUNCTION submitForm(): Promise<void>
    THIS.warningMessage <- NULL
    TRY
        IF THIS.formMode == "REGISTER" THEN
            AWAIT THIS.userControl.processRegistration(THIS.emailInput, THIS.passwordInput, THIS.profileInput)
            THIS.redirectToLogin()
        ELSE
            AWAIT THIS.userControl.authLogin(THIS.emailInput, THIS.passwordInput)
            THIS.loadDashboard()
        END IF
    CATCH error
        IF error.message == "INVALID_UNIVERSITY_EMAIL" THEN
            THIS.showWarning("Harap gunakan email institusi universitas yang valid")
        ELSE
            THIS.showWarning(error.message)
        END IF
    END TRY
END FUNCTION
```

## 5.16 Kelas ProfilePage

**Nama Kelas:** *ProfilePage*  
**ID Kelas:** *C16*

Tabel 5.16.1. Operasi Kelas ProfilePage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `openProfile(idUser: string): Promise<void>` | `public` | Memuat halaman profil pengguna tertentu dengan meminta data identitas dan preferensi melalui `UserControl`. |
| `displayProfileData(profile: Profile): void` | `public` | Merender informasi identitas pengguna (nama, universitas, program studi, dan bio) yang diperoleh dari getter objek `Profile` ke layar. |
| `displayPreferenceData(preference: Preference): void` | `public` | Merender daftar tag materi, preferensi format sesi, dan ketersediaan waktu dari objek `Preference` ke layar. |
| `clickEditPreference(): void` | `public` | Membuka mode pengeditan formulir preferensi belajar bagi pemilik akun. |
| `showPreferenceForm(preference: Preference): void` | `public` | Menampilkan komponen pemilihan tag materi, format sesi (daring/luring), dan kalender ketersediaan waktu yang terisi data saat ini. |
| `submitUpdate(data: PreferenceData \| ProfileData): Promise<void>` | `public` | Mengirimkan pembaruan data profil atau preferensi yang telah diisi pengguna ke `UserControl.savePreference()` atau `UserControl.saveProfile()`. |
| `showWarning(message: string): void` | `public` | Menampilkan pesan peringatan pada layar apabila terdapat pilihan preferensi yang belum diisi lengkap. |
| `showSuccessMessage(message: string): void` | `public` | Menampilkan notifikasi umpan balik keberhasilan penyimpanan pembaruan profil atau preferensi. |
| `showNotFound(message: string): void` | `public` | Menampilkan pesan bahwa profil pengguna tidak ditemukan apabila ID pengguna tidak valid atau akun telah dihapus. |

Tabel 5.16.2. Atribut Kelas ProfilePage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `targetUserId` | `private` | `string` |
| `currentProfile` | `private` | `Profile \| null` |
| `currentPreference` | `private` | `Preference \| null` |
| `isEditingPreference` | `private` | `boolean` |
| `feedbackBanner` | `private` | `string \| null` |
| `userControl` | `private` | `UserControl` |

### 5.16.1 Algoritma/Query

**Nama Kelas:** *ProfilePage*  
**Nama Operasi:** `openProfile(idUser: string): Promise<void>` dan `submitUpdate(data: PreferenceData): Promise<void>`  
**ID Algoritma:** *Algo-C16-01*

```text
FUNCTION openProfile(idUser: string): Promise<void>
    THIS.targetUserId <- idUser
    TRY
        profile <- AWAIT THIS.userControl.fetchUserProfile(idUser)
        preference <- AWAIT THIS.userControl.fetchUserPreference(idUser)
        THIS.displayProfileData(profile)
        THIS.displayPreferenceData(preference)
    CATCH error
        IF error.message == "USER_NOT_FOUND" THEN
            THIS.showNotFound("Profil pengguna tidak ditemukan")
        END IF
    END TRY
END FUNCTION

FUNCTION submitUpdate(data: PreferenceData): Promise<void>
    TRY
        updatedPref <- AWAIT THIS.userControl.savePreference(THIS.targetUserId, data)
        THIS.isEditingPreference <- FALSE
        THIS.displayPreferenceData(updatedPref)
        THIS.showSuccessMessage("Preferensi berhasil disimpan")
    CATCH error
        IF error.message == "INCOMPLETE_PREFERENCE" THEN
            THIS.showWarning("Silahkan Isi Semua Pilihan Preferensi")
        END IF
    END TRY
END FUNCTION
```

## 5.17 Kelas SessionPage

**Nama Kelas:** *SessionPage*  
**ID Kelas:** *C17*

Tabel 5.17.1. Operasi Kelas SessionPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `openSessionDetail(idSession: string): Promise<void>` | `public` | Memuat data detail sesi melalui `SessionControl.getSessionDetail()`, menampilkannya ke layar, serta memeriksa apakah sesi membutuhkan konfirmasi keterlaksanaan atau layak diberikan *feedback*. |
| `showSessionDetails(session: Session): void` | `public` | Menampilkan rincian informasi sesi (topik materi, jadwal, format belajar, kapasitas, daftar partisipan, dan status) menggunakan getter dari objek entitas `Session`. |
| `showConfirmationPrompt(promptText?: string): void` | `public` | Menampilkan dialog atau tombol konfirmasi keterlaksanaan sesi ("Terlaksana" dan "Tidak Terlaksana") maupun dialog konfirmasi aksi sesi. |
| `closeConfirmationPrompt(): void` | `public` | Menutup dialog konfirmasi yang sedang tampil di layar. |
| `clickConducted(): Promise<void>` | `public` | Menangani aksi pengguna saat menekan tombol "Terlaksana" dan memanggil `submitConfirmation(true, null)`. |
| `clickNotConducted(): void` | `public` | Menangani aksi pengguna saat menekan tombol "Tidak Terlaksana" dengan menampilkan kolom masukan alasan opsional (`showReasonField()`). |
| `showReasonField(): void` | `public` | Menampilkan kotak input teks opsional bagi pengguna untuk menuliskan alasan mengapa sesi tidak terlaksana. |
| `submitConfirmation(isConducted: boolean, reason?: string): Promise<void>` | `public` | Mengirimkan hasil konfirmasi keterlaksanaan sesi beserta alasan opsional ke `SessionControl.processSessionConfirmation()`. |
| `showSuccessMessage(message: string): void` | `public` | Menampilkan pesan notifikasi keberhasilan pembaruan status atau aksi pada halaman sesi. |
| `showWarning(message: string): void` | `public` | Menampilkan pesan peringatan apabila terjadi kendala validasi atau kegagalan pemrosesan aksi sesi. |

Tabel 5.17.2. Atribut Kelas SessionPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `confirmationPrompt` | `protected` | `string \| null` |
| `currentSession` | `protected` | `Session \| null` |
| `reasonInput` | `protected` | `string` |
| `isReasonFieldVisible` | `protected` | `boolean` |
| `sessionControl` | `protected` | `SessionControl` |

### 5.17.1 Algoritma/Query

**Nama Kelas:** *SessionPage*  
**Nama Operasi:** `submitConfirmation(isConducted: boolean, reason?: string): Promise<void>`  
**ID Algoritma:** *Algo-C17-01*

```text
FUNCTION submitConfirmation(isConducted: boolean, reason?: string): Promise<void>
    IF THIS.currentSession IS NULL THEN
        RETURN
    END IF

    TRY
        updatedSession <- AWAIT THIS.sessionControl.processSessionConfirmation(
            THIS.currentSession.getSessionID(),
            THIS.currentUserId,
            isConducted,
            reason
        )
        THIS.currentSession <- updatedSession
        THIS.closeConfirmationPrompt()
        THIS.showSessionDetails(updatedSession)
        THIS.showSuccessMessage("Status sesi berhasil diperbarui")
    CATCH error
        THIS.showWarning(error.message)
    END TRY
END FUNCTION
```

## 5.18 Kelas HostSessionPage

**Nama Kelas:** *HostSessionPage*  
**ID Kelas:** *C18*

Tabel 5.18.1. Operasi Kelas HostSessionPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `clickCreateSession(): void` | `public` | Menangani aksi Mentor saat memilih menu "Buat Sesi Baru" dengan memanggil `showCreateForm()`. |
| `showCreateForm(): void` | `public` | Menampilkan formulir kosong untuk pembuatan sesi belajar baru (topik, jadwal, format daring/luring, dan batas kapasitas peserta). |
| `submitSessionData(data: SessionData): Promise<void>` | `public` | Mengirimkan data formulir sesi baru ke `SessionControl.processSessionCreation()` dan menampilkan rincian sesi yang baru dibuat. |
| `clickEditSession(): void` | `public` | Menangani aksi Mentor saat menekan tombol "Edit Sesi" pada halaman detail sesi. |
| `showEditForm(session: Session): void` | `public` | Menampilkan formulir pengubahan sesi yang telah terisi (*pre-filled*) dengan data sesi saat ini. |
| `submitSessionUpdate(data: SessionData): Promise<void>` | `public` | Mengirimkan perubahan data sesi yang diedit Mentor ke `SessionControl.editSession()`. |
| `clickDeleteSession(): void` | `public` | Menangani aksi Mentor saat menekan tombol "Hapus Sesi" dengan menampilkan dialog konfirmasi penghapusan (`showConfirmationPrompt("Hapus sesi ini?")`). |
| `confirmDelete(): Promise<void>` | `public` | Mengirimkan permintaan penghapusan sesi ke `SessionControl.deleteSession()` setelah Mentor menekan tombol konfirmasi "Ya, Hapus". |
| `cancelDelete(): void` | `public` | Membatalkan proses penghapusan sesi dan menutup dialog konfirmasi tanpa mengubah data sesi. |
| `clickViewFeedback(): Promise<void>` | `public` | Meminta daftar *feedback* sesi yang telah selesai melalui `FeedbackControl.retrieveFeedbackBySession()` ketika Mentor menekan tombol "Lihat Feedback". |
| `showFeedbackList(feedbackList: Feedback[]): void` | `public` | Menampilkan daftar penilaian (*rating* dan ulasan teks) yang diberikan oleh para Mentee pada sesi tersebut. |
| `showEmptyFeedback(): void` | `public` | Menampilkan informasi keadaan kosong apabila belum ada Mentee yang memberikan *feedback* pada sesi tersebut. |

Tabel 5.18.2. Atribut Kelas HostSessionPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `sessionFormData` | `private` | `SessionData \| null` |
| `sessionFeedbackList` | `private` | `Feedback[]` |
| `isEditMode` | `private` | `boolean` |
| `feedbackControl` | `private` | `FeedbackControl` |

### 5.18.1 Algoritma/Query

**Nama Kelas:** *HostSessionPage*  
**Nama Operasi:** `submitSessionData(data: SessionData): Promise<void>` dan `clickViewFeedback(): Promise<void>`  
**ID Algoritma:** *Algo-C18-01*

```text
FUNCTION submitSessionData(data: SessionData): Promise<void>
    TRY
        createdSession <- AWAIT THIS.sessionControl.processSessionCreation(THIS.mentorId, data)
        THIS.currentSession <- createdSession
        THIS.showSessionDetails(createdSession)
        THIS.showSuccessMessage("Sesi berhasil dibuat")
    CATCH error
        IF error.message == "INVALID_CAPACITY_MAX" THEN
            THIS.showWarning("Kapasitas maksimal adalah 20 orang")
        ELSE IF error.message == "INVALID_CAPACITY_MIN" THEN
            THIS.showWarning("Kapasitas minimum adalah 1 orang")
        ELSE IF error.message == "SCHEDULE_CONFLICT" THEN
            THIS.showWarning("Jadwal bertabrakan dengan sesi lain")
        END IF
    END TRY
END FUNCTION

FUNCTION clickViewFeedback(): Promise<void>
    feedbackList <- AWAIT THIS.feedbackControl.retrieveFeedbackBySession(
        THIS.currentSession.getSessionID(),
        THIS.mentorId
    )
    THIS.sessionFeedbackList <- feedbackList
    IF LENGTH(feedbackList) > 0 THEN
        THIS.showFeedbackList(feedbackList)
    ELSE
        THIS.showEmptyFeedback()
    END IF
END FUNCTION
```

## 5.19 Kelas ParticipantSessionPage

**Nama Kelas:** *ParticipantSessionPage*  
**ID Kelas:** *C19*

Tabel 5.19.1. Operasi Kelas ParticipantSessionPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `showSessionDetails(session: Session): void` | `public` | Menampilkan rincian sesi bagi Mentee dilengkapi tombol aksi kontekstual ("Gabung Sesi" jika belum terdaftar, atau "Batalkan Keikutsertaan" jika sudah terdaftar dan sesi belum dimulai). |
| `submitJoinRequest(idSession: string): Promise<void>` | `public` | Mengirimkan permintaan pendaftaran Mentee ke dalam sesi melalui `SessionControl.processRegistration()` saat tombol "Gabung Sesi" ditekan. |
| `clickCancelParticipation(): void` | `public` | Menampilkan dialog konfirmasi pembatalan keikutsertaan (`showConfirmationPrompt("Batalkan keikutsertaan pada sesi ini?")`) saat Mentee menekan tombol "Batalkan Keikutsertaan". |
| `confirmCancelParticipation(): Promise<void>` | `public` | Meneruskan konfirmasi pembatalan keikutsertaan Mentee ke `SessionControl.cancelSession()` dan memperbarui tampilan halaman sesi. |
| `clickBack(): void` | `public` | Menutup dialog konfirmasi pembatalan tanpa mengirimkan permintaan ke `SessionControl` sehingga Mentee tetap terdaftar. |

Tabel 5.19.2. Atribut Kelas ParticipantSessionPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `isRegisteredParticipant` | `private` | `boolean` |
| `idMentee` | `private` | `string` |

### 5.19.1 Algoritma/Query

**Nama Kelas:** *ParticipantSessionPage*  
**Nama Operasi:** `submitJoinRequest(idSession: string): Promise<void>` dan `confirmCancelParticipation(): Promise<void>`  
**ID Algoritma:** *Algo-C19-01*

```text
FUNCTION submitJoinRequest(idSession: string): Promise<void>
    TRY
        success <- AWAIT THIS.sessionControl.processRegistration(idSession, THIS.idMentee)
        IF success THEN
            THIS.isRegisteredParticipant <- TRUE
            THIS.showSuccessMessage("Berhasil bergabung")
        END IF
    CATCH error
        THIS.showWarning(error.message)
    END TRY
END FUNCTION

FUNCTION confirmCancelParticipation(): Promise<void>
    TRY
        success <- AWAIT THIS.sessionControl.cancelSession(THIS.currentSession.getSessionID(), THIS.idMentee)
        IF success THEN
            THIS.isRegisteredParticipant <- FALSE
            THIS.closeConfirmationPrompt()
            THIS.showSuccessMessage("Berhasil Membatalkan Keikutsertaan")
        END IF
    CATCH error
        THIS.showWarning(error.message)
    END TRY
END FUNCTION
```

## 5.20 Kelas FeedbackForm

**Nama Kelas:** *FeedbackForm*  
**ID Kelas:** *C20*

Tabel 5.20.1. Operasi Kelas FeedbackForm

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `showForm(idSession: string): void` | `public` | Menampilkan komponen formulir penilaian berisi pilihan *rating* (1–5 bintang), kolom komentar opsional, tombol "Kirim", serta tombol "Skip". |
| `submitFeedback(rating: number, comment?: string): Promise<void>` | `public` | Mengirimkan nilai *rating* dan ulasan komentar yang diisi Mentee ke `FeedbackControl.submitFeedback()`. |
| `clickSkip(): void` | `public` | Menangani aksi Mentee saat melewati pengisian penilaian dengan langsung menutup formulir (`closeForm()`) tanpa memanggil `FeedbackControl`. |
| `closeForm(): void` | `public` | Menutup dan menyembunyikan modal atau komponen formulir *feedback* dari layar pengguna. |
| `showThankYou(message: string): void` | `public` | Menampilkan pesan apresiasi ("Terima kasih atas feedback Anda") setelah penilaian berhasil disimpan. |

Tabel 5.20.2. Atribut Kelas FeedbackForm

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `idSession` | `private` | `string` |
| `idMentee` | `private` | `string` |
| `rating` | `private` | `number` |
| `comment` | `private` | `string` |
| `isOpen` | `private` | `boolean` |
| `feedbackControl` | `private` | `FeedbackControl` |

### 5.20.1 Algoritma/Query

**Nama Kelas:** *FeedbackForm*  
**Nama Operasi:** `submitFeedback(rating: number, comment?: string): Promise<void>`  
**ID Algoritma:** *Algo-C20-01*

```text
FUNCTION submitFeedback(rating: number, comment?: string): Promise<void>
    THIS.rating <- rating
    THIS.comment <- comment
    AWAIT THIS.feedbackControl.submitFeedback(THIS.idSession, THIS.idMentee, THIS.rating, THIS.comment)
    THIS.closeForm()
    THIS.showThankYou("Terima kasih atas feedback Anda")
END FUNCTION

FUNCTION clickSkip(): void
    THIS.closeForm()
END FUNCTION
```

## 5.21 Kelas GroupChatPage

**Nama Kelas:** *GroupChatPage*  
**ID Kelas:** *C21*

Tabel 5.21.1. Operasi Kelas GroupChatPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `openGroupChat(idSession: string): Promise<void>` | `public` | Membuka halaman ruang obrolan grup untuk sesi terkait, meminta riwayat pesan melalui pengontrol obrolan, dan mendaftarkan langganan pesan *real-time*. |
| `displayMessages(messages: ChatMessage[]): void` | `public` | Menampilkan daftar seluruh riwayat pesan obrolan secara kronologis saat ruang obrolan pertama kali dimuat. |
| `displayMessage(message: ChatMessage): void` | `public` | Menambahkan dan menampilkan satu pesan obrolan baru ke layar secara instan menggunakan getter pada objek `ChatMessage` (`getSender()`, `getTime()`, `getText()`). |
| `sendMessage(text: string): Promise<void>` | `public` | Mengirimkan teks pesan baru yang diketik pengguna ke ruang obrolan sesi dan memperbarui tampilan pesan di layar. |
| `onMessageReceived(message: ChatMessage): void` | `public` | *Callback handler* yang menerima siaran pesan baru secara *real-time* melalui WebSocket dari anggota grup lain dan memanggil `displayMessage(message)`. |
| `showChatExpired(message: string): void` | `public` | Menampilkan pemberitahuan bahwa masa aktif ruang obrolan sementara untuk sesi tersebut telah berakhir (melewati batas retensi 48 jam setelah sesi selesai). |
| `disableMessageInput(): void` | `public` | Menonaktifkan kotak input pengetikan dan tombol kirim pesan ketika grup obrolan sudah berakhir. |

Tabel 5.21.2. Atribut Kelas GroupChatPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `idGroupChat` | `private` | `string` |
| `messageList` | `private` | `ChatMessage[]` |
| `messageInput` | `private` | `string` |
| `isInputDisabled` | `private` | `boolean` |

### 5.21.1 Algoritma/Query

**Nama Kelas:** *GroupChatPage*  
**Nama Operasi:** `openGroupChat(idSession: string): Promise<void>` dan `sendMessage(text: string): Promise<void>`  
**ID Algoritma:** *Algo-C21-01*

```text
FUNCTION openGroupChat(idSession: string): Promise<void>
    TRY
        chatData <- AWAIT chatController.getGroupChat(idSession, THIS.currentUserId)
        THIS.idGroupChat <- chatData.groupChat.getId()
        THIS.messageList <- chatData.messages
        THIS.displayMessages(THIS.messageList)
    CATCH error
        IF error.message == "CHAT_EXPIRED" THEN
            THIS.showChatExpired("Group chat untuk sesi ini telah berakhir")
            THIS.disableMessageInput()
        END IF
    END TRY
END FUNCTION

FUNCTION sendMessage(text: string): Promise<void>
    IF THIS.isInputDisabled OR TRIM(text) == "" THEN
        RETURN
    END IF

    newMsg <- AWAIT chatController.sendMessage(THIS.idGroupChat, THIS.currentUserId, text)
    APPEND newMsg TO THIS.messageList
    THIS.displayMessage(newMsg)
    THIS.messageInput <- ""
END FUNCTION
```

## 5.22 Kelas Notification

**Nama Kelas:** *Notification*  
**ID Kelas:** *C22*

Tabel 5.22.1. Operasi Kelas Notification

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `create(idUser: string, idSession: string, title: string, content: string): Promise<Notification>` | `public` | Operasi CRUD (Create) pada kelas entitas untuk menyimpan rekaman notifikasi pengingat baru ke dalam basis data dan mengembalikan objek `Notification`. |
| `findById(idNotification: string): Promise<Notification \| null>` | `public` | Operasi getter statis (Read) untuk mengambil satu objek entitas `Notification` dari basis data berdasarkan ID notifikasi. |
| `getNotificationsByUser(idUser: string): Promise<Notification[]>` | `public` | Operasi getter statis (Read) untuk mengambil daftar seluruh notifikasi milik seorang pengguna dari basis data. |
| `markAsRead(): Promise<boolean>` | `public` | Operasi setter/mutator (Update) pada entitas yang mengubah atribut `isRead` menjadi `true` dan memperbarui status terbaca di basis data. |
| `showContent(): string` | `public` | Operasi getter untuk mengembalikan gabungan judul dan isi teks pesan pengingat notifikasi (`title` dan `content`). |
| `getTime(): Date` | `public` | Operasi getter untuk mengembalikan waktu pembuatan atau pengiriman notifikasi (`timestamp`). |
| `getNotificationId(): string` | `public` | Operasi getter untuk mengembalikan identitas unik notifikasi (`notificationId`). |
| `getSessionId(): string` | `public` | Operasi getter untuk mengembalikan identitas sesi belajar yang terkait dengan notifikasi (`idSession`). |
| `getIsRead(): boolean` | `public` | Operasi getter untuk memeriksa apakah notifikasi sudah dibaca oleh pengguna (`isRead`). |
| `openApp(): string` | `public` | Mengembalikan tautan rute detail sesi tujuan (`/sessions/{idSession}`) ketika objek notifikasi diakses untuk membuka aplikasi. |

Tabel 5.22.2. Atribut Kelas Notification

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `notificationId` | `private` | `string` |
| `idUser` | `private` | `string` |
| `idSession` | `private` | `string` |
| `title` | `private` | `string` |
| `content` | `private` | `string` |
| `timestamp` | `private` | `Date` |
| `isRead` | `private` | `boolean` |

### 5.22.1 Algoritma/Query

**Nama Kelas:** *Notification*  
**Nama Operasi:** `create(idUser: string, idSession: string, title: string, content: string): Promise<Notification>` dan `markAsRead(): Promise<boolean>`  
**ID Algoritma:** *Algo-C22-01*

```text
STATIC FUNCTION create(idUser: string, idSession: string, title: string, content: string): Promise<Notification>
    row <- AWAIT Database.executeQuery(Q-C22-01, [idUser, idSession, title, content])
    RETURN NEW Notification(
        row.notification_id,
        row.id_user,
        row.id_session,
        row.title,
        row.content,
        row.timestamp,
        row.is_read
    )
END FUNCTION

FUNCTION markAsRead(): Promise<boolean>
    THIS.isRead <- TRUE
    AWAIT Database.executeQuery(Q-C22-03, [THIS.notificationId])
    RETURN TRUE
END FUNCTION
```

Tabel 5.22.3. Query Operasi Kelas Notification

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-C22-01* | `INSERT INTO notifications (id_user, id_session, title, content, is_read) VALUES ($1, $2, $3, $4, FALSE);` | Menyimpan entitas notifikasi pengingat sesi baru ke dalam tabel `notifications` (operasi Create). |
| *Q-C22-02* | `SELECT * FROM notifications WHERE notification_id = $1;` | Mengambil data entitas notifikasi berdasarkan `notification_id` (operasi Read pada `findById`). |
| *Q-C22-03* | `UPDATE notifications SET is_read = TRUE WHERE notification_id = $1;` | Memperbarui status `is_read` menjadi `TRUE` saat notifikasi dibaca pengguna (operasi Update pada `markAsRead`). |
| *Q-C22-04* | `SELECT * FROM notifications WHERE id_user = $1;` | Mengambil daftar seluruh notifikasi milik seorang pengguna (operasi Read pada `getNotificationsByUser`). |

## 5.23 Kelas PopUpNotification

**Nama Kelas:** *PopUpNotification*  
**ID Kelas:** *C23*

Tabel 5.23.1. Operasi Kelas PopUpNotification

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `onNotificationReceived(notification: Notification): void` | `public` | Menerima objek `Notification` yang dikirim secara *real-time* (15 menit sebelum sesi dimulai) dan memicu penampilan *pop-up* di layar pengguna. |
| `showPopUp(notification: Notification): void` | `public` | Menampilkan komponen visual *pop-up* notifikasi pada antarmuka pengguna. |
| `showContent(): string` | `public` | Mengambil dan menampilkan teks isi pesan pengingat dengan memanggil getter `activeNotification.showContent()` pada entitas `Notification`. |
| `getTime(): Date` | `public` | Mengambil dan menampilkan waktu pengingat dengan memanggil getter `activeNotification.getTime()` pada entitas `Notification`. |
| `clickNotification(idNotification: string): Promise<void>` | `public` | Menangani interaksi pengguna saat menekan *pop-up* notifikasi dengan menandainya sebagai telah dibaca (`markAsRead()`) dan mengarahkan pengguna ke halaman sesi (`openApp()`). |
| `markAsRead(): Promise<void>` | `public` | Meneruskan perintah pembaruan status terbaca untuk notifikasi yang sedang aktif. |
| `openApp(): void` | `public` | Mengarahkan pengguna ke halaman detail sesi (`SessionPage.openSessionDetail()`) sesuai rute dari `activeNotification.openApp()`. |

Tabel 5.23.2. Atribut Kelas PopUpNotification

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `activeNotification` | `private` | `Notification \| null` |
| `isVisible` | `private` | `boolean` |

### 5.23.1 Algoritma/Query

**Nama Kelas:** *PopUpNotification*  
**Nama Operasi:** `clickNotification(idNotification: string): Promise<void>`  
**ID Algoritma:** *Algo-C23-01*

```text
FUNCTION onNotificationReceived(notification: Notification): void
    THIS.activeNotification <- notification
    THIS.isVisible <- TRUE
    THIS.showPopUp(notification)
END FUNCTION

FUNCTION clickNotification(idNotification: string): Promise<void>
    IF THIS.activeNotification IS NOT NULL THEN
        AWAIT THIS.markAsRead()
        THIS.isVisible <- FALSE
        THIS.openApp()
    END IF
END FUNCTION
```

## 5.24 Kelas HistoryPage

**Nama Kelas:** *HistoryPage*  
**ID Kelas:** *C24*

Tabel 5.24.1. Operasi Kelas HistoryPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `openHistory(): Promise<void>` | `public` | Memuat halaman riwayat sesi pengguna dengan meminta objek `SessionHistory` melalui `SessionControl.fetchUserHistory()`. |
| `displayHistoryList(history: SessionHistory): void` | `public` | Mengambil pengelompokan arsip sesi berdasarkan status akhir (Selesai, Tidak Terlaksana, Dibatalkan) dari objek entitas `SessionHistory` dan merendernya ke layar. |
| `showEmptyState(message: string): void` | `public` | Menampilkan pesan keadaan kosong ("Belum ada sesi") apabila objek `SessionHistory` pengguna belum memiliki arsip sesi berstatus akhir. |
| `selectSession(idSession: string): void` | `public` | Menangani interaksi pengguna saat memilih salah satu kartu sesi pada daftar riwayat dan membuka detail sesi tersebut melalui `SessionPage.openSessionDetail(idSession)`. |

Tabel 5.24.2. Atribut Kelas HistoryPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `historyList` | `private` | `SessionHistory \| null` |
| `selectedStatusFilter` | `private` | `SessionStatus \| "ALL"` |
| `sessionControl` | `private` | `SessionControl` |
| `sessionPage` | `private` | `SessionPage` |

### 5.24.1 Algoritma/Query

**Nama Kelas:** *HistoryPage*  
**Nama Operasi:** `openHistory(): Promise<void>`  
**ID Algoritma:** *Algo-C24-01*

```text
FUNCTION openHistory(): Promise<void>
    history <- AWAIT THIS.sessionControl.fetchUserHistory(THIS.currentUserId)
    THIS.historyList <- history

    IF history.isEmpty() THEN
        THIS.showEmptyState("Belum ada sesi")
    ELSE
        groupedSessions <- history.getGroupedByStatus()
        THIS.displayHistoryList(history)
    END IF
END FUNCTION

FUNCTION selectSession(idSession: string): void
    THIS.sessionPage.openSessionDetail(idSession)
END FUNCTION
```

<br>

---

# BAB 6: Perancangan Antarmuka

## 6.1 Rancangan Antarmuka I-01

**Antarmuka:** I-01  
**Nama Layar:** Masuk

<p align="center">
<img alt="Rancangan Antarmuka I-01 - Masuk" src="./assets/diagram/ui-i01-signin.png" width="80%">
</p>
<p align="center">
<i>Gambar 6.1. Rancangan Antarmuka I-01 - Masuk</i>
</p>

Tabel 6.1. Spesifikasi Objek Antarmuka I-01

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| *I01-01* | *Text Field* | *Email, Kata Sandi* | *Masukan kredensial akun yang sudah terdaftar.* |
| *I01-02* | *Button* | *Masuk* | *Memanggil `UserController.authLogin(email, password)`. Jika berhasil, pengguna diarahkan ke I-03.* |
| *I01-03* | *Link* | *Daftar* | *Membuka I-02.* |

## 6.2 Rancangan Antarmuka I-02

**Antarmuka:** I-02  
**Nama Layar:** Daftar Akun

<p align="center">
<img alt="Rancangan Antarmuka I-02 - Daftar Akun" src="./assets/diagram/ui-i02-signup.png" width="80%">
</p>
<p align="center">
<i>Gambar 6.2. Rancangan Antarmuka I-02 - Daftar Akun</i>
</p>

Tabel 6.2. Spesifikasi Objek Antarmuka I-02

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| *I02-01* | *Text Field* | *Email Universitas, Kata Sandi, Nama Lengkap, Universitas, Program Studi* | *Data registrasi akun. Kata sandi minimal 8 karakter.* |
| *I02-02* | *Checkbox* | *Persetujuan Kebijakan Privasi* | *Wajib dicentang sebelum akun dapat dibuat.* |
| *I02-03* | *Button* | *Simpan* | *Memanggil `UserController.processRegistration(data)`; Validator memeriksa domain email universitas. Jika berhasil diarahkan ke I-01, jika gagal ke I-02a.* |
| *I02-04* | *Link* | *Masuk* | *Membuka I-01.* |

## 6.3 Rancangan Antarmuka I-02a

**Antarmuka:** I-02a  
**Nama Layar:** Daftar Akun Gagal

<p align="center">
<img alt="Rancangan Antarmuka I-02a - Daftar Akun Gagal" src="./assets/diagram/ui-i02a-signup-gagal.png" width="80%">
</p>
<p align="center">
<i>Gambar 6.3. Rancangan Antarmuka I-02a - Daftar Akun Gagal</i>
</p>

Tabel 6.3. Spesifikasi Objek Antarmuka I-02a

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| *I02a-01* | *Alert* | *Pendaftaran gagal. Harap gunakan email universitas yang valid.* | *Ditampilkan ketika Validator menolak domain email.* |
| *I02a-02* | *Text Field (Error)* | *Email Universitas* | *Field ditandai merah dengan pesan "Harap gunakan email universitas yang valid". Isian lain tetap tersimpan.* |
| *I02a-03* | *Button* | *Simpan* | *Mengirim ulang registrasi, sama seperti I02-03.* |

## 6.4 Rancangan Antarmuka I-03

**Antarmuka:** I-03  
**Nama Layar:** Beranda

<p align="center">
<img alt="Rancangan Antarmuka I-03 - Beranda" src="./assets/diagram/ui-i03-home.png" width="80%">
</p>
<p align="center">
<i>Gambar 6.4. Rancangan Antarmuka I-03 - Beranda</i>
</p>

Tabel 6.4. Spesifikasi Objek Antarmuka I-03

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| *I03-01* | *Navigation Menu* | *Home, Discover, History* | *Membuka I-03, I-04, dan I-09. Sidebar ini sama pada seluruh layar setelah login.* |
| *I03-02* | *List* | *My Sessions* | *Daftar sesi aktif pengguna. Item membuka I-05 atau I-05a; tombol + membuka I-11.* |
| *I03-03* | *Card* | *Nama dan email pengguna, ikon keluar* | *Kartu membuka I-07. Ikon keluar mengakhiri login dan kembali ke I-01.* |
| *I03-04* | *Card List* | *Sesi Aktif Terdekat* | *Hasil `SessionController.getUpcomingSessions(idUser)`. Tombol kartu membuka I-10 (Buka Ruang Obrolan), I-05a (Kelola Sesi), atau I-05 (Lihat Detail).* |
| *I03-05* | *Link* | *Lihat semua* | *Membuka I-09.* |
| *I03-06* | *Card List* | *Rekomendasi Sesi untukmu* | *Hasil `SessionController.findRecommendation(idUser)`. Tombol Gabung Sesi membuka I-05.* |
| *I03-07* | *Link* | *Cari sesi lain* | *Membuka I-04.* |

## 6.5 Rancangan Antarmuka I-03a

**Antarmuka:** I-03a  
**Nama Layar:** Beranda (Preferensi Belum Diatur)

<p align="center">
<img alt="Rancangan Antarmuka I-03a - Beranda (Preferensi Belum Diatur)" src="./assets/diagram/ui-i03a-home-preferensi-kosong.png" width="80%">
</p>
<p align="center">
<i>Gambar 6.5. Rancangan Antarmuka I-03a - Beranda (Preferensi Belum Diatur)</i>
</p>

Tabel 6.5. Spesifikasi Objek Antarmuka I-03a

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| *I03a-01* | *Alert* | *Preferensi belajar kamu belum diatur* | *Ditampilkan menggantikan rekomendasi ketika `Preference.isComplete()` bernilai false.* |
| *I03a-02* | *Button* | *Atur Preferensi* | *Membuka I-08.* |

## 6.6 Rancangan Antarmuka I-04

**Antarmuka:** I-04  
**Nama Layar:** Discover

<p align="center">
<img alt="Rancangan Antarmuka I-04 - Discover" src="./assets/diagram/ui-i04-discover.png" width="80%">
</p>
<p align="center">
<i>Gambar 6.6. Rancangan Antarmuka I-04 - Discover</i>
</p>

Tabel 6.6. Spesifikasi Objek Antarmuka I-04

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| *I04-01* | *Search Field* | *Search* | *Mencari sesi berdasarkan judul atau tag materi.* |
| *I04-02* | *Icon Button* | *Filter* | *Menyaring sesi berdasarkan tag materi, format, dan jadwal.* |
| *I04-03* | *Button* | *+ Buat Sesi* | *Membuka I-11.* |
| *I04-04* | *Card List* | *Rekomendasi Sesi untukmu* | *Hasil `SessionController.findRecommendation(idUser)`.* |
| *I04-05* | *Card List* | *Semua Sesi* | *Seluruh sesi terbuka yang belum dimulai. Tombol Gabung Sesi pada kartu membuka I-05.* |

## 6.7 Rancangan Antarmuka I-05

**Antarmuka:** I-05  
**Nama Layar:** Detail Sesi (Mentee)

<p align="center">
<img alt="Rancangan Antarmuka I-05 - Detail Sesi (Mentee)" src="./assets/diagram/ui-i05-detail-sesi.png" width="80%">
</p>
<p align="center">
<i>Gambar 6.7. Rancangan Antarmuka I-05 - Detail Sesi (Mentee)</i>
</p>

Tabel 6.7. Spesifikasi Objek Antarmuka I-05

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| *I05-01* | *Text* | *Judul, tag materi, format, deskripsi* | *Detail sesi dari `SessionController.getSessionDetail(idSession, idUser)`.* |
| *I05-02* | *Panel* | *Tanggal, Waktu, Format, Kapasitas* | *Tautan pertemuan disembunyikan sampai pengguna bergabung.* |
| *I05-03* | *List* | *Peserta* | *Daftar Mentee yang sudah bergabung dan sisa slot.* |
| *I05-04* | *Link* | *Lihat profil* | *Membuka I-07 milik Mentor.* |
| *I05-05* | *Button* | *Gabung Sesi* | *Memanggil `SessionControl.processRegistration(idSession, idMentee)`; slot diperiksa dengan `Session.checkCapacity()`. Jika berhasil, pengguna menjadi peserta dan tautan pertemuan ditampilkan.* |

## 6.8 Rancangan Antarmuka I-05a

**Antarmuka:** I-05a  
**Nama Layar:** Detail Sesi (Mentor)

<p align="center">
<img alt="Rancangan Antarmuka I-05a - Detail Sesi (Mentor)" src="./assets/diagram/ui-i05a-detail-sesi-mentor.png" width="80%">
</p>
<p align="center">
<i>Gambar 6.8. Rancangan Antarmuka I-05a - Detail Sesi (Mentor)</i>
</p>

Tabel 6.8. Spesifikasi Objek Antarmuka I-05a

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| *I05a-01* | *Button* | *Hapus Sesi* | *Membuka I-12.* |
| *I05a-02* | *Panel* | *Tanggal, Waktu, Format, Kapasitas* | *Tautan pertemuan selalu ditampilkan untuk Mentor.* |
| *I05a-03* | *List* | *Peserta* | *Daftar Mentee yang sudah bergabung.* |
| *I05a-04* | *Button* | *Buka Ruang Obrolan* | *Membuka I-10.* |
| *I05a-05* | *Button* | *Edit Sesi* | *Membuka I-06.* |

## 6.9 Rancangan Antarmuka I-06

**Antarmuka:** I-06  
**Nama Layar:** Edit Sesi

<p align="center">
<img alt="Rancangan Antarmuka I-06 - Edit Sesi" src="./assets/diagram/ui-i06-edit-sesi.png" width="80%">
</p>
<p align="center">
<i>Gambar 6.9. Rancangan Antarmuka I-06 - Edit Sesi</i>
</p>

Tabel 6.9. Spesifikasi Objek Antarmuka I-06

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| *I06-01* | *Text Field* | *Judul Sesi, Deskripsi* | *Terisi data sesi saat ini.* |
| *I06-02* | *Chip Group* | *Tag Materi* | *Memilih satu tag materi.* |
| *I06-03* | *Text Field* | *Tanggal, Jam Mulai, Jam Selesai* | *Validator menolak jadwal yang bertabrakan dengan sesi lain milik Mentor.* |
| *I06-04* | *Radio Group* | *Daring, Luring* | *Menentukan format sesi.* |
| *I06-05* | *Text Field* | *Tautan Pertemuan, Batas Peserta* | *Batas peserta harus 1–20 dan tidak kurang dari jumlah peserta saat ini.* |
| *I06-06* | *Card* | *Preview* | *Pratinjau kartu sesi yang diperbarui sesuai isian.* |
| *I06-07* | *Button* | *Simpan Perubahan* | *Memanggil `SessionController.editSession(idSession, idMentor, data)`, lalu kembali ke I-05a.* |
| *I06-08* | *Button* | *Batal* | *Kembali ke I-05a tanpa menyimpan.* |

## 6.10 Rancangan Antarmuka I-07

**Antarmuka:** I-07  
**Nama Layar:** Profil

<p align="center">
<img alt="Rancangan Antarmuka I-07 - Profil" src="./assets/diagram/ui-i07-profil.png" width="80%">
</p>
<p align="center">
<i>Gambar 6.10. Rancangan Antarmuka I-07 - Profil</i>
</p>

Tabel 6.10. Spesifikasi Objek Antarmuka I-07

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| *I07-01* | *Text* | *Nama, universitas, program studi, email, bio* | *Data dari `UserControl.fetchUserProfile(idUser)`.* |
| *I07-02* | *Button* | *Edit Preferensi* | *Membuka I-08. Hanya tampil pada profil milik sendiri.* |
| *I07-03* | *Card* | *Statistik sesi dan rating* | *Ringkasan jumlah sesi sebagai Mentee, sebagai Mentor, dan rating Mentor.* |
| *I07-04* | *Chip Group* | *Tag Materi, Format Belajar* | *Data dari `UserControl.fetchUserPreference(idUser)`.* |
| *I07-05* | *Grid* | *Ketersediaan Waktu* | *Slot waktu kosong per hari (hanya baca).* |

## 6.11 Rancangan Antarmuka I-08

**Antarmuka:** I-08  
**Nama Layar:** Edit Preferensi

<p align="center">
<img alt="Rancangan Antarmuka I-08 - Edit Preferensi" src="./assets/diagram/ui-i08-edit-preferensi.png" width="80%">
</p>
<p align="center">
<i>Gambar 6.11. Rancangan Antarmuka I-08 - Edit Preferensi</i>
</p>

Tabel 6.11. Spesifikasi Objek Antarmuka I-08

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| *I08-01* | *Chip Group* | *Tag Materi* | *Memilih satu atau lebih tag materi.* |
| *I08-02* | *Checkbox Group* | *Daring, Luring* | *Memilih format belajar.* |
| *I08-03* | *Grid* | *Ketersediaan Waktu* | *Memilih slot waktu kosong per hari.* |
| *I08-04* | *Button* | *Simpan Preferensi* | *Memanggil `UserControl.savePreference(idUser, data)`; Validator memastikan semua bagian terisi. Kembali ke I-07.* |
| *I08-05* | *Button* | *Batal* | *Kembali ke I-07 tanpa menyimpan.* |

## 6.12 Rancangan Antarmuka I-09

**Antarmuka:** I-09  
**Nama Layar:** History

<p align="center">
<img alt="Rancangan Antarmuka I-09 - History" src="./assets/diagram/ui-i09-history.png" width="80%">
</p>
<p align="center">
<i>Gambar 6.12. Rancangan Antarmuka I-09 - History</i>
</p>

Tabel 6.12. Spesifikasi Objek Antarmuka I-09

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| *I09-01* | *Segmented Control* | *Semua, Mentee, Mentor* | *Menyaring riwayat berdasarkan peran pengguna.* |
| *I09-02* | *List* | *Berlangsung, Terlaksana, Tidak Terlaksana* | *Hasil `SessionController.fetchUserHistory(idUser)` yang dikelompokkan berdasarkan status.* |
| *I09-03* | *Button* | *Buka Obrolan* | *Membuka I-10.* |
| *I09-04* | *Button* | *Lihat Feedback* | *Membuka I-15 (Mentor).* |
| *I09-05* | *Button* | *Beri Penilaian* | *Membuka I-14 (Mentee).* |
| *I09-06* | *Button* | *Lihat Detail* | *Membuka I-05 atau I-05a.* |

## 6.13 Rancangan Antarmuka I-10

**Antarmuka:** I-10  
**Nama Layar:** Grup Obrolan

<p align="center">
<img alt="Rancangan Antarmuka I-10 - Grup Obrolan" src="./assets/diagram/ui-i10-grup-obrolan.png" width="80%">
</p>
<p align="center">
<i>Gambar 6.13. Rancangan Antarmuka I-10 - Grup Obrolan</i>
</p>

Tabel 6.13. Spesifikasi Objek Antarmuka I-10

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| *I10-01* | *List* | *Pesan* | *Riwayat pesan dari `ChatController.getGroupChat(idSession, idUser)`; pesan baru diterima secara real-time.* |
| *I10-02* | *Text Field* | *Tulis pesan...* | *Masukan isi pesan.* |
| *I10-03* | *Icon Button* | *Kirim* | *Memanggil `ChatController.sendMessage(idGroupChat, idUser, text)`.* |
| *I10-04* | *Panel* | *Info Sesi* | *Jadwal dan tautan pertemuan sesi.* |
| *I10-05* | *Button* | *Lihat Detail Sesi* | *Membuka I-05 atau I-05a.* |
| *I10-06* | *List* | *Anggota* | *Daftar Mentor dan Mentee dalam grup. Nama membuka I-07.* |

## 6.14 Rancangan Antarmuka I-11

**Antarmuka:** I-11  
**Nama Layar:** Buat Sesi

<p align="center">
<img alt="Rancangan Antarmuka I-11 - Buat Sesi" src="./assets/diagram/ui-i11-buat-sesi.png" width="80%">
</p>
<p align="center">
<i>Gambar 6.14. Rancangan Antarmuka I-11 - Buat Sesi</i>
</p>

Tabel 6.14. Spesifikasi Objek Antarmuka I-11

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| *I11-01* | *Text Field* | *Judul Sesi, Deskripsi* | *Deskripsi bersifat opsional.* |
| *I11-02* | *Chip Group* | *Tag Materi* | *Memilih satu tag materi.* |
| *I11-03* | *Text Field* | *Tanggal, Jam Mulai, Jam Selesai* | *Validator menolak jadwal yang bertabrakan dengan sesi lain milik Mentor.* |
| *I11-04* | *Radio Group* | *Daring, Luring* | *Menentukan format sesi.* |
| *I11-05* | *Text Field* | *Tautan Pertemuan, Batas Peserta* | *Batas peserta harus 1–20.* |
| *I11-06* | *Card* | *Preview* | *Pratinjau kartu sesi yang diperbarui sesuai isian.* |
| *I11-07* | *Button* | *Buat Sesi* | *Memanggil `SessionController.processSessionCreation(idMentor, data)`, lalu membuka I-05a.* |
| *I11-08* | *Button* | *Batal* | *Kembali ke I-04 tanpa menyimpan.* |

## 6.15 Rancangan Antarmuka I-12

**Antarmuka:** I-12  
**Nama Layar:** Konfirmasi Hapus Sesi

<p align="center">
<img alt="Rancangan Antarmuka I-12 - Konfirmasi Hapus Sesi" src="./assets/diagram/ui-i12-hapus-sesi.png" width="80%">
</p>
<p align="center">
<i>Gambar 6.15. Rancangan Antarmuka I-12 - Konfirmasi Hapus Sesi</i>
</p>

Tabel 6.15. Spesifikasi Objek Antarmuka I-12

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| *I12-01* | *Dialog* | *Hapus sesi ini?* | *Konfirmasi sebelum sesi dihapus.* |
| *I12-02* | *Button* | *Batal* | *Menutup dialog dan kembali ke I-05a.* |
| *I12-03* | *Button* | *Hapus Sesi* | *Memanggil `SessionController.deleteSession(idSession, idMentor)`; peserta diberi notifikasi. Kembali ke I-03.* |

## 6.16 Rancangan Antarmuka I-13

**Antarmuka:** I-13  
**Nama Layar:** Konfirmasi Keluar Sesi

<p align="center">
<img alt="Rancangan Antarmuka I-13 - Konfirmasi Keluar Sesi" src="./assets/diagram/ui-i13-keluar-sesi.png" width="80%">
</p>
<p align="center">
<i>Gambar 6.16. Rancangan Antarmuka I-13 - Konfirmasi Keluar Sesi</i>
</p>

Tabel 6.16. Spesifikasi Objek Antarmuka I-13

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| *I13-01* | *Button* | *Keluar Sesi* | *Membuka dialog konfirmasi.* |
| *I13-02* | *Dialog* | *Keluar dari sesi?* | *Konfirmasi sebelum Mentee keluar dari sesi.* |
| *I13-03* | *Button* | *Kembali* | *Menutup dialog.* |
| *I13-04* | *Button* | *Keluar* | *Memanggil `SessionControl.cancelSession(idSession, idMentee)`; pengguna dikeluarkan dari peserta dan grup obrolan. Kembali ke I-03.* |

## 6.17 Rancangan Antarmuka I-14

**Antarmuka:** I-14  
**Nama Layar:** Konfirmasi Keterlaksanaan & Penilaian

<p align="center">
<img alt="Rancangan Antarmuka I-14 - Konfirmasi Keterlaksanaan & Penilaian" src="./assets/diagram/ui-i14-konfirmasi-penilaian.png" width="80%">
</p>
<p align="center">
<i>Gambar 6.17. Rancangan Antarmuka I-14 - Konfirmasi Keterlaksanaan & Penilaian</i>
</p>

Tabel 6.17. Spesifikasi Objek Antarmuka I-14

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| *I14-01* | *Option Group* | *Terlaksana, Tidak terlaksana* | *Memanggil `SessionController.processSessionConfirmation(idSession, idUser, status, alasan)`.* |
| *I14-02* | *Rating* | *1–5 bintang* | *Penilaian untuk sesi.* |
| *I14-03* | *Text Field* | *Catatan* | *Opsional.* |
| *I14-04* | *Button* | *Kirim* | *Memanggil `FeedbackController.submitFeedback(idSession, idMentee, rating, comment)`, lalu kembali ke I-09.* |
| *I14-05* | *Button* | *Nanti, ikon tutup* | *Menutup dialog tanpa menyimpan. Penilaian dapat diisi kemudian dari I-09.* |

## 6.18 Rancangan Antarmuka I-15

**Antarmuka:** I-15  
**Nama Layar:** Feedback Sesi

<p align="center">
<img alt="Rancangan Antarmuka I-15 - Feedback Sesi" src="./assets/diagram/ui-i15-feedback-sesi.png" width="80%">
</p>
<p align="center">
<i>Gambar 6.18. Rancangan Antarmuka I-15 - Feedback Sesi</i>
</p>

Tabel 6.18. Spesifikasi Objek Antarmuka I-15

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| *I15-01* | *Text* | *Judul sesi, tag materi, status, jadwal* | *Informasi sesi yang telah selesai.* |
| *I15-02* | *Card* | *Rata-rata rating, jumlah penilaian, distribusi* | *Ringkasan dari `FeedbackController.retrieveFeedbackBySession(idSession, idMentor)`.* |
| *I15-03* | *List* | *Feedback Mentee* | *Nama, rating, tanggal, dan catatan dari setiap Mentee.* |
| *I15-04* | *Link* | *History* | *Kembali ke I-09.* |

## 6.19 Rancangan Antarmuka I-16

**Antarmuka:** I-16  
**Nama Layar:** Notifikasi Pengingat Sesi

<p align="center">
<img alt="Rancangan Antarmuka I-16 - Notifikasi Pengingat Sesi" src="./assets/diagram/ui-i16-notifikasi-pengingat.png" width="80%">
</p>
<p align="center">
<i>Gambar 6.19. Rancangan Antarmuka I-16 - Notifikasi Pengingat Sesi</i>
</p>

Tabel 6.19. Spesifikasi Objek Antarmuka I-16

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| *I16-01* | *Toast* | *Sesi dimulai 15 menit lagi, nama dan jam sesi* | *Dikirim oleh `NotificationController.sendSessionReminders(now)` 15 menit sebelum sesi dimulai.* |
| *I16-02* | *Link* | *Lihat Detail* | *Memanggil `NotificationController.markAsRead(idNotification, idUser)`, lalu membuka I-05 atau I-05a.* |
| *I16-03* | *Icon Button* | *Tutup* | *Menutup notifikasi.* |

## 6.20 Rancangan Antarmuka Keseluruhan

Tabel 6.20. Rancangan Antarmuka Keseluruhan

| No | Tampilan Antarmuka |
| :--- | :--- |
| I-01<br>Masuk | <img src="./assets/diagram/ui-i01-signin.png" alt="I-01 - Masuk" width="400"> |
| I-02<br>Daftar Akun | <img src="./assets/diagram/ui-i02-signup.png" alt="I-02 - Daftar Akun" width="400"> |
| I-02a<br>Daftar Akun Gagal | <img src="./assets/diagram/ui-i02a-signup-gagal.png" alt="I-02a - Daftar Akun Gagal" width="400"> |
| I-03<br>Beranda | <img src="./assets/diagram/ui-i03-home.png" alt="I-03 - Beranda" width="400"> |
| I-03a<br>Beranda (Preferensi Belum Diatur) | <img src="./assets/diagram/ui-i03a-home-preferensi-kosong.png" alt="I-03a - Beranda (Preferensi Belum Diatur)" width="400"> |
| I-04<br>Discover | <img src="./assets/diagram/ui-i04-discover.png" alt="I-04 - Discover" width="400"> |
| I-05<br>Detail Sesi (Mentee) | <img src="./assets/diagram/ui-i05-detail-sesi.png" alt="I-05 - Detail Sesi (Mentee)" width="400"> |
| I-05a<br>Detail Sesi (Mentor) | <img src="./assets/diagram/ui-i05a-detail-sesi-mentor.png" alt="I-05a - Detail Sesi (Mentor)" width="400"> |
| I-06<br>Edit Sesi | <img src="./assets/diagram/ui-i06-edit-sesi.png" alt="I-06 - Edit Sesi" width="400"> |
| I-07<br>Profil | <img src="./assets/diagram/ui-i07-profil.png" alt="I-07 - Profil" width="400"> |
| I-08<br>Edit Preferensi | <img src="./assets/diagram/ui-i08-edit-preferensi.png" alt="I-08 - Edit Preferensi" width="400"> |
| I-09<br>History | <img src="./assets/diagram/ui-i09-history.png" alt="I-09 - History" width="400"> |
| I-10<br>Grup Obrolan | <img src="./assets/diagram/ui-i10-grup-obrolan.png" alt="I-10 - Grup Obrolan" width="400"> |
| I-11<br>Buat Sesi | <img src="./assets/diagram/ui-i11-buat-sesi.png" alt="I-11 - Buat Sesi" width="400"> |
| I-12<br>Konfirmasi Hapus Sesi | <img src="./assets/diagram/ui-i12-hapus-sesi.png" alt="I-12 - Konfirmasi Hapus Sesi" width="400"> |
| I-13<br>Konfirmasi Keluar Sesi | <img src="./assets/diagram/ui-i13-keluar-sesi.png" alt="I-13 - Konfirmasi Keluar Sesi" width="400"> |
| I-14<br>Konfirmasi Keterlaksanaan & Penilaian | <img src="./assets/diagram/ui-i14-konfirmasi-penilaian.png" alt="I-14 - Konfirmasi Keterlaksanaan & Penilaian" width="400"> |
| I-15<br>Feedback Sesi | <img src="./assets/diagram/ui-i15-feedback-sesi.png" alt="I-15 - Feedback Sesi" width="400"> |
| I-16<br>Notifikasi Pengingat Sesi | <img src="./assets/diagram/ui-i16-notifikasi-pengingat.png" alt="I-16 - Notifikasi Pengingat Sesi" width="400"> |

<br>

---

# BAB 7: Matriks Kerunutan

Matriks kerunutan berikut memetakan keterkaitan antara setiap kelas perancangan dengan *use case* yang diimplementasikannya pada perangkat lunak **PeerUP**.

Tabel 7.1. Matriks Kerunutan Kelas terhadap Use Case

| Kelas | Use Case Terkait |
| :--- | :--- |
| *C01 - User* | *UC01, UC02, UC05, UC06, UC07, UC08, UC09, UC14, UC15* |
| *C02 - Mentor* | *UC01, UC02, UC03, UC05, UC06, UC07, UC08, UC09, UC11, UC12, UC13, UC14, UC15* |
| *C03 - Mentee* | *UC01, UC02, UC04, UC05, UC06, UC07, UC08, UC09, UC10, UC14, UC15* |
| *C04 - Session* | *UC03, UC04, UC05, UC06, UC07, UC08, UC09, UC10, UC11, UC12, UC13, UC14* |
| *C05 - GroupChat* | *UC08* |
| *C06 - Feedback* | *UC07, UC13* |
| *C07 - SessionHistory* | *UC05, UC06, UC10, UC11, UC12, UC13* |
| *C08 - ChatMessage* | *UC08* |
| *C09 - Preference* | *UC02, UC04, UC14, UC15* |
| *C10 - Profile* | *UC01, UC02, UC15* |
| *C11 - Dashboard* | *UC01, UC04, UC06, UC09, UC14* |
| *C12 - UserControl* | *UC01, UC02, UC15* |
| *C13 - SessionControl* | *UC03, UC04, UC05, UC06, UC10, UC11, UC12, UC14* |
| *C14 - FeedbackControl* | *UC07, UC13* |
| *C15 - LoginPage* | *UC01* |
| *C16 - ProfilePage* | *UC02, UC15* |
| *C17 - SessionPage* | *UC03, UC04, UC05, UC10, UC11, UC12* |
| *C18 - HostSessionPage* | *UC03, UC05, UC11, UC12, UC13* |
| *C19 - ParticipantSessionPage* | *UC04, UC05, UC10* |
| *C20 - FeedbackForm* | *UC07, UC13* |
| *C21 - GroupChatPage* | *UC08* |
| *C22 - Notification* | *UC09* |
| *C23 - PopUpNotification* | *UC09* |
| *C24 - HistoryPage* | *UC06* |



# Lampiran
- https://www.figma.com/design/KHUnZ5eoo8LLb4JlLLY7lD/PeerUP?node-id=0-1&t=HUsRNIOViUmjL4Xl-1
