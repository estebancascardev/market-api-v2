import 'dotenv/config';
import { Sequelize } from 'sequelize';
import { RolesModel } from './rol.model.js';
import { UserModel } from './user.model.js';

const requiredEnvironmentVariables = [
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'DB_HOST',
  'DB_PORT',
  'DB_DIALECT',
];

for (const variable of requiredEnvironmentVariables) {
  if (!process.env[variable]) {
    throw new Error(`Falta configurar la variable de entorno ${variable}.`);
  }
}

if (process.env.DB_DIALECT !== 'postgres') {
  throw new Error('DB_DIALECT debe tener el valor "postgres".');
}

const port = Number(process.env.DB_PORT);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('DB_PORT debe ser un puerto válido entre 1 y 65535.');
}

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port,
    dialect: 'postgres',
    logging: false,
  },
);

export const User = UserModel.initModel(sequelize);
export const Role = RolesModel.initModel(sequelize);
User.belongsTo(Role,{foreignKey: 'rolId'});
Role.hasMany(User, {foreignKey: 'rolId'})

export async function testConnection() {
  await sequelize.authenticate();
  console.log('Conexión a PostgreSQL establecida correctamente.');
}