const { Sequelize } = require('sequelize');
require('dotenv').config();
const DB_URL=process.env.DB_URL

const sequelize = new Sequelize(
DB_URL, 

  {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

module.exports = sequelize;
