import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [parkingStatus, setParkingStatus] = useState({
    capacidade_total: 0,
    veiculos_presentes: 0,
    vagas_disponiveis: 0,
    ocupacao_percentual: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchParkingStatus = async () => {
      try {
        const response = await api.get('/access/status');
        setParkingStatus(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar status do estacionamento:', error);
        setError('Não foi possível carregar o status do estacionamento');
        setLoading(false);
      }
    };

    fetchParkingStatus();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Sistema de Controle de Estacionamento SENAI</h1>
        <div style={styles.userInfo}>
          <span>Olá, {user?.nome || 'Usuário'}</span>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Sair
          </button>
        </div>
      </header>

      <nav style={styles.nav}>
        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <Link to="/" style={styles.navLink}>Dashboard</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/vehicles" style={styles.navLink}>Meus Veículos</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/access" style={styles.navLink}>Controle de Acesso</Link>
          </li>
          {user?.tipo === 'admin' && (
            <li style={styles.navItem}>
              <Link to="/admin" style={styles.navLink}>Administração</Link>
            </li>
          )}
        </ul>
      </nav>

      <main style={styles.main}>
        <h2 style={styles.sectionTitle}>Dashboard</h2>

        {error && <p style={styles.error}>{error}</p>}

        {loading ? (
          <p>Carregando informações...</p>
        ) : (
          <div style={styles.statusContainer}>
            <div style={styles.statusCard}>
              <h3 style={styles.cardTitle}>Capacidade Total</h3>
              <p style={styles.cardValue}>{parkingStatus.capacidade_total}</p>
            </div>
            <div style={styles.statusCard}>
              <h3 style={styles.cardTitle}>Veículos Presentes</h3>
              <p style={styles.cardValue}>{parkingStatus.veiculos_presentes}</p>
            </div>
            <div style={styles.statusCard}>
              <h3 style={styles.cardTitle}>Vagas Disponíveis</h3>
              <p style={styles.cardValue}>{parkingStatus.vagas_disponiveis}</p>
            </div>
            <div style={styles.statusCard}>
              <h3 style={styles.cardTitle}>Ocupação</h3>
              <p style={styles.cardValue}>{parkingStatus.ocupacao_percentual.toFixed(1)}%</p>
            </div>
          </div>
        )}

        <div style={styles.actionsContainer}>
          <h3 style={styles.sectionSubtitle}>Ações Rápidas</h3>
          <div style={styles.buttonGroup}>
            <Link to="/vehicles/new" style={styles.actionButton}>
              Cadastrar Novo Veículo
            </Link>
            <Link to="/access" style={styles.actionButton}>
              Registrar Acesso
            </Link>
          </div>
        </div>
      </main>

      <footer style={styles.footer}>
        <p>&copy; 2025 SENAI - Sistema de Controle de Estacionamento</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  header: {
    backgroundColor: '#0066cc',
    color: '#fff',
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    border: '1px solid #fff',
    color: '#fff',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  nav: {
    backgroundColor: '#f0f0f0',
    padding: '10px 20px',
  },
  navList: {
    display: 'flex',
    listStyle: 'none',
    padding: 0,
    margin: 0,
    gap: '20px',
  },
  navItem: {
    margin: 0,
  },
  navLink: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: 'bold',
  },
  main: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#f9f9f9',
  },
  sectionTitle: {
    borderBottom: '1px solid #ddd',
    paddingBottom: '10px',
    marginBottom: '20px',
  },
  sectionSubtitle: {
    marginTop: '30px',
    marginBottom: '15px',
  },
  statusContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '30px',
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: '5px',
    padding: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    flex: '1 1 200px',
    minWidth: '200px',
  },
  cardTitle: {
    margin: '0 0 10px 0',
    fontSize: '1rem',
    color: '#555',
  },
  cardValue: {
    margin: 0,
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#0066cc',
  },
  actionsContainer: {
    marginTop: '20px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
  },
  actionButton: {
    display: 'inline-block',
    backgroundColor: '#0066cc',
    color: '#fff',
    padding: '10px 15px',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  error: {
    color: '#e74c3c',
    marginBottom: '15px',
  },
  footer: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '15px 20px',
    textAlign: 'center',
  },
};

export default Dashboard;
