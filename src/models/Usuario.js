const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Cuenta = require('./Cuenta');

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
	},
	name:{
		type: DataTypes.STRING(255),
		allowNull: false,
		unique: false,
		field: 'nombre'
	}

}, {
	tableName: 'usuario',
	timestamps: false,
})

Usuario.hasMany(Cuenta, {
    foreignKey: 'id_usuario', // La columna en la tabla 'cuenta' que apunta a 'usuario'
    as: 'cuenta' // El alias para incluir las cuentas (ej: user.cuentas)
});

Cuenta.belongsTo(Usuario, {
    foreignKey: 'id_usuario',
    as: 'usuario'
});



module.exports = Usuario;
