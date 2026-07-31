import { useNavigate } from 'react-router-dom';

/**
 * Success Page - Halaman sukses setelah submit audit
 */
export default function Success() {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <div style={styles.successBox}>
        <div style={styles.successIcon}>✓</div>
        <h1 style={styles.title}>Audit Berhasil Dikirim</h1>
        <p style={styles.message}>
          Terima kasih telah mengajukan audit. Tim kami akan segera memproses pengajuan Anda.
        </p>
        <p style={styles.subMessage}>
          Anda akan menerima notifikasi melalui email tentang status audit Anda.
        </p>
        <button onClick={handleBackHome} style={styles.button}>
          Kembali ke Halaman Utama
        </button>
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
  successBox: {
    backgroundColor: '#fff',
    padding: '60px 40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center',
  },
  successIcon: {
    width: '80px',
    height: '80px',
    backgroundColor: '#28a745',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '48px',
    fontWeight: 'bold',
    margin: '0 auto 20px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '15px',
  },
  message: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '10px',
    lineHeight: '1.6',
  },
  subMessage: {
    fontSize: '14px',
    color: '#999',
    marginBottom: '30px',
    lineHeight: '1.6',
  },
  button: {
    padding: '12px 30px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};
