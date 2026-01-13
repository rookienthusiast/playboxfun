'use client';

import { useUser } from '@/context/UserContext';
import { ArrowLeft, Check, Shirt, Scissors, Glasses, Palette, Puzzle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCustomAvatarUrl, User } from '@/data/mock';
import { API_URL } from '@/config';

interface ShopItem {
  id: string;
  name: string;
  price: number;
  category: 'hair' | 'clothing' | 'accessory' | 'hairColor';
}

const SHOP_ITEMS: ShopItem[] = [
  { id: 'shortFlat', name: 'Rambut Pendek', price: 0, category: 'hair' },
  { id: 'straight01', name: 'Rambut Panjang', price: 20, category: 'hair' },
  { id: 'shortCurly', name: 'Rambut Kriting', price: 25, category: 'hair' },
  { id: 'bob', name: 'Potongan Bob', price: 30, category: 'hair' },
  { id: 'bun', name: 'Sanggul', price: 35, category: 'hair' },
  { id: 'dreads01', name: 'Gimbal', price: 40, category: 'hair' },
  { id: 'shaggyMullet', name: 'Mullet Gaul', price: 45, category: 'hair' },
  { id: 'winterHat02', name: 'Topi Dingin', price: 50, category: 'hair' },
  { id: 'hijab', name: 'Hijab', price: 30, category: 'hair' },
  { id: 'turban', name: 'Turban', price: 35, category: 'hair' },
  { id: 'miaWallace', name: 'Poni Bob', price: 40, category: 'hair' },

  { id: '2c1b18', name: 'Hitam Alami', price: 0, category: 'hairColor' },
  { id: '4a312c', name: 'Coklat Tua', price: 10, category: 'hairColor' },
  { id: '724133', name: 'Coklat', price: 10, category: 'hairColor' },
  { id: 'a55728', name: 'Auburn', price: 15, category: 'hairColor' },
  { id: 'b58143', name: 'Light Brown', price: 15, category: 'hairColor' },
  { id: 'c93305', name: 'Merah Menyala', price: 20, category: 'hairColor' },
  { id: 'd6b370', name: 'Pirang', price: 20, category: 'hairColor' },
  { id: 'e8e1e1', name: 'Platinum', price: 25, category: 'hairColor' },
  { id: 'f59797', name: 'Pink Lucu', price: 30, category: 'hairColor' },

  { id: 'shirtCrewNeck', name: 'Kaos Crew', price: 0, category: 'clothing' },
  { id: 'shirtVNeck', name: 'Kaos V-Neck', price: 15, category: 'clothing' },
  { id: 'shirtScoopNeck', name: 'Kaos Scoop', price: 15, category: 'clothing' },
  { id: 'graphicShirt', name: 'Kaos Grafis', price: 25, category: 'clothing' },
  { id: 'hoodie', name: 'Hoodie Keren', price: 30, category: 'clothing' },
  { id: 'overall', name: 'Overalls', price: 40, category: 'clothing' },
  { id: 'collarAndSweater', name: 'Kerah & Sweater', price: 45, category: 'clothing' },
  { id: 'blazerAndShirt', name: 'Jas Resmi', price: 50, category: 'clothing' },
  { id: 'blazerAndSweater', name: 'Jas & Sweater', price: 55, category: 'clothing' },

  { id: 'none', name: 'Lepas Aksesoris', price: 0, category: 'accessory' },
  { id: 'round', name: 'Kacamata Bulat', price: 15, category: 'accessory' },
  { id: 'kurt', name: 'Kacamata Kurt', price: 20, category: 'accessory' },
  { id: 'prescription01', name: 'Kacamata Baca 1', price: 20, category: 'accessory' },
  { id: 'prescription02', name: 'Kacamata Baca 2', price: 25, category: 'accessory' },
  { id: 'wayfarers', name: 'Kacamata Hitam', price: 30, category: 'accessory' },
  { id: 'sunglasses', name: 'Sunglasses', price: 35, category: 'accessory' },
  { id: 'eyepatch', name: 'Bajak Laut', price: 50, category: 'accessory' },
];

