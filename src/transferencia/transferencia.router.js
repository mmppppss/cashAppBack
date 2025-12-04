const express = require('express');
const { createTransferencia } = require('./transferencia.controller');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');

// POST /api/transferencias/
// Requiere autenticación para obtener el ID del usuario de origen
router.post('/', protect, createTransferencia);

module.exports = router;
