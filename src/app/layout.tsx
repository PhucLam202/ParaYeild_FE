import type { Metadata } from "next";
import { Geist, Space_Mono, Space_Grotesk } from "next/font/google";
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

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ParaYield Lab | Polkadot DeFi Backtesting & Yield Optimizer",
  description: "Maximize Polkadot DeFi returns. Backtest liquidity strategies, simulate impermanent loss, and optimize XCM fees across Acala, Bifrost, and Hydration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body
        className={`${geistSans.variable} ${spaceMono.variable} ${spaceGrotesk.variable} antialiased font-sans bg-background text-foreground min-h-screen selection:bg-[#00FFA3]/30`}
      >
        {children}
      </body>
    </html>
  );
}
