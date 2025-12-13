import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fredoka",
});

export const metadata: Metadata = {
  title: "PlayBox Fun - Nabung Jadi Seru!",
  description: "Aplikasi menabung gamifikasi untuk anak",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${fredoka.variable} font-sans antialiased text-slate-700`} suppressHydrationWarning>
        <div className="min-h-screen bg-[url('/bg-pattern.png')] bg-joy-orange-light/30">
             {/* Mobile-first centered container */}
            <main className="max-w-md mx-auto min-h-screen bg-white shadow-2xl relative overflow-hidden">
                {children}
            </main>
        </div>
      </body>
    </html>
  );
}
