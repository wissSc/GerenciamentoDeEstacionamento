const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const { verifyToken } = require('../middlewares/auth');

// Listar veículos do usuário logado
router.get('/my', verifyToken, async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      where: { usuario_id: req.userId }
    });
    
    return res.json(vehicles);
  } catch (error) {
    console.error('Erro ao listar veículos:', error);
    return res.status(500).json({ message: 'Erro ao listar veículos', error: error.message });
  }
});

// Listar todos os veículos (apenas admin)
router.get('/', verifyToken, async (req, res) => {
  try {
    // Verifica se o usuário é admin
    const user = await User.findByPk(req.userId);
    if (user.tipo !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem listar todos os veículos' });
    }
    
    const vehicles = await Vehicle.findAll({
      include: [
        {
          model: User,
          as: 'usuario',
          attributes: ['id', 'nome', 'email', 'tipo', 'matricula_id']
        }
      ]
    });
    
    return res.json(vehicles);
  } catch (error) {
    console.error('Erro ao listar veículos:', error);
    return res.status(500).json({ message: 'Erro ao listar veículos', error: error.message });
  }
});

// Obter veículo pelo ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const vehicle = await Vehicle.findByPk(id, {
      include: [
        {
          model: User,
          as: 'usuario',
          attributes: ['id', 'nome', 'email', 'tipo', 'matricula_id']
        }
      ]
    });
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Veículo não encontrado' });
    }
    
    // Verifica se o veículo pertence ao usuário logado ou se é admin
    const user = await User.findByPk(req.userId);
    if (vehicle.usuario_id !== req.userId && user.tipo !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado. Você só pode visualizar seus próprios veículos' });
    }
    
    return res.json(vehicle);
  } catch (error) {
    console.error('Erro ao buscar veículo:', error);
    return res.status(500).json({ message: 'Erro ao buscar veículo', error: error.message });
  }
});

// Cadastrar veículo
router.post('/', verifyToken, async (req, res) => {
  try {
    const { placa, modelo, cor, ano, tipo } = req.body;
    
    // Verifica se a placa já está cadastrada
    const vehicleExists = await Vehicle.findOne({ where: { placa } });
    if (vehicleExists) {
      return res.status(400).json({ message: 'Veículo já cadastrado com esta placa' });
    }
    
    // Cria o veículo
    const vehicle = await Vehicle.create({
      placa,
      modelo,
      cor,
      ano,
      tipo,
      usuario_id: req.userId
    });
    
    return res.status(201).json({
      message: 'Veículo cadastrado com sucesso',
      vehicle
    });
  } catch (error) {
    console.error('Erro ao cadastrar veículo:', error);
    return res.status(500).json({ message: 'Erro ao cadastrar veículo', error: error.message });
  }
});

// Atualizar veículo
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { placa, modelo, cor, ano, tipo, ativo } = req.body;
    
    // Busca o veículo
    const vehicle = await Vehicle.findByPk(id);
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Veículo não encontrado' });
    }
    
    // Verifica se o veículo pertence ao usuário logado ou se é admin
    const user = await User.findByPk(req.userId);
    if (vehicle.usuario_id !== req.userId && user.tipo !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado. Você só pode atualizar seus próprios veículos' });
    }
    
    // Verifica se a placa já está em uso por outro veículo
    if (placa && placa !== vehicle.placa) {
      const placaExists = await Vehicle.findOne({ where: { placa } });
      if (placaExists) {
        return res.status(400).json({ message: 'Placa já está em uso por outro veículo' });
      }
    }
    
    // Atualiza o veículo
    await vehicle.update({
      placa: placa || vehicle.placa,
      modelo: modelo || vehicle.modelo,
      cor: cor || vehicle.cor,
      ano: ano || vehicle.ano,
      tipo: tipo || vehicle.tipo,
      ativo: ativo !== undefined ? ativo : vehicle.ativo
    });
    
    return res.json({
      message: 'Veículo atualizado com sucesso',
      vehicle
    });
  } catch (error) {
    console.error('Erro ao atualizar veículo:', error);
    return res.status(500).json({ message: 'Erro ao atualizar veículo', error: error.message });
  }
});

// Excluir veículo
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Busca o veículo
    const vehicle = await Vehicle.findByPk(id);
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Veículo não encontrado' });
    }
    
    // Verifica se o veículo pertence ao usuário logado ou se é admin
    const user = await User.findByPk(req.userId);
    if (vehicle.usuario_id !== req.userId && user.tipo !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado. Você só pode excluir seus próprios veículos' });
    }
    
    // Exclui o veículo
    await vehicle.destroy();
    
    return res.json({ message: 'Veículo excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir veículo:', error);
    return res.status(500).json({ message: 'Erro ao excluir veículo', error: error.message });
  }
});

module.exports = router;
