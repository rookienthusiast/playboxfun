import express, { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

// GET /api/history?userId=1
router.get('/', async (req: Request, res: Response) => {
  const userId = parseInt(req.query.userId as string);

  if (!userId) {
    return res.status(400).json({ error: 'UserId is required' });
  }

  try {
    const history = await prisma.moneyInEvent.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' }, // Terbaru diatas
      take: 20, // Ambil 20 transaksi terakhir
    });

    // Format data biar enak dibaca frontend
    const formatted = history.map(item => ({
        id: item.id,
        title: 'Tabungan Masuk', // Nanti bisa dibedakan Koin/Kertas
        amount: item.amount_rp,
        date: item.createdAt,
        type: 'income', // Buat warna hijau
        // method: item.method // Nanti kalo kolom method dibalikin
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

export default router;
