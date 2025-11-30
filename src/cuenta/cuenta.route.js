const express = require('express');
const { getCuentaByUser, getCuenta } = require('./cuenta.controller');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');

router.get('/', protect, getCuentaByUser);

module.exports = router;
