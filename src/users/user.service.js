const Usuario= require('../models/Usuario');
const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(password, salt);
};

const createUser = async (email, password, pin, phone) => {
	const hashedPassword = await hashPassword(password);

	const newUser = await Usuario.create({
		email: email,
		password: hashedPassword,
		pin: pin,
		phone: phone,
	});

	return {
		id: newUser.id,
		email: newUser.email,
		phone: newUser.phone
	};
};

module.exports = { createUser };
