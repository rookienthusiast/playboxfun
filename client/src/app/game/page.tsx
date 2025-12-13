'use client';

import { MOCK_USER, formatCurrency } from '@/data/mock';
import { ArrowLeft, Gift, Lock, Star } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function GamePage() {
  const user = MOCK_USER;
  
  // Game Configuration
  const STEP_VALUE = 50000; // Value of 1 step in IDR
  const TOTAL_STEPS = 20;   // Length of current board
  const CURRENT_STEP = Math.min(Math.floor(user.balance / STEP_VALUE), TOTAL_STEPS);
  
  // Define rewards position
  const REWARDS = [
      { step: 5, type: 'puzzle', amount: 1 },
      { step: 10, type: 'coin', amount: 500 },
      { step: 15, type: 'puzzle', amount: 2 },
      { step: 20, type: 'chest', amount: 1 }, // Grand Prize
  ];

  const getRewardAtStep = (step: number) => REWARDS.find(r => r.step === step);

  return (
    <div className="pb-24 min-h-screen bg-joy-blue relative overflow-hidden">
      
      {/* BACKGROUND DECORATION (Clouds & Grass) */}
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
            Langkah: {CURRENT_STEP}/{TOTAL_STEPS}
        </div>
      </header>

      {/* THE BOARD GAME */}
      <div className="relative z-10 px-6 py-8 flex flex-col-reverse items-center justify-center gap-6 pb-40">
        
        {/* Render Steps in Reverse (Start from bottom) */}
        {Array.from({ length: TOTAL_STEPS + 1 }).map((_, index) => {
            const stepNumber = index; // 0 is Start
            const isReached = stepNumber <= CURRENT_STEP;
            const isCurrent = stepNumber === CURRENT_STEP;
            const reward = getRewardAtStep(stepNumber);

            // Snake Layout Logic
            // Even rows go Right, Odd rows go Left (we simulate this with CSS translation for visual variety)
            const xOffset = stepNumber % 2 === 0 ? 0 : 40; 
            
            return (
                <div key={stepNumber} className="relative w-full flex justify-center">
                    
                    {/* Path Connector Line (Vertical Dotted) */}
                    {stepNumber < TOTAL_STEPS && (
                        <div className={`absolute bottom-full mb-[-20px] w-2 h-16 border-l-4 border-dotted ${isReached ? 'border-white/80' : 'border-white/30'} z-0`} />
                    )}

                    {/* The Step Node */}
                    <div className="relative">
                        <motion.div 
                            initial={false}
                            animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className={`
                                w-16 h-16 rounded-full flex items-center justify-center border-4 shadow-[0_8px_0_rgb(0,0,0,0.2)]
                                ${isCurrent 
                                    ? 'bg-joy-orange border-white z-20 scale-110' 
                                    : isReached 
                                        ? 'bg-joy-yellow border-white/50 text-joy-orange' 
                                        : 'bg-white/20 border-white/20 text-white/50'
                                }
                            `}
                        >
                            {/* If Current Position: Show Avatar */}
                            {isCurrent ? (
                                <div className="w-12 h-12 bg-white rounded-full overflow-hidden">
                                     <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user.avatarId}`} alt="You" />
                                </div>
                            ) : reward ? (
                                // Reward Icon
                                <div className="animate-bounce">
                                    <Gift size={24} className={isReached ? "text-joy-purple" : "text-white/50"} />
                                </div>
                            ) : (
                                // Regular Step Number
                                <span className="font-bold text-lg">{stepNumber}</span>
                            )}
                        </motion.div>

                        {/* Speech Bubble for Current Position */}
                        {isCurrent && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute -right-24 top-0 bg-white px-3 py-2 rounded-xl rounded-tl-none shadow-lg text-xs font-bold text-slate-600 w-24 text-center z-30"
                            >
                                Kamu di sini!
                                <br />
                                <span className="text-joy-orange">{formatCurrency(user.balance)}</span>
                            </motion.div>
                        )}
                    </div>
                </div>
            );
        })}

        {/* Start Label */}
        <div className="text-white/80 font-bold text-sm bg-white/10 px-4 py-1 rounded-full">
            START 🏁
        </div>

      </div>
    </div>
  );
}
