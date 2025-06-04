import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>404</h1>
        <h2 style={styles.subtitle}>Página não encontrada</h2>
        <p style={styles.message}>
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link to="/" style={styles.button}>
          Voltar para a página inicial
        </Link>
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
  content: {
    textAlign: 'center',
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px',
    width: '100%',
  },
  title: {
    fontSize: '72px',
    margin: '0',
    color: '#0066cc',
  },
  subtitle: {
    fontSize: '24px',
    margin: '10px 0 20px',
    color: '#333',
  },
  message: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '30px',
  },
  button: {
    display: 'inline-block',
    backgroundColor: '#0066cc',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
};

export default NotFound;
