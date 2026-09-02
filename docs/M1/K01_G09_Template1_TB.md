<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 1
<br>
TOPIC BRAINSTORMING
</h1>
<br>

## PeerUP

### Untuk: _Mikhael Andrian Yonatan_

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | _K01_ |
| Kelompok | _G09_ |

| NIM        | Nama                              |
| ---------- | --------------------------------- |
| _13525049_ | _Hugo Daniel Johansen Napitupulu_ |
| _13525001_ | _Matthew Allen Reynaldo_          |
| _13525010_ | _Fabian Amzar Susanto_            |
| _13525025_ | _David Christian_                 |
| _13525028_ | _Markus Christiano Simanjutak_    |

---

<br>
<br>

# BAB 1: Analisis Permasalahan

## 1.1 Latar Belakang Masalah

Pencapaian Sustainable Development Goals (SDGs) Nomor 4: Pendidikan Bermutu memiliki target untuk memastikan pendidikan yang inklusif dan merata, serta mendorong kesempatan belajar sepanjang hayat bagi semua orang. Namun, realitas pendidikan di Indonesia, khususnya bagi siswa dan mahasiswa yang mempersiapkan ujian penting seperti Tes Kemampuan Akademik (TKA), Ujian Tulis Berbasis Komputer (UTBK), dan ujian akhir, masih penuh dengan ketimpangan baik dari sisi infrastruktur maupun kesempatan. Bimbingan di luar institusi akademik biasanya membutuhkan biaya yang besar, sehingga siswa-siswi biasanya segan ataupun sulit mendapat akses diskusi dan bimbingan belajar, terutama pelajar kalangan ekonomi menengah ke bawah.

Di zaman di mana teknologi memarak kemana-mana, masalah ini diperparah oleh isolasi sosial. Banyak pelajar di tingkat pendidikan tinggi terus belajar sendirian karena mereka sering mempersepsikan pemeringkatan kelas sebagai kompetisi saling mengalahkan. Padahal, diskusi dan kolaborasi berbasis hubungan pertemanan dan interaksi sosial terbukti secara signifikan meningkatkan performa tim dalam menyelesaikan masalah atau tugas-tugas yang kompleks.

Pendekatan learning-by-teaching telah diakui dapat meningkatkan penyerapan materi pelajaran dan memperkuat relasi sosial antar-pelajar. Studi terbaru tentang program study buddy membuktikan bahwa kolaborasi antara pelajar yang nilainya di atas rata-rata (bertindak sebagai mentor) dan pelajar di bawah rata-rata (bertindak sebagai protégé) memberikan manfaat peningkatan nilai akademik yang sama besarnya bagi kedua belah pihak. Oleh karena itu, terdapat urgensi yang tinggi untuk menyediakan sebuah ekosistem digital gratis yang meruntuhkan batasan-batasan ini, memfasilitasi pelajar untuk menemukan study buddy yang tepat demi kesuksesan akademik bersama.

## 1.2 Analisis Kondisi Saat Ini

Di zaman yang sangat maju ini, para pelajar memiliki banyak metode yang dapat mereka pakai untuk belajar. Berikut adalah beberapa situasi metode pembelajaran yang paling sering digunakan oleh para pelajar di zaman sekarang.

# 1.2.1 Ketergantungan pada Kecerdasan Buatan (AI)

Banyak pelajar kini memanfaatkan AI berbayar maupun gratis sebagai tutor pribadi mereka. Sebenarnya, pemanfaatan AI sebagai tutor belajar itu sangat bagus karena teknologi ini membuat para pelajar memiliki tutor pribadi pintar yang mudah digunakan, dapat dipakai siapa saja, dan relatif murah.

Akan tetapi, hal ini juga menimbulkan sebuah gap yang kritis. Berinteraksi secara eksklusif dengan mesin menghilangkan komponen interaksi sosial dan bahasa tubuh yang krusial untuk melancarkan komunikasi kognitif antarmanusia. Selain itu, belajar dengan AI tidak memberikan kesempatan kepada pengguna untuk merasakan "efek protégé", yaitu dorongan motivasi dan retensi memori tingkat tinggi yang hanya didapatkan ketika seseorang berusaha keras menjelaskan sebuah konsep kepada orang lain.

