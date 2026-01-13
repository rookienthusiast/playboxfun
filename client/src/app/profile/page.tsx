'use client';

import { useUser } from '@/context/UserContext';
import { LogOut, User as UserIcon, Monitor, Smartphone, Tablet, Edit2, Check, Puzzle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCustomAvatarUrl, getEvolutionName, TITLES, getAvatarSeed, calculateLevel, getCurrentTitle } from '@/data/mock';
import { API_URL } from '@/config';

export default function ProfilePage() {
  const { user, logout, viewMode, setViewMode, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const router = useRouter();

  useEffect(() => {
      if (user?.cardUid) {
           fetch(`${API_URL}/api/auth/login`, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ uid: user.cardUid })
           })
           .then(res => res.json())
           .then(data => {
               if(data.success) {
                   updateUser(data.user);
               }
           })
           .catch(err => console.error("Sync failed", err));
      }
  }, [user?.cardUid]);

  const handleEdit = () => {
      if (!user) return;
      setNewName(user.name);
      setIsEditing(true);
  };

  const handleSaveName = async () => {
      if (!user) return;
      if(newName.trim()) {
          try {
              await fetch(`${API_URL}/api/auth/update-name`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId: user.id, name: newName })
              });
              
              updateUser({ name: newName });
          } catch (e) {
              alert("Gagal menyimpan nama. Cek internet!");
              console.error(e);
          }
      }
      setIsEditing(false);
  };

  if (!user) return null;
  
  const avatarSeed = getAvatarSeed(user.currentAvatar || user.avatarId, user.balance);

  return (
    <div className="pb-24 min-h-screen bg-slate-50">
      
      <header className="bg-white p-4 items-center flex justify-between shadow-sm sticky top-0 z-10 border-b border-slate-100">
        <h1 className="text-xl font-bold text-slate-700">Profil Saya</h1>
        <button onClick={logout} className="text-red-500 bg-red-50 p-2 rounded-full">
            <LogOut size={20} />
        </button>
      </header>

      <div className="p-6 space-y-8">
        
        <div className="flex flex-col items-center relative">
            <div 
                className="w-28 h-28 bg-white rounded-full p-1 shadow-lg border-4 border-joy-blue mb-4 relative group cursor-pointer"
                onClick={() => router.push('/store')}
            >
                <div className="w-full h-full bg-slate-200 rounded-full overflow-hidden">
                    <img src={getCustomAvatarUrl(user)} alt="Avatar" referrerPolicy="no-referrer" />
                </div>
                <div className="absolute bottom-0 right-0 bg-joy-orange text-white p-2 rounded-full border-2 border-white shadow-sm">
                    <Edit2 size={14} />
                </div>
            </div>

            {isEditing ? (
                <div className="flex items-center gap-2 mb-2">
                    <input 
                        type="text" 
                        value={newName} 
                        onChange={(e) => setNewName(e.target.value)}
                        className="bg-white border-2 border-joy-blue rounded-lg px-3 py-1 text-lg font-bold text-center w-48 focus:outline-none"
                    />
                    <button onClick={handleSaveName} className="bg-joy-green text-white p-2 rounded-lg">
                        <Check size={18} />
                    </button>
                </div>
            ) : (
                 <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-slate-700">{user.name}</h2>
                    <button onClick={handleEdit} className="text-slate-400 hover:text-joy-blue">
                        <Edit2 size={16} />
                    </button>
                 </div>
            )}
            
            <p className="text-slate-400 font-medium">Level {calculateLevel(user.xp)} {getCurrentTitle(user.balance).name}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="bg-joy-yellow-light p-4 rounded-2xl flex flex-col justify-between border border-joy-yellow/20 relative overflow-hidden">
                <div className="absolute -right-2 -bottom-2 text-joy-yellow opacity-20 transform rotate-12">
                    <Puzzle size={48} />
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-joy-orange uppercase tracking-wider mb-1">
                            Puzzle
                        </p>
                        <p className="text-xl font-black text-slate-700">{user.puzzlePieces}</p>
                    </div>
                    <div className="bg-white p-2 rounded-full shadow-sm text-joy-orange relative z-10">
                        <Puzzle size={20} fill="currentColor" />
                    </div>
                </div>
                <p className="mt-2 text-[10px] leading-snug text-joy-orange/80 font-medium">
                    Koleksi puzzle lewat konsisten menabung untuk membeli karaktermu.
                </p>
            </div>
            <button
                type="button"
                onClick={() => router.push('/inventory')}
                className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center hover:border-joy-green/60 hover:shadow-md transition-all cursor-pointer"
            >
                <div className="w-10 h-10 bg-joy-green/10 text-joy-green rounded-full flex items-center justify-center mx-auto mb-2">
                    <UserIcon size={20} />
                </div>
                <div className="text-xl font-bold text-slate-700">{user.inventory?.length || 0}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Item Fashion
                </div>
                <p className="mt-2 text-[10px] text-joy-green/80 font-medium">
                    Lihat & ganti item yang sudah kamu miliki
                </p>
            </button>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-xs text-slate-500 leading-relaxed">
                Puzzle didapat dari konsisten menabung. 
                Kumpulkan puzzle sebanyak mungkin untuk membeli dan mengganti karaktermu di Toko & Koleksi Item Fashion.
            </p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                Pengaturan Tampilan
            </h3>
            
            <div className="grid grid-cols-3 gap-2">
                <button 
                    onClick={() => setViewMode('mobile')}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${viewMode === 'mobile' ? 'border-joy-blue bg-joy-blue/5 text-joy-blue' : 'border-slate-100 text-slate-400'}`}
                >
                    <Smartphone size={24} />
                    <span className="text-xs font-bold">HP</span>
                </button>
                <button 
                    onClick={() => setViewMode('tablet')}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${viewMode === 'tablet' ? 'border-joy-blue bg-joy-blue/5 text-joy-blue' : 'border-slate-100 text-slate-400'}`}
                >
                    <Tablet size={24} />
                    <span className="text-xs font-bold">Tablet</span>
                </button>
                <button 
                    onClick={() => setViewMode('desktop')}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${viewMode === 'desktop' ? 'border-joy-blue bg-joy-blue/5 text-joy-blue' : 'border-slate-100 text-slate-400'}`}
                >
                    <Monitor size={24} />
                    <span className="text-xs font-bold">Laptop</span>
                </button>
            </div>
            <p className="text-xs text-slate-400 mt-3 text-center">
                Ubah ukuran tampilan aplikasi agar pas di layarmu.
            </p>
        </div>

      </div>
    </div>
  );
}
