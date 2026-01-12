import express, { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ error: 'UID is required' });
  }

  try {
    const card = await prisma.userCard.findUnique({
      where: { uid: uid },
      include: {
        user: {
            include: {
                inventory: true
            }
        }
      },
    });

    if (!card) return res.status(404).json({ error: 'Kartu tidak terdaftar' });

    const userData = {
      id: card.user.id,
      name: card.user.name,
      balance: card.user.balance,
      cardUid: card.uid,
      xp: card.user.xp,
      puzzlePieces: card.user.puzzlePieces,
      equippedBase: card.user.equippedBase,
      equippedHair: card.user.equippedHair,
      equippedHairColor: card.user.equippedHairColor,
      equippedClothing: card.user.equippedClothing,
      equippedAccessory: card.user.equippedAccessory,
      inventory: card.user.inventory.map(i => i.itemId),
      claimedBoxes: card.user.claimedBoxes,
    };

    return res.json({
        success: true,
        user: userData
    });

  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/update-name', async (req: Request, res: Response) => {
    const { userId, name } = req.body;
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { name }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Gagal update nama' });
    }
});

export default router;
