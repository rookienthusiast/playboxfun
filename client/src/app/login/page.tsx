'use client';

import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Rocket, CheckCircle } from 'lucide-react';
import { getAvatarSeed } from '@/data/mock';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('cat');
  const { login } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      login(name, selectedAvatar);
    }
  };

  const STARTER_AVATARS = [
      { id: 'cat', name: 'Kucing' },
      { id: 'dog', name: 'Anjing' },
      { id: 'bear', name: 'Beruang' },
  ];

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
        <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-white/5 rounded-full border-4 border-white/10 border-dashed"
        />

        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur-xl p-8 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-full max-w-sm relative z-10 text-center border-4 border-white/50"
        >
            {/* Header Icon */}
            <div className="w-24 h-24 bg-gradient-to-tr from-joy-yellow to-orange-400 rounded-full mx-auto -mt-20 mb-6 flex items-center justify-center border-8 border-joy-blue shadow-lg">
                <Rocket size={40} className="text-white transform -rotate-45" />
            </div>

            <h1 className="text-3xl font-black text-joy-blue mb-2 tracking-tight">PlayFunBox!</h1>
            <p className="text-slate-500 text-sm font-medium mb-8">Siap jadi pahlawan tabungan?</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Avatar Selection */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pilih Temanmu</label>
                    <div className="flex justify-center gap-4">
                        {STARTER_AVATARS.map((av) => {
                            const isSelected = selectedAvatar === av.id;
                            return (
                                <motion.div 
                                    key={av.id}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setSelectedAvatar(av.id)}
                                    className={`relative cursor-pointer transition-all ${isSelected ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
                                >
                                    <div className={`w-16 h-16 rounded-full overflow-hidden border-4 shadow-sm ${isSelected ? 'border-joy-orange ring-4 ring-joy-orange/20' : 'border-slate-200'}`}>
                                        <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${getAvatarSeed(av.id, 0)}`} alt={av.name} />
                                    </div>
                                    {isSelected && (
                                        <div className="absolute -bottom-1 -right-1 bg-joy-green text-white rounded-full p-0.5 border-2 border-white">
                                            <CheckCircle size={12} strokeWidth={4} />
                                        </div>
                                    )}
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                {/* Name Input */}
                <div className="text-left space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-2">Siapa Namamu?</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Contoh: Jojo"
                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 font-bold text-xl text-slate-700 focus:outline-none focus:border-joy-blue focus:ring-4 focus:ring-joy-blue/10 transition-all placeholder:font-normal placeholder:text-slate-300 text-center"
                            maxLength={15}
                            required
                        />
                    </div>
                </div>

                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-joy-blue to-joy-purple text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-200 flex items-center justify-center gap-2 text-lg border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all"
                >
                    <Sparkles size={20} />
                    Mulai Petualangan
                </motion.button>
            </form>
        </motion.div>

        <p className="mt-8 text-white/60 text-xs text-center relative z-10 font-medium">
            PlayFunBox © 2025<br/>Belajar menabung sejak dini
        </p>
    </div>
  );
}
