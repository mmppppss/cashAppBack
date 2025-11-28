const express = require('express');
const { register, getMe } = require('./user.controller');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');

router.post('/', register);
router.get('/me', protect, getMe);

module.exports = router;
