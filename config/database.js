const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASSWORD,
	{
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: process.env.DB_DIALECT,
		logging: false,
		dialectOptions: {
			ssl: {
				rejectUnauthorized: false, // Puedes cambiar a true si el certificado es válido y de confianza
			},
		},
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
