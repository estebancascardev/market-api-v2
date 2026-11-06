import 'dotenv/config';
import express from 'express';

const app = express();
const port = Number(process.env.APP_PORT);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('APP_PORT debe ser un puerto válido entre 1 y 65535.');
}

app.post('/test', (req, res) => {
  res.status(200).json({ message: 'API funcionando' });
});

app.listen(port, () => {
  console.log(`API escuchando en el puerto ${port}`);
});