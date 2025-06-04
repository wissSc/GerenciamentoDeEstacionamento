import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const VehicleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    placa: '',
    modelo: '',
    cor: '',
    ano: '',
    tipo: 'carro'
  });
  
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVehicle = async () => {
      if (isEditing) {
        try {
          const response = await api.get(`/vehicles/${id}`);
          setFormData({
            placa: response.data.placa,
            modelo: response.data.modelo,
            cor: response.data.cor,
            ano: response.data.ano || '',
            tipo: response.data.tipo
          });
          setLoading(false);
        } catch (error) {
          console.error('Erro ao buscar veículo:', error);
          setError('Não foi possível carregar os dados do veículo');
          setLoading(false);
        }
      }
    };

    fetchVehicle();
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setSubmitting(true);
      
      if (isEditing) {
        await api.put(`/vehicles/${id}`, formData);
        alert('Veículo atualizado com sucesso!');
      } else {
        await api.post('/vehicles', formData);
        alert('Veículo cadastrado com sucesso!');
      }
      
      navigate('/vehicles');
    } catch (error) {
      console.error('Erro ao salvar veículo:', error);
      setError(error.response?.data?.message || 'Erro ao salvar veículo');
    } finally {
      setSubmitting(false);
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
        <div style={styles.formHeader}>
          <h2 style={styles.sectionTitle}>
            {isEditing ? 'Editar Veículo' : 'Cadastrar Novo Veículo'}
          </h2>
          <Link to="/vehicles" style={styles.backButton}>
            Voltar
          </Link>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {loading ? (
          <p>Carregando dados do veículo...</p>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label htmlFor="placa" style={styles.label}>Placa *</label>
              <input
                type="text"
                id="placa"
                name="placa"
                value={formData.placa}
                onChange={handleChange}
                style={styles.input}
                placeholder="AAA-0000 ou AAA0A00"
                required
                disabled={isEditing} // Não permite editar a placa
              />
            </div>
            
            <div style={styles.formGroup}>
              <label htmlFor="modelo" style={styles.label}>Modelo *</label>
              <input
                type="text"
                id="modelo"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                style={styles.input}
                placeholder="Ex: Gol, Civic, Corolla"
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label htmlFor="cor" style={styles.label}>Cor *</label>
              <input
                type="text"
                id="cor"
                name="cor"
                value={formData.cor}
                onChange={handleChange}
                style={styles.input}
                placeholder="Ex: Branco, Preto, Prata"
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label htmlFor="ano" style={styles.label}>Ano</label>
              <input
                type="number"
                id="ano"
                name="ano"
                value={formData.ano}
                onChange={handleChange}
                style={styles.input}
                placeholder="Ex: 2020"
                min="1900"
                max={new Date().getFullYear() + 1}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label htmlFor="tipo" style={styles.label}>Tipo de Veículo *</label>
              <select
                id="tipo"
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value="carro">Carro</option>
                <option value="moto">Moto</option>
                <option value="van">Van</option>
                <option value="caminhao">Caminhão</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              style={styles.submitButton}
              disabled={submitting}
            >
              {submitting ? 'Salvando...' : isEditing ? 'Atualizar Veículo' : 'Cadastrar Veículo'}
            </button>
          </form>
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
  formHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  sectionTitle: {
    margin: 0,
  },
  backButton: {
    backgroundColor: '#666',
    color: '#fff',
    padding: '8px 15px',
    borderRadius: '4px',
    textDecoration: 'none',
  },
  form: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    maxWidth: '600px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  },
  submitButton: {
    padding: '12px',
    backgroundColor: '#0066cc',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
    width: '100%',
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

export default VehicleForm;
