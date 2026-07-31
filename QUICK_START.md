# Quick Start Guide - Customer Audit Application

## Prerequisites
- Node.js 16+
- npm or yarn
- Supabase account

## Step 1: Setup Supabase

### 1.1 Create Project
1. Go to https://supabase.com
2. Create new project
3. Copy `Project URL` and `Anon Key`

### 1.2 Create Database Table
Open SQL Editor and run:

```sql
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

CREATE INDEX idx_audits_nama_customer ON audits(nama_customer);
CREATE INDEX idx_audits_perusahaan ON audits(perusahaan);
CREATE INDEX idx_audits_status ON audits(status);
CREATE INDEX idx_audits_created_at ON audits(created_at DESC);

ALTER TABLE audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for all users" ON audits
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for all users" ON audits
  FOR SELECT USING (true);
```

### 1.3 Create Storage Bucket
1. Go to **Storage** in Supabase
2. Create new bucket: `audit-files`

### 1.4 Create Admin User
1. Go to **Authentication** → **Users**
2. Add user with email & password

## Step 2: Configure Environment

1. Open `.env` file
2. Add your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 3: Install & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Application will run at: **http://localhost:5173**

## Step 4: Test

### Test Customer Form
1. Go to `http://localhost:5173`
2. Fill form and submit
3. Should redirect to success page

### Test Admin Panel
1. Go to `http://localhost:5173/login`
2. Login with admin credentials
3. Access `/dashboard`

## Troubleshooting

### Error: "Missing Supabase configuration"
- Check `.env` file exists with correct values
- Restart dev server after changing `.env`

### Error: "Auth session not found"
- Create admin user in Supabase Authentication
- Use correct email & password

### Error: "Storage bucket not found"
- Create `audit-files` bucket in Supabase Storage
- Ensure bucket is public or configure CORS

### Form submission fails
- Check browser console for errors
- Verify Supabase credentials
- Check database table exists

## Project Structure

```
src/
├── services/         # Supabase & API calls
├── pages/           # UI pages
├── context/         # Global state
├── layouts/         # Layout components
├── routes/          # Route definitions
└── hooks/           # Custom React hooks
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Check code quality
npm run preview  # Preview production build
```

## Next Steps

1. **Customize styles** - Modify inline styles in components or use CSS framework
2. **Add components** - Create reusable components in `src/components/`
3. **Add validation** - Enhance form validation as needed
4. **Add tests** - Setup testing framework (Vitest, Jest)
5. **Deploy** - Deploy to Vercel, Netlify, or other platforms

## Support

- React Docs: https://react.dev
- Supabase Docs: https://supabase.com/docs
- React Router: https://reactrouter.com
- Vite: https://vitejs.dev
