import jwt from 'jsonwebtoken';
import { User,Role } from '../models/index.js';

export const login = async (req, res) => {
	const { email, password } = req.body ?? {};

	if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
		return res.status(400).json({ message: 'El correo y la contraseña son obligatorios.' });
	}

	if (!process.env.JWT_SECRET) {
		return res.status(500).json({ message: 'La autenticación no está configurada.' });
	}

	try {
		const user = await User.findOne({ where: { email },
		include:[
			{
				model:Role,
				attributes:['id', 'name', 'description', 'isActive']
			}
		] });
		if (!user || !(await user.comparePassword(password))) {
			return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
		}

		const token = jwt.sign(
			{ id: user.id, email: user.email, fullName: user.fullName },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' },
		);

		const userData = user.toJSON();
		delete userData.password;

		return res.status(200).json({ token, user: userData });
	} catch (_error) {
		console.log(_error)
		return res.status(500).json({ message: 'No se pudo iniciar sesión.' });
	}
};
