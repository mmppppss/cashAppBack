const User = require('../models/User');
const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(password, salt);
};

const createUser = async (username, email, password) => {
	const hashedPassword = await hashPassword(password);

	const newUser = await User.create({
		username: username,
		email: email,
		hashed_password: hashedPassword
	});

	return {
		id: newUser.id,
		username: newUser.username,
		email: newUser.email
	};
};

module.exports = { createUser };
