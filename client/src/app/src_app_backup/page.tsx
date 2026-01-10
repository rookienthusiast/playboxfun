'use client';

import { MOCK_USER, getCurrentTitle, formatCurrency, TITLES } from '@/data/mock';
import { Sparkles, Star, Gamepad2, ScrollText, Store, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const user = MOCK_USER;
  const currentTitle = getCurrentTitle(user.balance);
  const nextTitle = TITLES.find(t => t.minBalance > user.balance);
  
  // XP Logic (consistent with main page.tsx)
  const xpForNextLevel = 100;
  const currentLevelProgress = user.xp % xpForNextLevel;
  const userLevel = Math.floor(user.xp / xpForNextLevel) + 1;
  
  // Calculate progress to next title
  let progress = 0;
  if(nextTitle) {
      const prevTitleBalance = currentTitle ? currentTitle.minBalance : 0;
      const totalRange = nextTitle.minBalance - prevTitleBalance;
      const currentProgress = user.balance - prevTitleBalance;
      progress = (currentProgress / totalRange) * 100;
  } else {
      progress = 100; // Max title reached
  }

  return (
    <div className="pb-24">
      {/* HEADER SECTION */}
      <header className="bg-joy-blue p-6 rounded-b-[40px] shadow-lg relative z-10 text-white overflow-hidden">
         {/* Background Circles Decoration */}
         <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
         <div className="absolute top-10 -left-10 w-24 h-24 bg-white/10 rounded-full" />

         <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full p-1 shadow-md border-4 border-joy-yellow">
                {/* Avatar Placeholder */}
                <div className="w-full h-full bg-slate-200 rounded-full overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user.avatarId}`} alt="Avatar" />
                </div>
            </div>
            <div>
                <h1 className="text-xl font-bold">Halo, {user.name}! 👋</h1>
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-sm mt-1 bg-white/20 backdrop-blur-sm border border-white/30`}>
                    <Sparkles size={12} className="text-joy-yellow" />
                    {currentTitle?.name}
                </div>
            </div>
         </div>

         {/* SALDO CARD */}
         <div className="mt-8">
            <p className="text-joy-blue-light text-sm font-medium opacity-90">Total Tabunganmu</p>
            <h2 className="text-4xl font-extrabold tracking-tight mt-1">
                {formatCurrency(user.balance)}
            </h2>
         </div>
      </header>

      {/* CONTENT AREA */}
      <div className="px-6 -mt-6 relative z-20">
        
        {/* LEVEL PROGRESS CARD */}
        <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white p-5 rounded-3xl shadow-xl border border-slate-100"
        >
            <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-slate-600">Level {userLevel}</span>
                <div className="flex items-center gap-1 text-joy-orange font-bold text-sm">
                    <Star size={16} fill="currentColor" />
                    <span>{currentLevelProgress}/{xpForNextLevel} XP</span>
                </div>
            </div>
            {/* Progress Bar Container */}
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200 relative">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentLevelProgress / xpForNextLevel) * 100}%` }}
                    className="h-full bg-gradient-to-r from-joy-orange to-joy-yellow relative"
                >
                     <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" />
                </motion.div>
            </div>
            
            {nextTitle && (
                 <p className="text-xs text-slate-400 mt-3 text-center">
                    Simpan <strong>{formatCurrency(nextTitle.minBalance - user.balance)}</strong> lagi untuk jadi <br/>
                    <span className="font-bold text-joy-purple">{nextTitle.name}</span>!
                 </p>
            )}
        </motion.div>

        {/* MENU GRID */}
        <div className="grid grid-cols-2 gap-4 mt-6">
            <Link href="/game" className="group">
                <motion.div whileTap={{ scale: 0.95 }} className="bg-joy-purple-light p-4 rounded-3xl h-32 flex flex-col justify-between relative overflow-hidden border-2 border-joy-purple/20 shadow-sm hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                        <Gamepad2 size={60} className="text-joy-purple" />
                    </div>
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-joy-purple shadow-sm">
                         <Gamepad2 size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-joy-purple text-lg">Main Game</h3>
                        <p className="text-xs text-joy-purple/70">Papan Petualangan</p>
                    </div>
                </motion.div>
            </Link>

            <Link href="/store" className="group">
                <motion.div whileTap={{ scale: 0.95 }} className="bg-joy-orange-light p-4 rounded-3xl h-32 flex flex-col justify-between relative overflow-hidden border-2 border-joy-orange/20 shadow-sm hover:shadow-md transition-all">
                     <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                        <Store size={60} className="text-joy-orange" />
                    </div>
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-joy-orange shadow-sm">
                         <Store size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-joy-orange text-lg">Toko</h3>
                        <p className="text-xs text-joy-orange/70">Beli Avatar Baru</p>
                    </div>
                </motion.div>
            </Link>

             <Link href="/report" className="col-span-2 group">
                <motion.div whileTap={{ scale: 0.98 }} className="bg-joy-green-light p-4 rounded-3xl flex items-center justify-between border-2 border-joy-green/20 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-joy-green shadow-sm">
                            <ScrollText size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-joy-green text-lg">Laporan & Riwayat</h3>
                            <p className="text-xs text-joy-green/70">Lihat catatanku</p>
                        </div>
                    </div>
                    <div className="bg-white/50 px-3 py-1 rounded-full text-xs font-bold text-joy-green cursor-pointer">
                        Lihat
                    </div>
                </motion.div>
            </Link>
        </div>
      </div>

      {/* FLOATING ACTION BUTTON (FAB) - Quick Add Tabungan */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="pointer-events-auto bg-gradient-to-r from-joy-orange to-joy-yellow text-white flex items-center gap-2 px-6 py-4 rounded-full shadow-2xl shadow-orange-300 font-bold text-lg border-4 border-white/30"
          >
            <PlusCircle size={24} />
            Isi Tabungan
          </motion.button>
      </div>

    </div>
  );
}
