'use client';

import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { motion } from 'framer-motion';
import { Sparkles, Rocket, ScanLine, Loader2 } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-joy-blue via-joy-purple to-pink-500 flex flex-col items-center justify-center p-8 relative overflow-hidden">
        
        {/* Animated Background Shapes */}
        <motion.div 
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 left-10 text-white opacity-20"
        >
            <Sparkles size={60} />
        </motion.div>
        
        <motion.div 
            animate={{ y: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-20 right-10 text-white opacity-15"
        >
            <Sparkles size={80} />
        </motion.div>
        
        {/* LOGIN CARD */}
        <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="bg-white/95 backdrop-blur-xl p-10 rounded-[40px] shadow-[0_25px_60px_rgba(0,0,0,0.4)] w-full max-w-md relative z-10 text-center border-4 border-white/60"
        >
            {/* Logo Section */}
            <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex justify-center -mt-24 mb-6"
            >
                <div className="bg-white rounded-full p-4 shadow-2xl border-4 border-joy-blue/30">
                    <img src="/Logo_Sirupi.png" alt="Sirupi Logo" className="w-25 h-25 object-contain" />
                </div>
            </motion.div>

            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-black bg-gradient-to-r from-joy-blue to-joy-purple bg-clip-text text-transparent mb-3 tracking-tight"
            >
                Sirupi
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-slate-600 text-sm font-semibold mb-8"
            >
                Masuk dengan Kartu Ajaibmu ✨
            </motion.p>

            <motion.form 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onSubmit={handleSubmit} 
                className="space-y-6"
            >
                
                {/* UID Input */}
                <div className="text-left space-y-3">
                    <label className="text-sm font-bold text-slate-700 ml-3 flex items-center gap-2">
                        <ScanLine size={16} className="text-joy-blue" />
                        Nomor Kartu (UID)
                    </label>
                    <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-joy-blue/60 group-focus-within:text-joy-blue transition-colors">
                             <ScanLine size={22} />
                        </div>
                        <input 
                            type="text" 
                            value={uid}
                            onChange={(e) => setUid(e.target.value)}
                            placeholder="Contoh: 04A3B2C1D4E5F6"
                            className="w-full bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-2xl pl-14 pr-5 py-4 font-semibold text-base text-slate-800 focus:outline-none focus:border-joy-blue focus:ring-4 focus:ring-joy-blue/20 transition-all placeholder:font-normal placeholder:text-slate-400 shadow-inner"
                            required
                        />
                    </div>
                </div>

                {/* Error Message */}
                {errorMsg && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="p-4 bg-gradient-to-r from-red-50 to-red-100 text-red-700 text-sm font-bold rounded-xl border-2 border-red-200 shadow-sm flex items-center gap-2"
                    >
                        <span className="text-lg">⛔</span>
                        <span>{errorMsg}</span>
                    </motion.div>
                )}

                <motion.button 
                    whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-joy-blue via-joy-purple to-pink-500 text-white font-bold py-5 rounded-2xl shadow-xl shadow-blue-300/50 flex items-center justify-center gap-3 text-lg border-b-4 border-blue-700 active:border-b-2 active:translate-y-0.5 transition-all disabled:opacity-70 disabled:grayscale disabled:cursor-not-allowed relative overflow-hidden group"
                >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin relative z-10" size={22} />
                            <span className="relative z-10">Mengecek...</span>
                        </>
                    ) : (
                        <>
                            <Rocket size={22} className="relative z-10" />
                            <span className="relative z-10">Masuk Sekarang</span>
                        </>
                    )}
                </motion.button>
            </motion.form>
        </motion.div>

        <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 text-white/80 text-sm text-center relative z-10 font-semibold backdrop-blur-sm bg-white/10 px-6 py-3 rounded-full border border-white/20"
        >
            💳 Gunakan Kartu RFID yang sudah terdaftar
        </motion.p>
    </div>
  );
}
