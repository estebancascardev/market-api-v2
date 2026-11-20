import 'dotenv/config';
import express from 'express';
import authRouter from './src/routes/auth.route.js';
import userRouter from './src/routes/user.route.js';

const app = express();
const port = Number(process.env.APP_PORT);

app.use(express.json());
app.use('/auth', authRouter);
app.use("/users", userRouter);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('APP_PORT debe ser un puerto válido entre 1 y 65535.');
}

app.listen(port, () => {
  console.log(`API escuchando en el puerto ${port}`);
});