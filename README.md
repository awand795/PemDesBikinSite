# 🏘️ Sistem Informasi Manajemen Desa (SIMDesa)

> **Aplikasi manajemen desa berbasis web modern** — Mengelola data kependudukan, surat menyurat, berita, pengaduan, galeri, dan profil desa dalam satu platform terintegrasi.

---

## ✨ Fitur Utama

### 👥 Manajemen Kependudukan
- **Dusun** — Kelola data dusun beserta kepala dusun
- **Keluarga** — Data keluarga terintegrasi dengan dusun
- **Penduduk** — Data penduduk lengkap (NIK, agama, pendidikan, pekerjaan, status perkawinan, dll.)

### 📄 Surat Menyurat Digital
- **Jenis Surat** — Kelola template dan jenis surat desa
- **Pengajuan Surat** — Warga dapat mengajukan surat secara online
- **Persetujuan & Cetak** — Approve/reject dan cetak surat dalam format PDF
- **Cek Status** — Lacak status pengajuan surat via kode pengajuan

### 📰 Berita & Pengumuman
- **Berita** — Publikasi artikel dengan kategori, thumbnail, dan penjadwalan
- **Pengumuman** — Pengumuman penting untuk warga desa

### 📢 Pengaduan Masyarakat
- **Pengaduan Online** — Warga dapat melapor dengan upload foto
- **Kategori Pengaduan** — Pengelompokan jenis pengaduan
- **Respons Petugas** — Tanggapan dan penanganan dari perangkat desa
- **Tracking Tiket** — Cek status pengaduan via kode tiket

### 🖼️ Galeri Desa
- Unggah dan kelola foto-foto kegiatan desa

### 👤 Manajemen Pengguna & RBAC
- **Role & Permissions** — Sistem hak akses berbasis peran (Spatie)
- **Akun Pengguna** — Kelola pengguna perangkat desa

### 📊 Dashboard & Statistik
- Statistik penduduk, surat, pengaduan, dan berita
- Grafik dan visualisasi data

### 🏛️ Profil Desa
- Data profil desa (nama, alamat, kepala desa, visi, misi, sejarah)
- Informasi geografis (luas wilayah, koordinat)
- Logo desa

---

## 🛠️ Teknologi

### Backend

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| **PHP** | ^8.2 | Bahasa pemrograman |
| **Laravel** | ^12.0 | Framework backend |
| **Laravel Sanctum** | ^4.3 | API authentication (token-based) |
| **Spatie Laravel Permission** | ^6.25 | Role & permissions management |
| **Laravel DomPDF** | ^3.1 | Generate surat PDF |
| **Maatwebsite Excel** | ^3.1 | Export/import data Excel |
| **MySQL / SQLite** | — | Database |

### Frontend

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| **React** | ^19.2 | UI Library |
| **TypeScript** | ~6.0 | Type safety |
| **Vite** | ^8.1 | Build tool & dev server |
| **Tailwind CSS** | ^4.3 | Utility-first CSS |
| **TanStack React Query** | ^5.101 | Server state management |
| **TanStack React Table** | ^8.21 | Data tables |
| **React Router DOM** | ^7.18 | Routing |
| **React Hook Form** | ^7.81 | Form management |
| **Zod** | ^4.4 | Form validation |
| **Zustand** | ^5.0 | Client state management |
| **Recharts** | ^3.9 | Charts & visualizations |
| **Lucide React** | ^1.24 | Icons |
| **Axios** | ^1.18 | HTTP client |
| **CLSX** | ^2.1 | CSS class utilities |

---

## 📁 Struktur Proyek

```
sistem informasi managemen desa/
├── backend/                    # Laravel API Backend
│   ├── app/
│   │   ├── Enums/             # Enum classes (ComplaintStatus, LetterRequestStatus, NewsStatus)
│   │   ├── Http/Controllers/ # API Controllers
│   │   ├── Models/           # Eloquent Models
│   │   ├── Services/         # Business logic services
│   │   └── Providers/        # Service providers
│   ├── config/               # Application configuration
│   ├── database/
│   │   ├── migrations/       # Database migrations
│   │   └── seeders/          # Database seeders
│   ├── routes/
│   │   ├── api.php           # API routes
│   │   └── web.php           # Web routes
│   ├── resources/views/pdf/  # PDF templates for letters
│   └── tests/                # PHPUnit tests
│
├── frontend/                   # React SPA Frontend
│   └── src/
│       ├── components/
│       │   ├── layout/       # Admin & Public layouts
│       │   └── ...           # Page-level components
│       ├── features/
│       │   ├── auth/         # Login page
│       │   ├── dashboard/    # Dashboard
│       │   ├── residents/    # Manajemen penduduk
│       │   ├── families/     # Manajemen keluarga
│       │   ├── letters/      # Surat menyurat
│       │   ├── news/         # Berita
│       │   ├── announcements/# Pengumuman
│       │   ├── complaints/   # Pengaduan
│       │   ├── users/        # Manajemen pengguna
│       │   └── public/       # Halaman publik (Beranda, Profil, Layanan, dll.)
│       ├── services/         # API client & services
│       ├── stores/           # Zustand stores
│       └── types/            # TypeScript type definitions
│
├── README.md
```

