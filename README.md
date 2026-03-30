# Notes App - Express + Sequelize + MySQL

Aplikasi fullstack sederhana untuk manajemen catatan (CRUD):

- Tambah catatan
- Lihat daftar catatan
- Edit catatan
- Hapus catatan

## Stack

- Backend: Express.js
- ORM: Sequelize
- Database: MySQL
- Frontend: HTML + CSS + JavaScript (tanpa framework), disimpan di folder `views`

## Struktur Endpoint

- `GET /api/notes` -> ambil semua catatan
- `POST /api/notes` -> tambah catatan
- `PUT /api/notes/:id` -> edit catatan
- `DELETE /api/notes/:id` -> hapus catatan

Field catatan:

- `id`
- `judul`
- `isi`
- `tanggal_dibuat`

## Menjalankan Secara Lokal

1. Pastikan MySQL lokal aktif.
2. Buat database, contoh: `notes`.
3. Atur file `.env`.
4. Jalankan:

```bash
npm install
node index.js
```

5. Buka browser: `http://localhost:3000`

## Contoh Konfigurasi .env

```env
DB_NAME=notes
DB_USER=root
DB_PASS=password
DB_HOST=localhost
DB_PORT=3306
DB_SSL=false
PORT=3000
```

## Migrasi MySQL Lokal ke Cloud SQL atau VM

### 1) Export data dari lokal

```bash
mysqldump -u root -p notes > notes_dump.sql
```

### 2) Import ke Cloud SQL / VM MySQL

Contoh di VM:

```bash
mysql -u <user_remote> -p -h <host_remote> notes < notes_dump.sql
```

### 3) Ubah `.env` aplikasi

Contoh Cloud SQL / VM:

```env
DB_NAME=notes
DB_USER=<user_remote>
DB_PASS=<password_remote>
DB_HOST=<ip_atau_hostname_remote>
DB_PORT=3306
DB_SSL=true
PORT=3000
```

### 4) Jalankan ulang aplikasi

```bash
node index.js
```

Jika koneksi remote tanpa SSL, set `DB_SSL=false`.
