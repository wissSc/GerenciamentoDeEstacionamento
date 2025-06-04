const express = require('express');
const router = express.Router();
const AccessRecord = require('../models/AccessRecord');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const { verifyToken } = require('../middlewares/auth');

// Registrar entrada de veículo
router.post('/entrada', verifyToken, async (req, res) => {
  try {
    const { placa, setor_id } = req.body;
    
    // Busca o veículo pela placa
    const vehicle = await Vehicle.findOne({ 
      where: { placa },
      include: [
        {
          model: User,
          as: 'usuario',
          attributes: ['id', 'nome', 'tipo', 'ativo', 'validade_acesso']
        }
      ]
    });
    
    // Verifica se o veículo está cadastrado
    if (!vehicle) {
      // Registra tentativa não autorizada
      await AccessRecord.create({
        veiculo_id: null,
        tipo_operacao: 'entrada',
        autorizado: false,
        motivo_recusa: 'Veículo não cadastrado',
        setor_id
      });
      
      return res.status(401).json({ 
        message: 'Acesso não autorizado', 
        motivo: 'Veículo não cadastrado' 
      });
    }
    
    // Verifica se o veículo está ativo
    if (!vehicle.ativo) {
      // Registra tentativa não autorizada
      await AccessRecord.create({
        veiculo_id: vehicle.id,
        tipo_operacao: 'entrada',
        autorizado: false,
        motivo_recusa: 'Veículo inativo',
        setor_id
      });
      
      return res.status(401).json({ 
        message: 'Acesso não autorizado', 
        motivo: 'Veículo inativo' 
      });
    }
    
    // Verifica se o usuário está ativo
    if (!vehicle.usuario.ativo) {
      // Registra tentativa não autorizada
      await AccessRecord.create({
        veiculo_id: vehicle.id,
        tipo_operacao: 'entrada',
        autorizado: false,
        motivo_recusa: 'Usuário inativo',
        setor_id
      });
      
      return res.status(401).json({ 
        message: 'Acesso não autorizado', 
        motivo: 'Usuário inativo' 
      });
    }
    
    // Verifica se o acesso do usuário está válido
    if (vehicle.usuario.validade_acesso && new Date(vehicle.usuario.validade_acesso) < new Date()) {
      // Registra tentativa não autorizada
      await AccessRecord.create({
        veiculo_id: vehicle.id,
        tipo_operacao: 'entrada',
        autorizado: false,
        motivo_recusa: 'Acesso expirado',
        setor_id
      });
      
      return res.status(401).json({ 
        message: 'Acesso não autorizado', 
        motivo: 'Acesso expirado' 
      });
    }
    
    // Verifica se o veículo já está no estacionamento
    const lastAccess = await AccessRecord.findOne({
      where: { veiculo_id: vehicle.id },
      order: [['data_hora', 'DESC']]
    });
    
    if (lastAccess && lastAccess.tipo_operacao === 'entrada') {
      // Registra tentativa não autorizada
      await AccessRecord.create({
        veiculo_id: vehicle.id,
        tipo_operacao: 'entrada',
        autorizado: false,
        motivo_recusa: 'Veículo já está no estacionamento',
        setor_id
      });
      
      return res.status(400).json({ 
        message: 'Acesso não autorizado', 
        motivo: 'Veículo já está no estacionamento' 
      });
    }
    
    // TODO: Verificar lotação do setor (implementação simplificada)
    
    // Registra entrada autorizada
    const accessRecord = await AccessRecord.create({
      veiculo_id: vehicle.id,
      tipo_operacao: 'entrada',
      autorizado: true,
      setor_id
    });
    
    return res.status(201).json({
      message: 'Entrada registrada com sucesso',
      accessRecord
    });
  } catch (error) {
    console.error('Erro ao registrar entrada:', error);
    return res.status(500).json({ message: 'Erro ao registrar entrada', error: error.message });
  }
});