---

## 🚀 Cara Instalasi & Menjalankan

### 📋 Prasyarat

- PHP ^8.2
- Composer
- Node.js & npm
- MySQL atau SQLite

### ⚙️ Backend (Laravel)

```bash
# 1. Masuk ke direktori backend
cd backend

# 2. Install PHP dependencies
composer install

# 3. Copy environment file
cp .env.example .env

# 4. Generate application key
php artisan key:generate

# 5. Atur database di .env (MySQL atau SQLite)
#    DB_CONNECTION=mysql
#    DB_HOST=127.0.0.1
#    DB_PORT=3306
#    DB_DATABASE=simdesa
#    DB_USERNAME=root
#    DB_PASSWORD=

# 6. Jalankan migrasi & seeder
php artisan migrate --seed

# 7. Jalankan development server
php artisan serve
```

### 🎨 Frontend (React)

```bash
# 1. Masuk ke direktori frontend
cd frontend

# 2. Install npm dependencies
npm install

# 3. Jalankan development server
npm run dev
```

### 🚦 Menjalankan Semua Service Sekaligus

Dari folder `backend`:

```bash
php artisan dev
```

Perintah ini akan menjalankan secara bersamaan:
- **Laravel server** (`php artisan serve`) — port 8000
- **Queue listener** (`php artisan queue:listen`)
- **Log viewer** (`php artisan pail`)
- **Vite dev server** (`npm run dev`) — port 5173

### 🔑 Akses Awal

Setelah migrasi dan seeder dijalankan, akun admin default akan tersedia (lihat `DatabaseSeeder.php` untuk detail kredensial).

---

## 📡 API Endpoints

### Publik (Tanpa Autentikasi)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/public/profile` | Profil desa |
| GET | `/api/public/letter-types` | Jenis-jenis surat |
| GET | `/api/public/news` | Berita publik |
| GET | `/api/public/news/{slug}` | Detail berita |
| GET | `/api/public/announcements` | Pengumuman publik |
| GET | `/api/public/gallery` | Galeri foto |
| POST | `/api/public/letter-requests` | Ajukan surat |
| GET | `/api/public/letter-requests/check` | Cek status surat |
| POST | `/api/public/complaints` | Kirim pengaduan |
| GET | `/api/public/complaints/check` | Cek status pengaduan |

### Autentikasi

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout (auth) |
| GET | `/api/auth/me` | Profil user (auth) |
| POST | `/api/auth/forgot-password` | Lupa password |
| POST | `/api/auth/reset-password` | Reset password |

### Terproteksi (Sanctum Auth)

Dashboard, CRUD master data (dusun, keluarga, penduduk), surat menyurat (approve/reject/print), berita, pengumuman, pengaduan (respond), galeri, manajemen pengguna (roles & permissions), profil desa, dan pengaturan.

---

## 🧪 Testing

```bash
# Backend tests (PHPUnit)
cd backend
php artisan test

# Frontend linting
cd frontend
npm run lint
```

---

## 🧰 Fitur Lengkap

| Modul | Fitur |
|-------|-------|
| **Dashboard** | Statistik penduduk, surat, pengaduan, berita dalam bentuk grafik & angka |
| **Dusun** | CRUD dusun, data kepala dusun |
| **Keluarga** | CRUD keluarga terintegrasi dengan dusun |
| **Penduduk** | CRUD penduduk, filter & pencarian, statistik demografi (usia, jenis kelamin, agama, pekerjaan) |
| **Surat** | Jenis surat, pengajuan online, approval workflow (approve/reject), cetak PDF, tracking status |
| **Berita** | CRUD berita dengan thumbnail, slug otomatis, status publish/draft, kategorisasi |
| **Pengumuman** | CRUD pengumuman untuk informasi desa |
| **Pengaduan** | Pengaduan online dari warga, tiket tracking, tanggapan petugas, kategori pengaduan |
| **Galeri** | Upload & kelola foto kegiatan desa |
| **Pengguna** | CRUD pengguna, role & permissions (admin, petugas, dll.) |
| **Profil Desa** | Informasi desa, visi misi, sejarah, kontak, peta koordinat |
| **Pengaturan** | Pengaturan umum aplikasi |

---

## 🤝 Kontribusi

Silakan buka *issue* atau kirim *pull request* untuk pengembangan lebih lanjut.

---

## 📄 Lisensi

[MIT License](LICENSE)

---

*Dibuat dengan ❤️ untuk desa Indonesia*
