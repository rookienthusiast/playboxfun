'use client';

import { useUser } from '@/context/UserContext';
import { ArrowLeft, Lock, Puzzle, Check, Loader2, X, Frown, PartyPopper } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAvatarSeed } from '@/data/mock';

// Items yang dijual
const AVATAR_ITEMS = [
  { id: 'cat', name: 'Kucing Kampung', price: 0 },
  { id: 'dog', name: 'Anjing Setia', price: 50 },
  { id: 'bear', name: 'Beruang Kuat', price: 100 },
  { id: 'rabbit', name: 'Kelinci Cepat', price: 150 },
  { id: 'fox', name: 'Rubah Cerdik', price: 200 },
];

export default function StorePage() {
  const { user, updateUser } = useUser();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // MODAL STATES
  const [modalData, setModalData] = useState<{
      open: boolean;
      type: 'success' | 'error';
      title: string;
      message: string;
      icon: React.ReactNode;
  }>({ open: false, type: 'success', title: '', message: '', icon: null });

  const closeModal = () => setModalData(prev => ({ ...prev, open: false }));

  // Logic: Beli Avatar
  const handleBuy = async (item: typeof AVATAR_ITEMS[0]) => {
      if (!user) return;
      
      // Pre-check Balance
      if (user.puzzlePieces < item.price) {
          setModalData({
              open: true,
              type: 'error',
              title: 'Uang Kurang!',
              message: 'Puzzle Pieces kamu tidak cukup. Nabung lagi yuk! 💪',
              icon: <div className="text-6xl mb-4">💸</div>
          });
          return;
      }

      setLoadingAction(item.id);

      try {
          const res = await fetch('http://localhost:4000/api/store/buy', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: user.id, avatarId: item.id })
          });
          const data = await res.json();

          if (data.success) {
              updateUser({
                  puzzlePieces: data.newBalance,
                  unlockedAvatars: [...(user.unlockedAvatars || []), item.id]
              });
              setModalData({
                  open: true,
                  type: 'success',
                  title: 'Pembelian Berhasil!',
                  message: `Hore! Kamu sekarang berteman dengan ${item.name}! 🎉`,
                  icon: <div className="text-6xl mb-4">🥳</div>
              });
          } else {
              setModalData({
                  open: true,
                  type: 'error',
                  title: 'Gagal Beli',
                  message: data.error,
                  icon: <Frown size={60} className="text-joy-red mx-auto mb-4" />
              });
          }
      } catch (err) {
          console.error(err);
      } finally {
          setLoadingAction(null);
      }
  };

  // Logic: Pakai Avatar
  const handleEquip = async (itemId: string) => {
      if (!user) return;
      setLoadingAction(itemId);

      try {
          const res = await fetch('http://localhost:4000/api/store/equip', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: user.id, avatarId: itemId })
          });
          const data = await res.json();

          if (data.success) {
               updateUser({ currentAvatar: itemId });
               // Optional: Show small toast or just update UI
          } else {
              alert(data.error);
          }
      } catch (err) {
          console.error(err);
      } finally {
          setLoadingAction(null);
      }
  };

  if (!user) return <div className="p-10 text-center">Loading Toko...</div>;

  return (
    <div className="pb-24 min-h-screen bg-slate-50 relative">
      
      {/* MODAL COMPONENT */}
      <AnimatePresence>
        {modalData.open && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                onClick={closeModal}
            >
                <motion.div 
                    initial={{ scale: 0.5, y: 100 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.5, y: 100 }}
                    className="bg-white rounded-[40px] p-8 text-center shadow-2xl relative overflow-hidden max-w-sm w-full"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="absolute inset-0 bg-slate-50/50 z-0"></div>

                    <div className="relative z-10">
                        {modalData.icon}
                        
                        <h2 className={`text-2xl font-black mb-2 ${modalData.type === 'success' ? 'text-joy-green' : 'text-joy-red'}`}>
                            {modalData.title}
                        </h2>
                        <p className="text-slate-500 font-medium mb-6">
                            {modalData.message}
                        </p>

                        <button 
                            onClick={closeModal}
                            className={`w-full text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:scale-105 transition-transform ${modalData.type === 'success' ? 'bg-joy-green shadow-green-200' : 'bg-joy-red shadow-red-200'}`}
                        >
                            {modalData.type === 'success' ? 'Keren!' : 'Coba Lagi'}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

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
            <span className="font-bold text-joy-orange">{user.puzzlePieces || 0}</span>
        </div>
      </header>

      {/* ITEMS GRID */}
      <div className="p-6 grid grid-cols-2 gap-4">
        {AVATAR_ITEMS.map((item) => {
            const myAvatars = user.unlockedAvatars || [];
            const isUnlocked = myAvatars.includes(item.id);
            const isEquipped = user.currentAvatar === item.id;
            const isLoading = loadingAction === item.id;

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

                    <div className={`w-20 h-20 rounded-full bg-slate-50 overflow-hidden ${!isUnlocked && 'grayscale opacity-50'}`}>
                         <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${getAvatarSeed(item.id, 0)}`} alt={item.name} />
                    </div>

                    <div className="text-center w-full">
                        <h3 className="font-bold text-slate-700 text-sm truncate">{item.name}</h3>
                        
                        {!isUnlocked ? (
                            <button 
                                onClick={() => handleBuy(item)}
                                disabled={isLoading}
                                className="mt-3 w-full bg-joy-orange text-white text-xs font-bold py-2 rounded-xl shadow-md border-b-4 border-orange-600 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-1 disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={12}/> : <><Puzzle size={12} fill="currentColor" /> {item.price}</>}
                            </button>
                        ) : isEquipped ? (
                            <div className="mt-3 text-xs font-bold text-joy-green py-2 bg-green-50 rounded-xl">Sedang Dipakai</div>
                        ) : (
                            <button 
                                onClick={() => handleEquip(item.id)}
                                disabled={isLoading}
                                className="mt-3 w-full bg-slate-100 text-slate-500 hover:bg-joy-blue hover:text-white text-xs font-bold py-2 rounded-xl transition-colors flex items-center justify-center"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={12}/> : 'Pakai'}
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
