'use client';

import { getCustomAvatarUrl } from '@/data/mock';
import { ArrowLeft, Gift, Star, Check, Lock, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/config';

export default function GamePage() {
  const { user, updateUser, isLoading } = useUser(); 
  const router = useRouter();
  
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [user, isLoading, router]);

  if (isLoading) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
              <Loader2 className="animate-spin text-joy-blue" size={48} />
              <p className="text-joy-blue font-bold animate-pulse">Menyiapkan Papan Permainan...</p>
          </div>
      );
  }

  if (!user) return null;
   
  const STEP_VALUE = 10000;
  const TOTAL_STEPS = 100;   
  const CURRENT_STEP = Math.min(Math.floor(user.balance / STEP_VALUE), TOTAL_STEPS);
  
  const MYSTERY_BOXES = [5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 90, 100];

  const claimedBoxList = user.claimedBoxes 
    ? user.claimedBoxes.split(',').map(s => parseInt(s)).filter(n => !isNaN(n))
    : [];

  const handleBoxClick = (step: number) => {
      if (CURRENT_STEP >= step && !claimedBoxList.includes(step)) {
          setSelectedBox(step);
          setClaimSuccess(false);
      }
  };

  const handleClaimReward = async () => {
      if (!selectedBox || !user.id) return;
      setIsClaiming(true);

      try {
          const res = await fetch(`${API_URL}/api/game/claim`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: user.id, step: selectedBox })
          });
          const data = await res.json();

          if (data.success) {
              setClaimSuccess(true);
              updateUser({
                  puzzlePieces: data.puzzlePieces,
                  claimedBoxes: data.claimedBoxes
              });
              setTimeout(() => {
                  setSelectedBox(null);
                  setClaimSuccess(false);
              }, 2000);
          } else {
              alert(data.error);
              setSelectedBox(null);
          }
      } catch (err) {
          alert("Gagal klaim hadiah");
      } finally {
          setIsClaiming(false);
      }
  };

  const rows = [];
  const cols = 5;
  for (let i = 0; i < TOTAL_STEPS; i += cols) {
    const rowItems = Array.from({ length: cols }, (_, j) => i + j + 1).filter(n => n <= TOTAL_STEPS);
    if (Math.floor(i / cols) % 2 !== 0) {
        rowItems.reverse(); 
    }
    rows.push(rowItems);
  }
  rows.reverse();

  const avatarUrl = user ? getCustomAvatarUrl(user) : '';

  return (
    <div className="pb-24 min-h-screen bg-joy-blue relative overflow-hidden">
      
      <AnimatePresence>
        {selectedBox && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                onClick={() => !isClaiming && setSelectedBox(null)}
            >
                <motion.div 
                    initial={{ scale: 0.5, y: 100 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.5, y: 100 }}
                    className="bg-white rounded-[40px] p-8 text-center shadow-2xl relative overflow-hidden max-w-sm w-full"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                        onClick={() => setSelectedBox(null)}
                        className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-400 hover:bg-slate-200"
                        disabled={isClaiming}
                    >
                        <X size={20} />
                    </button>

                    <h2 className="text-2xl font-black text-joy-purple mb-6">KOTAK MISTERI!</h2>
                    
                    <div className="flex justify-center mb-8 relative h-40 items-center">
                        <motion.div
                            animate={claimSuccess ? { scale: 1.5, rotate: 360, opacity: 0 } : { rotate: [0, -5, 5, 0] }}
                            transition={{ duration: 0.5, repeat: claimSuccess ? 0 : Infinity, repeatDelay: 1 }}
                            className="absolute z-20 text-6xl"
                        >
                            🎁
                        </motion.div>

                        {claimSuccess && (
                            <motion.div
                                initial={{ scale: 0, y: 20 }}
                                animate={{ scale: 1.5, y: 0 }}
                                className="z-10 text-center"
                            >
                                <div className="text-6xl drop-shadow-md">🧩</div>
                                <div className="mt-4 bg-joy-yellow px-4 py-2 rounded-xl font-bold text-joy-orange shadow-sm border border-orange-200">
                                    +2 Puzzle
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <p className="text-slate-500 font-bold mb-6">
                        {claimSuccess ? "Selamat! Hadiah berhasil diambil!" : `Kamu menemukan kotak di langkah ${selectedBox}! Buka sekarang?`}
                    </p>
                    
                    {!claimSuccess && (
                        <motion.button 
                            whileTap={{ scale: 0.95 }}
                            onClick={handleClaimReward}
                            disabled={isClaiming}
                            className="w-full bg-joy-purple text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-purple-200 hover:scale-105 transition-transform flex justify-center items-center gap-2"
                        >
                            {isClaiming ? <Loader2 className="animate-spin" /> : "Buka Kotak"}
                        </motion.button>
                    )}
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-10 left-10 text-white/20"><Star size={40} /></div>
      <div className="absolute top-40 right-10 text-white/10"><Star size={60} /></div>
      <div className="absolute bottom-0 w-full h-32 bg-joy-green rounded-t-[50px] z-0" />

      <header className="p-4 flex items-center justify-between sticky top-0 z-50">
        <Link href="/">
           <button className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors text-white">
             <ArrowLeft size={24} />
           </button>
        </Link>
        <div className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-white font-bold text-sm border border-white/30">
            Langkah: {CURRENT_STEP} / {TOTAL_STEPS}
        </div>
      </header>

      <div className="relative z-10 px-4 py-4 flex flex-col gap-4 pb-40 mt-4">
        
        {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-between relative">
                {row.map((stepNumber) => {
                    const isReached = stepNumber <= CURRENT_STEP;
                    const isCurrent = stepNumber === CURRENT_STEP;
                    const hasBox = MYSTERY_BOXES.includes(stepNumber);
                    
                    const isBoxClaimed = claimedBoxList.includes(stepNumber);
                    const canClaimBox = hasBox && isReached && !isBoxClaimed;

                    return (
                        <div key={stepNumber} className="relative w-1/5 flex justify-center h-20 items-center">
                            
                            <motion.div 
                                initial={false}
                                animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                                transition={{ repeat: Infinity, duration: 2 }}
                                onClick={() => canClaimBox && handleBoxClick(stepNumber)}
                                className={`
                                    w-14 h-14 rounded-2xl flex items-center justify-center border-b-4 shadow-sm relative z-10 transition-transform
                                    ${isCurrent 
                                        ? 'bg-joy-orange border-orange-700 text-white transform -translate-y-2' 
                                        : isReached 
                                            ? 'bg-joy-yellow border-yellow-600 text-yellow-800' 
                                            : 'bg-white/10 border-white/10 text-white/30'
                                    }
                                    ${canClaimBox ? 'cursor-pointer hover:scale-110 ring-4 ring-white ring-opacity-50 animate-bounce' : ''}
                                `}
                            >
                                {isCurrent ? (
                                    <div className="w-10 h-10 bg-white rounded-full overflow-hidden border-2 border-white">
                                         <img src={avatarUrl} alt="You" referrerPolicy="no-referrer" />
                                    </div>
                                ) : hasBox ? (
                                    <div className="relative">
                                        {isBoxClaimed ? (
                                            <div className="text-joy-green bg-white/50 rounded-full p-1"><Check size={20} strokeWidth={4} /></div>
                                        ) : isReached ? (
                                            <Gift size={24} className="text-joy-purple animate-pulse" />
                                        ) : (
                                            <Lock size={20} className="text-white/30" />
                                        )}
                                    </div>
                                ) : (
                                    <span className="font-bold text-lg">{stepNumber}</span>
                                )}
                            </motion.div>
                        </div>
                    );
                })}
            </div>
        ))}

        <div className="text-center">
             <div className="inline-block text-white/80 font-bold text-sm bg-white/10 px-6 py-2 rounded-full border border-white/20">
                START PERJALANAN 🏁
            </div>
        </div>

      </div>
    </div>
  );
}
