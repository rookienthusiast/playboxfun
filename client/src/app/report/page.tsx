'use client';

import { getCurrentTitle, formatCurrency, getCustomAvatarUrl, calculateLevel } from '@/data/mock';
import { Share2, Copy } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';

export default function ReportPage() {
  const { user } = useUser();
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const currentTitle = getCurrentTitle(user.balance);
  
  const xpForNextLevel = 100;
  const currentLevelProgress = user.xp % xpForNextLevel;
  const userLevel = calculateLevel(user.xp);

  const getWAMessage = () => {
    return `*📊 LAPORAN TABUNGAN SIRUPI*
---------------------------

👤 *Nama:* ${user.name}
📅 *Periode:* ${new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' })}

💰 *RINGKASAN SALDO*
Total Tabungan: ${formatCurrency(user.balance)}
XP Progress: ${currentLevelProgress}/${xpForNextLevel} XP

🏅 *STATUS PENCAPAIAN*
Title: ${currentTitle?.name}
Level: ${userLevel}

🧩 *KOLEKSI*
Puzzle: ${user.puzzlePieces} keping

✨ _Terus semangat menabung, ${user.name}!_ ✨

---------------------------
_Powered by Sirupi 🚀_`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getWAMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWA = () => {
    const text = encodeURIComponent(getWAMessage());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="pb-24 min-h-screen bg-slate-50">
      <header className="bg-white p-4 items-center flex gap-4 shadow-sm sticky top-0 z-10 border-b border-slate-100">
        <div className="bg-joy-green-light p-2 rounded-full text-joy-green">
             <Share2 size={24} />
        </div>
        <h1 className="text-xl font-bold text-slate-700">Laporan Orang Tua</h1>
      </header>

      <div className="p-6 space-y-6">
        
        <section>
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 text-center mb-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-slate-50 mb-4 overflow-hidden border-4 border-joy-green-light">
                    <img src={getCustomAvatarUrl(user)} className="w-full h-full object-cover" alt="avatar" referrerPolicy="no-referrer"/>
                </div>
                <h2 className="text-lg font-bold text-slate-700">Laporan Siap Dikirim!</h2>
                <p className="text-slate-400 text-sm">Bagikan progres menabungmu kepada orang tua atau guru.</p>
            </div>

            <div className="flex items-center gap-2 mb-3 text-slate-500 text-sm font-semibold px-2">
                <span>Preview Pesan:</span>
            </div>
            
            {/* The WhatsApp Bubble Look */}
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                onClick={handleCopy}
                className="bg-[#dcf8c6] p-4 rounded-xl rounded-tl-none shadow-sm border border-green-200 relative text-sm font-mono text-slate-800 leading-relaxed whitespace-pre-wrap cursor-pointer"
            >
                {getWAMessage()}
                
                <div className="text-[10px] text-slate-500 text-right mt-2 flex justify-end gap-1">
                    <span>Just now</span>
                    <span>✓✓</span>
                </div>
            </motion.div>

            <div className="flex gap-3 mt-6">
                <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className="flex-1 bg-white border border-slate-300 py-4 rounded-xl font-bold text-slate-600 shadow-sm transition-transform flex justify-center items-center gap-2"
                >
                    <Copy size={20} />
                    {copied ? 'Tersalin!' : 'Salin'}
                </motion.button>
                <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShareWA}
                    className="flex-[2] bg-[#25D366] text-white py-4 rounded-xl font-bold shadow-lg shadow-green-200 transition-transform flex justify-center items-center gap-2"
                >
                    <Share2 size={20} />
                    Kirim ke WhatsApp
                </motion.button>
            </div>
        </section>

      </div>
    </div>
  );
}
