# Project Structure - Customer Audit Application

## Folder Structure

```
audit-customer/
│
├── public/                         # Static files
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── assets/                     # Images & static assets
│   │   ├── hero.png
│   │   ├── react.svg
│   │   ├── vite.svg
│   │   └── pages/                  # Page-specific assets (legacy, moved to pages)
│   │       └── admin/
│   │
│   ├── components/                 # Reusable components (for future use)
│   │
│   ├── context/
│   │   ├── AuthContext.jsx         # Auth provider component
│   │   └── createAuthContext.js    # Context creation (separate for linting)
│   │
│   ├── hooks/
│   │   └── useAuth.js              # Custom hook untuk auth context
│   │
│   ├── layouts/
│   │   └── DashboardLayout.jsx     # Admin dashboard layout dengan navigation
│   │
│   ├── pages/
│   │   ├── public/                 # Public pages (no auth required)
│   │   │   ├── Home.jsx            # Customer audit form
│   │   │   └── Success.jsx         # Success page setelah submit
│   │   │
│   │   └── admin/                  # Admin pages (auth required)
│   │       ├── Login.jsx           # Admin login
│   │       ├── Dashboard.jsx       # Dashboard dengan statistik
│   │       ├── AuditList.jsx       # Daftar audit dengan search & filter
│   │       └── AuditDetail.jsx     # Detail audit & edit status
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx           # Route definitions dan protected routes
│   │
│   ├── services/                   # API & Supabase services
│   │   ├── supabase.js             # Supabase client initialization
│   │   ├── authService.js          # Authentication functions
│   │   └── auditService.js         # Audit CRUD & storage operations
│   │
│   ├── utils/                      # Utility functions (for future use)
│   │
│   ├── App.jsx                     # Main app component
│   ├── App.css                     # Global styles
│   ├── index.css                   # Base styles
│   └── main.jsx                    # React DOM render entry
│
├── .env                            # Environment variables (local)
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── .oxlintrc.json                  # Linting configuration
├── index.html                      # HTML entry point
├── package.json                    # Project dependencies
├── package-lock.json               # Dependency lock file
├── vite.config.js                  # Vite configuration
├── SETUP.md                        # Setup & installation guide
└── PROJECT_STRUCTURE.md            # This file

```

## File Descriptions

### Core Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main component, setup Router & AuthProvider |
| `src/main.jsx` | React DOM render entry point |
| `index.html` | HTML template |
| `vite.config.js` | Vite build configuration |

### Services (`src/services/`)

| File | Functions |
|------|-----------|
| `supabase.js` | Supabase client initialization |
| `authService.js` | `loginWithEmail`, `logout`, `getCurrentSession`, `onAuthStateChange` |
| `auditService.js` | `createAudit`, `getAudits`, `getAuditById`, `updateAudit`, `getAuditStats`, `uploadFile`, `deleteFile` |

### Context (`src/context/`)

| File | Purpose |
|------|---------|
| `AuthContext.jsx` | AuthProvider component, manages global auth state |
| `createAuthContext.js` | AuthContext creation (separated for linting compliance) |

### Hooks (`src/hooks/`)

| File | Purpose |
|------|---------|
| `useAuth.js` | Custom hook to access auth context |

### Pages - Public (`src/pages/public/`)

| Page | Route | Purpose |
|------|-------|---------|
| `Home.jsx` | `/` | Customer audit submission form |
| `Success.jsx` | `/success` | Success page after form submission |

### Pages - Admin (`src/pages/admin/`)

| Page | Route | Purpose |
|------|-------|---------|
| `Login.jsx` | `/login` | Admin login page |
| `Dashboard.jsx` | `/dashboard` | Dashboard with audit statistics |
| `AuditList.jsx` | `/dashboard/audits` | List of audits with search & filter |
| `AuditDetail.jsx` | `/dashboard/audits/:id` | Audit detail & edit status/notes |

### Layouts (`src/layouts/`)

| File | Purpose |
|------|---------|
| `DashboardLayout.jsx` | Admin layout with navigation, uses React Router Outlet |

### Routes (`src/routes/`)

| File | Purpose |
|------|---------|
| `AppRoutes.jsx` | Route definitions, ProtectedRoute component |

## Database Schema

### Table: `audits`

```sql
id                  UUID PRIMARY KEY (auto)
nama_customer       VARCHAR(255) NOT NULL
perusahaan          VARCHAR(255) NOT NULL
email               VARCHAR(255) NOT NULL
whatsapp            VARCHAR(20) NOT NULL
website             VARCHAR(255) NULLABLE
jenis_audit         VARCHAR(100) NOT NULL
deskripsi           TEXT NOT NULL
lampiran            VARCHAR(500) NULLABLE (file URL)
status              VARCHAR(50) DEFAULT 'Menunggu' NOT NULL
catatan_admin       TEXT NULLABLE
created_at          TIMESTAMP WITH TIME ZONE (auto)
updated_at          TIMESTAMP WITH TIME ZONE (auto)
```

### Storage Bucket

- Bucket Name: `audit-files`
- Used for: Customer audit attachments

## Routes Overview

### Public Routes
- `GET /` → Home (customer form)
- `GET /success` → Success page
- `GET /login` → Admin login

### Protected Routes (requires authentication)
- `GET /dashboard` → Dashboard with stats
- `GET /dashboard/audits` → Audit list
- `GET /dashboard/audits/:id` → Audit detail

## Key Features

### 1. Customer Audit Form
- Form validation
- File upload to Supabase Storage
- Create audit in database
- Redirect to success page

### 2. Admin Dashboard
- Real-time audit statistics
- Status breakdown (Menunggu, Diproses, Selesai)

### 3. Audit List
- Display audits in table format
- Search by name/company
- Filter by status
- Sort by date

### 4. Audit Detail
- View complete audit information
- Edit status & admin notes
- Download attachments
- Update database

### 5. Authentication
- Login with email & password (Supabase Auth)
- Protected routes for admin pages
- Logout functionality
- Session management

## Technology Stack

- **Frontend Framework**: React 19 with Vite
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Routing**: React Router v7
- **State Management**: React Context API
- **Styling**: Inline styles (no CSS framework)
- **HTTP Client**: Supabase JS SDK

## Best Practices Implemented

✓ Modular code structure (services, context, pages, layouts)
✓ Separation of concerns
✓ Proper error handling
✓ Loading states management
✓ Form validation
✓ Async/await for asynchronous operations
✓ Context API for global state
✓ React Router for navigation
✓ Functional components with hooks
✓ Responsive design
✓ Clean code with comments
✓ Environment variable configuration
✓ Protected routes for admin pages

## Development Workflow

1. **Setup**: Follow SETUP.md for installation & configuration
2. **Development**: `npm run dev` for hot reload
3. **Linting**: `npm run lint` to check code quality
4. **Build**: `npm run build` for production
5. **Preview**: `npm run preview` to preview build
