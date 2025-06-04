const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../middlewares/auth');

// Middleware para verificar se o usuário é admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    if (user.tipo !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem realizar esta operação' });
    }
    
    next();
  } catch (error) {
    console.error('Erro ao verificar permissão de admin:', error);
    return res.status(500).json({ message: 'Erro ao verificar permissões', error: error.message });
  }
};

// Listar todos os usuários (apenas admin)
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['senha'] }
    });
    
    return res.json(users);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return res.status(500).json({ message: 'Erro ao listar usuários', error: error.message });
  }
});

// Obter usuário pelo ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verifica se o usuário está buscando a si mesmo ou é admin
    if (req.userId != id) {
      const requestingUser = await User.findByPk(req.userId);
      if (requestingUser.tipo !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado. Você só pode visualizar seu próprio perfil' });
      }
    }
    
    const user = await User.findByPk(id, {
      attributes: { exclude: ['senha'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    return res.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({ message: 'Erro ao buscar usuário', error: error.message });
  }
});

// Criar usuário (apenas admin)
router.post('/', verifyToken, isAdmin, async (req, res) => {
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
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({ message: 'Erro ao criar usuário', error: error.message });
  }
});

// Atualizar usuário
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, senha, telefone, tipo, matricula_id, validade_acesso, ativo } = req.body;
    
    // Verifica se o usuário está atualizando a si mesmo ou é admin
    if (req.userId != id) {
      const requestingUser = await User.findByPk(req.userId);
      if (requestingUser.tipo !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado. Você só pode atualizar seu próprio perfil' });
      }
    }
    
    // Busca o usuário
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    // Verifica se o email já está em uso por outro usuário
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ message: 'E-mail já está em uso por outro usuário' });
      }
    }
    
    // Verifica se a matrícula já está em uso por outro usuário
    if (matricula_id && matricula_id !== user.matricula_id) {
      const matriculaExists = await User.findOne({ where: { matricula_id } });
      if (matriculaExists) {
        return res.status(400).json({ message: 'Matrícula/ID já está em uso por outro usuário' });
      }
    }
    
    // Atualiza o usuário
    await user.update({
      nome: nome || user.nome,
      email: email || user.email,
      senha: senha || user.senha,
      telefone: telefone || user.telefone,
      tipo: tipo || user.tipo,
      matricula_id: matricula_id || user.matricula_id,
      validade_acesso: validade_acesso || user.validade_acesso,
      ativo: ativo !== undefined ? ativo : user.ativo
    });
    
    // Remove a senha do objeto de resposta
    user.senha = undefined;
    
    return res.json({
      message: 'Usuário atualizado com sucesso',
      user
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({ message: 'Erro ao atualizar usuário', error: error.message });
  }
});

// Excluir usuário (apenas admin)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Busca o usuário
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    // Exclui o usuário
    await user.destroy();
    
    return res.json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    return res.status(500).json({ message: 'Erro ao excluir usuário', error: error.message });
  }
});

module.exports = router;
