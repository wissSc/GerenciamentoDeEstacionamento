const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Vehicle = require('./Vehicle');

const AccessRecord = sequelize.define('AccessRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipo_operacao: {
    type: DataTypes.ENUM('entrada', 'saida'),
    allowNull: false
  },
  data_hora: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  autorizado: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  motivo_recusa: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  setor_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  timestamps: true,
  createdAt: 'data_criacao',
  updatedAt: false,
  tableName: 'registros_acesso'
});

// Relacionamento com Vehicle
AccessRecord.belongsTo(Vehicle, { foreignKey: 'veiculo_id', as: 'veiculo' });
Vehicle.hasMany(AccessRecord, { foreignKey: 'veiculo_id', as: 'registros_acesso' });

module.exports = AccessRecord;
