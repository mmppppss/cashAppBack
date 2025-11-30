const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Usuario = require('./Usuario'); 

const Cuenta = sequelize.define('Cuenta', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        field: 'id' 
    },

    id_usuario: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'id_usuario',
        references: {
            model: Usuario, 
            key: 'id' 
        }
    },

    monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        field: 'monto_saldo'
    }
}, {
    tableName: 'cuenta',
    timestamps: false,
});


// Una Cuenta pertenece a un Usuario (Muchos-a-Uno)
Cuenta.belongsTo(Usuario, {
    foreignKey: 'id_usuario',
    as: 'usuario'
});

// Un Usuario puede tener muchas Cuentas (Uno-a-Muchos)
Usuario.hasMany(Cuenta, {
    foreignKey: 'id_usuario',
    as: 'cuentas'
});

module.exports = Cuenta;
