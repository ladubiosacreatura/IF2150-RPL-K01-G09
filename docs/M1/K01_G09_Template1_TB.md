<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 1
<br>
TOPIC BRAINSTORMING
</h1>
<br>

## _Nama Perangkat Lunak_

### Untuk: _[Nama Asisten]_

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | _\[Kelas\]_ |
| Kelompok | _\[Nomor Kelompok\]_ |

| NIM       | Nama               |
| --------- | ------------------ |
| _[NIM 1]_ | _[Nama Anggota 1]_ |
| _[NIM 2]_ | _[Nama Anggota 2]_ |
| _[NIM 3]_ | _[Nama Anggota 3]_ |
| _[NIM 4]_ | _[Nama Anggota 4]_ |
| _[NIM 5]_ | _[Nama Anggota 5]_ |

---

<br>
<br>

# BAB 1: Analisis Permasalahan

## 1.1 Latar Belakang Masalah

Tuliskan deskripsi permasalahan yang kalian pilih secara naratif dan spesifik. Tambahkan keterkaitan permasalahan tersebut dengan Tujuan Pembangunan Berkelanjutan (SDGs) yang telah disepakati. Dukung argumen kalian dengan data yang kredibel, serta jelaskan urgensi mengapa masalah ini perlu dan layak untuk segera diselesaikan.

## 1.2 Analisis Kondisi Saat Ini

Lakukan analisis terhadap proses yang berjalan saat ini di dunia nyata, baik itu sistem lama ataupun solusi yang sudah ada. Soroti kesenjangan atau celah dari kondisi tersebut yang nantinya akan diselesaikan oleh perangkat lunak kalian.

---

# BAB 2: Analisis Solusi

## 2.1 Deskripsi Perangkat Lunak

Sebuah bot pemantau otomatis dengan UI desktop application yang dirancang untuk membantu investigator untuk mendeteksi perdagangan satwa liar ilegal di internet secara otomatis.

Dari POV user, bot bekerja dengan melakukan web-scraping di medsos dan e-commerce untuk menganalisis gambar, serta mengekstrak informasi dari satwa tanpa pencarian manual. Platform desktop dipilih agar memudahkan user dengan memberikan UI yang mudah dimanfaatkan

Nilai inovasi:

1. NLP dilatih dengan slang/kode lokal Indonesia.

## 2.2 Asumsi dan Batasan

Asumsi:
1. Hewan dan/atau satwa langka diperjual-belikan di internet/e-commerce.

Batasan:
1. Hanya mencakup transaksi ilegal yang terjadi di Indonesia.
2. Hanya mengambil dan mengelola informasi berbasis teks atau data, bukan gambar.
3. Kelompok ini tidak memiliki wewenang hukum untuk melakukan penangkapan atau agen penyamar yang dapat membahayakan keselamatan pribadi ataupun melanggar hukum.


---

# BAB 3: Spesifikasi Kebutuhan dan Proses Bisnis

## 3.1 Identifikasi Aktor

Buatlah daftar seluruh aktor (pengguna) yang akan berinteraksi langsung dengan sistem solusi yang kalian kembangkan. Berikan penjelasan singkat mengenai peran dan karakteristik dari masing-masing aktor tersebut.

| Aktor   | Deskripsi                                                                                                                                                                                                                         |
| :------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _Kasir_ | _Pengguna ini bertindak sebagai pihak yang bertanggung jawab untuk memproses transaksi harian dan melayani pembayaran pelanggan. Karakteristik dari pengguna ini adalah mengutamakan kecepatan dan keakuratan saat bertransaksi._ |
| ...     | ...                                                                                                                                                                                                                               |

## 3.2 Kebutuhan Pengguna Awal

Definisikan apa yang ingin dicapai oleh pengguna saat menggunakan sistem ini dalam format _User Story_ (Sebagai [Aktor], saya ingin [Aktivitas/Kebutuhan], sehingga [Tujuan/Nilai]). Pastikan kalian berfokus pada "apa yang ingin dilakukan pengguna".

| ID    | Aktor          | Kebutuhan / Aktivitas     | Tujuan / Nilai                                |
| :---- | :------------- | :------------------------ | :-------------------------------------------- |
| US-01 | _Kasir_        | _Memindai barcode barang_ | _Proses pembayaran berjalan cepat dan akurat_ |
| US-02 | _[Nama Aktor]_ | _[Kebutuhan pengguna]_    | _[Tujuan yang dicapai pengguna]_              |
| ...   | ...            | ...                       | ...                                           |

## 3.3 Model Proses Bisnis

Buatlah _Activity Diagram_ atau _Swimlane Diagram_ yang menunjukkan alur kerja proses bisnis dari sistem solusi. Diagram ini harus memvisualisasikan bagaimana alur operasional di dunia nyata berjalan lebih efisien dengan adanya interaksi antara aktor (yang didefinisikan pada poin 3.1) dan sistem perangkat lunak. Perhatikan notasi yang digunakan dalam pembuatannya.
<br>

<p align="center">
<img alt="Contoh Activity Diagram" src="./assets/diagram/diagram-act-1.avif" width="70%">
</p>
<p align="center">
<i>Gambar 1. Contoh Activity Diagram</i>
</p>

<br>

# Referensi

- Diagram UML: https://www.drawio.com/, https://staruml.io/
