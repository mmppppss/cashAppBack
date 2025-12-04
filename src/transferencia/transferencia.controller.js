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
/**
 * Obtiene el historial de transferencias (enviadas y recibidas) del usuario logueado.
 * Ruta: GET /api/transferencias/historial
 */
const historialTransferencias = async (req, res) => {
    try {
        // 1. Obtener el ID del usuario logueado, que viene del middleware 'protect'
        const id_usuario = req.user.id; 
        
        // 2. Delegar la lógica compleja al servicio
        const historial = await transferenciaService.getHistorialTransferencias(id_usuario);
        
        // 3. Respuesta exitosa
        return res.status(200).json(historial);

    } catch (error) {
        // 4. Manejo de errores
        console.error('Error en el controlador al obtener historial:', error);
        
        // Si es un error de negocio esperado (ej: cuenta no encontrada)
        if (error.message.includes("Cuenta no encontrada")) {
            return res.status(404).json({ message: error.message });
        }
        
        // Error genérico del servidor
        return res.status(500).json({ message: 'Error interno del servidor al obtener el historial.' });
    }
};

module.exports = { createTransferencia, historialTransferencias };
