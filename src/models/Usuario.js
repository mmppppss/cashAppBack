const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Usuario = sequelize.define('Usuario', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		field: 'id'
	},

	pin: {
		type: DataTypes.INTEGER,
		allowNull: false,
		field: 'pin'
	},

	name:{
		type: DataTypes.STRING,
		allowNull: false,
		field: 'nombre'
	},

	phone: {
		type: DataTypes.INTEGER,
		allowNull: true,
		unique: true,
		field: 'celular'
	},

	password: {
		type: DataTypes.STRING(255),
		allowNull: false,
		field: 'contraseña'
	},

	email: {
		type: DataTypes.STRING(255),
		allowNull: true,
		unique: true,
		field: 'correo_electronico'
	}

}, {
	tableName: 'usuario',
	timestamps: false,
})
module.exports = Usuario;
