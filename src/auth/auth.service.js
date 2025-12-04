const Usuario = require('../models/Usuario');
const Cuenta = require('../models/Cuenta');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const validateUser = async (email, password) => {
	const user = await Usuario.findOne({
		where: { email },
		include: [{
			model: Cuenta,
			as: 'cuenta', // Debe coincidir con el alias de la relación Usuario.hasMany(Cuenta)
			required: false // Opcional: El usuario puede existir sin cuenta
		}]
	});

	if (!user) {
		return null;
	}

	const isMatch = await bcrypt.compare(password, user.password);

	if (!isMatch) {
		return null;
	}

	return user;
};

const validateUserPin = async (email, pin) => {
	const user = await Usuario.findOne({
		where: { email },
		include: [{
			model: Cuenta,
			as: 'cuenta', // Debe coincidir con el alias de la relación Usuario.hasMany(Cuenta)
			required: false // Opcional: El usuario puede existir sin cuenta
		}]
	});

	if (!user) {
		return null;
	}

	const isMatch = pin == user.pin;

	if (!isMatch) {
		return null;
	}
	return user;
};

const generateToken = (user) => {
	const payload = {
		id: user.id,
		email: user.email,
		phone: user.phone,
		name: user.name
	};

	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN,
	});
};

module.exports = { validateUser, generateToken, validateUserPin };
