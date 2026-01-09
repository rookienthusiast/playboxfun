'use client';

import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { motion } from 'framer-motion';
import { Sparkles, Rocket, CreditCard, ScanLine, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [uid, setUid] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid.trim()) return;

    setIsLoading(true);
    setErrorMsg('');

    try {
        // 1. Tembak API Login (Hardcoded localhost for dev)
        // Di Real project, URL ini harusnya dari environment variable
        const response = await fetch('http://localhost:4000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uid: uid }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // 2. Login Sukses -> Masuk ke App
            // Kirim data user asli dari DB ke context
            // Kita perlu menyesuaikan UserContext agar menerima objek User lengkap dari DB
            login(data.user);
        } else {
            // Login Gagal
            setErrorMsg(data.error || 'Login gagal. Coba lagi.');
        }

    } catch (err) {
        console.error(err);
        setErrorMsg('Gagal terhubung ke server. Pastikan server nyala.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-joy-blue to-joy-purple flex flex-col items-center justify-center p-8 relative overflow-hidden">
        
        {/* Animated Background Shapes */}
        <motion.div 
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 left-10 text-white opacity-20"
        >
            <Sparkles size={60} />
        </motion.div>
        
        {/* LOGIN CARD */}
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur-xl p-8 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-full max-w-sm relative z-10 text-center border-4 border-white/50"
        >
            {/* Header Icon - Ganti jadi Kartu */}
            <div className="w-24 h-24 bg-gradient-to-tr from-joy-purple to-pink-500 rounded-full mx-auto -mt-20 mb-6 flex items-center justify-center border-8 border-joy-blue shadow-lg">
                <CreditCard size={40} className="text-white transform -rotate-12" />
            </div>

            <h1 className="text-3xl font-black text-joy-blue mb-2 tracking-tight">Tap & Play!</h1>
            <p className="text-slate-500 text-sm font-medium mb-8">Masuk dengan Kartu Ajaibmu ✨</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* UID Input */}
                <div className="text-left space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-2">Nomor Kartu (UID)</label>
                    <div className="relative">
                        <div className="absolute left-4 top-4 text-slate-400">
                             <ScanLine size={20} />
                        </div>
                        <input 
                            type="text" 
                            value={uid}
                            onChange={(e) => setUid(e.target.value)}
                            placeholder="Contoh: CARD-JOJO-01"
                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl pl-12 pr-5 py-4 font-bold text-lg text-slate-700 focus:outline-none focus:border-joy-blue focus:ring-4 focus:ring-joy-blue/10 transition-all placeholder:font-normal placeholder:text-slate-300"
                            required
                        />
                    </div>
                </div>

                {/* Error Message */}
                {errorMsg && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-red-100 text-red-600 text-xs font-bold rounded-xl border border-red-200"
                    >
                        ⛔ {errorMsg}
                    </motion.div>
                )}

                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-joy-blue to-joy-purple text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-200 flex items-center justify-center gap-2 text-lg border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-70 disabled:grayscale"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin" />
                            Mengecek...
                        </>
                    ) : (
                        <>
                            <Rocket size={20} />
                            Masuk Sekarang
                        </>
                    )}
                </motion.button>
            </form>
        </motion.div>

        <p className="mt-8 text-white/60 text-xs text-center relative z-10 font-medium">
            Gunakan Kartu RFID yang sudah terdaftar<br/>di mesin PlayBox Fun
        </p>
    </div>
  );
}
