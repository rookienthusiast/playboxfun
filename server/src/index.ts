import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './lib/prisma'; 
import iotRoutes from './routes/iot'; 
import authRoutes from './routes/auth';
import historyRoutes from './routes/history';
import storeRoutes from './routes/store';
import gameRoutes from './routes/game';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/iot', iotRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/game', gameRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + Prisma Server is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});