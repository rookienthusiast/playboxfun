'use client';

import { getCurrentTitle, formatCurrency, TITLES, getCustomAvatarUrl, getEvolutionName, calculateLevel } from '@/data/mock';
import { Star, Gamepad2, Store, Puzzle, Info, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const { user, isLoggedIn } = useUser();
  const router = useRouter();
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showXPInfo, setShowXPInfo] = useState(false);

  const xpForNextLevel = 100;
  const currentLevelProgress = user ? user.xp % xpForNextLevel : 0;
  const userLevel = user ? calculateLevel(user.xp) : 1;
  const currentTitle = user ? getCurrentTitle(user.balance) : TITLES[0];

  useEffect(() => {
    if (!isLoggedIn) {
        router.push('/login');
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (user) {
        const storedLevel = parseInt(localStorage.getItem('last_seen_level') || '0');
        
        if (storedLevel === 0) {
            localStorage.setItem('last_seen_level', userLevel.toString());
            return;
        }

        if (userLevel > storedLevel) {
            setShowLevelUp(true);
            localStorage.setItem('last_seen_level', userLevel.toString());
        } else {
             localStorage.setItem('last_seen_level', userLevel.toString());
        }
    }
  }, [userLevel, user]);
  
  if (!user) return null;

  const nextTitle = TITLES.find(t => t.minBalance > user.balance);
  const avatarUrl = getCustomAvatarUrl(user);
  const evolutionName = getEvolutionName(user.balance);
  
  return (
    <div className="pb-32 relative">
      
      <AnimatePresence>
        {showLevelUp && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                onClick={() => setShowLevelUp(false)}
            >
                <motion.div 
                    initial={{ scale: 0.5, y: 100 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.5, y: 100 }}
                    className="bg-white rounded-[40px] p-8 text-center shadow-2xl relative overflow-hidden max-w-sm w-full"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="absolute inset-0 bg-joy-yellow/10 z-0"></div>
                    
                    <motion.div 
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-24 h-24 bg-gradient-to-tr from-joy-orange to-joy-yellow rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg relative z-10"
                    >
                        <Star size={40} className="text-white" fill="white" />
                    </motion.div>

                    <h2 className="text-3xl font-black text-joy-blue relative z-10">LEVEL UP!</h2>
                    <p className="text-slate-500 font-bold mb-6 relative z-10">Selamat! Kamu naik ke Level {userLevel}.</p>
                    
                    <button 
                        onClick={() => setShowLevelUp(false)}
                        className="bg-joy-blue text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-200 hover:scale-105 transition-transform relative z-10"
                    >
                        Keren! 😎
                    </button>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      <header className="bg-joy-blue p-6 rounded-b-[40px] shadow-lg relative z-10 text-white overflow-hidden pb-12">
         <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
         <div className="absolute top-10 -left-10 w-24 h-24 bg-white/10 rounded-full" />

         <div className="flex items-center gap-4">
            <Link href="/profile">
                <div className="w-14 h-14 bg-white rounded-full p-1 shadow-md border-4 border-joy-yellow cursor-pointer hover:scale-105 transition-transform">
                    <div className="w-full h-full bg-slate-200 rounded-full overflow-hidden">
                        <img src={avatarUrl} alt="Avatar" referrerPolicy="no-referrer" />
                    </div>
                </div>
            </Link>
            <div>
                <h1 className="text-xl font-bold">Halo, {user.name}! 👋</h1>
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-sm mt-1 bg-white/20 backdrop-blur-sm border border-white/30`}>
                    <Sparkles size={12} className="text-joy-yellow" />
                    {evolutionName} Form
                </div>
            </div>
         </div>

         <div className="mt-8 mb-4">
            <p className="text-joy-blue-light text-sm font-medium opacity-90">Total Tabunganmu</p>
            <h2 className="text-4xl font-extrabold tracking-tight mt-1">
                {formatCurrency(user.balance)}
            </h2>
         </div>
      </header>

      <div className="px-6 -mt-10 relative z-20 space-y-4">
        
        <motion.div 
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowXPInfo(!showXPInfo)}
            className="bg-white p-5 rounded-3xl shadow-xl border border-slate-100 cursor-pointer relative overflow-hidden"
        >
            <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-slate-600">Level {userLevel} {currentTitle?.name}</span>
                <div className="flex items-center gap-1 text-joy-orange font-bold text-sm">
                    <Star size={16} fill="currentColor" />
                    <span>{currentLevelProgress}/{xpForNextLevel} XP</span>
                </div>
            </div>

            <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200 relative mb-1">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentLevelProgress / xpForNextLevel) * 100}%` }}
                    className="h-full bg-gradient-to-r from-joy-orange to-joy-yellow relative"
                >
                     <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" />
                </motion.div>
            </div>
            
            <AnimatePresence>
                {showXPInfo && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <hr className="my-3 border-slate-100"/>
                        <div className="flex gap-3 items-start text-xs text-slate-500">
                            <Info size={32} className="text-joy-blue shrink-0" />
                            <p>
                                Kamu butuh <strong>{xpForNextLevel - currentLevelProgress} XP</strong> lagi untuk naik level. 
                                <br/><br/>
                                💡 <em>Tips: Nabung lebih sering untuk dapat XP lebih banyak!</em>
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!showXPInfo && (
                 <p className="text-xs text-slate-400 mt-2 text-center">
                    Ketuk untuk info XP
                 </p>
            )}
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
            
            <motion.div 
                className="bg-joy-yellow-light p-4 rounded-3xl flex items-center justify-between border-2 border-joy-yellow/20 relative overflow-hidden h-full"
            >
                <div className="absolute -right-2 -bottom-2 text-joy-yellow opacity-20 transform rotate-12">
                   <Puzzle size={60} />
                </div>
                <div>
                    <p className="text-xs font-bold text-joy-orange uppercase tracking-wider mb-1 flex items-center gap-1">
                        Puzzle
                    </p>
                    <p className="text-2xl font-black text-slate-700">{user.puzzlePieces}</p>
                </div>
                <div className="bg-white p-2 rounded-full shadow-sm text-joy-orange relative z-10">
                    <Puzzle size={24} fill="currentColor" />
                </div>
            </motion.div>

             <div className="bg-joy-purple-light p-4 rounded-3xl flex items-center justify-between border-2 border-joy-purple/20 relative overflow-hidden">
                <div className="absolute -right-2 -bottom-2 text-joy-purple opacity-20 transform rotate-12">
                   <Store size={60} />
                </div>
                <div>
                     <p className="text-xs font-bold text-joy-purple uppercase tracking-wider mb-1">Toko</p>
                     <Link href="/store" className="text-xs font-bold bg-white px-3 py-1 rounded-full text-joy-purple shadow-sm inline-block hover:bg-joy-purple hover:text-white transition-colors">
                        Buka
                     </Link>
                </div>
                <div className="bg-white p-2 rounded-full shadow-sm text-joy-purple relative z-10">
                    <Store size={24} fill="currentColor" />
                </div>
            </div>
        </div>

        <Link href="/game" className="block group">
            <motion.div 
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-joy-purple to-[#8B5CF6] p-6 rounded-3xl relative overflow-hidden shadow-lg shadow-purple-200"
            >
                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
                    <Gamepad2 size={100} className="text-white" />
                </div>
                
                <div className="relative z-10 text-white">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                        <Gamepad2 size={24} />
                    </div>
                    <h3 className="text-2xl font-bold mb-1">Mulai Petualangan</h3>
                    <p className="text-white/80 text-sm max-w-[200px]">Cek posisimu di papan permainan sekarang!</p>
                </div>
            </motion.div>
        </Link>
      </div>
    </div>
  );
}
