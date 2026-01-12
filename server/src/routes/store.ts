import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// KATALOG BARANG (Nanti bisa dipindah ke DB)
const ITEM_CATALOG: Record<string, { price: number, category: string }> = {
  // HAIR
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

  // HAIR COLOR (NEW)
  '2c1b18': { price: 0, category: 'hairColor' }, // Black
  '4a312c': { price: 10, category: 'hairColor' }, // Dark Brown
  '724133': { price: 10, category: 'hairColor' }, // Brown
  'a55728': { price: 15, category: 'hairColor' }, // Auburn
  'b58143': { price: 15, category: 'hairColor' }, // Light Brown
  'c93305': { price: 20, category: 'hairColor' }, // Red
  'd6b370': { price: 20, category: 'hairColor' }, // Blonde
  'e8e1e1': { price: 25, category: 'hairColor' }, // Platinum/White
  'f59797': { price: 30, category: 'hairColor' }, // Pink

  // CLOTHING
  'shirtCrewNeck': { price: 0, category: 'clothing' },
  'shirtVNeck': { price: 15, category: 'clothing' },
  'shirtScoopNeck': { price: 15, category: 'clothing' },
  'graphicShirt': { price: 25, category: 'clothing' },
  'hoodie': { price: 30, category: 'clothing' },
  'overall': { price: 40, category: 'clothing' },
  'collarAndSweater': { price: 45, category: 'clothing' },
  'blazerAndShirt': { price: 50, category: 'clothing' },
  'blazerAndSweater': { price: 55, category: 'clothing' },

  // ACCESSORY
  'none': { price: 0, category: 'accessory' },
  'round': { price: 15, category: 'accessory' },
  'kurt': { price: 20, category: 'accessory' },
  'prescription01': { price: 20, category: 'accessory' },
  'prescription02': { price: 25, category: 'accessory' },
  'wayfarers': { price: 30, category: 'accessory' },
  'sunglasses': { price: 35, category: 'accessory' },
  'eyepatch': { price: 50, category: 'accessory' },
};

// 1. GET CATALOG
router.get('/', (req, res) => {
    res.json({ success: true, catalog: ITEM_CATALOG });
});

// 2. BUY ITEM
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

    // Cek apakah sudah punya
    const alreadyOwns = user.inventory.some(i => i.itemId === itemId);
    if (alreadyOwns) return res.status(400).json({ error: 'Kamu sudah punya barang ini!' });

    // Cek Saldo
    if (user.puzzlePieces < price) {
      return res.status(400).json({ error: 'Puzzle Pieces tidak cukup!' });
    }

    // Transaksi Atomik
    const result = await prisma.$transaction([
      // 1. Kurangi Saldo
      prisma.user.update({
        where: { id: userId },
        data: { puzzlePieces: { decrement: price } }
      }),
      // 2. Tambah ke Inventory
      prisma.userItem.create({
        data: { 
            userId: userId, 
            itemId: itemId,
            category: itemInfo.category
        }
      })
    ]);

    // Return saldo baru
    res.json({ success: true, newBalance: result[0].puzzlePieces });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal membeli barang' });
  }
});

// 3. EQUIP ITEM
router.post('/equip', async (req: Request, res: Response) => {
  const { userId, itemId } = req.body;
  
  // Hande Unequip (misal copot kacamata)
  if (itemId === 'none') {
       // Kita asumsikan unequip cuma buat aksesoris dulu
       // Atau terima parameter category
  }

  // Cari info item untuk tau kategorinya
  const itemInfo = ITEM_CATALOG[itemId];
  
  // Tapi user mungkin equip item yg default (price 0) yg gak ada di inventory?
  // Kita asumsikan default items jg ada di catalog
  
  if (!itemInfo) return res.status(400).json({ error: 'Item tidak valid' });

  try {
    // Pastikan user memilikinya (kecuali barang gratisan default?)
    // Kita cek DB
    const ownership = await prisma.userItem.findUnique({
       where: { userId_itemId: { userId, itemId } }
    });
    
    // Kalau item berbayar (>0) dan gak punya -> Error
    if (itemInfo.price > 0 && !ownership) {
        return res.status(403).json({ error: 'Kamu belum punya barang ini!' });
    }

    // Tentukan kolom mana yang diupdate berdasarkan kategori
    let updateData = {};
    if (itemInfo.category === 'hair') updateData = { equippedHair: itemId };
    if (itemInfo.category === 'hairColor') updateData = { equippedHairColor: itemId }; // NEW
    if (itemInfo.category === 'clothing') updateData = { equippedClothing: itemId };
    if (itemInfo.category === 'accessory') updateData = { equippedAccessory: itemId };
    if (itemInfo.category === 'base') updateData = { equippedBase: itemId };

    await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal memakai barang' });
  }
});

export default router;
