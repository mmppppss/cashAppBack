const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const validateUser = async (username, password) => {
	const user = await User.findOne({ where: { username } });

	if (!user) {
		return null;
	}

	const isMatch = await bcrypt.compare(password, user.hashed_password);

	if (!isMatch) {
		return null;
	}

	return user;
};

const generateToken = (user) => {
	const payload = {
		id: user.id,
		username: user.username,
	};

	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN,
	});
};

module.exports = { validateUser, generateToken };
