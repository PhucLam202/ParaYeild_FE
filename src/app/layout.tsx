import type { Metadata } from "next";
import { Geist, Space_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DeFi Analytics Platform | Polkadot",
  description: "Backtest DeFi Strategies Across Polkadot Parachains",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${spaceMono.variable} antialiased font-sans bg-background text-foreground min-h-screen selection:bg-[#00FFA3]/30`}
      >
        {children}
      </body>
    </html>
  );
}
