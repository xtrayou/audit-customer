import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAudits } from '../../services/auditService';

/**
 * AuditList Page - Daftar audit dengan fitur search dan filter
 */
export default function AuditList() {
  const navigate = useNavigate();
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');

  const statusOptions = ['Semua', 'Menunggu', 'Diproses', 'Selesai'];

  // Fetch data dengan debounce untuk search
  useEffect(() => {
    const fetchAudits = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getAudits(search, statusFilter);
        setAudits(data);
      } catch (err) {
        setError(err.message || 'Gagal mengambil data audit');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      fetchAudits();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const handleRowClick = (id) => {
    navigate(`/dashboard/audits/${id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusStyle = (status) => {
    const statusStyles = {
      'Menunggu': { backgroundColor: '#ffc10733', color: '#856404' },
      'Diproses': { backgroundColor: '#17a2b833', color: '#0c5460' },
      'Selesai': { backgroundColor: '#28a74533', color: '#155724' },
    };
    return statusStyles[status] || { backgroundColor: '#e2e3e533', color: '#383d41' };
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Daftar Audit</h1>

      {/* Search dan Filter */}
      <div style={styles.filterSection}>
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau perusahaan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterBox}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.filterSelect}
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <div style={styles.errorAlert}>{error}</div>}

      {loading ? (
        <div style={styles.loading}>Loading audits...</div>
      ) : audits.length === 0 ? (
        <div style={styles.emptyState}>
          <p>Tidak ada data audit yang ditemukan</p>
        </div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Nama Customer</th>
                <th style={styles.th}>Perusahaan</th>
                <th style={styles.th}>Jenis Audit</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Tanggal</th>
                <th style={styles.th}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {audits.map((audit) => (
                <tr key={audit.id} style={styles.tableRow}>
                  <td style={styles.td}>{audit.nama_customer}</td>
                  <td style={styles.td}>{audit.perusahaan}</td>
                  <td style={styles.td}>{audit.jenis_audit}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      ...getStatusStyle(audit.status)
                    }}>
                      {audit.status}
                    </span>
                  </td>
                  <td style={styles.td}>{formatDate(audit.created_at)}</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleRowClick(audit.id)}
                      style={styles.detailBtn}
                    >
                      Lihat Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={styles.statsText}>
        Total: {audits.length} audit
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
  filterSection: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  searchBox: {
    flex: 1,
    minWidth: '250px',
  },
  searchInput: {
    width: '100%',
    padding: '10px 15px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontFamily: 'inherit',
  },
  filterBox: {
    minWidth: '150px',
  },
  filterSelect: {
    width: '100%',
    padding: '10px 15px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontFamily: 'inherit',
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
  emptyState: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#666',
  },
  tableWrapper: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #dee2e6',
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
  },
  tableRow: {
    borderBottom: '1px solid #dee2e6',
    transition: 'background-color 0.2s ease',
  },
  td: {
    padding: '12px',
    fontSize: '14px',
    color: '#666',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  detailBtn: {
    padding: '6px 12px',
    fontSize: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  statsText: {
    padding: '15px 20px',
    fontSize: '14px',
    color: '#666',
  },
};
