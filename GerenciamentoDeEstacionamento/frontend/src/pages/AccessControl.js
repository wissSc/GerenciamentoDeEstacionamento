import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const AccessControl = () => {
  const { user } = useAuth();
  const [placa, setPlaca] = useState('');
  const [setor, setSetor] = useState('1'); // Valor padrão para o exemplo
  const [operacao, setOperacao] = useState('entrada');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!placa) {
      setError('Informe a placa do veículo');
      return;
    }
    
    try {
      setError('');
      setResult(null);
      setLoading(true);
      
      const endpoint = operacao === 'entrada' ? '/access/entrada' : '/access/saida';
      const payload = operacao === 'entrada' 
        ? { placa, setor_id: parseInt(setor) } 
        : { placa };
      
      const response = await api.post(endpoint, payload);
      
      setResult({
        success: true,
        message: response.data.message,
        data: response.data.accessRecord
      });
    } catch (error) {
      console.error(`Erro ao registrar ${operacao}:`, error);
      setResult({
        success: false,
        message: error.response?.data?.message || `Erro ao registrar ${operacao}`,
        motivo: error.response?.data?.motivo
      });
    } finally {
      setLoading(false);
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
            <Link to="/vehicles" style={styles.navLink}>Meus Veículos</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/access" style={{...styles.navLink, fontWeight: 'bold', borderBottom: '2px solid #0066cc'}}>Controle de Acesso</Link>
          </li>
          {user?.tipo === 'admin' && (
            <li style={styles.navItem}>
              <Link to="/admin" style={styles.navLink}>Administração</Link>
            </li>
          )}
        </ul>
      </nav>

      <main style={styles.main}>
        <h2 style={styles.sectionTitle}>Controle de Acesso</h2>

        <div style={styles.accessContainer}>
          <div style={styles.formContainer}>
            <h3 style={styles.formTitle}>Registrar Acesso</h3>
            
            {error && <p style={styles.error}>{error}</p>}
            
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label htmlFor="placa" style={styles.label}>Placa do Veículo *</label>
                <input
                  type="text"
                  id="placa"
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value)}
                  style={styles.input}
                  placeholder="AAA-0000 ou AAA0A00"
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label htmlFor="operacao" style={styles.label}>Operação *</label>
                <div style={styles.radioGroup}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="operacao"
                      value="entrada"
                      checked={operacao === 'entrada'}
                      onChange={() => setOperacao('entrada')}
                    />
                    Entrada
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="operacao"
                      value="saida"
                      checked={operacao === 'saida'}
                      onChange={() => setOperacao('saida')}
                    />
                    Saída
                  </label>
                </div>
              </div>
              
              {operacao === 'entrada' && (
                <div style={styles.formGroup}>
                  <label htmlFor="setor" style={styles.label}>Setor *</label>
                  <select
                    id="setor"
                    value={setor}
                    onChange={(e) => setSetor(e.target.value)}
                    style={styles.input}
                    required
                  >
                    <option value="1">Setor A - Geral</option>
                    <option value="2">Setor B - Professores</option>
                    <option value="3">Setor C - Administrativo</option>
                  </select>
                </div>
              )}
              
              <button 
                type="submit" 
                style={styles.submitButton}
                disabled={loading}
              >
                {loading ? 'Processando...' : `Registrar ${operacao === 'entrada' ? 'Entrada' : 'Saída'}`}
              </button>
            </form>
          </div>
          
          {result && (
            <div style={{
              ...styles.resultContainer,
              backgroundColor: result.success ? '#e7f5e7' : '#f8e7e7'
            }}>
              <h3 style={{
                ...styles.resultTitle,
                color: result.success ? '#2e7d32' : '#c62828'
              }}>
                {result.success ? 'Acesso Autorizado' : 'Acesso Negado'}
              </h3>
              <p style={styles.resultMessage}>{result.message}</p>
              
              {!result.success && result.motivo && (
                <p style={styles.resultReason}>Motivo: {result.motivo}</p>
              )}
              
              {result.success && result.data && (
                <div style={styles.resultDetails}>
                  <p><strong>Data/Hora:</strong> {new Date(result.data.data_hora).toLocaleString()}</p>
                  <p><strong>Operação:</strong> {result.data.tipo_operacao}</p>
                  {result.data.setor_id && (
                    <p><strong>Setor:</strong> {
                      result.data.setor_id === 1 ? 'Setor A - Geral' :
                      result.data.setor_id === 2 ? 'Setor B - Professores' :
                      result.data.setor_id === 3 ? 'Setor C - Administrativo' :
                      `Setor ${result.data.setor_id}`
                    }</p>
                  )}
                </div>
              )}
            </div>
          )}
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
  sectionTitle: {
    borderBottom: '1px solid #ddd',
    paddingBottom: '10px',
    marginBottom: '20px',
  },
  accessContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '800px',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  formTitle: {
    margin: '0 0 15px 0',
    fontSize: '1.2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
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
  radioGroup: {
    display: 'flex',
    gap: '20px',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    cursor: 'pointer',
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
  },
  resultContainer: {
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  resultTitle: {
    margin: '0 0 15px 0',
    fontSize: '1.2rem',
  },
  resultMessage: {
    fontSize: '1.1rem',
    marginBottom: '10px',
  },
  resultReason: {
    color: '#c62828',
    fontWeight: 'bold',
  },
  resultDetails: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '4px',
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

export default AccessControl;
