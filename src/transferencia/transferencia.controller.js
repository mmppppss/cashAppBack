const transferenciaService = require('./transferencia.service');
const cuentaService = require('../cuenta/cuenta.service'); // Necesario para obtener el ID de la cuenta

/**
 * Crea y ejecuta una nueva transferencia.
 * La cuenta de origen se extrae del usuario logueado.
 */
const createTransferencia = async (req, res) => {
    try {
        // 1. Obtener el ID del usuario logueado (Origen)
        const id_usuario_origen = req.user.id; 

        // 2. Obtener la cuenta de origen del usuario logueado
        // Esto asume que tienes acceso al servicio de cuentas
        const cuentaOrigen = await cuentaService.getCuentaByUserId(id_usuario_origen); 

        if (!cuentaOrigen) {
            return res.status(404).json({ message: "No se encontró la cuenta de origen para este usuario." });
        }
        
        // 3. Obtener datos de la solicitud
        const { id_cuenta_destino, monto } = req.body;

        // Validación simple de datos
        if (!id_cuenta_destino || !monto || isNaN(monto) || monto <= 0) {
            return res.status(400).json({ message: "Datos de transferencia inválidos." });
        }

        const id_cuenta_origen = cuentaOrigen.id; // ID de la cuenta (no del usuario)

        // 4. Llamar al servicio
        const transferencia = await transferenciaService.createTransferencia(
            id_cuenta_origen,
            id_cuenta_destino,
            monto
        );

        return res.status(201).json({
            message: "Transferencia realizada con éxito",
            data: transferencia
        });

    } catch (error) {
        // 5. Manejo de errores (por ejemplo: saldo insuficiente, cuenta no encontrada)
        // El error es propagado desde el servicio
        console.error(error.message); 
        return res.status(400).json({ message: error.message });
    }
};

module.exports = { createTransferencia };
