'use client';

import { useUser } from '@/context/UserContext';
import { LogOut, Award, User as UserIcon, Monitor, Smartphone, Tablet, Edit2, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getCustomAvatarUrl, getEvolutionName, TITLES, getAvatarSeed, calculateLevel, getCurrentTitle } from '@/data/mock';
import { API_URL } from '@/config';

export default function ProfilePage() {
  const { user, logout, viewMode, setViewMode, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');

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
            <div className="w-28 h-28 bg-white rounded-full p-1 shadow-lg border-4 border-joy-blue mb-4 relative group cursor-pointer">
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
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
                <div className="w-10 h-10 bg-joy-yellow/10 text-joy-yellow rounded-full flex items-center justify-center mx-auto mb-2">
                    <Award size={20} />
                </div>
                <div className="text-xl font-bold text-slate-700">{user.xp}</div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total XP</div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
                <div className="w-10 h-10 bg-joy-green/10 text-joy-green rounded-full flex items-center justify-center mx-auto mb-2">
                    <UserIcon size={20} />
                </div>
                <div className="text-xl font-bold text-slate-700">{user.inventory?.length || 0}</div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Item Fashion</div>
            </div>
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
