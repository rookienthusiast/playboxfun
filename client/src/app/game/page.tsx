'use client';

import { MOCK_USER, formatCurrency, getAvatarSeed } from '@/data/mock';
import { ArrowLeft, Gift, Lock, Star, ChevronDown, Trophy } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GamePage() {
  const { user, updateUser } = useUser(); // Need updateUser from context
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  if (!user) return null;
  
  // Game Configuration
  const STEP_VALUE = 50000; // 1 Langkah = 50rb
  const TOTAL_STEPS = 100;   
  const CURRENT_STEP = Math.min(Math.floor(user.balance / STEP_VALUE), TOTAL_STEPS);
  
  // Mystery Box Locations (Every 5 steps approx)
  const MYSTERY_BOXES = [5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 90, 100];
  const avatarSeed = getAvatarSeed(user.avatarId, user.balance);

  // SIMULATION: Add Money
  const handleSimulateSaving = () => {
      const amount = 50000; // 1 Step worth
      const newBalance = user.balance + amount;
      const newXP = user.xp + 50; 
      
      // Check if passing a mystery box
      const oldStep = Math.floor(user.balance / STEP_VALUE);
      const newStep = Math.floor(newBalance / STEP_VALUE);
      
      if(newStep > oldStep && MYSTERY_BOXES.includes(newStep)) {
          alert(`🎉 SELAMAT! Kamu sampai di langkah ${newStep} dan menemukan KOTAK MISTERIUS! 🎁\nIsinya: 2 Puzzle Pieces`);
          updateUser({ 
              balance: newBalance, 
              xp: newXP, 
              puzzlePieces: user.puzzlePieces + 2 
          });
      } else {
          updateUser({ balance: newBalance, xp: newXP });
      }
  };

  const handleReset = () => {
      updateUser({ balance: 0, xp: 0, puzzlePieces: 0 });
  };

  // Generate Board Grid (Zigzag)
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

  return (
    <div className="pb-24 min-h-screen bg-joy-blue relative overflow-hidden">
      
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

      {/* SIMULATION CONTROLS (Demo Purpose) */}
      <div className="bg-white/10 backdrop-blur-md p-2 mx-4 rounded-xl flex gap-2 justify-center mb-4 border border-white/20">
          <button onClick={handleSimulateSaving} className="bg-joy-green text-white text-xs font-bold px-3 py-2 rounded-lg shadow-sm active:scale-95">
            + Rp 50rb (Jalan)
          </button>
          <button onClick={handleReset} className="bg-joy-red text-white text-xs font-bold px-3 py-2 rounded-lg shadow-sm active:scale-95">
            Reset 0
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
                            
                            {/* Connector Line Logic (Simplified visual) */}
                            {/* You might use SVG lines for perfect connectors, but CSS borders work for 'good enough' */}
                            
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

        {/* Start Label */}
        <div className="text-center">
             <div className="inline-block text-white/80 font-bold text-sm bg-white/10 px-6 py-2 rounded-full border border-white/20">
                START PERJALANAN 🏁
            </div>
        </div>

      </div>
    </div>
  );
}
