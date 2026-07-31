import { supabase } from './supabase';

const STORAGE_BUCKET = 'audit-files';
const TABLE_NAME = 'audits';

/**
 * Buat audit baru
 * @param {object} auditData - Data audit
 * @returns {Promise<object>} - Audit yang baru dibuat
 */
export const createAudit = async (auditData) => {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([auditData])
        .select();

    if (error) {
        throw new Error(error.message);
    }

    return data[0];
};

/**
 * Ambil semua audit dengan filter dan pencarian
 * @param {string} search - Kata kunci pencarian (nama atau perusahaan)
 * @param {string} status - Filter status
 * @returns {Promise<array>} - Daftar audit
 */
export const getAudits = async (search = '', status = null) => {
    let query = supabase.from(TABLE_NAME).select('*');

    // Filter berdasarkan status
    if (status && status !== 'Semua') {
        query = query.eq('status', status);
    }

    // Pencarian berdasarkan nama atau perusahaan
    if (search.trim()) {
        query = query.or(`nama_customer.ilike.%${search}%,perusahaan.ilike.%${search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

/**
 * Ambil audit berdasarkan ID
 * @param {string} id - ID audit
 * @returns {Promise<object>} - Data audit
 */
export const getAuditById = async (id) => {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

/**
 * Update audit (status dan catatan admin)
 * @param {string} id - ID audit
 * @param {object} updateData - Data yang akan diupdate
 * @returns {Promise<object>} - Audit yang diupdate
 */
export const updateAudit = async (id, updateData) => {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .update(updateData)
        .eq('id', id)
        .select();

    if (error) {
        throw new Error(error.message);
    }

    return data[0];
};

/**
 * Ambil statistik audit
 * @returns {Promise<object>} - Total dan breakdown status
 */
export const getAuditStats = async () => {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('status');

    if (error) {
        throw new Error(error.message);
    }

    const stats = {
        total: data.length,
        menunggu: data.filter(a => a.status === 'Menunggu').length,
        diproses: data.filter(a => a.status === 'Diproses').length,
        selesai: data.filter(a => a.status === 'Selesai').length,
    };

    return stats;
};

/**
 * Upload file ke Storage
 * @param {File} file - File yang akan diupload
 * @param {string} customFileName - Nama file custom (opsional)
 * @returns {Promise<string>} - URL file yang diupload
 */
export const uploadFile = async (file, customFileName = null) => {
    const fileName = customFileName || `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, file);

    if (error) {
        throw new Error(error.message);
    }

    // Dapatkan public URL
    const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(fileName);

    return urlData.publicUrl;
};

/**
 * Delete file dari Storage
 * @param {string} filePath - Path file di storage
 * @returns {Promise<void>}
 */
export const deleteFile = async (filePath) => {
    const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([filePath]);

    if (error) {
        throw new Error(error.message);
    }
};
