const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken, generateRefreshToken } = require('../middlewares/auth');

// Rota de registro
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha, telefone, tipo, matricula_id, validade_acesso } = req.body;

    // Verifica se o usuário já existe
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'Usuário já cadastrado com este e-mail' });
    }

    // Verifica se a matrícula já existe
    const matriculaExists = await User.findOne({ where: { matricula_id } });
    if (matriculaExists) {
      return res.status(400).json({ message: 'Matrícula/ID já cadastrado' });
    }

    // Cria o usuário
    const user = await User.create({
      nome,
      email,
      senha,
      telefone,
      tipo,
      matricula_id,
      validade_acesso
    });

    // Remove a senha do objeto de resposta
    user.senha = undefined;

    return res.status(201).json({
      message: 'Usuário cadastrado com sucesso',
      user
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
  }
});

// Rota de login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Busca o usuário pelo email
    const user = await User.findOne({ where: { email } });
    
    // Verifica se o usuário existe
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verifica se o usuário está ativo
    if (!user.ativo) {
      return res.status(401).json({ message: 'Usuário inativo' });
    }

    // Verifica se a senha está correta
    const isPasswordValid = await user.checkPassword(senha);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verifica se o acesso está válido
    if (user.validade_acesso && new Date(user.validade_acesso) < new Date()) {
      return res.status(401).json({ message: 'Acesso expirado' });
    }

    // Gera tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Remove a senha do objeto de resposta
    user.senha = undefined;

    return res.json({
      user,
      token,
      refreshToken
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
  }
});

// Rota para renovar token
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token não fornecido' });
    }

    // Verifica o refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    // Gera novo token
    const token = generateToken(decoded.id);
    
    return res.json({ token });
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    return res.status(401).json({ message: 'Refresh token inválido ou expirado' });
  }
});

module.exports = router;
