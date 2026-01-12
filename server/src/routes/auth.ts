import express, { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

// Endpoint Login by UID
// POST /api/auth/login
// Body: { "uid": "CARD-JOJO-01" }
router.post('/login', async (req: Request, res: Response) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ error: 'UID is required' });
  }

  try {
    // 1. Cari kartu berdasarkan UID
    const card = await prisma.userCard.findUnique({
      where: { uid: uid },
      include: {
        user: {
            include: {
                inventory: true // Fetch items
            }
        }
      },
    });

    // 2. Jika kartu tidak ditemukan
    if (!card) return res.status(404).json({ error: 'Kartu tidak terdaftar' });

    // 3. Jika ketemu, kembalikan data user
    // Kita format sedikit biar rapi
    const userData = {
      id: card.user.id,
      name: card.user.name,
      balance: card.user.balance,
      cardUid: card.uid,
      // Gamification Data
      xp: card.user.xp,
      puzzlePieces: card.user.puzzlePieces,

      // Avatar Customization
      equippedBase: card.user.equippedBase,
      equippedHair: card.user.equippedHair,
      equippedHairColor: card.user.equippedHairColor, // Sync hair color on login
      equippedClothing: card.user.equippedClothing,
      equippedAccessory: card.user.equippedAccessory,

      // Inventory (List of item IDs)
      inventory: card.user.inventory.map(i => i.itemId),

      claimedBoxes: card.user.claimedBoxes,
    };

    return res.json({
        success: true,
        user: userData
    });

  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Profile Name
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
