'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, History, User, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";

export default function BottomNav() {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { label: "Home", href: "/", icon: Home },
    { label: "Riwayat", href: "/history", icon: History },
    { label: "Laporan", href: "/report", icon: HeartHandshake },
    { label: "Profil", href: "/profile", icon: User },
  ];

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 pb-6 flex justify-between items-center z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        
        return (
          <Link key={item.href} href={item.href} className="relative group">
            <div className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-joy-blue' : 'text-slate-400 hover:text-joy-blue/70'}`}>
                {isActive && (
                    <motion.div 
                        layoutId="nav-dot"
                        className="absolute -top-3 w-10 h-1 bg-joy-blue rounded-b-full" 
                    />
                )}
                
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-bold">{item.label}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
