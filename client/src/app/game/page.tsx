'use client';

import { getAvatarSeed } from '@/data/mock';
import { ArrowLeft, Gift, Star, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GamePage() {
  const { user, updateUser } = useUser(); 
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // MODAL STATE
  const [mysteryBoxOpen, setMysteryBoxOpen] = useState(false); // Modal visible?
  const [chestOpened, setChestOpened] = useState(false); // Chest animation state

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  if (!user) return null;
  
  // Game Configuration
  const STEP_VALUE = 50000;
  const TOTAL_STEPS = 100;   
  const CURRENT_STEP = Math.min(Math.floor(user.balance / STEP_VALUE), TOTAL_STEPS);
  const MYSTERY_BOXES = [5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 90, 100];
  const avatarSeed = getAvatarSeed(user.currentAvatar || user.avatarId, user.balance);

  const handleSimulateSaving = async () => {
    if(!user.cardUid) {
        alert("Mode Guest tidak bisa simulasi IoT. Login pakai kartu.");
        return;
    }
    
    setLoading(true);
    try {
        const amount = 50000; 

        const res = await fetch('http://localhost:4000/api/iot/money-in', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                uid: user.cardUid, 
                amount_rp: amount,
                deviceId: "SIMULATOR-WEB"
            })
        });

        const data = await res.json();
        
        if (res.ok) {
            const newBalance = user.balance + amount;
            const oldStep = Math.floor(user.balance / STEP_VALUE);
            const newStep = Math.floor(newBalance / STEP_VALUE);
            
            // Trigger Mystery Box Modal
            if(newStep > oldStep && MYSTERY_BOXES.includes(newStep)) {
                setChestOpened(false); // Reset animation
                setMysteryBoxOpen(true);
            }
            
            updateUser({ 
                balance: newBalance,
                xp: user.xp + (amount/1000), 
                puzzlePieces: user.puzzlePieces + 1 
            });

        } else {
            alert("Error: " + data.error);
        }

    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const handleReset = () => {
      alert("Fitur Reset dimatikan.");
  };

  // Generate Board Grid
  const rows = [];
  const cols = 5;
  for (let i = 0; i < TOTAL_STEPS; i += cols) {
    const rowItems = Array.from({ length: cols }, (_, j) => i + j + 1).filter(n => n <= TOTAL_STEPS);
    if (Math.floor(i / cols) % 2 !== 0) rowItems.reverse(); 
    rows.push(rowItems);
  }
  rows.reverse();

  return (
    <div className="pb-24 min-h-screen bg-joy-blue relative overflow-hidden">
      
      {/* MYSTERY BOX MODAL */}
      <AnimatePresence>
        {mysteryBoxOpen && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                onClick={() => { if(chestOpened) setMysteryBoxOpen(false) }}
            >
                <motion.div 
                    initial={{ scale: 0.5, y: 100 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.5, y: 100 }}
                    className="bg-white rounded-[40px] p-8 text-center shadow-2xl relative overflow-hidden max-w-sm w-full"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                        onClick={() => setMysteryBoxOpen(false)}
                        className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-400 hover:bg-slate-200"
                    >
                        <X size={20} />
                    </button>

                    <h2 className="text-2xl font-black text-joy-purple mb-6">MISTERI TERUNGKAP!</h2>
                    
                    <div className="flex justify-center mb-8 relative h-40 items-center">
                        {/* THE CHEST */}
                        <motion.div
                            whileTap={!chestOpened ? { scale: 0.9 } : {}}
                            onClick={() => setChestOpened(true)}
                            animate={chestOpened ? { y: 20, opacity: 0 } : { rotate: [0, -5, 5, 0] }}
                            transition={{ duration: 0.5, repeat: chestOpened ? 0 : Infinity, repeatDelay: 1 }}
                            className={`cursor-pointer absolute z-20 ${chestOpened ? 'pointer-events-none' : ''}`}
                        >
                            <div className="text-6xl text-center">🎁</div>
                            <p className="text-xs font-bold text-slate-400 mt-2 bg-slate-100 px-3 py-1 rounded-full">Ketuk Aku!</p>
                        </motion.div>

                        {/* THE REWARD (Hidden behind chest initially) */}
                        {chestOpened && (
                            <motion.div
                                initial={{ scale: 0, y: 20 }}
                                animate={{ scale: 1.5, y: 0, rotate: 360 }}
                                transition={{ type: "spring", bounce: 0.6 }}
                                className="z-10 text-center"
                            >
                                <div className="text-6xl drop-shadow-md">🧩</div>
                                <div className="mt-4 bg-joy-yellow px-4 py-2 rounded-xl font-bold text-joy-orange shadow-sm border border-orange-200">
                                    +2 Puzzle
                                </div>
                            </motion.div>
                        )}
                        
                        {/* Confetti BG */}
                        {chestOpened && <div className="absolute inset-0 bg-joy-yellow/20 rounded-full blur-xl animate-pulse z-0"></div>}
                    </div>

                    <p className="text-slate-500 font-bold mb-6">
                        {chestOpened ? "Hore! Kamu dapat bonus Puzzle!" : "Ada hadiah spesial buat kamu..."}
                    </p>
                    
                    {chestOpened && (
                        <motion.button 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => setMysteryBoxOpen(false)}
                            className="w-full bg-joy-purple text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-purple-200 hover:scale-105 transition-transform"
                        >
                            Ambil Hadiah
                        </motion.button>
                    )}
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-10 left-10 text-white/20"><Star size={40} /></div>
      <div className="absolute top-40 right-10 text-white/10"><Star size={60} /></div>
      <div className="absolute bottom-0 w-full h-32 bg-joy-green rounded-t-[50px] z-0" />

      {/* HEADER */}
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

      {/* SIMULATION CONTROLS */}
      <div className="bg-white/10 backdrop-blur-md p-2 mx-4 rounded-xl flex gap-2 justify-center mb-4 border border-white/20">
          <button 
            onClick={handleSimulateSaving} 
            disabled={loading}
            className="bg-joy-green text-white text-xs font-bold px-3 py-2 rounded-lg shadow-sm active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={12}/>}
            + Rp 50rb (Jalan)
          </button>
      </div>

      {/* THE BOARD GAME */}
      <div className="relative z-10 px-4 py-4 flex flex-col gap-4 pb-40">
        {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-between relative">
                {row.map((stepNumber) => {
                    const isReached = stepNumber <= CURRENT_STEP;
                    const isCurrent = stepNumber === CURRENT_STEP;
                    const hasBox = MYSTERY_BOXES.includes(stepNumber);

                    return (
                        <div key={stepNumber} className="relative w-1/5 flex justify-center h-20 items-center">
                            <motion.div 
                                initial={false}
                                animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className={`
                                    w-14 h-14 rounded-2xl flex items-center justify-center border-b-4 shadow-sm relative z-10
                                    ${isCurrent 
                                        ? 'bg-joy-orange border-orange-700 text-white transform -translate-y-2' 
                                        : isReached 
                                            ? 'bg-joy-yellow border-yellow-600 text-yellow-800' 
                                            : 'bg-white/10 border-white/10 text-white/30'
                                    }
                                `}
                            >
                                {isCurrent ? (
                                    <div className="w-10 h-10 bg-white rounded-full overflow-hidden border-2 border-white">
                                         <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`} alt="You" />
                                    </div>
                                ) : hasBox ? (
                                    <Gift size={24} className={isReached ? "text-joy-purple" : "text-white/50"} />
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
