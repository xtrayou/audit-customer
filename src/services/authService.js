import { supabase } from './supabase';

/**
 * Login dengan email dan password
 * @param {string} email - Email pengguna
 * @param {string} password - Password pengguna
 * @returns {Promise<object>} - User data jika berhasil
 */
export const loginWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

/**
 * Logout pengguna
 * @returns {Promise<void>}
 */
export const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        throw new Error(error.message);
    }
};

/**
 * Ambil session pengguna saat ini
 * @returns {Promise<object>} - Session data
 */
export const getCurrentSession = async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
        throw new Error(error.message);
    }

    return data.session;
};

/**
 * Subscribe ke perubahan auth state
 * @param {function} callback - Fungsi yang dipanggil saat auth state berubah
 * @returns {object} - Subscription object
 */
export const onAuthStateChange = (callback) => {
    return supabase.auth.onAuthStateChange(callback);
};
