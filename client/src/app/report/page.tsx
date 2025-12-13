'use client';

import { MOCK_USER, getCurrentTitle, formatCurrency } from '@/data/mock';
import { ArrowLeft, Share2, Copy, History, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ReportPage() {
  const user = MOCK_USER;
  const currentTitle = getCurrentTitle(user.balance);
  const [copied, setCopied] = useState(false);

  // Dummy Transaction Data
  const transactions = [
    { id: 1, type: 'in', date: '12 Des', note: 'Uang Saku', amount: 5000 },
    { id: 2, type: 'in', date: '10 Des', note: 'Hadiah Nenek', amount: 20000 },
    { id: 3, type: 'out', date: '08 Des', note: 'Beli Jajan', amount: 2000 },
    { id: 4, type: 'in', date: '05 Des', note: 'Sisa Belanja', amount: 1500 },
  ];

  // Generate WhatsApp Message
  const getWAMessage = () => {
    return `*📊 LAPORAN TABUNGAN SIBUNAK*
---------------------------

👤 *Nama:* ${user.name}
📅 *Periode:* Desember 2025

💰 *RINGKASAN SALDO*
Total Tabungan: ${formatCurrency(user.balance)}
Target Level: ${user.stars}/${user.maxStars} ⭐

🏅 *STATUS PENCAPAIAN*
Title: ${currentTitle?.name}
Level: ${user.level}

🧩 *KOLEKSI*
Puzzle: ${user.puzzlePieces} keping

✨ _Terus semangat menabung, ${user.name}!_ ✨

---------------------------
_Powered by PlayBox Fun 🚀_`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getWAMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWA = () => {
    const text = encodeURIComponent(getWAMessage());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="pb-24 min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="bg-white p-4 items-center flex gap-4 shadow-sm sticky top-0 z-10">
        <Link href="/">
           <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
             <ArrowLeft size={24} className="text-slate-600" />
           </button>
        </Link>
        <h1 className="text-xl font-bold text-slate-700">Laporan</h1>
      </header>

      <div className="p-6 space-y-8">
        
        {/* SECTION 1: WHATSAPP PREVIEW CARD */}
        <section>
            <div className="flex items-center gap-2 mb-3 text-slate-500 text-sm font-semibold">
                <Share2 size={16} />
                <h3>Preview Laporan Orang Tua</h3>
            </div>
            
            {/* The WhatsApp Bubble Look */}
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#dcf8c6] p-4 rounded-lg rounded-tl-none shadow-md border border-green-200 relative text-sm font-mono text-slate-800 leading-relaxed whitespace-pre-wrap"
            >
                {getWAMessage()}
                
                {/* Time stamp simulation */}
                <div className="text-[10px] text-slate-500 text-right mt-2 flex justify-end gap-1">
                    <span>16:45</span>
                    <span>✓✓</span>
                </div>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
                <button 
                    onClick={handleCopy}
                    className="flex-1 bg-white border border-slate-300 py-3 rounded-xl font-bold text-slate-600 shadow-sm active:scale-95 transition-transform flex justify-center items-center gap-2"
                >
                    <Copy size={18} />
                    {copied ? 'Tersalin!' : 'Salin Teks'}
                </button>
                <button 
                    onClick={handleShareWA}
                    className="flex-1 bg-[#25D366] text-white py-3 rounded-xl font-bold shadow-lg shadow-green-200 active:scale-95 transition-transform flex justify-center items-center gap-2"
                >
                    <Share2 size={18} />
                    Kirim WA
                </button>
            </div>
        </section>

        {/* SECTION 2: TRANSACTION HISTORY */}
        <section>
             <div className="flex items-center gap-2 mb-4 text-slate-500 text-sm font-semibold">
                <History size={16} />
                <h3>Riwayat Mutasi</h3>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {transactions.map((trx, i) => (
                    <div key={trx.id} className={`flex items-center justify-between p-4 ${i !== transactions.length - 1 ? 'border-b border-slate-50' : ''}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${trx.type === 'in' ? 'bg-joy-green-light text-joy-green' : 'bg-joy-red/10 text-joy-red'}`}>
                                {trx.type === 'in' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                            </div>
                            <div>
                                <p className="font-bold text-slate-700">{trx.note}</p>
                                <p className="text-xs text-slate-400">{trx.date}</p>
                            </div>
                        </div>
                        <span className={`font-bold ${trx.type === 'in' ? 'text-joy-green' : 'text-slate-500'}`}>
                            {trx.type === 'in' ? '+' : '-'}{formatCurrency(trx.amount)}
                        </span>
                    </div>
                ))}
            </div>
        </section>

      </div>
    </div>
  );
}