export default function InventoryPage() {
  const { user, updateUser, isLoading } = useUser();
  const router = useRouter();

  const [previewUser, setPreviewUser] = useState<User | null>(null);
  const [tryingItem, setTryingItem] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
    if (!isLoading && user) setPreviewUser(user);
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="p-10 text-center font-bold text-slate-400">
        Loading Koleksi...
      </div>
    );
  }

  if (!user) return null;

  const ownedItems = SHOP_ITEMS.filter(
    (item) => user.inventory.includes(item.id) || item.price === 0
  );

  const displayUser = tryingItem && previewUser ? previewUser : user;
  const avatarUrl = getCustomAvatarUrl(displayUser);

  const performEquip = async (item: ShopItem) => {
    try {
      const res = await fetch(`${API_URL}/api/store/equip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, itemId: item.id }),
      });
      const data = await res.json();
      if (data.success) {
        const updatedUser: User = { ...user };
        if (item.category === 'hair') updatedUser.equippedHair = item.id;
        if (item.category === 'hairColor') updatedUser.equippedHairColor = item.id;
        if (item.category === 'clothing') updatedUser.equippedClothing = item.id;
        if (item.category === 'accessory') updatedUser.equippedAccessory = item.id;

        updateUser(updatedUser);
        setTryingItem(null);
        setPreviewUser(updatedUser);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTryOn = (item: ShopItem) => {
    setTryingItem(item.id);
    const baseUser = previewUser || user;
    const temp: User = { ...baseUser };

    if (item.category === 'hair') temp.equippedHair = item.id;
    if (item.category === 'hairColor') temp.equippedHairColor = item.id;
    if (item.category === 'clothing') temp.equippedClothing = item.id;
    if (item.category === 'accessory') temp.equippedAccessory = item.id;

    setPreviewUser(temp);
  };

  return (
    <div className="pb-24 min-h-screen bg-slate-50">
      <header className="bg-white p-4 flex items-center justify-between shadow-sm sticky top-0 z-50 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-slate-700">Koleksi Item Fashion</h1>
        </div>
        <div className="bg-joy-yellow/10 px-3 py-1 rounded-full flex items-center gap-1 border border-joy-yellow/20 text-xs font-bold text-joy-orange">
          <Puzzle size={14} />
          <span>{user.puzzlePieces} Puzzle</span>
        </div>
      </header>

      <div className="p-4 space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-slate-50 to-transparent" />
          <div className="w-36 h-36 bg-slate-100 rounded-full p-2 relative z-10 border-4 border-joy-purple">
            <div className="w-full h-full rounded-full overflow-hidden bg-white">
              <img
                src={avatarUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500 text-center max-w-xs">
            Ini adalah tampilan karaktermu saat ini. Pilih item dari koleksi di bawah
            untuk mengganti gaya rambut, warna, baju, atau aksesoris.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
          <h2 className="text-sm font-bold text-slate-600 mb-3">
            Koleksi Milikmu ({ownedItems.length} item)
          </h2>
          {ownedItems.length === 0 ? (
            <p className="text-xs text-slate-400">
              Kamu belum punya item fashion. Beli dulu di Toko menggunakan puzzle ya!
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {ownedItems.map((item) => {
                let isEquipped = false;
                if (item.category === 'hair' && user.equippedHair === item.id) isEquipped = true;
                if (
                  item.category === 'hairColor' &&
                  (user.equippedHairColor || '2c1b18') === item.id
                )
                  isEquipped = true;
                if (item.category === 'clothing' && user.equippedClothing === item.id)
                  isEquipped = true;
                if (item.category === 'accessory' && user.equippedAccessory === item.id)
                  isEquipped = true;

                return (
                  <motion.div
                    key={item.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleTryOn(item)}
                    className={`bg-slate-50 p-3 rounded-2xl border text-left relative overflow-hidden transition-colors ${
                      isEquipped
                        ? 'border-joy-green bg-green-50'
                        : tryingItem === item.id
                        ? 'border-joy-purple bg-purple-50'
                        : 'border-slate-100'
                    }`}
                  >
                    <div className="absolute top-2 right-2">
                      {isEquipped && (
                        <div className="bg-joy-green text-white p-1 rounded-full">
                          <Check size={12} strokeWidth={4} />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                        {item.category === 'hair' && <Scissors size={20} />}
                        {item.category === 'hairColor' && <Palette size={20} />}
                        {item.category === 'clothing' && <Shirt size={20} />}
                        {item.category === 'accessory' && <Glasses size={20} />}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-600">{item.name}</p>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                          {item.category === 'hair' && 'Rambut'}
                          {item.category === 'hairColor' && 'Warna Rambut'}
                          {item.category === 'clothing' && 'Baju'}
                          {item.category === 'accessory' && 'Aksesoris'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        performEquip(item);
                      }}
                      className={`w-full py-1.5 rounded-xl text-[11px] font-bold mt-1 ${
                        isEquipped
                          ? 'bg-green-200 text-green-700 cursor-default'
                          : 'bg-joy-blue text-white hover:bg-blue-600'
                      }`}
                    >
                      {isEquipped ? 'Sedang Dipakai' : 'Pakai Item Ini'}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

