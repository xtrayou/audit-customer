import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAudit, uploadFile } from '../../services/auditService';

/**
 * Home Page - Form pengajuan audit untuk customer
 */
export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nama_customer: '',
    perusahaan: '',
    email: '',
    whatsapp: '',
    website: '',
    jenis_audit: '',
    deskripsi: '',
    lampiran: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        lampiran: file,
      }));
    }
  };

  const validateForm = () => {
    // Field wajib
    const requiredFields = ['nama_customer', 'perusahaan', 'email', 'whatsapp', 'jenis_audit', 'deskripsi'];
    
    for (const field of requiredFields) {
      if (!formData[field].trim()) {
        setError(`Field ${field.replace(/_/g, ' ')} wajib diisi`);
        return false;
      }
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Format email tidak valid');
      return false;
    }

    // Validasi whatsapp (minimal 10 digit)
    const whatsappRegex = /^[\d+\s-]{10,}$/;
    if (!whatsappRegex.test(formData.whatsapp.replace(/\s/g, ''))) {
      setError('Nomor WhatsApp tidak valid (minimal 10 digit)');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      let lampiranUrl = null;

      // Upload file jika ada
      if (formData.lampiran) {
        lampiranUrl = await uploadFile(formData.lampiran);
      }

      // Simpan data audit
      const auditPayload = {
        nama_customer: formData.nama_customer,
        perusahaan: formData.perusahaan,
        email: formData.email,
        whatsapp: formData.whatsapp,
        website: formData.website,
        jenis_audit: formData.jenis_audit,
        deskripsi: formData.deskripsi,
        lampiran: lampiranUrl,
        status: 'Menunggu',
        catatan_admin: null,
        created_at: new Date().toISOString(),
      };

      await createAudit(auditPayload);

      // Redirect ke halaman success
      navigate('/success');
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat mengirim audit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Form Pengajuan Audit</h1>
        <p style={styles.subtitle}>Silakan lengkapi formulir di bawah untuk mengajukan audit</p>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Nama Customer */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Nama Customer *</label>
            <input
              type="text"
              name="nama_customer"
              value={formData.nama_customer}
              onChange={handleInputChange}
              placeholder="Masukkan nama customer"
              style={styles.input}
            />
          </div>

          {/* Perusahaan */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Perusahaan *</label>
            <input
              type="text"
              name="perusahaan"
              value={formData.perusahaan}
              onChange={handleInputChange}
              placeholder="Masukkan nama perusahaan"
              style={styles.input}
            />
          </div>

          {/* Email */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Masukkan email"
              style={styles.input}
            />
          </div>

          {/* WhatsApp */}
          <div style={styles.formGroup}>
            <label style={styles.label}>WhatsApp *</label>
            <input
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleInputChange}
              placeholder="Masukkan nomor WhatsApp"
              style={styles.input}
            />
          </div>

          {/* Website */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://example.com"
              style={styles.input}
            />
          </div>

          {/* Jenis Audit */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Jenis Audit *</label>
            <select
              name="jenis_audit"
              value={formData.jenis_audit}
              onChange={handleInputChange}
              style={styles.input}
            >
              <option value="">-- Pilih Jenis Audit --</option>
              <option value="Sistem">Sistem</option>
              <option value="Keamanan">Keamanan</option>
              <option value="Finansial">Finansial</option>
              <option value="Operasional">Operasional</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          {/* Deskripsi */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Deskripsi *</label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleInputChange}
              placeholder="Masukkan deskripsi audit"
              style={{...styles.input, minHeight: '120px', resize: 'vertical'}}
            />
          </div>

          {/* Upload Lampiran */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Upload Lampiran</label>
            <input
              type="file"
              onChange={handleFileChange}
              style={styles.input}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
            />
            {formData.lampiran && (
              <p style={styles.fileInfo}>File terpilih: {formData.lampiran.name}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Mengirim...' : 'Kirim Audit'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    width: '100%',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    textAlign: 'center',
    marginBottom: '30px',
  },
  errorAlert: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '12px 16px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #f5c6cb',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px',
  },
  input: {
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontFamily: 'inherit',
    transition: 'border-color 0.3s ease',
    ':focus': {
      outline: 'none',
      borderColor: '#007bff',
      boxShadow: '0 0 0 3px rgba(0,123,255,0.1)',
    },
  },
  fileInfo: {
    fontSize: '12px',
    color: '#28a745',
    marginTop: '8px',
  },
  submitBtn: {
    padding: '12px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop: '10px',
  },
};
