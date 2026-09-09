<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 2
<br>
REQUIREMENT GATHERING
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

## Daftar Perubahan

| Revisi | Deskripsi |
| :--- | :--- |
| *A* | *Deskripsikan perubahan yang dilakukan dari dokumen sebelumnya pada dokumen ini. Jika tidak terdapat perubahan, harap kosongkan tabel.* |
| *B* | |
| *C* | |
| ... | |

<br>
<br>

# BAB 1: Deskripsi Umum

## 1.1 Deskripsi Umum Sistem

Abstraksikan sistem solusi menurut sudut pandang pengguna yang telah ditentukan. Jelaskan secara ringkas mengenai apa saja ekspektasi pengguna terhadap sistem yang akan dikembangkan, alur kerja sistem yang diinginkan, serta harapan dari penerapan solusi dalam bentuk narasi.

> *Sistem adalah kesatuan utuh antara perangkat lunak, pengguna, perangkat keras, dan proses bisnis (urutan langkah logis yang dilakukan di dunia nyata untuk menyelesaikan suatu pekerjaan atau mencapai tujuan tertentu).*

PeerUP adalah sebuah perangkat lunak berbasis platform digital yang dirancang untuk memfasilitasi pembelajaran kolaboratif (peer-to-peer tutoring). PeerUp akan menjadi platform untu mempertemukan pelajar yang membutuhkan bantuan pemahaman materi tertentu dengan tutor sebaya yang memiliki penguasaan materi lebih baik, jadwal yang selaras, dan preferensi belajar yang cocok. Hal ini akan membuat kedua belah pihak dapat belajar bersama dan bahkan membuat study group sendriri  

Secara naratif, alur kerja sistem ini dimulai ketika pengguna (tutor ataupun pelajar) membuat sebuah akun dan mengatur profil mereka. Siswa (Mentee) kemudian dapat mengisi preferensi sesi tutoring (kebutuhan materi, ketersediaan waktu, sesi online offline) dan memilih sesi yang tersedia. Sementara itu tutor (mentor) dapat Membuat sesi dengan menyertakan keterangan (topik materi, jadwal sesi, sesi online/offline, kapasitas maksimum peserta). Sistem akan mencocokkan para mentee dengan mentor yang sesuai dengan preferensi satu sama lain. Selain itu, sebuh group chat sesi sementara akan dibuat oleh sistem untuk menjadi sarana mereka berkomunikasi tentang sesi mereka. Setelah ini, mereka dapat merencakanakan sesi belajar bersama mereka sesuai dengan persetujuan satu sama lain.

Dari sisi mahasiswa atau peserta didik, mereka mengekspektasikan sebuah metode pembelajaran yang efektif dan mudah dibentuk. Selain itu, mereka juga mengekspektasikan sebuah lingkungan belajar yang lebih interaktif, organik, dan mudah dibentuk, bukan sekadar dipaparkan materi secara pasif satu arah. Mereka. Dengan adanya platform ini, mereka dapat dengan mudah membentuk study group sendiri dan mendapatkan pembelajaran yang naturan dari orang-orang sebaya mereka.

Sementara itu, dari sisi tutor, ekspektasinya adalah mendapatkan wadah untuk menambah pengalaman mengajar (volunteering experience), memperluas relasi, dan berpotensi mendapatkan insentif tambahan secara mandiri.

Harapan dari penerapan solusi ini adalah platform ini mampu memfasilitasi para pelajar untuk menemukan study buddy atau group belajar yang paling cocok dengan preferensi mereka masing-masing, menggantikan batasan biaya bimbingan dan subskripsi aplikasi pembelajaran yang mahal, demi mencapai menuntut ilmu bersama-sama.

## 1.2 Deskripsi Pengguna Perangkat Lunak

Buatlah daftar seluruh aktor (pengguna) yang akan berinteraksi langsung dengan sistem solusi yang kalian kembangkan. Berikan penjelasan singkat mengenai peran dan karakteristik dari masing-masing aktor tersebut.

| Aktor | Deskripsi |
| :--- | :--- |
| *Mentee* | *Pengguna ini adalah siswa/mahasiswa yang bertindak sebagai pihak yang membutuhkan bimbingan atau group belajar untuk materi dan jadwal tertentu. Karakteristik utama dari aktor ini adalah membutuhkan antarmuka yang intuitif dan enak dilihat, menginginkan respons yang cepat dalam matchmaking sesi, dan mencari kecocokan gaya belajar.* |
| Mentor | Pengguna ini bertindak sebagai pihak pengajar sebaya yang menyediakan waktu dan tenaga untuk membagikan penguasaan materinya. Karakteristik aktor ini adalah membutuhkan antarmuka yang intuitif dan enak dilihat, fitur pengelolaan jadwal (ketersediaan waktu) yang fleksibel, manajemen kapasitas sesi (jumlah anggota), dan kemudahan dalam mengonfirmasi atau menolak sesi. |
| Administrator | Pengguna ini bertindak sebagai pengelola back-end dari platform. Karakteristik aktor ini berfokus pada manajemen data, seperti mengelola daftar mata pelajaran/topik valid yang bisa dipilih oleh pengguna, serta menangani laporan pengguna jika terjadi pelanggaran ataupun masalah di dalam platform. |

