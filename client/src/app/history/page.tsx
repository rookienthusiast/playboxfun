'use client';

import { formatCurrency } from '@/data/mock';
import { History, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

export default function HistoryPage() {
  // Dummy Transaction Data
  const transactions = [
    { id: 1, type: 'in', date: '12 Des 2025', note: 'Uang Saku', amount: 5000 },
    { id: 2, type: 'in', date: '10 Des 2025', note: 'Hadiah Nenek', amount: 20000 },
    { id: 3, type: 'out', date: '08 Des 2025', note: 'Beli Jajan', amount: 2000 },
    { id: 4, type: 'in', date: '05 Des 2025', note: 'Sisa Belanja', amount: 1500 },
    { id: 5, type: 'in', date: '01 Des 2025', note: 'Uang Saku', amount: 5000 },
    { id: 6, type: 'out', date: '28 Nov 2025', note: 'Belli Mainan', amount: 15000 },
  ];

  return (
    <div className="pb-24 min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="bg-white p-4 items-center flex gap-4 shadow-sm sticky top-0 z-10 border-b border-slate-100">
        <div className="bg-joy-blue/10 p-2 rounded-full text-joy-blue">
            <History size={24} />
        </div>
        <h1 className="text-xl font-bold text-slate-700">Riwayat Mutasi</h1>
      </header>

      <div className="p-4 space-y-4">
        {/* Month Separator Example */}
        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium px-2">
            <Calendar size={14} />
            <span>Desember 2025</span>
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
      </div>
    </div>
  );
}
