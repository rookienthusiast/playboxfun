'use client';

import { UserProvider, useUser } from "@/context/UserContext";
import { usePathname } from "next/navigation";
import BottomNav from "@/components/BottomNav";

function AppContainer({ children }: { children: React.ReactNode }) {
  const { viewMode } = useUser();
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  const widthClass = 
    viewMode === 'mobile' ? 'max-w-md' : 
    viewMode === 'tablet' ? 'max-w-2xl' : 
    'max-w-5xl';

  return (
    <>
        <div className="fixed inset-0 z-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <div className={`min-h-screen flex justify-center bg-joy-orange/5 relative z-10 p-0 transition-all duration-300`}>
            <main className={`w-full ${widthClass} h-screen bg-white shadow-2xl relative overflow-hidden flex flex-col`}>
                <div className="flex-1 overflow-y-auto relative scrollbar-hide">
                    {children}
                </div>
                {!isLoginPage && <BottomNav />}
            </main>
        </div>
    </>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
        <AppContainer>
            {children}
        </AppContainer>
    </UserProvider>
  );
}
