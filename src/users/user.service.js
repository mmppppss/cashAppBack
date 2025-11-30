const Usuario= require('../models/Usuario');
const cuentaService = require('../cuenta/cuenta.service');
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
	const newCuenta = await cuentaService.createCuenta(newUser);

	return {
		id: newUser.id,
		email: newUser.email,
		phone: newUser.phone,
		cuenta: newCuenta
	};
};

const getCuenta = async (id) => {
	const cuenta = await cuentaService.getCuentaByUserId(id);
	return cuenta;
}

const getData = async (usuario) =>{
	const  cuenta = await getCuenta(usuario.id)
	return	{
		usuario,
		cuenta
	};
}
module.exports = { createUser, getCuenta, getData};
