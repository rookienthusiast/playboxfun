'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { formatCurrency } from '@/data/mock';
import { History, TrendingUp, Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

interface Transaction {
    id: number;
    title: string;
    amount: number;
    date: string;
    type: string;
}

export default function HistoryPage() {
  const { user } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
        setLoading(true);
        fetch(`http://localhost:4000/api/history?userId=${user.id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setTransactions(data.data);
                }
            })
            .catch(err => console.error('Failed fetch history', err))
            .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading && !transactions.length) {
      return (
          <div className="flex h-screen items-center justify-center text-joy-blue">
              <Loader2 className="animate-spin" size={32} />
          </div>
      )
  }

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
            <span>Terbaru</span>
        </div>

        {transactions.length > 0 ? (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {transactions.map((trx, i) => (
                    <div key={trx.id} className={`flex items-center justify-between p-4 ${i !== transactions.length - 1 ? 'border-b border-slate-50' : ''}`}>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-joy-green-light text-joy-green">
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-slate-700">{trx.title}</p>
                                {/* Format tanggal jadi: Selasa, 9 Jan 2026 */}
                                <p className="text-xs text-slate-400">
                                    {format(new Date(trx.date), 'eeee, d MMM yyyy - HH:mm', { locale: idLocale })}
                                </p>
                            </div>
                        </div>
                        <span className="font-bold text-joy-green">
                            +{formatCurrency(trx.amount)}
                        </span>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-20 opacity-50">
                <p className="text-slate-400 font-medium">Belum ada transaksi</p>
                <p className="text-xs text-slate-300">Ayo mulai menabung!</p>
            </div>
        )}
      </div>
    </div>
  );
}
