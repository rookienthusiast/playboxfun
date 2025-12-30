import type { Metadata } from "next";
import { Fredoka } from "next/font/google"; 
import "./globals.css";
import ClientLayout from "./ClientLayout";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fredoka",
});

export const metadata: Metadata = {
  title: "PlayFunBox - Nabung Jadi Seru!",
  description: "Aplikasi menabung gamifikasi untuk anak",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${fredoka.variable} font-sans antialiased text-slate-700 bg-slate-100`} suppressHydrationWarning>
        <ClientLayout>
            {children}
        </ClientLayout>
      </body>
    </html>
  );
}
