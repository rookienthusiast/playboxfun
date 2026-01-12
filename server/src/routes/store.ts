import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

const ITEM_CATALOG: Record<string, { price: number, category: string }> = {
  'shortFlat': { price: 0, category: 'hair' },
  'straight01': { price: 20, category: 'hair' },
  'shortCurly': { price: 25, category: 'hair' },
  'bob': { price: 30, category: 'hair' },
  'bun': { price: 35, category: 'hair' },
  'dreads01': { price: 40, category: 'hair' },
  'shaggyMullet': { price: 45, category: 'hair' },
  'winterHat02': { price: 50, category: 'hair' },
  'hijab': { price: 30, category: 'hair' },
  'turban': { price: 35, category: 'hair' },
  'miaWallace': { price: 40, category: 'hair' },

  '2c1b18': { price: 0, category: 'hairColor' },
  '4a312c': { price: 10, category: 'hairColor' },
  '724133': { price: 10, category: 'hairColor' },
  'a55728': { price: 15, category: 'hairColor' },
  'b58143': { price: 15, category: 'hairColor' },
  'c93305': { price: 20, category: 'hairColor' },
  'd6b370': { price: 20, category: 'hairColor' },
  'e8e1e1': { price: 25, category: 'hairColor' },
  'f59797': { price: 30, category: 'hairColor' },

  'shirtCrewNeck': { price: 0, category: 'clothing' },
  'shirtVNeck': { price: 15, category: 'clothing' },
  'shirtScoopNeck': { price: 15, category: 'clothing' },
  'graphicShirt': { price: 25, category: 'clothing' },
  'hoodie': { price: 30, category: 'clothing' },
  'overall': { price: 40, category: 'clothing' },
  'collarAndSweater': { price: 45, category: 'clothing' },
  'blazerAndShirt': { price: 50, category: 'clothing' },
  'blazerAndSweater': { price: 55, category: 'clothing' },

  'none': { price: 0, category: 'accessory' },
  'round': { price: 15, category: 'accessory' },
  'kurt': { price: 20, category: 'accessory' },
  'prescription01': { price: 20, category: 'accessory' },
  'prescription02': { price: 25, category: 'accessory' },
  'wayfarers': { price: 30, category: 'accessory' },
  'sunglasses': { price: 35, category: 'accessory' },
  'eyepatch': { price: 50, category: 'accessory' },
};

router.get('/', (req, res) => {
    res.json({ success: true, catalog: ITEM_CATALOG });
});

router.post('/buy', async (req: Request, res: Response) => {
  const { userId, itemId } = req.body;
  
  if (!ITEM_CATALOG[itemId]) {
      return res.status(400).json({ error: 'Barang tidak ditemukan' });
  }

  const itemInfo = ITEM_CATALOG[itemId];
  const price = itemInfo.price;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { inventory: true }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const alreadyOwns = user.inventory.some(i => i.itemId === itemId);
    if (alreadyOwns) return res.status(400).json({ error: 'Kamu sudah punya barang ini!' });

    if (user.puzzlePieces < price) {
      return res.status(400).json({ error: 'Puzzle Pieces tidak cukup!' });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { puzzlePieces: { decrement: price } }
      }),
      prisma.userItem.create({
        data: { 
            userId: userId, 
            itemId: itemId,
            category: itemInfo.category
        }
      })
    ]);

    const updatedUser = await prisma.user.findUnique({
        where: { id: userId },
        include: { inventory: true }
    });

    const userData = {
      ...updatedUser,
      inventory: updatedUser?.inventory.map(i => i.itemId) || []
    };

    res.json({ success: true, user: userData });

  } catch (error) {
    res.status(500).json({ error: 'Gagal membeli barang' });
  }
});

router.post('/equip', async (req: Request, res: Response) => {
  const { userId, itemId } = req.body;
  
  const itemInfo = ITEM_CATALOG[itemId];
  
  if (!itemInfo) return res.status(400).json({ error: 'Item tidak valid' });

  try {
    const ownership = await prisma.userItem.findUnique({
       where: { userId_itemId: { userId, itemId } }
    });
    
    if (itemInfo.price > 0 && !ownership) {
        return res.status(403).json({ error: 'Kamu belum punya barang ini!' });
    }

    let updateData = {};
    if (itemInfo.category === 'hair') updateData = { equippedHair: itemId };
    if (itemInfo.category === 'hairColor') updateData = { equippedHairColor: itemId };
    if (itemInfo.category === 'clothing') updateData = { equippedClothing: itemId };
    if (itemInfo.category === 'accessory') updateData = { equippedAccessory: itemId };
    if (itemInfo.category === 'base') updateData = { equippedBase: itemId };

    await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    res.json({ success: true });

  } catch (error) {
    res.status(500).json({ error: 'Gagal memakai barang' });
  }
});

export default router;
