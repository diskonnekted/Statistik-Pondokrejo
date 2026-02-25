# Panduan Deployment ke CloudPanel (Tanpa Sudo/PM2)

Panduan ini menjelaskan cara men-deploy aplikasi Next.js ini ke server Ubuntu yang menggunakan CloudPanel, tanpa akses `sudo` atau `pm2`.

## Prasyarat

1.  Akses ke **CloudPanel**.
2.  Akses **SSH Terminal** ke user aplikasi (biasanya user yang dibuat oleh CloudPanel saat membuat site).
3.  Node.js terinstall (CloudPanel biasanya sudah menyediakannya).

## Langkah 1: Persiapan di CloudPanel

1.  Login ke **CloudPanel**.
2.  Masuk ke menu **Sites** -> **Add Site**.
3.  Pilih **Create Node.js Site**.
4.  Isi detail:
    *   **Domain Name**: Domain anda (misal: `dashboard.pondokrejo.desa.id`).
    *   **Node.js Version**: Pilih versi LTS terbaru (misal: v20 atau v18).
    *   **App Port**: Biarkan default (misal: `3000`) atau sesuaikan jika port tersebut terpakai.
5.  Klik **Create**.

## Langkah 2: Upload Kode via Terminal

1.  Buka terminal SSH anda dan login sebagai user site tersebut.
    *   Info user SSH bisa dilihat di dashboard CloudPanel pada detail site tersebut.
    *   Perintah: `ssh namauser@ip-server`
2.  Masuk ke direktori root aplikasi (biasanya `/home/namauser/htdocs/nama-domain`).
    ```bash
    cd htdocs/nama-domain
    ```
3.  Hapus file default (jika ada) dan clone repository ini.
    ```bash
    rm -rf *
    git clone https://github.com/diskonnekted/Statistik-Pondokrejo .
    ```
    *(Pastikan ada titik `.` di akhir perintah agar clone dilakukan ke folder saat ini)*

## Langkah 3: Install & Build

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Buat file `.env` untuk konfigurasi environment (Database, dll).
    ```bash
    nano .env
    ```
    Isi dengan konfigurasi database anda:
    ```env
    DATABASE_URL="mysql://user:password@localhost:3306/nama_database"
    # Tambahkan variabel lain yang diperlukan
    ```
    Simpan dengan `Ctrl+O`, `Enter`, lalu keluar dengan `Ctrl+X`.

3.  Build aplikasi:
    ```bash
    npm run build
    ```

## Langkah 4: Menjalankan Aplikasi

### Opsi A: Menggunakan CloudPanel (Direkomendasikan)

CloudPanel memiliki manager proses sendiri untuk aplikasi Node.js.

1.  Kembali ke **CloudPanel** -> **Sites** -> Pilih Site anda.
2.  Masuk ke tab **Node.js Settings**.
3.  Pastikan konfigurasi berikut:
    *   **Script**: `npm start` (atau arahkan ke `node_modules/.bin/next` dengan argumen `start`).
        *   *Alternatif (Lebih Hemat RAM)*: Jika build sukses, ubah script menjadi `node .next/standalone/server.js`.
    *   **Environment Variables**: Anda juga bisa memasukkan variabel `.env` di sini jika tidak ingin menggunakan file.
4.  Klik **Save** atau **Restart**.
5.  Aplikasi akan berjalan dan dikelola otomatis oleh CloudPanel.

### Opsi B: Menjalankan Manual di Background (Tanpa PM2)

Jika anda tidak bisa menggunakan fitur Node.js manager CloudPanel dan harus menjalankannya manual lewat terminal tanpa PM2, gunakan `nohup`.

1.  Pastikan anda berada di folder aplikasi.
2.  Jalankan perintah berikut:
    ```bash
    nohup npm start > app.log 2>&1 &
    ```
    *   `nohup`: Menjalankan proses agar tidak mati saat terminal ditutup.
    *   `> app.log`: Menyimpan output log ke file `app.log`.
    *   `2>&1`: Menggabungkan error log ke output log.
    *   `&`: Menjalankan proses di background.

3.  Cek apakah aplikasi berjalan:
    ```bash
    cat app.log
    ```
    Atau cek process ID:
    ```bash
    ps aux | grep next
    ```

4.  Untuk mematikan aplikasi (jika perlu update):
    ```bash
    pkill -f "next-server"
    ```
    Lalu ulangi langkah start di atas.

## Troubleshooting

*   **Error Memory**: Jika build gagal karena memori habis, coba build di lokal komputer anda, lalu upload folder `.next`, `public`, `package.json`, dan `next.config.ts` via SCP/SFTP.
*   **Port Conflict**: Pastikan port yang anda set di CloudPanel sama dengan port yang aplikasi coba gunakan (default Next.js adalah 3000). CloudPanel biasanya mengatur reverse proxy otomatis ke port tersebut.
