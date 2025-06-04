import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    tipo: 'aluno',
    matricula_id: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { nome, email, senha, confirmarSenha, telefone, tipo, matricula_id } = formData;
    
    // Validações básicas
    if (!nome || !email || !senha || !confirmarSenha || !matricula_id) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }
    
    if (senha !== confirmarSenha) {
      setError('As senhas não conferem');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      await api.post('/auth/register', {
        nome,
        email,
        senha,
        telefone,
        tipo,
        matricula_id
      });
      
      alert('Cadastro realizado com sucesso! Faça login para continuar.');
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao realizar cadastro');
      console.error('Erro ao cadastrar:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Cadastro - Sistema de Estacionamento SENAI</h2>
        
        {error && <p style={styles.error}>{error}</p>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="nome" style={styles.label}>Nome Completo *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              style={styles.input}
              placeholder="Seu nome completo"
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>E-mail *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="Seu e-mail"
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="senha" style={styles.label}>Senha *</label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              style={styles.input}
              placeholder="Sua senha"
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="confirmarSenha" style={styles.label}>Confirmar Senha *</label>
            <input
              type="password"
              id="confirmarSenha"
              name="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              style={styles.input}
              placeholder="Confirme sua senha"
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="telefone" style={styles.label}>Telefone</label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              style={styles.input}
              placeholder="Seu telefone"
            />
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="tipo" style={styles.label}>Tipo de Usuário *</label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option value="aluno">Aluno</option>
              <option value="professor">Professor</option>
              <option value="funcionario">Funcionário</option>
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="matricula_id" style={styles.label}>Matrícula/ID *</label>
            <input
              type="text"
              id="matricula_id"
              name="matricula_id"
              value={formData.matricula_id}
              onChange={handleChange}
              style={styles.input}
              placeholder="Sua matrícula ou ID funcional"
              required
            />
          </div>
          
          <button 
            type="submit" 
            style={styles.button}
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        
        <p style={styles.loginText}>
          Já tem uma conta? <Link to="/login" style={styles.link}>Faça login</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  },
  formContainer: {
    width: '100%',
    maxWidth: '500px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '5px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
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
  button: {
    padding: '12px',
    backgroundColor: '#0066cc',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  error: {
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: '15px',
  },
  loginText: {
    textAlign: 'center',
    marginTop: '20px',
  },
  link: {
    color: '#0066cc',
    textDecoration: 'none',
  }
};

export default Register;