---

# BAB 2: Deskripsi Kebutuhan Perangkat Lunak

## 2.1 Kebutuhan Pengguna Awal

| ID    | Aktor    | Kebutuhan / Aktivitas                                                   | Tujuan / Nilai                                                                        |
| :---- | :------- | :---------------------------------------------------------------------- | :------------------------------------------------------------------------------------ |
| US-01 | _Tutor_  | _Saya ingin mendaftar dan masuk menggunakan akun universitas valid_     | _sehingga saya bisa mengakses semua fitur_                                            |
| US-02 | _Tutor_  | _Saya ingin mengisi materi yang saya bisa_                              | _sehingga saya dipertemukan dengan orang yang membutuhkannya_                         |
| US-03 | _Tutor_  | _Saya ingin membuat sesi mengajar_                                      | _sehingga saya bisa mengajar dengan waktu kosong_                                     |
| US-04 | _Tutor_  | _Saya ingin menetapkan jumlah maksimum peserta dalam satu sesi_         | _sehingga sesi tetap efektif_                                                         |
| US-05 | _Tutor_  | _Saya ingin menerima informasi mentee, materi dan waktunya_             | _sehingga saya tahu harus bertemu siapa dan kapan_                                    |
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
| US-20 | _Mentee_ | _Saya ingin memilih sesi_                                               | _sehingga saya bisa join ke sesi yang saya mau_                                       |

## 2.2 Deskripsi Aktivitas

| ID  | Aktivitas                                  | Penjelasan                                                                      | ID User Story           |
| :-- | :----------------------------------------- | :------------------------------------------------------------------------------ | :---------------------- |
| A01 | Melakukan Registrasi dan Autentikasi       | User mendaftar menggunakan akun universitas valid                               | US-01 US-09             |
| A02 | Mengisi Kebutuhan Materi                   | User memilih materi yang ingin dipelajari dan dikuasai                          | US-02 US-010            |
| A03 | Mengisi Ketersediaan Waktu                 | User menandai waktu saat mereka bisa                                            | US-11                   |
| A04 | Membuat Sesi Baru                          | User membuat sesi baru dan mengisi slot                                         | US-03 US-04             |
| A05 | Menjalankan Pencocokan Jadwal              | Sistem mencocokan mentee untuk membuat study group berdasarkan materi dan waktu | US-11 US-10             |
| A06 | Melaksanakan Sesi Belajar                  | Kedua pihak bertemu sesuai kesepakatan bisa offline atau online                 | US-04 US-12 US-16 US-17 |
| A07 | Konfirmasi Sesi                            | Sistem menanyakan dan mencatat sesi                                             | US-06 US-13             |
| A08 | Melihat History Sesi                       | User bisa melihat daftar sesi yang pernah dijalaninya sebagai tutor atau mentee | US-07 US-14             |
| A09 | Memberikan Feedback Sehabis Sesi           | User memberi penilaian singkat dan catatan opsional ke orang pada sesi tersebut | US-08 US-15             |
| A10 | Berkomunikasi Melalui Temporary Group Chat | User bisa chat teman atau tutor atau mentee                                     | US-18 US-19             |
| A11 | Melakukan Login                            | User masuk menggunakan akun universitas yang sudah terdaftar                    | US-01 US-09             |
| A12 | Memilih Sesi                               | User memilih sesi yang tersedia                                                 | US-20                   |

## 2.3 Pemetaan Kebutuhan

Perhatikan kembali semua aktivitas yang telah didefinisikan pada tabel deskripsi aktivitas atau *activity diagram*. Jabarkan kebutuhan sistem yang akan dibuat dengan mengacu pada aktivitas-aktivitas tersebut. Setiap aktivitas (ID Aktivitas) dapat memiliki satu atau lebih kebutuhan yang berbeda. Pastikan untuk mengidentifikasi dan mengisi semua jenis kebutuhan yang relevan untuk setiap aktivitas, yaitu:

- **User Requirement**, yaitu kebutuhan dari sudut pandang pengguna (apa yang dapat dilakukan pengguna).
- **Business Requirement**, yaitu aturan, kebijakan, atau standar bisnis yang harus dipenuhi oleh sistem.
- **System Requirement**, yaitu kebutuhan yang menjelaskan apa yang harus dilakukan sistem dan bagaimana sistem harus bekerja dari segi performa, keamanan, keandalan, dsb.

Lengkapi juga dengan penjelasannya dan apakah keperluan tersebut perlu didukung oleh perangkat lunak atau tidak. Jenis kebutuhan tidak terbatas hanya dari tiga jenis di atas, dapat ditambahkan yang lain juga bila diperlukan, misalnya kebutuhan regulasi (*Legal*).

