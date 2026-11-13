import {User} from "../models/index.js";

export const getUsers = async (_req, res) => {
	try {
		const users = await User.findAll({ attributes: { exclude: ['password'] } });
		return res.status(200).json(users);
	} catch (_error) {
		return res.status(500).json({ message: 'No se pudieron obtener los usuarios.' });
	}
};

export const updateUser = async (_req, res) => {
	const userId = Number(_req.params.id);
	const body = _req.body ?? {};

	if (!Number.isInteger(userId) || userId < 1) {
		return res.status(400).json({ message: 'El ID del usuario no es válido.' });
	}

	if (typeof body !== 'object' || Array.isArray(body)) {
		return res.status(400).json({ message: 'El cuerpo de la solicitud no es válido.' });
	}

	try {
		const user = await User.findByPk(userId);
		if (!user) {
			return res.status(404).json({ message: 'Usuario no encontrado.' });
		}

		const fields = ['fullName', 'email', 'phoneNumber', 'password', 'address', 'gender', 'isActived'];
		const updates = Object.fromEntries(fields.filter((field) => field in body).map((field) => [field, body[field]]));
		await user.update(updates);

		const userData = user.toJSON();
		delete userData.password;
		return res.status(200).json(userData);
	} catch (error) {
		if (error.name === 'SequelizeUniqueConstraintError') {
			return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
		}

		if (error.name === 'SequelizeValidationError') {
			return res.status(400).json({ message: error.errors.map(({ message }) => message) });
		}

		return res.status(500).json({ message: 'No se pudo actualizar el usuario.' });
	}
};

export const deleteUser = async (_req, res) => {
	const userId = Number(_req.params.id);

	if (!Number.isInteger(userId) || userId < 1) {
		return res.status(400).json({ message: 'El ID del usuario no es válido.' });
	}

	try {
		const deletedCount = await User.destroy({ where: { id: userId } });
		if (deletedCount === 0) {
			return res.status(404).json({ message: 'Usuario no encontrado.' });
		}

		return res.status(200).json({ message: 'Usuario eliminado correctamente.' });
	} catch (_error) {
		return res.status(500).json({ message: 'No se pudo eliminar el usuario.' });
	}
};

export const addUser = async (_req, res) => {
		const { fullName, email, phoneNumber, password, address, gender } = _req.body ?? {};

		try {
			const user = await User.create({ fullName, email, phoneNumber, password, address, gender });
			const userData = user.toJSON();
			delete userData.password;

			return res.status(201).json(userData);
		} catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
			}

			if (error.name === 'SequelizeValidationError') {
				return res.status(400).json({ message: error.errors.map(({ message }) => message) });
			}

			return res.status(500).json({ message: 'No se pudo crear el usuario.' });
		}
};