// Registrar saída de veículo
router.post('/saida', verifyToken, async (req, res) => {
  try {
    const { placa } = req.body;
    
    // Busca o veículo pela placa
    const vehicle = await Vehicle.findOne({ where: { placa } });
    
    // Verifica se o veículo está cadastrado
    if (!vehicle) {
      return res.status(404).json({ message: 'Veículo não encontrado' });
    }
    
    // Verifica se o veículo está no estacionamento
    const lastAccess = await AccessRecord.findOne({
      where: { veiculo_id: vehicle.id },
      order: [['data_hora', 'DESC']]
    });
    
    if (!lastAccess || lastAccess.tipo_operacao === 'saida') {
      // Registra tentativa não autorizada
      await AccessRecord.create({
        veiculo_id: vehicle.id,
        tipo_operacao: 'saida',
        autorizado: false,
        motivo_recusa: 'Veículo não está no estacionamento'
      });
      
      return res.status(400).json({ 
        message: 'Saída não autorizada', 
        motivo: 'Veículo não está no estacionamento' 
      });
    }
    
    // Registra saída autorizada
    const accessRecord = await AccessRecord.create({
      veiculo_id: vehicle.id,
      tipo_operacao: 'saida',
      autorizado: true,
      setor_id: lastAccess.setor_id
    });
    
    return res.status(201).json({
      message: 'Saída registrada com sucesso',
      accessRecord
    });
  } catch (error) {
    console.error('Erro ao registrar saída:', error);
    return res.status(500).json({ message: 'Erro ao registrar saída', error: error.message });
  }
});

// Listar registros de acesso (apenas admin)
router.get('/', verifyToken, async (req, res) => {
  try {
    // Verifica se o usuário é admin
    const user = await User.findByPk(req.userId);
    if (user.tipo !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem listar registros de acesso' });
    }
    
    // Parâmetros de paginação e filtros
    const { page = 1, limit = 20, data_inicio, data_fim, placa, tipo_operacao } = req.query;
    const offset = (page - 1) * limit;
    
    // Constrói o filtro
    const where = {};
    
    // Filtro por data
    if (data_inicio || data_fim) {
      where.data_hora = {};
      if (data_inicio) where.data_hora.$gte = new Date(data_inicio);
      if (data_fim) where.data_hora.$lte = new Date(data_fim);
    }
    
    // Filtro por tipo de operação
    if (tipo_operacao) {
      where.tipo_operacao = tipo_operacao;
    }
    
    // Busca os registros
    const { count, rows } = await AccessRecord.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['data_hora', 'DESC']],
      include: [
        {
          model: Vehicle,
          as: 'veiculo',
          where: placa ? { placa } : undefined,
          include: [
            {
              model: User,
              as: 'usuario',
              attributes: ['id', 'nome', 'tipo', 'matricula_id']
            }
          ]
        }
      ]
    });
    
    return res.json({
      total: count,
      pages: Math.ceil(count / limit),
      current_page: parseInt(page),
      records: rows
    });
  } catch (error) {
    console.error('Erro ao listar registros de acesso:', error);
    return res.status(500).json({ message: 'Erro ao listar registros de acesso', error: error.message });
  }
});

// Obter status atual do estacionamento
router.get('/status', verifyToken, async (req, res) => {
  try {
    // Conta veículos atualmente no estacionamento
    const veiculosNoEstacionamento = await AccessRecord.count({
      where: { tipo_operacao: 'entrada', autorizado: true },
      include: [
        {
          model: Vehicle,
          as: 'veiculo',
          required: true
        }
      ],
      distinct: true,
      col: 'veiculo_id',
      group: ['veiculo_id']
    });
    
    // TODO: Implementar contagem por setor (simplificado)
    
    // Capacidade total (valor fixo para exemplo)
    const capacidadeTotal = 100;
    
    return res.json({
      capacidade_total: capacidadeTotal,
      veiculos_presentes: veiculosNoEstacionamento.length,
      vagas_disponiveis: capacidadeTotal - veiculosNoEstacionamento.length,
      ocupacao_percentual: (veiculosNoEstacionamento.length / capacidadeTotal) * 100
    });
  } catch (error) {
    console.error('Erro ao obter status do estacionamento:', error);
    return res.status(500).json({ message: 'Erro ao obter status do estacionamento', error: error.message });
  }
});

module.exports = router;
