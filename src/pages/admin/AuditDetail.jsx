import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuditById, updateAudit } from '../../services/auditService';

/**
 * AuditDetail Page - Detail audit dengan fitur edit status dan catatan
 */
export default function AuditDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    catatan_admin: '',
  });

  const statusOptions = ['Menunggu', 'Diproses', 'Selesai'];

  // Fetch audit detail
  useEffect(() => {
    const fetchAudit = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getAuditById(id);
        setAudit(data);
        setFormData({
          status: data.status,
          catatan_admin: data.catatan_admin || '',
        });
      } catch (err) {
        setError(err.message || 'Gagal mengambil data audit');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAudit();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setUpdating(true);
      setError('');
      const updated = await updateAudit(id, formData);
      setAudit(updated);
      alert('Data audit berhasil diperbarui');
    } catch (err) {
      setError(err.message || 'Gagal memperbarui audit');
    } finally {
      setUpdating(false);
    }
  };

  const handleBack = () => {
    navigate('/dashboard/audits');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div style={styles.loading}>Loading detail audit...</div>;
  }

  if (!audit) {
    return <div style={styles.error}>Audit tidak ditemukan</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={handleBack} style={styles.backBtn}>
          ← Kembali
        </button>
        <h1 style={styles.title}>Detail Audit</h1>
      </div>

      {error && <div style={styles.errorAlert}>{error}</div>}

      <div style={styles.content}>
        {/* Data Customer */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Informasi Customer</h2>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <label style={styles.label}>Nama Customer</label>
              <p style={styles.value}>{audit.nama_customer}</p>
            </div>
            <div style={styles.infoItem}>
              <label style={styles.label}>Perusahaan</label>
              <p style={styles.value}>{audit.perusahaan}</p>
            </div>
            <div style={styles.infoItem}>
              <label style={styles.label}>Email</label>
              <p style={styles.value}>{audit.email}</p>
            </div>
            <div style={styles.infoItem}>
              <label style={styles.label}>WhatsApp</label>
              <p style={styles.value}>{audit.whatsapp}</p>
            </div>
            <div style={styles.infoItem}>
              <label style={styles.label}>Website</label>
              <p style={styles.value}>{audit.website || '-'}</p>
            </div>
            <div style={styles.infoItem}>
              <label style={styles.label}>Tanggal Dikirim</label>
              <p style={styles.value}>{formatDate(audit.created_at)}</p>
            </div>
          </div>
        </section>

        {/* Data Audit */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Informasi Audit</h2>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <label style={styles.label}>Jenis Audit</label>
              <p style={styles.value}>{audit.jenis_audit}</p>
            </div>
            <div style={{ ...styles.infoItem, gridColumn: '1 / -1' }}>
              <label style={styles.label}>Deskripsi</label>
              <p style={{...styles.value, whiteSpace: 'pre-wrap'}}>{audit.deskripsi}</p>
            </div>
          </div>

          {/* Lampiran */}
          {audit.lampiran && (
            <div style={styles.lampiranBox}>
              <label style={styles.label}>Lampiran</label>
              <a href={audit.lampiran} target="_blank" rel="noopener noreferrer" style={styles.lampiranLink}>
                📎 Download Lampiran
              </a>
            </div>
          )}
        </section>

        {/* Form Update Status dan Catatan */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Update Status dan Catatan</h2>

          <div style={styles.formGrid}>
            <div style={styles.formItem}>
              <label style={styles.label}>Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                style={styles.select}
                disabled={updating}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.formItem}>
            <label style={styles.label}>Catatan Admin</label>
            <textarea
              name="catatan_admin"
              value={formData.catatan_admin}
              onChange={handleInputChange}
              placeholder="Masukkan catatan atau keterangan..."
              style={{...styles.textarea, minHeight: '150px'}}
              disabled={updating}
            />
          </div>

          <button
            onClick={handleSave}
            style={styles.saveBtn}
            disabled={updating}
          >
            {updating ? 'Menyimpan...' : 'Simpan'}
          </button>
        </section>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '30px',
  },
  backBtn: {
    padding: '8px 12px',
    fontSize: '14px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  errorAlert: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '12px 16px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #f5c6cb',
  },
  loading: {
    padding: '40px',
    textAlign: 'center',
    color: '#666',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '20px',
    borderRadius: '4px',
    border: '1px solid #f5c6cb',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  section: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
    borderBottom: '2px solid #007bff',
    paddingBottom: '10px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: '5px',
  },
  value: {
    fontSize: '14px',
    color: '#333',
    margin: 0,
    wordBreak: 'break-word',
  },
  lampiranBox: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '4px',
    marginTop: '15px',
  },
  lampiranLink: {
    color: '#007bff',
    textDecoration: 'none',
    fontSize: '14px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  },
  formItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  select: {
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontFamily: 'inherit',
  },
  textarea: {
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  saveBtn: {
    padding: '12px 30px',
    fontSize: '14px',
    fontWeight: 'bold',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};
