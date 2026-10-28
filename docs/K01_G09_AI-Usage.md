# Deklarasi Penggunaan AI

## Tugas Besar IF2150 - Rekayasa Perangkat Lunak

| Informasi            | Keterangan   |
| -------------------- | ------------ |
| Kelas                | _K1_         |
| Nomor Kelompok       | _9_          |
| Nama Kelompok        | _PindahCSUI_ |
| Nama Perangkat Lunak | PeerUP       |

**Anggota Kelompok:**

| NIM        | Nama                              |
| ---------- | --------------------------------- |
| _13525049_ | _Hugo Daniel Johansen Napitupulu_ |
| _13525001_ | _Matthew Allen Reynaldo_          |
| _13525010_ | _Fabian Amzar Susanto_            |
| _13525025_ | _David Christian_                 |
| _13525028_ | _Markus Christiano Simanjuntak_   |  
---

### Daftar Isi
* [Milestone 1](#milestone-1)
* Notes: Copy bagian Daftar Isi seperti Milestone 1 untuk Milestone berikutnya, contoh ``* [Milestone 2](#milestone-2)``. Ketika Daftar isi diklik maka akan langsung diarahkan ke bagian bawah sesuai dengan Milestone tujuan.

---

### Log Penggunaan AI per Milestone

Silakan catat penggunaan AI yang berdampak signifikan pada pengerjaan tugas (misal: *generate* fungsi algoritma yang kompleks, *generate* draf dokumen SKPL/DPPL, atau *debugging* error utama). 
*Penggunaan sepele seperti memperbaiki *typo* atau auto-complete satu baris kode tidak perlu dicatat.*

### Milestone 1
| Tool AI | Tujuan Penggunaan | Contoh Prompt Utama | Modifikasi & Validasi Manusia |
| :--- | :--- | :--- | :--- |
| *[Nama AI]* | *[Sertakan Tujuan Penggunaan]* | *[Tuliskan Prompt Utama]* | *[Tuliskan Keputusan Hasil Validasi]* |
| *Gemini* | *Membantu menyempurnakan tata bahasa dan struktur kalimat pada draf kasar Latar Belakang Masalah agar lebih akademis.* | *"Tolong perbaiki tata bahasa paragraf ini agar lebih baku dan cocok untuk dokumen spesifikasi akademis, tanpa mengubah ide utamanya: [draf tulisan kami]."* | *AI memberikan hasil yang kosakatanya terlalu kaku. Kami menyesuaikan kembali beberapa istilah agar lebih luwes dibaca dan memastikan argumen orisinal kelompok kami tidak hilang.* |
| *Gemini* | *Merapikan format penulisan daftar pustaka di bagian Referensi menjadi APA Style yang rapi.* | *"Tolong ubah daftar link jurnal penelitian dan artikel berita berikut ini menjadi format sitasi APA Style yang benar."* | *Kami melakukan pengecekan silang terhadap hasil sitasi AI untuk memastikan urutan abjad, nama penulis, dan tahun terbitnya (2023-2024) sudah dicantumkan dengan tepat.* |
| *Gemini* | *Brainstorming sudut pandang tambahan terkait penentuan 'Asumsi dan Batasan' sistem pencocokan teman belajar.* | *"Berikan beberapa contoh batasan sistem yang umum ditemui pada aplikasi pencarian teman/matching app khusus edukasi."* | *AI menghasilkan daftar saran yang terlalu luas dan kompleks. Kami menolak sebagian besar saran teknisnya dan hanya mengadopsi batasan demografi pengguna serta tanggung jawab efektivitas belajar yang disesuaikan dengan scope tugas kami.* |
| *Gemini* | *Membantu menyusun tata bahasa dan merapikan format kalimat pada dokumen Log Penggunaan AI (dokumen AI Usage).* | *"Bantu perbaiki kalimat draf kasar untuk tabel log AI ini agar penyampaiannya terdengar profesional, jujur, dan tidak berlebihan: [draf kasar kalimat kami]."* | *AI memberikan draf kalimat yang kaku dan cenderung melebih-lebihkan perannya. Kami memodifikasi dan memangkas deskripsi tersebut agar lebih singkat, natural, dan benar-benar merepresentasikan porsi kerja kelompok kami.* |
| | | | | |

### Milestone 2
| Tool AI | Tujuan Penggunaan | Contoh Prompt Utama | Modifikasi & Validasi Manusia |
| :--- | :--- | :--- | :--- |
| *Gemini* | *Mengevaluasi kesesuaian tata bahasa pada draf Kebutuhan Fungsional (KF) yang telah kami susun agar konsisten mengikuti pola kalimat EARS.* | *"Apakah draf kalimat Kebutuhan Fungsional kami berikut ini sudah sesuai dengan sintaks EARS? Beri saran perbaikan tata bahasanya."* | *AI terkadang mengubah istilah spesifik aplikasi kami menjadi terlalu generik. Kami hanya mengambil saran perbaikan struktur kalimat pasif/aktifnya saja, sementara isi fitur dan alur bisnis tetap menggunakan rumusan awal kami.* |
| *Gemini* | *Berdiskusi mengenai tolok ukur kuantitatif yang wajar untuk parameter Kebutuhan Non-Fungsional (KNF) seperti Response Kelompoke dan Security.* | *"Untuk aplikasi web pencarian teman belajar skala kampus, berapa batas response kelompoke yang wajar dan algoritma hashing apa yang umum dituliskan pada spesifikasi KNF?"* | *AI menyarankan banyak sekali parameter KNF yang terlalu rumit (over engineering). Kami memilah saran tersebut dan hanya mengambil metrik yang relevan dengan ruang lingkup PeerUP.* |
| *Gemini* | *Membantu melakukan pengecekan silang terhadap kelengkapan pemetaan ID antara User Story (US), Aktivitas (A), dan Kebutuhan (R).* | *"Tolong periksa tabel draf kami ini, apakah ada ID Kebutuhan (R) yang terlewat atau belum terhubung ke Kebutuhan Fungsional (KF)?"* | *AI membantu menunjukkan adanya beberapa nomor ID yang belum terpetakan. Kelompok kami kemudian berdiskusi secara mandiri untuk menentukan pemetaan akhir dan merumuskan kebutuhan yang sempat terlewat tersebut.* |

### Milestone 3
| Tool AI | Tujuan Penggunaan | Contoh Prompt Utama | Modifikasi & Validasi Manusia |
| :--- | :--- | :--- | :--- |
| *Gemini* | *Berdiskusi untuk memvalidasi pemahaman teori terkait penggunaan relasi include, extend, dan generalisasi aktor pada Use Case Diagram.* | *"Jika fitur melihat feedback sesi hanya dilakukan oleh Mentor saat membuka riwayat sesi, apakah tepat jika dihubungkan menggunakan relasi extend ke use case melihat riwayat?"* | *Penjelasan AI kami gunakan sebatas konfirmasi teori UML agar tidak salah arah panah. Seluruh struktur Use Case Diagram tetap kami rancang dan gambar sendiri secara manual menggunakan Draw.io.* |
| *Gemini* | *Merapikan format sintaks tabel Markdown dan menyeragamkan gaya bahasa pada draf Skenario Use Case yang ditulis anggota kelompok.* | *"Tolong rapikan penulisan draf skenario use case ini ke dalam format tabel Markdown yang rapi tanpa mengubah langkah-langkah interaksinya: [draf skenario kelompok]."* | *Terkadang AI menambahkan langkah reaksi sistem yang tidak sesuai dengan rancangan UI kami. Kami memvalidasi ulang setiap baris skenario dan menghapus bagian tambahan yang tidak sesuai dengan desain asli aplikasi PeerUP.* |

### Milestone 4
| Tool AI | Tujuan Penggunaan | Contoh Prompt Utama | Modifikasi & Validasi Manusia |
| :--- | :--- | :--- | :--- |
| *Gemini* | *Merangkum poin-poin penting dari teks transkrip rekaman asistensi terkait pembagian kelas menjadi 3 layer (Boundary, Controller, Entity).* | *"Berikut adalah transkrip hasil asistensi kami. Tolong rangkum poin-poin utama yang disampaikan asisten mengenai pembagian Boundary, Controller, dan Entity class."* | *Kami mencocokkan hasil rangkuman AI dengan catatan dan ingatan anggota kelompok yang hadir saat asistensi untuk memastikan tidak ada instruksi asisten yang salah ditangkap akibat kesalahan transkripsi suara.* |
| *Gemini* | *Teman diskusi untuk mengonfirmasi ketepatan penggunaan notasi relasi UML (seperti perbedaan Agregasi, Komposisi, dan Dependensi) antarkelas.* | *"Antara kelas Session dan SessionHistory, apakah relasi yang tepat menggunakan Generalization atau Aggregation? Jelaskan alasannya."* | *AI memberikan penjelasan konseptual mengenai relasi Has-a vs Is-a. Berdasarkan pemahaman tersebut, kelompok kami memutuskan sendiri jenis relasi yang paling tepat dan mengimplementasikannya langsung pada diagram kelas di Draw.io.* |
| *Gemini* | *Membantu memeriksa inkonsistensi penulisan (seperti kesalahan copy-paste tabel) serta merapikan format tabel Markdown pada Bab 4 dan Bab 5 (Traceability).* | *"Tolong cek dokumen Markdown kami ini, apakah ada tabel atribut/metode yang isinya masih tertukar antar-use case atau penomoran ID kelas yang ganda?"* | *AI membantu menemukan baris tabel yang terduplikasi dan sisa copy-paste dari draf sebelumnya. Seluruh nama kelas (C01-C24), atribut, metode, dan pemetaan traceability tetap kami periksa dan sesuaikan kembali secara manual agar semuanya sinkron dengan gambar diagram kami.* |
---

### Milestone 5
| Tool AI | Tujuan Penggunaan | Contoh Prompt Utama | Modifikasi & Validasi Manusia |
| :--- | :--- | :--- | :--- |
| *-* | *-* | *"-"* | *-* |

### Milestone 6
| Tool AI | Tujuan Penggunaan | Contoh Prompt Utama | Modifikasi & Validasi Manusia |
| :--- | :--- | :--- | :--- |
| ChatGPT | Membantu mendiskusikan pemilihan *architectural style/pattern* dan *architectural view* yang sesuai untuk PeerUP berdasarkan materi asistensi dan dokumen proyek. | "Berdasarkan materi Asistensi Akbar M6 serta dokumen SKPL, APL, dan DPPL PeerUP, style/pattern arsitektur apa yang sesuai? Jelaskan pertimbangan penggunaan MVC, Client-Server, dan beberapa architectural view." | AI digunakan untuk memperoleh pertimbangan dan alternatif, bukan menentukan arsitektur secara langsung. Kelompok membandingkan saran dengan kebutuhan PeerUP, arahan asistensi, dan rancangan implementasi sebelum menentukan pendekatan yang digunakan. |
| ChatGPT | Membantu meninjau konsistensi dan menemukan potensi kesalahan pada Bab 1–2 DPPL, terutama pemetaan komponen, kebutuhan, serta kesesuaian antarbagian dokumen. | "Tinjau Bab 1–2 DPPL kami berdasarkan SKPL, APL, dan arahan asistensi. Tunjukkan inkonsistensi yang perlu diperiksa tanpa menilai Bab 3 ke atas yang belum dikerjakan." | Hasil AI dipakai sebagai daftar temuan awal. Kelompok memeriksa kembali saran yang relevan terhadap dokumen acuan dan menentukan sendiri koreksi yang diperlukan; saran yang tidak sesuai dengan rancangan kelompok tidak diterapkan begitu saja. |
| ChatGPT | Membantu menyusun draf awal *Development View* berupa *package diagram* dan *Physical View* berupa *deployment diagram* menggunakan PlantUML. | "Bantu susun dan periksa draf package diagram serta deployment diagram PeerUP dalam PlantUML berdasarkan komponen, arsitektur, dan teknologi yang telah kami tentukan." | AI membantu menyusun bentuk awal diagram, tetapi hasilnya tidak langsung dianggap final. Kelompok meninjau pengelompokan komponen, relasi dependensi, node deployment, dan jalur komunikasi, kemudian menyesuaikannya dengan rancangan serta keputusan implementasi PeerUP. |


### Milestone 7
| Tool AI | Tujuan Penggunaan | Contoh Prompt Utama | Modifikasi & Validasi Manusia |
| :--- | :--- | :--- | :--- |
| *-* | *-* | *"-"* | *-* |

### Milestone 8
| Tool AI | Tujuan Penggunaan | Contoh Prompt Utama | Modifikasi & Validasi Manusia |
| :--- | :--- | :--- | :--- |
| *Gemini* | *Menentukan contoh format pseudocode untuk web based functions* | *Untuk merealisasikan fungsi seperti ini .... , berikan contoh pseudocode secara web based (seperti realisasi promise)* | *Output gemini dibandingkan dengan function aktual javascript atau typescript* |
| *Gemini* | *Menentukan format query CRUD pada kelas entitas* | *Untuk merealisasikan fungsi seperti ini .... , berikan contoh query untuk melakukan ini* | *Output gemini dibandingkan dengan query yang valid* |

---
### Pernyataan Integritas dan Persetujuan

Kami yang bertanda tangan di bawah ini menyatakan bahwa seluruh log penggunaan AI di atas adalah benar. Kami telah memvalidasi seluruh hasil AI dan bertanggung jawab penuh atas orisinalitas, keamanan, dan kebenaran hasil akhir dari tugas ini.

| Tanda Tangan | Nama Anggota |
| :---: | :--- |
| <img src="./assets/ttd-Hugo_Daniel_Johansen_Napitupulu.png" width="100"> | **[13525049 - Hugo Daniel Johansen Napitupulu]** |
| <img src="./assets/ttd-Matthew_Allen_Reynaldo.png" width="100"> | **[13525001 - Matthew Allen Reynaldo]** |
| <img src="./assets/ttd-Fabian_Amzar_Susanto.png" width="100"> | **[13525010 - Fabian Amzar Susanto]** |
| <img src="./assets/ttd-David_Christian.png" width="100"> | **[13525025 - David Christian]** |
| <img src="./assets/ttd-Markus_Christiano_Simanjuntak.png" width="100"> | **[13525028 - Markus Christiano Simanjuntak]** |