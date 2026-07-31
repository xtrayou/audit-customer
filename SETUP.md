# Customer Audit Application - Setup Guide

Aplikasi Customer Audit dibangun dengan **React.js (Vite)**, **Supabase**, dan **React Router**.

## Persyaratan

- Node.js 16+ dan npm
- Akun Supabase (https://supabase.com)

## Instalasi

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Supabase

#### 2.1 Buat Project di Supabase

1. Buka https://supabase.com dan login
2. Buat project baru
3. Copy `Project URL` dan `Anon Key`

#### 2.2 Buat Database Table

Jalankan SQL query berikut di Supabase SQL Editor:

```sql
-- Buat table audits
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama_customer VARCHAR(255) NOT NULL,
  perusahaan VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(20) NOT NULL,
  website VARCHAR(255),
  jenis_audit VARCHAR(100) NOT NULL,
  deskripsi TEXT NOT NULL,
  lampiran VARCHAR(500),
  status VARCHAR(50) DEFAULT 'Menunggu' NOT NULL,
  catatan_admin TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Buat index untuk search
CREATE INDEX idx_audits_nama_customer ON audits(nama_customer);
CREATE INDEX idx_audits_perusahaan ON audits(perusahaan);
CREATE INDEX idx_audits_status ON audits(status);
CREATE INDEX idx_audits_created_at ON audits(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;

-- Policy untuk public read/insert (customer)
CREATE POLICY "Enable insert for all users" ON audits
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for all users" ON audits
  FOR SELECT USING (true);
```

#### 2.3 Setup Storage Bucket

1. Buka **Storage** di Supabase dashboard
2. Buat bucket baru dengan nama `audit-files`
3. Buat folder atau upload file

#### 2.4 Setup Authentication

1. Buka **Authentication** → **Settings** di Supabase
2. Buat pengguna admin dengan email dan password untuk login admin

### 3. Konfigurasi Environment

Buat file `.env` di root project:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Ganti dengan nilai dari Supabase Anda.

## Menjalankan Aplikasi

### Development Mode

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

### Build untuk Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Struktur Project

```
src/
├── assets/              # Gambar dan file statis
├── components/          # Reusable components
├── pages/
│   ├── public/          # Halaman publik (tanpa login)
│   │   ├── Home.jsx     # Form audit
│   │   └── Success.jsx  # Halaman sukses
│   └── admin/           # Halaman admin (perlu login)
│       ├── Login.jsx    # Login admin
│       ├── Dashboard.jsx
│       ├── AuditList.jsx
│       └── AuditDetail.jsx
├── services/            # API/Supabase services
│   ├── supabase.js      # Supabase client
│   ├── authService.js   # Auth functions
│   └── auditService.js  # Audit CRUD
├── context/
│   └── AuthContext.jsx  # Global auth state
├── layouts/
│   └── DashboardLayout.jsx  # Admin layout
├── routes/
│   └── AppRoutes.jsx    # Route definition
├── App.jsx
├── main.jsx
└── index.css
```

## Route List

### Public Routes
- `/` - Form audit (customer)
- `/success` - Halaman sukses submit audit
- `/login` - Login admin

### Admin Routes (Protected)
- `/dashboard` - Dashboard dengan statistik
- `/dashboard/audits` - Daftar audit dengan search & filter
- `/dashboard/audits/:id` - Detail audit (edit status & catatan)

## Fitur Utama

### 1. Customer Audit Form
- Validasi field wajib
- Upload file ke Supabase Storage
- Submit data ke database
- Redirect ke halaman sukses

### 2. Admin Dashboard
- Statistik total audit dan breakdown status
- Real-time update

### 3. Daftar Audit
- Tampilkan tabel audit
- Search berdasarkan nama & perusahaan
- Filter status (Semua, Menunggu, Diproses, Selesai)
- Sorting by created_at

### 4. Detail Audit
- Tampilkan semua informasi audit
- Edit status audit
- Tambah/edit catatan admin
- Download lampiran

### 5. Authentication
- Login dengan email & password
- Protected routes untuk admin
- Logout

## Best Practice yang Diterapkan

✓ Modular code structure
✓ Separation of concerns (services, context, pages, layouts)
✓ Error handling
✓ Loading states
✓ Form validation
✓ Async/await
✓ Context API untuk global state
✓ React Router untuk navigation
✓ Functional components + hooks
✓ Responsive design (inline styles)

## Troubleshooting

### Error: "Missing Supabase configuration"
- Pastikan `.env` file sudah dibuat dengan benar
- Periksa nilai `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`

### Error: "Auth session not found"
- Pastikan pengguna admin sudah dibuat di Supabase Authentication
- Cek email dan password saat login

### Error: "Storage bucket not found"
- Buat bucket `audit-files` di Supabase Storage
- Pastikan nama bucket sesuai dengan konfigurasi

### File tidak bisa diupload
- Cek permission bucket di Supabase
- Pastikan bucket status public atau configure CORS

## Development Tips

1. Gunakan `npm run dev` untuk development dengan hot reload
2. Buka browser console untuk debugging
3. Gunakan Supabase dashboard untuk monitor database dan storage
4. Test semua skenario: success, error, empty state

## Deployment

Aplikasi dapat di-deploy ke:
- Vercel
- Netlify
- GitHub Pages
- Heroku
- Atau host lainnya

Pastikan environment variables sudah di-setup di host yang dipilih.

## Support

Untuk bantuan lebih lanjut:
- Baca dokumentasi React: https://react.dev
- Baca dokumentasi Supabase: https://supabase.com/docs
- Baca dokumentasi React Router: https://reactrouter.com
