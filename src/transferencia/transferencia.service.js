const { sequelize } = require('../../config/database');
const Cuenta = require('../models/Cuenta');
const Transferencia = require('../models/Transferencia');

/**
 * Realiza una transferencia de dinero de una cuenta a otra.
 * @param {number} id_origen - ID de la cuenta que envía el dinero.
 * @param {number} id_destino - ID de la cuenta que recibe el dinero.
 * @param {number} monto - La cantidad a transferir.
 * @returns {Transferencia|null} La nueva transferencia creada.
 */
const createTransferencia = async (id_origen, id_destino, monto) => {
    // Usamos una transacción para garantizar la atomicidad (o todo sucede, o nada sucede)
    const transaction = await sequelize.transaction();

    try {
        // 1. Validar que la cuenta de origen y destino existan
        const cuentaOrigen = await Cuenta.findByPk(id_origen, { transaction });
        const cuentaDestino = await Cuenta.findByPk(id_destino, { transaction });

        if (!cuentaOrigen || !cuentaDestino) {
            throw new Error("Una de las cuentas no existe.");
        }

        // 2. Validar saldo suficiente en la cuenta de origen
        if (cuentaOrigen.monto < monto) {
            throw new Error("Saldo insuficiente en la cuenta de origen.");
        }

        // 3. Actualizar el saldo de la cuenta de origen (restar)
        await cuentaOrigen.update({
            monto: cuentaOrigen.monto - monto
        }, { transaction });

        // 4. Actualizar el saldo de la cuenta de destino (sumar)
        await cuentaDestino.update({
            monto: parseFloat(cuentaDestino.monto) + parseFloat(monto)
        }, { transaction }); // Nota: Usamos parseFloat para evitar problemas de tipos con DECIMAL

        // 5. Registrar la transferencia
        const newTransferencia = await Transferencia.create({
            id_cuenta_origen: id_origen,
            id_cuenta_destino: id_destino,
            monto: monto,
        }, { transaction });

        // 6. Confirmar la transacción (COMMIT)
        await transaction.commit();

        // Devolver la transferencia creada
        return {
            id: newTransferencia.id,
            id_cuenta_origen: newTransferencia.id_cuenta_origen,
            id_cuenta_destino: newTransferencia.id_cuenta_destino,
            monto: newTransferencia.monto
        };

    } catch (error) {
        // 7. Revertir la transacción (ROLLBACK) si algo falló
        await transaction.rollback();
        // Propagar el error para que el controlador lo maneje
        throw error;
    }
};

module.exports = { createTransferencia };
