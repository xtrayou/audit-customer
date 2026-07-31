import { useEffect, useState } from 'react';
import { loginWithEmail, logout as logoutService, getCurrentSession, onAuthStateChange } from '../services/authService';
import { AuthContext } from './createAuthContext';

/**
 * AuthProvider - Mengelola state autentikasi global
 */
export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    // Subscribe ke perubahan auth state saat component mount
    useEffect(() => {
        // Ambil session awal
        const initSession = async () => {
            const currentSession = await getCurrentSession();
            setSession(currentSession);
            setLoading(false);
        };

        initSession();

        // Subscribe ke perubahan auth state
        const { data: { subscription } } = onAuthStateChange((event, newSession) => {
            setSession(newSession);
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    // Login function
    const login = async (email, password) => {
        setLoading(true);
        const data = await loginWithEmail(email, password);
        setSession(data.session);
        setLoading(false);
        return data;
    };

    // Logout function
    const logout = async () => {
        setLoading(true);
        await logoutService();
        setSession(null);
        setLoading(false);
    };

    const value = {
        session,
        loading,
        login,
        logout,
        isAuthenticated: !!session,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
