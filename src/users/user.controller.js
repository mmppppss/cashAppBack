const userService = require('./user.service');

const register = async (req, res) => {
	const { email, password, pin, phone } = req.body;

	if (!pin || !password || !email || !phone) {
		return res.status(400).json({ message: 'Todos los campos (pin, email, password, phone) son obligatorios.' });
	}

	try {
		const newUser = await userService.createUser(email, password, pin, phone);

		return res.status(201).json({
			message: 'Usuario registrado exitosamente',
			user: newUser
		});

	} catch (error) {
		if (error.name === 'SequelizeUniqueConstraintError') {
			return res.status(409).json({ message: 'El teléfono o email ya están en uso.' });
		}
		return res.status(500).json({
			message: 'Error interno del servidor al registrar.',
			error
		});
	}
};

const getMe = async (req, res) => {
	const { id, email, phone } = req.user;
	const cuenta = await userService.getCuenta(id);
	return res.status(200).json({
		id,
		email,
		phone,
		cuenta
	});
};
const getData = async(req,res) => {
	const user = req.user;
	const data = await userService.getData(user);
	return res.status(200).json(data);
}

module.exports = { register, getMe, getData};
