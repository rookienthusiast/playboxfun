import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding (Simple Version)...');

  // 1. Buat Dummy Users (Anak-anak)
  const user1 = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Jojo Sang Juara',
      balance: 150000,
      xp: 150, // Fix XP awal
      puzzlePieces: 10,
      equippedHair: 'shortFlat', // Fix: match NEW Avataaars style
      equippedHairColor: '2c1b18', // New Default
      equippedClothing: 'hoodie',
      equippedAccessory: 'wayfarers',
      cards: { create: { uid: 'CARD-JOJO-01' } },
      inventory: {
        create: [
            { itemId: 'shortFlat', category: 'hair' },
            { itemId: 'hoodie', category: 'clothing' },
            { itemId: 'wayfarers', category: 'accessory' }
        ]
      }
    },
  });

  const user2 = await prisma.user.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Siti Rajin',
      balance: 75000,
      xp: 75,
      puzzlePieces: 5,
      cards: { create: { uid: 'CARD-SITI-01' } },
      inventory: {
         create: [
            { itemId: 'shortFlat', category: 'hair' },
            { itemId: 'shirtCrewNeck', category: 'clothing' }
         ]
      }
    },
  });

  console.log('✅ Users with Fashion Inventory created');

  // 2. Buat Fake Transactions (User nabung)
  // Perhatikan: Model Device tidak ada, jadi deviceId di sini cuma String biasa (bukan relation)
  
  // Jojo nabung 50rb
  await prisma.moneyInEvent.create({
    data: {
      deviceId: 'DEV-001', // Cuma string ID
      userId: user1.id,
      amount_rp: 50000,
      saldo_after: 150000,
    }
  });

  // Siti nabung 500 perak
  await prisma.moneyInEvent.create({
    data: {
      deviceId: 'DEV-001', 
      userId: user2.id,
      amount_rp: 500,
      saldo_after: 75000,
    }
  });

  console.log('✅ Transactions seeded');
  console.log('🚀 Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    throw e;
  });
