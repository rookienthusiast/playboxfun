'use client';

import { MOCK_USER } from '@/data/mock';
import { ArrowLeft, Lock, Puzzle, Check } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

// Mock Items
const AVATAR_ITEMS = [
  { id: 'cat_warrior', name: 'Kucing Petualang', price: 0, seed: 'cat_warrior' },
  { id: 'dog_detective', name: 'Anjing Detektif', price: 5, seed: 'dog_detective' },
  { id: 'bear_king', name: 'Raja Beruang', price: 10, seed: 'bear_king' },
  { id: 'rabbit_racer', name: 'Kelinci Pembalap', price: 15, seed: 'rabbit_racer' },
  { id: 'panda_chef', name: 'Koki Panda', price: 20, seed: 'panda_chef' },
  { id: 'lion_hero', name: 'Singa Pahlawan', price: 50, seed: 'lion_hero' },
];

export default function StorePage() {
  const [user, setUser] = useState(MOCK_USER);
  const [selectedItem, setSelectedItem] = useState<typeof AVATAR_ITEMS[0] | null>(null);

  const handleBuy = (item: typeof AVATAR_ITEMS[0]) => {
      if (user.puzzlePieces >= item.price) {
          // Simulate Buy
          setUser((prev) => ({
              ...prev,
              puzzlePieces: prev.puzzlePieces - item.price,
              unlockedAvatars: [...prev.unlockedAvatars, item.id]
          }));
          setSelectedItem(null);
          alert(`Yeay! Kamu berhasil membeli ${item.name}! 🎉`);
      } else {
          alert("Yah, Puzzle kamu belum cukup! Ayo nabung lagi! 💪");
      }
  };

  const handleEquip = (itemId: string) => {
      setUser((prev) => ({ ...prev, avatarId: itemId }));
  };

  return (
    <div className="pb-24 min-h-screen bg-slate-50">
      
      {/* HEADER */}
      <header className="bg-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-sm border-b border-slate-100">
        <div className="flex items-center gap-4">
            <Link href="/">
                <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
                    <ArrowLeft size={24} />
                </button>
            </Link>
            <h1 className="text-xl font-bold text-slate-700">Toko Avatar</h1>
        </div>
        
        {/* Currency Display */}
        <div className="flex items-center gap-2 bg-joy-orange-light px-3 py-1.5 rounded-full border border-joy-orange/30">
            <Puzzle size={18} className="text-joy-orange fill-joy-orange" />
            <span className="font-bold text-joy-orange">{user.puzzlePieces}</span>
        </div>
      </header>

      {/* ITEMS GRID */}
      <div className="p-6 grid grid-cols-2 gap-4">
        {AVATAR_ITEMS.map((item) => {
            const isUnlocked = user.unlockedAvatars.includes(item.id);
            const isEquipped = user.avatarId === item.id;

            return (
                <motion.div 
                    key={item.id}
                    whileTap={{ scale: 0.98 }}
                    className={`
                        relative bg-white rounded-3xl p-4 shadow-sm border-2 flex flex-col items-center gap-3 overflow-hidden
                        ${isEquipped ? 'border-joy-green ring-2 ring-joy-green/30' : 'border-slate-100'}
                    `}
                >
                    {/* Badge Status */}
                    <div className="absolute top-3 right-3">
                         {isEquipped && <div className="bg-joy-green text-white p-1 rounded-full"><Check size={12} strokeWidth={4} /></div>}
                         {!isUnlocked && <Lock size={16} className="text-slate-300" />}
                    </div>

                    {/* Avatar Image */}
                    <div className={`w-20 h-20 rounded-full bg-slate-50 overflow-hidden ${!isUnlocked && 'grayscale opacity-50'}`}>
                         <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${item.seed}`} alt={item.name} />
                    </div>

                    <div className="text-center w-full">
                        <h3 className="font-bold text-slate-700 text-sm truncate">{item.name}</h3>
                        
                        {!isUnlocked ? (
                            <button 
                                onClick={() => handleBuy(item)}
                                className="mt-3 w-full bg-joy-orange text-white text-xs font-bold py-2 rounded-xl shadow-md border-b-4 border-orange-600 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-1"
                            >
                                <Puzzle size={12} fill="currentColor" /> {item.price}
                            </button>
                        ) : isEquipped ? (
                            <div className="mt-3 text-xs font-bold text-joy-green py-2">Sedang Dipakai</div>
                        ) : (
                            <button 
                                onClick={() => handleEquip(item.id)}
                                className="mt-3 w-full bg-slate-100 text-slate-500 hover:bg-joy-blue hover:text-white text-xs font-bold py-2 rounded-xl transition-colors"
                            >
                                Pakai
                            </button>
                        )}
                    </div>
                </motion.div>
            );
        })}
      </div>
    </div>
  );
}
