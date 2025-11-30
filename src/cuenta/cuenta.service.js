const Cuenta = require('../models/Cuenta');

const createCuenta = async (usuario) => {
	const newCuenta = await Cuenta.create({
		id_usuario: usuario.id,
		monto: 0.00,
	})
	return {
		id: newCuenta.id,
		id_usuario: newCuenta.id_usuario,
		monto: newCuenta.monto
	};
}

const getCuentaByUserId = async(id)=>{
	const cuenta = await Cuenta.findOne({
		where:{
			id_usuario: id
		}
	})
	return {
		id: cuenta.id,
		monto: cuenta.monto
	};
}
const getCuenta = async (id) => {
	const cuenta = await Cuenta.findByPk(id);
	return {
		id: cuenta.id,
		id_usuario: cuenta.id_usuario,
		monto: cuenta.monto
	};
}

module.exports = { createCuenta, getCuentaByUserId, getCuenta };
