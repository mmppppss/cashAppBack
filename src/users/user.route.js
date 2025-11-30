const express = require('express');
const { register, getMe, getData } = require('./user.controller');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');

router.post('/', register);
router.get('/me', protect, getMe);
router.get('/data', protect, getData);


module.exports = router;
