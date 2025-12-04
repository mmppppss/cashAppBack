const { sequelize } = require('../../config/database');
const { Op } = require('sequelize');
const Cuenta = require('../models/Cuenta');
const Usuario = require('../models/Usuario')
const Transferencia = require('../models/Transferencia');
const cuentaService = require('../cuenta/cuenta.service')

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

const getHistorialTransferencias = async (id_usuario) => {
    // Lógica para obtener el ID de la Cuenta
    const cuentaUsuario = await cuentaService.getCuentaByUserId(id_usuario); 
    if (!cuentaUsuario) {
        throw new Error("Cuenta no encontrada para este usuario."); 
    }
    const id_cuenta_usuario = cuentaUsuario.id;

    // Ejecutar la consulta compleja con inclusión anidada
    const historial = await Transferencia.findAll({
        where: {
            [Op.or]: [
                { id_cuenta_origen: id_cuenta_usuario },
                { id_cuenta_destino: id_cuenta_usuario }
            ]
        },
        include: [
            // Incluir Cuenta Origen y anidar la información del Usuario Origen
            {
                model: Cuenta,
                as: 'origen',
                attributes: ['id', 'id_usuario'],
                include: [{
                    model: Usuario,
                    as: 'usuario', // Alias de la relación Cuenta.belongsTo(Usuario)
                    attributes: ['id', 'email', 'name'] // Campos del usuario que quieres ver
                }]
            },
            // Incluir Cuenta Destino y anidar la información del Usuario Destino
            {
                model: Cuenta,
                as: 'destino',
                attributes: ['id', 'id_usuario'],
                include: [{
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id', 'email', 'name']
                }]
            }
        ],
        order: [
            ['fecha', 'DESC']
        ],
    });

    // 3. Mapear y formatear el historial para el cliente
    const historialFormateado = historial.map(transferencia => {
        const esEnviada = transferencia.id_cuenta_origen === id_cuenta_usuario;
        
        // Determinar qué objeto (Origen o Destino) NO es el usuario logueado
        const cuentaOpuesta = esEnviada ? transferencia.destino : transferencia.origen;
        
        // Extraer el usuario opuesto del objeto de la cuenta opuesta
        const usuarioOpuesto = cuentaOpuesta.usuario;
        
        return {
            id: transferencia.id,
            tipo: esEnviada ? 'ENVIADA' : 'RECIBIDA',
            monto: transferencia.monto,
            fecha: transferencia.fecha,
            // Retornar la información clave del usuario opuesto
            usuario_opuesto: {
                id: usuarioOpuesto.id,
                email: usuarioOpuesto.email,
                nombre: usuarioOpuesto.name,
                cuenta_id: cuentaOpuesta.id // El ID de la cuenta del otro usuario
            }
        };
    });
    
    return historialFormateado;
};
module.exports = { createTransferencia, getHistorialTransferencias };
