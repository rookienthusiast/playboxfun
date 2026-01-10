import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.post('/money-in', async (req: Request, res: Response) => {
  const { uid, amount_rp, deviceId } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Cari kartu
      const card = await tx.userCard.findUnique({
        where: { uid },
        include: { user: true }
      });

      // Validasi ketat untuk TS: pastikan card dan userId tidak null
      if (!card || !card.userId || !card.user) {
        throw new Error("Kartu tidak valid atau belum terhubung ke user");
      }

      // 2. Tambah saldo (Pastikan npx prisma generate sudah dijalankan)
      const updatedUser = await tx.user.update({
        where: { id: card.userId },
        data: { 
          balance: { increment: Number(amount_rp) },
          // REWARD SYSTEM
          xp: { increment: Math.floor(Number(amount_rp) / 1000) }, // 1000rp = 1 xp
          puzzlePieces: { increment: 1 } // Setiap nabung dapet 1 puzzle (Bonus)
        }
      });

      // 3. Catat history (Sesuaikan dengan field wajib di skema Ndan saat ini)
      return await tx.moneyInEvent.create({
        data: {
          deviceId: deviceId || "DEV-01",
          userId: card.userId,
          amount_rp: Number(amount_rp),
          saldo_after: updatedUser.balance
        }
      });
    });

    res.json({ message: `Saldo masuk Rp${amount_rp}` });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Unknown error" });
  }
});

export default router;