import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// 1. Impor prisma dari lib, jangan bikin instance baru di sini
import { prisma } from './lib/prisma'; 
// 2. Impor route iot yang tadi dibuat
import iotRoutes from './routes/iot'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// 3. Daftarkan route IoT
// Ini artinya semua route di iot.ts akan diawali dengan /api/iot
app.use('/api/iot', iotRoutes);

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