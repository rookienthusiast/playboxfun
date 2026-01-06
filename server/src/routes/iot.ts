import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma'; // Sesuaikan path ke file prisma.ts Ndan
import { Prisma } from '@prisma/client';

const router = Router();

// Endpoint: POST /api/iot/money-in
router.post('/money-in', async (req: Request, res: Response) => {
  try {
    const { uid, amount_rp, method, event_uuid, deviceId } = req.body;

    // 1. Cari Kartu & User
    const card = await prisma.userCard.findUnique({
      where: { uid },
      include: { user: true }
    });

    if (!card || !card.user) {
      return res.status(404).json({ message: "Kartu tidak terdaftar" });
    }

    // 2. Transaksi Prisma
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      return await tx.moneyInEvent.create({
        data: {
          event_uuid: event_uuid || `auto-${Date.now()}`,
          deviceId: deviceId || "DEV-01",
          userId: card.userId,
          method: method || "UNKNOWN",
          amount_rp: Number(amount_rp),
          saldo_before: 0,
          saldo_after: 0,
        }
      });
    });

    return res.status(200).json({ 
      status: "Berhasil", 
      message: `Tabungan ${card.user.name} masuk` 
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;