const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Cuenta = require('./Cuenta');

const Transferencia = sequelize.define('Transferencia', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        field: 'id' 
    },

    id_cuenta_origen: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'id_cuenta_origen',
        references: {
            model: Cuenta, 
            key: 'id' 
        }
    },

    id_cuenta_destino: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'id_cuenta_destino',
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
        field: 'fecha_hora'
    }
}, {
    tableName: 'transferencia', 
    timestamps: false, 
});

// --- Definición de Relaciones ---

// 1. La Transferencia tiene una Cuenta de Origen
Transferencia.belongsTo(Cuenta, {
    foreignKey: 'id_cuenta_origen',
    as: 'origen' // Alias para acceder a la cuenta de origen: transferencia.origen
});

// 2. La Transferencia tiene una Cuenta de Destino
Transferencia.belongsTo(Cuenta, {
    foreignKey: 'id_cuenta_destino',
    as: 'destino' // Alias para acceder a la cuenta de destino: transferencia.destino
});

// 3. Una Cuenta puede ser el Origen de muchas Transferencias
Cuenta.hasMany(Transferencia, {
    foreignKey: 'id_cuenta_origen',
    as: 'transferencias_enviadas'
});

// 4. Una Cuenta puede ser el Destino de muchas Transferencias
Cuenta.hasMany(Transferencia, {
    foreignKey: 'id_cuenta_destino',
    as: 'transferencias_recibidas'
});


module.exports = Transferencia;
