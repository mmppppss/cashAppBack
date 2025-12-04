const authService = require('./auth.service');

const login = async (req, res) => {
	const { email, password, pin } = req.body;

	if (!email && (!password || !pin)) {
		return res.status(400).json({ message: 'Se requieren email y contraseña o pin.' });
	}

	const user = await authService.validateUser(email, password);

	if (!user) {
		return res.status(401).json({ message: 'Credenciales inválidas.' });
	}

	const token = authService.generateToken(user);

	return res.status(200).json({
		message: 'Login exitoso',
		token,
		user: { id: user.id, email: user.email, name: user.name },
	});
};

module.exports = { login };
