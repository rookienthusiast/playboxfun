'use client';

import { MOCK_USER, User } from '@/data/mock';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UserContextType {
  user: User | null;
  login: (name: string, avatarId?: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isLoggedIn: boolean;
  viewMode: 'mobile' | 'tablet' | 'desktop';
  setViewMode: (mode: 'mobile' | 'tablet' | 'desktop') => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const router = useRouter();

  useEffect(() => {
    const storedName = localStorage.getItem('playbox_user');
    // Load viewMode from local storage if exists
    const storedViewMode = localStorage.getItem('playbox_view_mode') as 'mobile' | 'tablet' | 'desktop';
    if (storedViewMode) setViewMode(storedViewMode);

    if (storedName) {
        const storedAvatar = localStorage.getItem('playbox_avatar') || 'cat';
        setUser({ ...MOCK_USER, name: storedName, avatarId: storedAvatar });
    }
  }, []);

  const login = (name: string, avatarId: string = 'cat') => {
    const newUser = { ...MOCK_USER, name: name, avatarId: avatarId };
    setUser(newUser);
    localStorage.setItem('playbox_user', name);
    localStorage.setItem('playbox_avatar', avatarId);
    router.push('/');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('playbox_user');
    router.push('/login');
  };

  const updateUser = (updates: Partial<User>) => {
      setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const handleSetViewMode = (mode: 'mobile' | 'tablet' | 'desktop') => {
      setViewMode(mode);
      localStorage.setItem('playbox_view_mode', mode);
  }

  return (
    <UserContext.Provider value={{ user, login, logout, updateUser, isLoggedIn: !!user, viewMode, setViewMode: handleSetViewMode }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
