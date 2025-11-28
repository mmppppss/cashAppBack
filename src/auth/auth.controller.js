const authService = require('./auth.service');

const login = async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(400).json({ message: 'Se requieren usuario y contraseña.' });
	}

	const user = await authService.validateUser(username, password);

	if (!user) {
		return res.status(401).json({ message: 'Credenciales inválidas.' });
	}

	const token = authService.generateToken(user);

	return res.status(200).json({
		message: 'Login exitoso',
		token,
		user: { id: user.id, username: user.username }
	});
};

module.exports = { login };
