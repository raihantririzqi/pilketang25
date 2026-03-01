# PEMIKET Voting System

Sistem voting digital untuk Pemilihan Ketua Angkatan berbasis QR Code.

## Arsitektur

```
pilketang25/
├── backend/          # Elysia.js + Prisma + MySQL
├── front_end/
│   ├── user_app/     # Next.js — Portal peserta (login, generate QR, hasil)
│   └── scanner/      # Next.js — Kiosk scanner untuk bilik suara
```

## Alur Sistem

1. Peserta login via akun Google (ITERA)
2. Peserta generate QR Code di halaman Bilik Suara
3. QR Code berlaku 30 detik
4. Di bilik suara, peserta tunjukkan QR ke kamera laptop
5. Panitia verifikasi identitas, lalu allow voting
6. Peserta memilih kandidat (waktu 2 menit)
7. Panitia publish hasil via dashboard

## Setup

### Prerequisites
- Bun >= 1.0
- Node.js >= 18
- MySQL / MariaDB
- Docker (opsional)

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env sesuai konfigurasi
bun install
bunx prisma migrate dev
bun run dev
```

### User App

```bash
cd front_end/user_app
cp .env.example .env
# Edit .env sesuai konfigurasi
npm install
npm run dev
```

### Scanner

```bash
cd front_end/scanner
cp .env.example .env
# Edit .env sesuai konfigurasi
npm install
npm run dev
```

## Environment Variables

### Backend `.env`

| Variable | Keterangan |
|---|---|
| `DATABASE_URL` | MySQL connection string |
| `JWT_SECRET` | Secret untuk JWT access token |
| `REFRESH_TOKEN_SECRET` | Secret untuk refresh token |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| `SCANNER_SECRET` | Secret key untuk validasi scanner |

### User App `.env`

| Variable | Keterangan |
|---|---|
| `BACKEND_URL` | URL backend (server-side) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `NEXT_PUBLIC_GOOGLE_REDIRECT_URI` | Google OAuth redirect URI |
| `NEXT_PUBLIC_BASE_URL` | Base URL aplikasi |
| `JWT_SECRET` | Secret JWT (sama dengan backend) |
| `NEXT_PUBLIC_VOTING_UNLOCK` | Waktu buka voting (format: `YYYY-MM-DDTHH:MM:SS`) |
| `NEXT_PUBLIC_RESULTS_UNLOCK` | Waktu buka hasil (format: `YYYY-MM-DDTHH:MM:SS`) |

### Scanner `.env`

| Variable | Keterangan |
|---|---|
| `BACKEND_URL` | URL backend |
| `SCANNER_SECRET` | Secret key (sama dengan backend) |
| `KIOSK_ACCESS_TOKEN` | Token untuk unlock kiosk via URL |

## Akses Kiosk Scanner

Untuk membuka akses scanner di laptop bilik suara, buka URL:

```
https://scanner.domain.site/?access_key=<KIOSK_ACCESS_TOKEN>
```

Setelah dibuka sekali, cookie akan di-set dan laptop tidak perlu key lagi.

## Tech Stack

| Teknologi | Fungsi | Analogi Sederhana |
|---|---|---|
| [Elysia.js](https://elysiajs.com) | Framework backend (server) | "Otak" yang terima & proses request |
| [Prisma](https://prisma.io) | ORM untuk database | Jembatan antara kode dan database |
| MySQL | Database | Tempat simpan data user, voting, QR |
| [Next.js](https://nextjs.org) | Framework frontend (UI) | Yang user lihat di browser |
| [Tailwind CSS](https://tailwindcss.com) | Styling / tampilan | Biar tampilannya bagus |
| Google OAuth | Login dengan akun Google | Tidak perlu buat sistem login sendiri |
| JWT | Autentikasi sesi | Bukti bahwa user sudah login |
| QR Code | Media transfer token voting | Pengganti kertas suara |
| [Framer Motion](https://framer.com/motion) | Animasi UI | Efek gerak di halaman |
