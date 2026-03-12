import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

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
        className={`${spaceGrotesk.variable} antialiased font-sans text-slate-700 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
