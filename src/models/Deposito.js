const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Cuenta = require('./Cuenta'); 

const Deposito = sequelize.define('Deposito', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        field: 'id' 
    },

    id_cuenta: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'id_cuenta',
        references: {
            model: Cuenta, 
            key: 'id' 
        }
    },

    monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'monto'
    },
    
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'fecha'
    }
}, {
    tableName: 'deposito', 
    timestamps: false, 
});

Deposito.belongsTo(Cuenta, {
    foreignKey: 'id_cuenta',
    as: 'cuenta'
});

Cuenta.hasMany(Deposito, {
    foreignKey: 'id_cuenta',
    as: 'depositos'
});


module.exports = Deposito;
