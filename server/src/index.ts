import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// 1. Impor prisma dari lib, jangan bikin instance baru di sini
import { prisma } from './lib/prisma'; 
// 2. Impor route
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

// 3. Daftarkan Routes
app.use('/api/iot', iotRoutes);   // Endpoint untuk Hardware
app.use('/api/auth', authRoutes); // Endpoint untuk Login Aplikasi
app.use('/api/history', historyRoutes); // Endpoint History Transaksi
app.use('/api/store', storeRoutes); // Endpoint Toko Avatar
app.use('/api/game', gameRoutes); // Endpoint untuk Game

app.get('/', (req: Request, res: Response) => {
  res.send('Express + Prisma Server is running!');
});

// Contoh endpoint users menggunakan prisma yang sudah diimpor
app.get('/api/users', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});