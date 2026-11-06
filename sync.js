import { sequelize } from './src/models/index.js';

export async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados correctamente con la base de datos.');
  } finally {
    await sequelize.close();
  }
}

try {
  await syncDatabase();
} catch (error) {
  console.error('Error al sincronizar los modelos con la base de datos:', error);
  process.exitCode = 1;
}