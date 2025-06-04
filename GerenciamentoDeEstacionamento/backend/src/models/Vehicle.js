const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Vehicle = sequelize.define('Vehicle', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  placa: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true
  },
  modelo: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  cor: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  ano: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  tipo: {
    type: DataTypes.ENUM('carro', 'moto', 'van', 'caminhao', 'outro'),
    allowNull: false
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  createdAt: 'data_criacao',
  updatedAt: 'data_atualizacao'
});

// Relacionamento com User
Vehicle.belongsTo(User, { foreignKey: 'usuario_id', as: 'usuario' });
User.hasMany(Vehicle, { foreignKey: 'usuario_id', as: 'veiculos' });

module.exports = Vehicle;
