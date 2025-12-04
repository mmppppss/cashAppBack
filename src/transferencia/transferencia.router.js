const express = require('express');
const { createTransferencia, historialTransferencias } = require('./transferencia.controller');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');

// POST /api/transferencias/
// Requiere autenticación para obtener el ID del usuario de origen
router.post('/', protect, createTransferencia);
router.get('/historial', protect, historialTransferencias);

module.exports = router;
