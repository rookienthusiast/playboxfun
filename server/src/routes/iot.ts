import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.post('/money-in', async (req: Request, res: Response) => {
  const { uid, amount_rp, deviceId } = req.body;

  // Validasi input
  if (!uid || amount_rp === undefined || !deviceId) {
    return res.status(400).json({ error: 'uid, amount_rp, dan deviceId wajib diisi' });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Cek UID sudah ada atau belum
      let userId: number;
      
      const existingCard = await tx.userCard.findUnique({
        where: { uid }
      });

      if (existingCard) {
        // RFID SUDAH LAMA: pakai userId yang sudah ada
        userId = existingCard.userId;
      } else {
        // RFID BARU: buat User baru + UserCard baru
        const newUser = await tx.user.create({
          data: {
            name: uid, // Nama default = UID (misal: "04A3B2C1D4E5F6")
            balance: 0,
            xp: 0,
            puzzlePieces: 0,
            currentAvatar: 'cat'
          }
        });
        
        await tx.userCard.create({
          data: {
            uid: uid,
            userId: newUser.id
          }
        });
        
        userId = newUser.id;
      }

      // 2. Update saldo, XP, dan puzzlePieces
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { 
          balance: { increment: Number(amount_rp) },
          xp: { increment: Math.floor(Number(amount_rp) / 1000) }, // 1000rp = 1 xp
          puzzlePieces: { increment: 1 } // Setiap nabung dapet 1 puzzle
        }
      });

      // 3. Catat transaksi (MoneyInEvent)
      const event = await tx.moneyInEvent.create({
        data: {
          deviceId: deviceId,
          userId: userId,
          amount_rp: Number(amount_rp),
          saldo_after: updatedUser.balance
        }
      });

      return { user: updatedUser, event };
    });

    res.json({ 
      success: true,
      message: `Saldo masuk Rp${amount_rp}`,
      amount_rp: Number(amount_rp),
      new_balance: result.user.balance
    });

  } catch (err: any) {
    console.error('Money-in Error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

export default router;