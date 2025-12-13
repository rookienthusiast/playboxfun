# 🎮 PlayBox Fun

Aplikasi gamifikasi tabungan untuk anak-anak (Usia 6-12 Tahun) agar rajin menabung dengan cara yang menyenangkan!

> **Project Concept:** Menggabungkan tabungan celengan dengan elemen RPG & Board Game.

## 📂 Struktur Project (Monorepo)

Project ini menggunakan arsitektur **Terpisah (Decoupled)** tetapi berada dalam satu repositori yang sama:

- **`client/` (Frontend)**: Dibangun dengan **Next.js 15+**, **Tailwind CSS v4**, dan **Framer Motion**.
- **`server/` (Backend)**: Dibangun dengan **Express.js**, **Prisma ORM**, dan **PostgreSQL**.

---

## 🚀 Cara Menjalankan Project

### 1. Mode Frontend Saja (Mock Data)
Jika Backend belum siap atau Anda hanya ingin melihat tampilan UI:

```bash
cd client
npm install
npm run dev
```
Buka browser di: [http://localhost:3000](http://localhost:3000)

> Saat ini Frontend menggunakan data palsu (Mock Data) yang ada di `client/src/data/mock.ts`, jadi tidak memerlukan koneksi database.

### 2. Mode Fullstack (Client + Server)
Jika Backend sudah dikembangkan:

1. Setup Environment Backend:
   - Buat file `.env` di folder `server/`.
   - Isi `DATABASE_URL` PostgreSQL Anda.
2. Jalankan keduanya:

```bash
# Dari root folder 'playboxfun'
npm run dev
```
Perintah ini akan menjalankan Frontend (Port 3000) dan Backend (Port 4000) secara bersamaan menggunakan `concurrently`.

---

## ✨ Fitur Utama (Frontend)

1.  **Dashboard Jojo:**
    - Leveling System & Progress Bar.
    - Title Unik (Pemula, Cerdas, Sultan) berdasarkan saldo.
2.  **Board Game Journey (`/game`):**
    - Visualisasi ular tangga vertikal.
    - Avatar bergerak sesuai jumlah tabungan.
3.  **Laporan Orang Tua (`/report`):**
    - Preview pesan WhatsApp otomatis.
    - Tombol "Kirim ke WA".
4.  **Toko Avatar (`/store`):**
    - Sistem mata uang "Puzzle Piece".
    - Beli & Ganti Avatar.

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS (Custom "Joy" Color Palette)
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Backend:** Express.js (Setup Awal) + Prisma
