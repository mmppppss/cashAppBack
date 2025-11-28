const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const protect = (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			token = req.headers.authorization.split(' ')[1];

			const decoded = jwt.verify(token, JWT_SECRET);

			req.user = decoded;

			next();

		} catch (error) {
			return res.status(401).json({ message: 'No autorizado, token inválido o expirado.' });
		}
	}

	if (!token) {
		return res.status(401).json({ message: 'No autorizado, no se encontró token.' });
	}
};

module.exports = { protect };
