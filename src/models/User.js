const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const User = sequelize.define('User', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		field: 'id'
	},
	username: {
		type: DataTypes.STRING(50),
		allowNull: false,
		unique: true,
		field: 'username'
	},
	email: {
		type: DataTypes.STRING(50),
		allowNull: true,
		unique: true,
		field: 'email'
	},
	hashed_password: {
		type: DataTypes.STRING(255),
		allowNull: false,
		field: 'hashed_password'
	}
}, {
	tableName: 'users',
	timestamps: false,
});

module.exports = User;