| ID Kebutuhan | ID Aktivitas | Jenis Kebutuhan | Deskripsi Kebutuhan | P/L |
| :--- | :--- | :--- | :--- | :--- |
| *R01* | *A01* | *User* | *Pengguna dapat memilih metode pembayaran dan melakukan pembayaran secara digital.* | *Ya* |
| *R02* | *A01* | *Business* | *Transaksi digital sesuai dengan ketentuan UU ITE yang berlaku.* | *Tidak* |
| *R03* | *A01* | *System* | *Sistem harus mengintegrasikan API Payment Gateway dengan prinsip ACID (Atomicity, Consistency, Isolation, Durability), jika terjadi kegagalan jaringan saat saldo terpotong, sistem harus secara otomatis membatalkan transaksi atau meneruskan dana (reliable).* | *Ya* |
| *R04* | *A01* | *System* | *Kata sandi (password) atau PIN pengguna saat otorisasi pembayaran harus di-hash menggunakan algoritma SHA-256 dan tidak disimpan dalam bentuk plain-text.* | *Ya* |
| *R05* | *A02* | *Business* | *Toko harus memiliki rekening bank aktif dan valid untuk menerima pencairan dana dari sistem.* | *Tidak* |
| ... | ... | ... | ... | ... |

## 2.4 Kebutuhan Fungsional (KF)

Untuk setiap kebutuhan yang telah diidentifikasi sebagai "didukung oleh perangkat lunak", buatlah daftar kebutuhan fungsional P/L, lengkap dengan ID Kebutuhan Fungsional (KF) dan penjelasannya. Hubungkan ID Kebutuhan Fungsional dengan ID Pemetaan Kebutuhan dari sistem.

| ID KF | ID Kebutuhan | Penjelasan |
| :--- | :--- | :--- |
| *KF01* | *R01* | *Perangkat lunak dapat menampilkan pilihan antarmuka metode pembayaran (transfer bank, e-wallet, kartu kredit) setelah pengguna melakukan checkout.* |
| *KF02* | *R01* | *Perangkat lunak dapat mengirimkan permintaan otorisasi transaksi ke API Payment Gateway beserta nominal tagihan dan ID Pesanan.* |
| ... | ... | ... |

## 2.5 Kebutuhan Non-Fungsional (KNF)

Uraikan dengan ringkas Kebutuhan Non-Fungsional dalam tabel sebagai berikut. Isilah kolom kebutuhan dengan kalimat yang jelas, spesifik, dan terukur (kelak dapat diuji untuk dipenuhi). Kolom ID KNF adalah nomor Kebutuhan Non-Fungsional yang harus ditelusuri pada saat pengujian. Hubungkan ID Kebutuhan Non-Fungsional dengan ID Pemetaan Kebutuhan Umum dari sistem.

| ID KNF | ID Kebutuhan | Parameter | Deskripsi Kebutuhan |
| :--- | :--- | :--- | :--- |
| *KNF01* | *R03* | *Reliability* | *Proses transaksi pembayaran harus memenuhi prinsip ACID untuk mencegah terjadinya data tersangkut (lost update) apabila terjadi kegagalan jaringan di tengah proses.* |
| *KNF02* | *R04* | *Security* | *Sistem harus mengenkripsi PIN atau password pengguna menggunakan algoritma SHA-256 sebelum data dikirimkan ke server, serta tidak menyimpannya dalam bentuk plain-text di database.* |
| ... | ... | ... | ... |

Silakan pilih yang relevan. Tidak perlu semua parameter menjadi kebutuhan non-fungsional. Berikut merupakan penjelasan dari setiap parameter. **Parameter dari Kebutuhan Non-Fungsional tidak terbatas hanya di bawah ini** karena hanya merupakan panduan sehingga dapat ditambah KNF yang lain, misalnya *constraint* dari sistem.

| Parameter | Penjelasan |
| :--- | :--- |
| *Availability* | Ketersediaan aplikasi, misalnya harus terus-menerus beroperasi 7 hari per minggu, 24 jam per hari tanpa gagal. |
| *Reliability* | Keandalan, misalnya tidak pernah boleh gagal (atau kegagalan yang ditolerir adalah …%) sehingga harus dipikirkan *fault tolerant architecture*. Biasanya hanya perlu untuk *critical application* yang jika gagal akan berakibat fatal. |
| *Ergonomy* | Kenyamanan pakai bagi pengguna. |
| *Portability* | Kemudahan untuk dibawa dan dioperasikan ke mesin/sistem operasi/*platform* yang lain. |
| *Memory* | Jika perhitungan kapasitas memori internal kritis (misalnya untuk P/L yang harus dijadikan *chips* dan ukurannya harus kecil). |
| *Response time* | Batasan waktu yang harus dipenuhi. Sangat penting untuk aplikasi *real time*. Contoh: "Aplikasi harus mampu menampilkan hasil dalam 4 detik", atau "ATM harus menarik kembali kartu yang tidak diambil dalam waktu 3 menit". |
| *Safety* | Yang menyangkut keselamatan manusia, misalnya untuk P/L yang dipakai pada sistem kontrol di pabrik. |
| *Security* | Aspek keamanan yang harus dipenuhi. |

<br>

# Referensi
- Diagram UML: https://www.drawio.com/, https://staruml.io/