# 1.2.2 Platform EdTech Berbasis Subskripsi

Solusi seperti platform EdTech (Skuling, Pahamify, atau Zenius) menggunakan model bisnis berlangganan yang diskriminatif secara ekonomi yang membuat para pelajar dengan anggaran yang terbatas sulit untuk mengakses platform-platform ini. Sistem ini juga lebih banyak berjalan satu arah. Hal ini juga berarti para pelajar tidak mendapatkan koneksi ataupun sosialisasi yang cukup untuk memaksimalkan potensi dan pembelajaran mereka. Metode belajar ini gagal mewadahi kebutuhan pelajar yang membutuhkan komunikasi dua arah secara real-time dengan tutor ataupun teman sebaya.

# 1.2.3 Pencarian Teman Belajar secara Manual

Pelajar sering mencari teman belajar secara acak di media sosial, mau itu dari group WhatsApp, Line, ataupun saat diajak. Situasi ini sangat bagus karena mendorong interaksi yang natural dan mendorong kolaborasi yang memang disetujui dan diinginkan oleh semua orang yang terlibat dalam kelompok belajarnya. Akan tetapi, kondisi semacam ini memiliki gap yang cukup besar juga. Banyak pelajar yang memiliki kesulitan dalam bertemu dan berbicara dengan orang baru, mau itu untuk berkomunikasi maupun untuk membuat kelompok belajar. Hal ini diperparah lagi dengan maraknya digitalisasi dan kecanduan sosial media yang dapat menghambat kemampuan sosialisasi para pelajar dan membuat mereka terisolasi dari dunia nyata. Gap-nya juga terletak pada tidak adanya struktur atau sistem pencarian grup belajar yang jelas. Sering kali jadwal mereka berbenturan atau mereka terjebak pada kelompok yang tingkat pemahamannya sama-sama rendah, sehingga tidak terjadi transfer ilmu dari sosok mentor ke protégé.

# Kesenjangan yang Akan Diselesaikan:

Perangkat lunak yang kami kembangkan hadir untuk membantu mengisi celah ini melalui platform matching study group. Platform ini bertindak seperti fasilitator otomatis yang mencocokkan pengguna berdasarkan metrik yang jelas: tingkat penguasaan materi, ketersediaan waktu, dan topik/pelajaran yang ingin didiskusikan. Dengan memfasilitasi terbentuknya kelompok belajar yang lebih jelas dan terstruktur, aplikasi ini menghadirkan solusi berbiaya rendah dan terukur untuk meningkatkan pengalaman pendidikan pelajar.

---

# BAB 2: Analisis Solusi

## 2.1 Deskripsi Perangkat Lunak

PeerUP merupakan perangkat lunak yang menjadi jawaban bagi pelajar yang ingin belajar tanpa menguras biaya pada bimbingan belajar dan pelajar yang ingin belajar bersama dalam study group. PeerUP hadir sebagai situs web agar pengguna dapat memanfaatkan fitur-fitur tanpa perlu mengunduh aplikasi khusus. Bentuk situs web juga memungkinkan untuk melakukan penambahan fitur dan pemeliharaan perangkat lunak tanpa menuntut update dari pengguna.

Dari sudut pandang pengguna, situs web ini akan menampung semua sesi tutor sebaya yang tersedia dalam bentuk dashboard yang dapat diakses oleh semua pengguna. Selain itu, pengguna juga dapat memafaatkan fitur matching berbasis preferensi belajar mereka agar bertemu dengan pengguna lain yang seminat atau sefrekuensi.

Nilai inovasi dari PeerUP terletak pada layanan peer tutoring yang terjangkau dan ekonomis dan sistem matchmaking dalam satu ekosistem perangkat lunak yang terstruktur.Berbeda dengan perangkat lunak edukatif lain seperti Zenius dan Pahamify yang berbasis sistem langganan berbayar dan fokus pada materi modul searah, PeerUP mengedepankan interaksi sosial dan diskusi antarpelajar.

## 2.2 Asumsi dan Batasan

Asumsi:

