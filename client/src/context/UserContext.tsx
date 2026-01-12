'use client';

import { MOCK_USER, User } from '@/data/mock';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UserContextType {
  user: User | null;
  login: (userData: any) => void;
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

    // Load viewMode from local storage if exists
    const storedViewMode = localStorage.getItem('playbox_view_mode') as 'mobile' | 'tablet' | 'desktop';
    if (storedViewMode) setViewMode(storedViewMode);

    const storedUser = localStorage.getItem('playbox_user');
    if (storedUser) {
        try {
            const parsed = JSON.parse(storedUser);
            // Check if it's new object format or old string format
            if (typeof parsed === 'object') {
                setUser(parsed);
            } else {
                setUser({ ...MOCK_USER, name: storedUser });
            }
        } catch (e) {
             // Fallback for old simple string
             setUser({ ...MOCK_USER, name: storedUser });
        }
    }
  }, []);

  // Updated login function to accept full user data from API
  const login = (userData: any) => {
    // Merge API data with mock default structure
    const mergedUser = { 
        ...MOCK_USER, 
        ...userData,
        // Ensure critical fields exist
        xp: userData.xp || 0,
        puzzlePieces: userData.puzzlePieces || 0,
        inventory: userData.inventory || [],
        
        equippedBase: userData.equippedBase || 'base',
        equippedHair: userData.equippedHair || 'shortHair', 
        equippedClothing: userData.equippedClothing || 'shirtCrewNeck',
        equippedAccessory: userData.equippedAccessory || 'none'
    };
    
    setUser(mergedUser);
    localStorage.setItem('playbox_user', JSON.stringify(mergedUser));
    router.push('/');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('playbox_user');
    router.push('/login');
  };

  const updateUser = (updates: Partial<User>) => {
      setUser(prev => {
          if (!prev) return null;
          const updated = { ...prev, ...updates };
          localStorage.setItem('playbox_user', JSON.stringify(updated)); // Persist!
          return updated;
      });
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
