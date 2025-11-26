# Menu Catalog API (GDGoC UGM Backend Study Case)

Backend API untuk manajemen katalog restoran, dibangun sebagai bagian dari studi kasus GDGoC UGM dengan role Hacker dan fokus pada bidang backend. Proyek ini menampilkan implementasi CRUD lengkap, filter lanjutan, dokumentasi otomatis, dan integrasi kecerdasan buatan (AI) untuk analisis data menu.

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL (via Docker)
- **ORM:** Prisma
- **Validation:** Zod
- **AI Integration:** Google Gemini SDK (`@google/genai`)
- **Documentation:** Swagger UI

## ✨ Key Features

1.  **Comprehensive CRUD**: Manajemen penuh (Create, Read, Update, Delete) untuk item menu.
2.  **Advanced Filtering & Pagination**:
    * Pencarian teks (*full-text search*) pada nama dan deskripsi.
    * Filter berdasarkan kategori, rentang harga, dan kalori.
    * Sorting dinamis dan Pagination data.
3.  **AI-Enhanced Insights**:
    * Integrasi dengan **Google Gemini 2.5 Flash Lite**.
    * Akses endpoint `GET /menu?with_ai_summary=true` untuk mendapatkan analisis tentang dominasi kategori, rentang harga, dan rekomendasi strategi promosi berdasarkan data menu yang ada.
4.  **OpenAPI Documentation**: Dokumentasi interaktif menggunakan Swagger UI.

## 🌐 Live Demo (Deployed)
Project ini sudah di-deploy dan dapat diakses secara publik.

* **Base URL:** `https://studycasebackend-nyoman.up.railway.app/`
* **API Documentation (Swagger UI):** [Klik di sini untuk mencoba API](https://studycasebackend-nyoman.up.railway.app/api-docs)

## 🛠️ Prasyarat (Prerequisites)

Pastikan di komputermu sudah terinstall:
* [Node.js](https://nodejs.org/) (v18+)
* [Docker Desktop](https://www.docker.com/) (Untuk menjalankan database PostgreSQL)
* [Git](https://git-scm.com/)

## ⚙️ Cara Menjalankan (Installation Guide)

Ikuti langkah-langkah berikut untuk menjalankan project di lingkungan lokal (Localhost):

### 1. Clone Repository
```bash
git clone <masukkan-url-repository-di-sini>repository GitHub project ini
cd study_case_backend
```

### 2. Konfigurasi Environment Variables
Buat file bernama `.env` di root folder proyek, lalu salin konfigurasi berikut:

```env
# Server Configuration
PORT=3000

# Database Configuration (Sesuai docker-compose)
# Ganti 'user:password' dengan username dan password database PostgreSQL-mu
DATABASE_URL="postgresql://user:password@localhost:5432/menu_catalog?schema=public"

# Google Gemini AI Key (Dapatkan di aistudio.google.com)
GEMINI_API_KEY="paste_api_key_kamu_disini"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Setup Database
Pastikan Docker Desktop sudah berjalan, lalu nyalakan container database dan jalankan migrasi Prisma:

```bash
# Nyalakan Database PostgreSQL di Docker
docker-compose up -d

# Push schema tabel ke database
npx prisma migrate dev --name init
```

### 5. Jalankan Server
```bash
npm run dev
```

## 📖 Dokumentasi API (Swagger)
Setelah server berjalan, dokumentasi lengkap mengenai endpoint, format request, dan response dapat diakses secara interaktif melalui browser:

👉 [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## 🧪 Testing
Aplikasi ini telah lulus validasi menggunakan Postman Collection Runner yang mencakup skenario:

* Validasi Schema Response (JSON Structure)
* HTTP Status Codes (200, 201, 404)
* Logic CRUD (Create, Read, Update, Delete)
* Fitur Pencarian & Filter

---
Created for GDGoC UGM 2025 Selection Study Case.