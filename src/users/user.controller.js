const userService = require('./user.service');

const register = async (req, res) => {
	const { username, email, password } = req.body;

	if (!username || !password || !email) {
		return res.status(400).json({ message: 'Todos los campos (username, email, password) son obligatorios.' });
	}

	try {
		const newUser = await userService.createUser(username, email, password);

		return res.status(201).json({
			message: 'Usuario registrado exitosamente',
			user: newUser
		});

	} catch (error) {
		if (error.name === 'SequelizeUniqueConstraintError') {
			return res.status(409).json({ message: 'El nombre de usuario o email ya están en uso.' });
		}
		return res.status(500).json({ message: 'Error interno del servidor al registrar.' });
	}
};

const getMe = async (req, res) => {
	const { id, username } = req.user;

	return res.status(200).json({
		id,
		username,
		message: 'Acceso a ruta protegida exitoso.'
	});
};

module.exports = { register, getMe };