- User bisa menilai tingkat penguasaan terhadap suatu hal atau materi
- User punya akses internet dan device yang memadai
- Pengguna tidak menggunakan perangkat lunaknya untuk melakukan hal selain untuk kepentingan pembelajaran
- User memiliki niat untuk belajar dan berkolaborasi dalam study group dan sesi tutoring
- User bisa mengoperasikan situs web secara efektif
- Tim developer harus dapat menjaminkan data pengguna aman

Batasan:

- Hanya mencakup pengguna yang ada di Indonesia dan berdasarkan lokasi pengguna
- Keefektifan pembelajaran tergantung oleh user-user lain

Ketentuan Hukum:

- UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi
- UU No. 1 Tahun 2024 (UU ITE)
- PP Nomor 17 Tahun 2025 (PP Tunas)

---

# BAB 3: Spesifikasi Kebutuhan dan Proses Bisnis

## 3.1 Identifikasi Aktor

Buatlah daftar seluruh aktor (pengguna) yang akan berinteraksi langsung dengan sistem solusi yang kalian kembangkan. Berikan penjelasan singkat mengenai peran dan karakteristik dari masing-masing aktor tersebut.

| Aktor  | Deskripsi                                                                                                                                                                                                                       |
| :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Tutor  | _User yang mendaftarkan materi, Menentukan ketersediaan waktu dan kapasitas peserta per sesi, lalu memberi materi pada sesi yang terbentuk. Satu orang dapat berperan sebagai Tutor sekaligus Mentee untuk materi yang berbeda_ |
| Mentee | _User yang mendaftarkan materi yang ingin dipelajarinya beserta ketersediaan waktunya, lalu mengikuti sesi belajar bersama Tutor atau sesama Mentee_                                                                            |
| Sistem | _Menjalankan pencocokan untuk study group secara terjadwal berdasarkan materi dan waktu, serta mencatat keterlaksanaan sesi_                                                                                                     |

## 3.2 Kebutuhan Pengguna Awal

| ID    | Aktor    | Kebutuhan / Aktivitas                                                   | Tujuan / Nilai                                                                        |
| :---- | :------- | :---------------------------------------------------------------------- | :------------------------------------------------------------------------------------ |
| US-01 | _Tutor_  | _Saya ingin mendaftar dan masuk menggunakan akun universitas valid_     | _sehingga saya bisa mengakses semua fitur_                                            |
| US-02 | _Tutor_  | _Saya ingin mengisi materi yang saya bisa_                              | _sehingga saya dipertemukan dengan orang yang membutuhkannya_                         |
| US-03 | _Tutor_  | _Saya ingin membuat sesi mengajar_                                      | _sehingga saya bisa mengajar dengan waktu kosong_                                     |
| US-04 | _Tutor_  | _Saya ingin menetapkan jumlah maksimum peserta dalam satu sesi_         | _sehingga sesi tetap efektif_                                                         |
| US-05 | _Tutor_  | _Saya ingin menerima info mentee beserta materi dan waktunya_           | _sehingga saya tahu harus bertemu siapa dan kapan_                                    |
| US-06 | _Tutor_  | _Saya ingin mencatat apakah sesi jadi terlaksana_                       | _sehingga catatan sistem sesuai keadaan sebenarnya_                                   |
| US-07 | _Tutor_  | _Saya ingin melihat riwayat sesi yang pernah saya jalani_               | _sehingga saya bisa mengecek apa saja yang sudah saya ajarkan_                        |
| US-08 | _Tutor_  | _Saya ingin memberi penilaian singkat setelah sesi_                     | _sehingga kualitas pencocokan berikutnya membaik_                                     |
| US-09 | _Mentee_ | _Saya ingin mendaftar dan masuk menggunakan akun universitas valid_     | _sehingga saya bisa mengakses semua fitur_                                            |
| US-10 | _Mentee_ | _Saya ingin mengisi materi yang ingin saya pelajari_                    | _sehingga saya memperoleh bantuan yang sesuai_                                        |
| US-11 | _Mentee_ | _Saya ingin mengisi ketersediaan waktu_                                 | _sehingga saya tidak dipasangkan pada jadwal yang saya tidak bisa_                    |
| US-12 | _Mentee_ | _Saya ingin menerima info tutor atau teman beserta materi dan waktunya_ | _sehingga saya tahu harus bertemu siapa dan kapan_                                    |
| US-13 | _Mentee_ | _Saya ingin mencatat apakah sesi jadi terlaksana_                       | _sehingga catatan sistem sesuai keadaan sebenarnya_                                   |
| US-14 | _Mentee_ | _Saya ingin melihat riwayat sesi yang pernah saya jalani_               | _sehingga saya bisa menelusuri apa saja yang sudah saya pelajari_                     |
| US-15 | _Mentee_ | _Saya ingin memberi penilaian singkat setelah sesi_                     | _sehingga kualitas pencocokan berikutnya membaik dan bisa melaporkan yang bermasalah_ |
| US-16 | _Mentee_ | _Saya ingin menentukan online atau offline_                             | _sehingga sesuai dengan ketersediaan saya_                                            |
| US-17 | _Tutor_  | _Saya ingin menentukan online atau offline_                             | _sehingga sesuai dengan ketersediaan saya_                                            |
| US-18 | _Mentee_ | _Saya ingin menghubungi teman atau tutor_                               | _sehingga bisa berkomunikasi dengan jelas terkait sesi_                               |
| US-19 | _Tutor_  | _Saya ingin menghubungi mentee_                                         | _sehingga bisa berkomunikasi dengan jelas terkait sesi_                               |

