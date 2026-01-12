import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// POST /api/game/claim
router.post('/claim', async (req: Request, res: Response) => {
  const { userId, step } = req.body;

  if (!userId || !step) {
    return res.status(400).json({ error: 'Data tidak lengkap' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Cek apakah sudah diklaim
    const claimedList = user.claimedBoxes ? user.claimedBoxes.split(',') : [];
    if (claimedList.includes(String(step))) {
      return res.status(400).json({ error: 'Hadiah ini sudah diambil!' });
    }

    // Logic Hadiah: +2 Puzzle Pieces
    const REWARD_AMOUNT = 2;

    const newClaimedList = [...claimedList, step].join(',');

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        puzzlePieces: { increment: REWARD_AMOUNT },
        claimedBoxes: newClaimedList
      }
    });

    res.json({ 
      success: true, 
      puzzlePieces: updatedUser.puzzlePieces,
      claimedBoxes: updatedUser.claimedBoxes 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal klaim hadiah' });
  }
});

export default router;
