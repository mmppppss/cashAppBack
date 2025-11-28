const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('[001] Conexión a MariaDB establecida correctamente.');
  } catch (error) {
    console.error('[#001] Error al conectar con MariaDB:', error);
    process.exit(1);  
  }
};

module.exports = { sequelize, connectDB };
