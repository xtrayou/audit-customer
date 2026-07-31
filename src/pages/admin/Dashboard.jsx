import { useEffect, useState } from 'react';
import { getAuditStats } from '../../services/auditService';

/**
 * Dashboard Page - Halaman dashboard admin
 * Menampilkan statistik audit
 */
export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    menunggu: 0,
    diproses: 0,
    selesai: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getAuditStats();
        setStats(data);
      } catch (err) {
        setError(err.message || 'Gagal mengambil data statistik');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div style={styles.loading}>Loading statistics...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  const statCards = [
    {
      title: 'Total Audit',
      value: stats.total,
      color: '#007bff',
      icon: '📊',
    },
    {
      title: 'Menunggu',
      value: stats.menunggu,
      color: '#ffc107',
      icon: '⏳',
    },
    {
      title: 'Diproses',
      value: stats.diproses,
      color: '#17a2b8',
      icon: '⚙️',
    },
    {
      title: 'Selesai',
      value: stats.selesai,
      color: '#28a745',
      icon: '✓',
    },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>
      <p style={styles.subtitle}>Ringkasan statistik audit customer</p>

      <div style={styles.statsGrid}>
        {statCards.map((card, index) => (
          <div key={index} style={{ ...styles.statCard, borderTop: `4px solid ${card.color}` }}>
            <div style={styles.cardIcon}>{card.icon}</div>
            <h3 style={styles.cardTitle}>{card.title}</h3>
            <div style={{ ...styles.cardValue, color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={styles.infoBox}>
        <h3 style={styles.infoTitle}>Informasi</h3>
        <ul style={styles.infoList}>
          <li>
            <strong>Total Audit:</strong> Jumlah seluruh audit yang masuk
          </li>
          <li>
            <strong>Menunggu:</strong> Audit yang menunggu untuk diproses
          </li>
          <li>
            <strong>Diproses:</strong> Audit yang sedang dalam proses
          </li>
          <li>
            <strong>Selesai:</strong> Audit yang telah selesai diproses
          </li>
        </ul>
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
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '30px',
  },
  loading: {
    padding: '40px',
    textAlign: 'center',
    color: '#666',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '12px 16px',
    borderRadius: '4px',
    border: '1px solid #f5c6cb',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  cardIcon: {
    fontSize: '32px',
    marginBottom: '10px',
  },
  cardTitle: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '10px',
    fontWeight: 'normal',
  },
  cardValue: {
    fontSize: '36px',
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  infoTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '15px',
  },
  infoList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  infoListItem: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '10px',
    lineHeight: '1.6',
  },
};
