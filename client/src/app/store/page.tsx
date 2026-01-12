'use client';

import { useUser } from '@/context/UserContext';
import { ArrowLeft, Check, Lock, ShoppingBag, Info, Shirt, Scissors, Glasses, Palette } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCustomAvatarUrl, formatCurrency, User } from '@/data/mock';
import { API_URL } from '@/config';


interface ShopItem {
    id: string;
    name: string;
    price: number;
    category: 'hair' | 'clothing' | 'accessory' | 'hairColor';
    icon?: any;
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

export default function StorePage() {
  const { user, updateUser, isLoading } = useUser();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'hair' | 'clothing' | 'accessory' | 'hairColor'>('hair');
  const [tryingItem, setTryingItem] = useState<string | null>(null);
  const [previewUser, setPreviewUser] = useState<User | null>(null);

  const [itemToBuy, setItemToBuy] = useState<ShopItem | null>(null);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
     if (!isLoading && !user) router.push('/login');
     if (!isLoading && user) setPreviewUser(user);
  }, [user, isLoading, router]);
  
  if (isLoading) return <div className="p-10 text-center font-bold text-slate-400">Loading Store...</div>;
  if (!user) return null;
  
  const currentItems = SHOP_ITEMS.filter(item => item.category === activeTab);

  const handleTryOn = (item: ShopItem) => {
      setTryingItem(item.id);
      
      const baseUser = previewUser || user;
      const temp = { ...baseUser };
      
      if (item.category === 'hair') temp.equippedHair = item.id;
      if (item.category === 'hairColor') temp.equippedHairColor = item.id;
      if (item.category === 'clothing') temp.equippedClothing = item.id;
      if (item.category === 'accessory') temp.equippedAccessory = item.id;
      
      setPreviewUser(temp);
  };

  const performEquip = async (item: ShopItem) => {
      try {
         const res = await fetch(`${API_URL}/api/store/equip`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ userId: user.id, itemId: item.id })
         });
         const data = await res.json();
         if (data.success) {
              const updatedUser = { ...user };
              if (item.category === 'hair') updatedUser.equippedHair = item.id;
              if (item.category === 'hairColor') updatedUser.equippedHairColor = item.id;
              if (item.category === 'clothing') updatedUser.equippedClothing = item.id;
              if (item.category === 'accessory') updatedUser.equippedAccessory = item.id;
              
              updateUser(updatedUser);
              setTryingItem(null); 
         }
      } catch (e) {
          console.error(e);
      }
  };

  const initiateBuy = (item: ShopItem) => {
      if (user.puzzlePieces < item.price) {
          setShowError(true);
      } else {
          setItemToBuy(item);
      }
  };

  const confirmPurchase = async () => {
      if (!itemToBuy) return;
      try {
          const res = await fetch(`${API_URL}/api/store/buy`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: user.id, itemId: itemToBuy.id })
          });
          const data = await res.json();
          if (data.success) {
              updateUser(data.user);
              
              performEquip(itemToBuy); 
              setItemToBuy(null);
          } else {
              alert(data.error);
          }
      } catch (e) {
          console.error(e);
      }
  };

  const handleAction = (item: ShopItem) => {
       const isOwned = user.inventory.includes(item.id) || item.price === 0;
       if (isOwned) {
           performEquip(item);
       } else {
           initiateBuy(item);
       }
  };

 const displayUser = tryingItem && previewUser ? previewUser : user;
 const avatarUrl = getCustomAvatarUrl(displayUser);

  return (
    <div className="pb-24 min-h-screen bg-slate-50">
      
      <header className="bg-white p-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
            <Link href="/">
                <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                    <ArrowLeft size={24} />
                </button>
            </Link>
            <h1 className="text-xl font-bold text-slate-700">Fashion Store</h1>
        </div>
        <div className="bg-joy-yellow/10 px-4 py-2 rounded-full flex items-center gap-2 border border-joy-yellow/20">
             <div className="text-joy-orange"><ShoppingBag size={18} /></div>
             <span className="font-bold text-joy-orange">{user.puzzlePieces} Puzzle</span>
        </div>
      </header>

      <div className="p-4 space-y-6">
        
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-slate-50 to-transparent" />
             
             <div className="w-40 h-40 bg-slate-100 rounded-full p-2 relative z-10 border-4 border-joy-purple">
                 <div className="w-full h-full rounded-full overflow-hidden bg-white">
                      <img 
                        src={avatarUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                 </div>
             </div>
        </div>

        <div className="flex justify-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            {[
                { id: 'hair', icon: Scissors, label: 'Rambut' },
                { id: 'hairColor', icon: Palette, label: 'Warna' },
                { id: 'clothing', icon: Shirt, label: 'Baju' },
                { id: 'accessory', icon: Glasses, label: 'Aksesoris' }
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id as any); setTryingItem(null); setPreviewUser(user); }}
                    className={`flex-1 py-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                        activeTab === tab.id 
                        ? 'bg-joy-purple text-white shadow-md' 
                        : 'text-slate-400 hover:bg-slate-50'
                    }`}
                >
                    <tab.icon size={20} />
                    <span className="text-xs font-bold">{tab.label}</span>
                </button>
            ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
            {currentItems.map((item) => {
                const isOwned = user.inventory.includes(item.id) || item.price === 0;
                
                let isEquipped = false;
                if (item.category === 'hair' && user.equippedHair === item.id) isEquipped = true;
                if (item.category === 'hairColor' && (user.equippedHairColor || '2c1b18') === item.id) isEquipped = true;
                if (item.category === 'clothing' && user.equippedClothing === item.id) isEquipped = true;
                if (item.category === 'accessory' && user.equippedAccessory === item.id) isEquipped = true;

                return (
                    <motion.div 
                        key={item.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleTryOn(item)}
                        className={`bg-white p-4 rounded-2xl border-2 cursor-pointer relative overflow-hidden transition-colors ${
                            isEquipped ? 'border-joy-green bg-green-50' : 
                            activeTab === item.category && tryingItem === item.id ? 'border-joy-purple bg-purple-50' : 'border-slate-100'
                        }`}
                    >
                        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                            {isEquipped && <div className="bg-joy-green text-white p-1 rounded-full"><Check size={12} strokeWidth={4}/></div>}
                            {!isOwned && <div className="bg-slate-200 text-slate-400 p-1 rounded-full"><Lock size={12} /></div>}
                        </div>

                        <div className="flex justify-center mb-4 mt-2">
                             {item.category === 'hairColor' ? (
                                 <div className="w-12 h-12 rounded-full shadow-inner border-2 border-white ring-2 ring-slate-100" style={{ backgroundColor: `#${item.id}` }} />
                             ) : (
                                 <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">                                      {/* Placeholder Icon */}
                                       {item.category === 'hair' && <Scissors size={24} />}
                                       {item.category === 'clothing' && <Shirt size={24} />}
                                       {item.category === 'accessory' && <Glasses size={24} />}
                                 </div>
                             )}
                        </div>

                        {/* Item Name & Price */}
                        <div className="text-center">
                            <h3 className="font-bold text-slate-700 text-sm mb-2">{item.name}</h3>
                            
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleAction(item); }}
                                className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors ${
                                    isEquipped 
                                        ? 'bg-green-200 text-green-700 cursor-default'
                                        : isOwned 
                                            ? 'bg-joy-blue text-white hover:bg-blue-600'
                                            : 'bg-joy-orange text-white hover:bg-orange-600'
                                }`}
                            >
                                {isEquipped ? 'Dipakai' : isOwned ? 'Pakai' : (
                                    <>
                                        Beli <span className="bg-white/20 px-1 rounded">{item.price} 🧩</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                );
            })}
        </div>

        {/* MODAL CONFIRM BUY */}
        <AnimatePresence>
            {itemToBuy && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => setItemToBuy(null)}
                >
                    <motion.div 
                        initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 50 }}
                        className="bg-white w-full max-w-sm rounded-[32px] p-6 text-center shadow-2xl relative overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-20 h-20 bg-joy-orange/20 rounded-full mx-auto flex items-center justify-center mb-4 text-joy-orange">
                            <ShoppingBag size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Beli Item Ini?</h3>
                        <p className="text-slate-500 mb-6 font-medium">
                            Kamu akan membeli <strong className="text-joy-purple">{itemToBuy.name}</strong> seharga <strong className="text-joy-orange">{itemToBuy.price} Puzzle</strong>.
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setItemToBuy(null)}
                                className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-200"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={confirmPurchase}
                                className="flex-1 py-3 bg-joy-orange text-white rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-200"
                            >
                                Ya, Beli!
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* MODAL ERROR BALANCE */}
        <AnimatePresence>
            {showError && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => setShowError(false)}
                >
                    <motion.div 
                        initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 50 }}
                        className="bg-white w-full max-w-sm rounded-[32px] p-6 text-center shadow-2xl relative overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-20 h-20 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4 text-red-500">
                            <Lock size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Oops! Puzzle Kurang</h3>
                        <p className="text-slate-500 mb-6 font-medium">
                            Puzzle kamu gak cukup buat beli item ini. Main game lagi yuk buat ngumpulin puzzle!
                        </p>
                        <button 
                            onClick={() => setShowError(false)}
                            className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200"
                        >
                            Oke, Mengerti
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

      </div>
    </div>
  );
}
