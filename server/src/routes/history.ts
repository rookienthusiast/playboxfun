import express, { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const userId = parseInt(req.query.userId as string);

  if (!userId) {
    return res.status(400).json({ error: 'UserId is required' });
  }

  try {
    const history = await prisma.moneyInEvent.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const formatted = history.map(item => ({
        id: item.id,
        title: 'Tabungan Masuk',
        amount: item.amount_rp,
        date: item.createdAt,
        type: 'income',
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

export default router;