## 3.3 Deskripsi Aktivitas

| ID  | Aktivitas                                  | Penjelasan                                                                      | ID User Story           |
| :-- | :----------------------------------------- | :------------------------------------------------------------------------------ | :---------------------- |
| A01 | Melakukan Registrasi dan Autentikasi       | User mendaftar dan masuk menggunakan akun universitas valid                     | US-01 US-09             |
| A02 | Mengisi Kebutuhan Materi                   | User memilih materi yang ingin dipelajari dan dikuasai                          | US-02 US-010            |
| A03 | Mengisi Ketersediaan Waktu                 | User menandai waktu saat mereka bisa                                            | US-11                   |
| A04 | Membuat Sesi Baru                          | User membuat sesi baru dan mengisi slot                                         | US-03 US-04             |
| A05 | Menjalankan Pencocokan Jadwal              | Sistem mencocokan mentee untuk membuat study group berdasarkan materi dan waktu | US-11 US-10             |
| A06 | Melaksanakan Sesi Belajar                  | Kedua pihak bertemu sesuai kesepakatan bisa offline atau online                 | US-04 US-12 US-16 US-17 |
| A07 | Konfirmasi Sesi                            | Sistem menanyakan dan mencatat sesi                                             | US-06 US-13             |
| A08 | Melihat History Sesi                       | User bisa melihat daftar sesi yang pernah dijalaninya sebagai tutor atau mentee | US-07 US-14             |
| A09 | Memberikan Feedback Sehabis Sesi           | User memberi penilaian singkat dan catatan opsional ke orang pada sesi tersebut | US-08 US-15             |
| A10 | Berkomunikasi Melalui Temporary Group Chat | User bisa chat teman atau tutor atau mentee                                     | US-18 US-19             |

## 3.4 Model Proses Bisnis

Buatlah Activity Diagram atau Swimlane Diagram yang menunjukkan alur kerja proses bisnis dari sistem solusi. Diagram ini harus memvisualisasikan bagaimana alur operasional di dunia nyata berjalan lebih efisien dengan adanya interaksi antara aktor (yang didefinisikan pada poin 3.1) dan sistem perangkat lunak. Perhatikan notasi yang digunakan dalam pembuatannya.
<br>

# Referensi

- Diagram UML: https://www.drawio.com/, https://staruml.io/
- Jones, A., Reznik, G., Hossain, A. R., dkk. (2025). Study buddy learning is associated with academic success in undergraduate science courses. bioRxiv.
- Badan Pusat Statistik (BPS). (2023). Potret Pendidikan Indonesia: Statistik Pendidikan 2023. Jakarta: BPS.
- United Nations (UN). (2023). The Sustainable Development Goals Report 2023: Special Edition. New York: United Nations.
- Mahanal, S., & Zubaidah, S. (2024). Keefektifan Peer-to-Peer Tutoring di Era Digital. Jurnal Inovasi Pendidikan, 15(1), 112-125.
- Torrens University Australia. (n.d.). The 5 Big Benefits of Studying with Friends and How it Could Save You Money.
