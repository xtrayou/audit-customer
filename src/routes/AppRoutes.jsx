import { Navigate, Routes, Route } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Public Pages
import Home from '../pages/public/Home';
import Success from '../pages/public/Success';

// Admin Pages
import Login from '../pages/admin/Login';
import Dashboard from '../pages/admin/Dashboard';
import AuditList from '../pages/admin/AuditList';
import AuditDetail from '../pages/admin/AuditDetail';

// Layouts
import DashboardLayout from '../layouts/DashboardLayout';

/**
 * Protected Route Component
 * Redirect ke login jika belum authenticated
 */
function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div style={{ padding: '20px' }}>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

/**
 * Main Routes
 */
export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/success" element={<Success />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Admin Routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Dashboard />} />
                <Route path="audits" element={<AuditList />} />
                <Route path="audits/:id" element={<AuditDetail />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
