const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const validateUser = async (email, password) => {
	const user = await Usuario.findOne({ where: { email } });

	if (!user) {
		return null;
	}

	const isMatch = await bcrypt.compare(password, user.password);

	if (!isMatch) {
		return null;
	}

	return user;
};

const generateToken = (user) => {
	const payload = {
		id: user.id,
		email: user.email
	};

	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN,
	});
};

module.exports = { validateUser, generateToken };
