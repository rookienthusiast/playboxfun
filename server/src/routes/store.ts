import express, { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

const AVATAR_PRICES: Record<string, number> = {
    'cat': 0,    // Gratis
    'dog': 50,
    'bear': 100,
    'rabbit': 150,
    'fox': 200
};

// POST /api/store/buy
// Body: { userId: 1, avatarId: 'dog' }
router.post('/buy', async (req: Request, res: Response) => {
    const { userId, avatarId } = req.body;
    const price = AVATAR_PRICES[avatarId];

    if (!userId || !avatarId) return res.status(400).json({ error: 'Data tidak lengkap' });
    if (price === undefined) return res.status(400).json({ error: 'Avatar tidak valid' });

    try {
        // 1. Cek User & Saldo Puzzle
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { avatars: true } // Cek udah punya belum
        });

        if (!user) return res.status(404).json({ error: 'User not found' });

        // 2. Cek apakah sudah punya?
        const alreadyOwns = user.avatars.some(a => a.avatarId === avatarId);
        if (alreadyOwns) return res.status(400).json({ error: 'Kamu sudah punya avatar ini!' });

        // 3. Cek Saldo Cukup?
        if (user.puzzlePieces < price) {
            return res.status(400).json({ error: 'Puzzle Pieces tidak cukup!' });
        }

        // 4. EKSEKUSI TRANSAKSI (Atomik: Kurang Saldo + Tambah Item)
        // Kita pakai transaction biar aman (kalau satu gagal, semua batal)
        const result = await prisma.$transaction([
            // Kurangi Saldo
            prisma.user.update({
                where: { id: userId },
                data: { puzzlePieces: { decrement: price } }
            }),
            // Tambah Item ke Inventory
            prisma.userAvatar.create({
                data: {
                    userId: userId,
                    avatarId: avatarId
                }
            })
        ]);

        res.json({ success: true, newBalance: result[0].puzzlePieces });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal membeli avatar' });
    }
});

// POST /api/store/equip
// Body: { userId: 1, avatarId: 'dog' }
router.post('/equip', async (req: Request, res: Response) => {
    const { userId, avatarId } = req.body;
    
    try {
        // 1. Cek kepemilikan dulu (Security Check)
        const ownership = await prisma.userAvatar.findUnique({
             where: {
                userId_avatarId: { userId, avatarId }
             }
        });
        
        // Kalo avatarId = 'cat' (default), kita anggap selalu boleh walau ga ada di tabel UserAvatar (opsional)
        // Tapi amannya kita cek dulu.

        if (!ownership && avatarId !== 'cat') {
            return res.status(403).json({ error: 'Kamu belum punya avatar ini!' });
        }

        // 2. Update Current Avatar
        await prisma.user.update({
            where: { id: userId },
            data: { currentAvatar: avatarId }
        });

        res.json({ success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal mengganti avatar' });
    }
});

export default router;
