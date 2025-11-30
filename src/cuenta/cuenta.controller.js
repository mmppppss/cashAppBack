const cuentaService = require('./cuenta.service');

const getCuenta = async (req, res) => {
	const { id } = req.params;
	const cuenta = await cuentaService.getCuenta(id);
	return res.status(200).json(cuenta);
}
const getCuentaByUser = async (req, res) => {
	const { id } = req.user;
	console.log(id);
	const cuenta = await cuentaService.getCuentaByUserId(id);
	return res.status(200).json(cuenta);
}
module.exports = { getCuenta, getCuentaByUser };
