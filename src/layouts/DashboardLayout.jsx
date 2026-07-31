import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

/**
 * DashboardLayout - Layout untuk admin dashboard
 * Berisi navigation, sidebar, dan outlet untuk halaman dashboard
 */
export default function DashboardLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            alert('Error logging out: ' + err.message);
        }
    };

    const handleNavigate = (path) => {
        navigate(path);
        setIsMenuOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div style={styles.container}>
            {/* Header/Navigation */}
            <nav style={styles.header}>
                <div style={styles.headerContent}>
                    <h1 style={styles.logo}>Audit Customer</h1>
                    <div style={styles.nav}>
                        <button
                            style={styles.mobileMenuBtn}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            ☰
                        </button>
                        <div style={{
                            ...styles.navLinks,
                            display: isMenuOpen ? 'flex' : { display: 'none', '@media (min-width: 768px)': { display: 'flex' } }
                        }}>
                            <button
                                onClick={() => handleNavigate('/dashboard')}
                                style={{
                                    ...styles.navLink,
                                    ...(isActive('/dashboard') ? styles.navLinkActive : {})
                                }}
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => handleNavigate('/dashboard/audits')}
                                style={{
                                    ...styles.navLink,
                                    ...(isActive('/dashboard/audits') ? styles.navLinkActive : {})
                                }}
                            >
                                Daftar Audit
                            </button>
                            <button
                                onClick={handleLogout}
                                style={styles.logoutBtn}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main style={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#fff',
        borderBottom: '1px solid #e0e0e0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    headerContent: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '60px',
    },
    logo: {
        margin: 0,
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333',
    },
    nav: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    mobileMenuBtn: {
        display: 'none',
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        '@media (max-width: 768px)': {
            display: 'block',
        },
    },
    navLinks: {
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
    },
    navLink: {
        background: 'none',
        border: 'none',
        color: '#666',
        fontSize: '16px',
        cursor: 'pointer',
        padding: '8px 12px',
        borderRadius: '4px',
        transition: 'all 0.3s ease',
        ':hover': {
            backgroundColor: '#f0f0f0',
            color: '#333',
        },
    },
    navLinkActive: {
        color: '#007bff',
        fontWeight: 'bold',
        backgroundColor: '#f0f7ff',
    },
    logoutBtn: {
        background: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
        ':hover': {
            backgroundColor: '#c82333',
        },
    },
    mainContent: {
        flex: 1,
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '20px',
    },
};
