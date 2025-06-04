import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const VehicleList = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await api.get('/vehicles/my');
        setVehicles(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar veículos:', error);
        setError('Não foi possível carregar seus veículos');
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleDeleteVehicle = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este veículo?')) {
      try {
        await api.delete(`/vehicles/${id}`);
        setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
        alert('Veículo excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir veículo:', error);
        alert('Erro ao excluir veículo. Tente novamente.');
      }
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Sistema de Controle de Estacionamento SENAI</h1>
        <div style={styles.userInfo}>
          <span>Olá, {user?.nome || 'Usuário'}</span>
        </div>
      </header>

      <nav style={styles.nav}>
        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <Link to="/" style={styles.navLink}>Dashboard</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/vehicles" style={{...styles.navLink, fontWeight: 'bold', borderBottom: '2px solid #0066cc'}}>Meus Veículos</Link>
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
        <div style={styles.headerActions}>
          <h2 style={styles.sectionTitle}>Meus Veículos</h2>
          <Link to="/vehicles/new" style={styles.addButton}>
            + Adicionar Veículo
          </Link>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {loading ? (
          <p>Carregando veículos...</p>
        ) : (
          <>
            {vehicles.length === 0 ? (
              <div style={styles.emptyState}>
                <p>Você ainda não possui veículos cadastrados.</p>
                <Link to="/vehicles/new" style={styles.actionButton}>
                  Cadastrar meu primeiro veículo
                </Link>
              </div>
            ) : (
              <div style={styles.vehicleGrid}>
                {vehicles.map(vehicle => (
                  <div key={vehicle.id} style={styles.vehicleCard}>
                    <div style={styles.vehicleHeader}>
                      <h3 style={styles.vehiclePlate}>{vehicle.placa}</h3>
                      <span style={{
                        ...styles.vehicleStatus,
                        backgroundColor: vehicle.ativo ? '#4caf50' : '#f44336'
                      }}>
                        {vehicle.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <div style={styles.vehicleDetails}>
                      <p><strong>Modelo:</strong> {vehicle.modelo}</p>
                      <p><strong>Cor:</strong> {vehicle.cor}</p>
                      <p><strong>Ano:</strong> {vehicle.ano || 'N/A'}</p>
                      <p><strong>Tipo:</strong> {vehicle.tipo}</p>
                    </div>
                    <div style={styles.vehicleActions}>
                      <Link to={`/vehicles/edit/${vehicle.id}`} style={styles.editButton}>
                        Editar
                      </Link>
                      <button 
                        onClick={() => handleDeleteVehicle(vehicle.id)} 
                        style={styles.deleteButton}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
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
    padding: '5px 0',
  },
  main: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#f9f9f9',
  },
  headerActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  sectionTitle: {
    margin: 0,
  },
  addButton: {
    backgroundColor: '#4caf50',
    color: '#fff',
    padding: '8px 15px',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  vehicleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  vehicleCard: {
    backgroundColor: '#fff',
    borderRadius: '5px',
    padding: '15px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  vehicleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  vehiclePlate: {
    margin: 0,
    fontSize: '1.2rem',
  },
  vehicleStatus: {
    padding: '3px 8px',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '0.8rem',
  },
  vehicleDetails: {
    marginBottom: '15px',
  },
  vehicleActions: {
    display: 'flex',
    gap: '10px',
  },
  editButton: {
    backgroundColor: '#0066cc',
    color: '#fff',
    padding: '5px 10px',
    borderRadius: '4px',
    textDecoration: 'none',
    textAlign: 'center',
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    color: '#fff',
    padding: '5px 10px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    flex: 1,
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 0',
  },
  actionButton: {
    display: 'inline-block',
    backgroundColor: '#0066cc',
    color: '#fff',
    padding: '10px 15px',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: 'bold',
    marginTop: '15px',
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

export default VehicleList;
