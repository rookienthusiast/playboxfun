import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Express + Prisma Server is running!');
});

app.get('/api/users', async (req: Request, res: Response) => {
  try {
    // Example usage of prisma (uncomment when you have a model)
    // const users = await prisma.user.findMany();
    // res.json(users);
    res.json({ message: "Get all users endpoint" });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
