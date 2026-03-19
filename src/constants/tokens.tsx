import React from 'react';

export interface TokenInfo {
    symbol: string;
    label: string;
    icon?: React.ReactNode;
    iconPath?: string;
    color: string;
}

export const TOKEN_CONFIG: Record<string, TokenInfo> = {
    DOT: {
        symbol: "DOT",
        label: "Polkadot",
        iconPath: "/polkadot-new-dot-logo.svg",
        icon: <img src="/polkadot-new-dot-logo.svg" className="w-4 h-4 object-contain" alt="Polkadot" />,
        color: "polkadot-gradient"
    },
    KSM: {
        symbol: "KSM",
        label: "Kusama",
        iconPath: "/kusama-ksm-logo.svg",
        icon: <img src="/kusama-ksm-logo.svg" className="w-4 h-4 object-contain" alt="Kusama" />,
        color: "bg-pink-600"
    },
    ASTR: {
        symbol: "ASTR",
        label: "Astar",
        iconPath: "/astar-astr-logo.svg",
        icon: <img src="/astar-astr-logo.svg" className="w-4 h-4 object-contain" alt="Astar" />,
        color: "bg-blue-600"
    },
    GLMR: {
        symbol: "GLMR",
        label: "Moonbeam",
        iconPath: "/moonbeam-glmr-logo.svg",
        icon: <img src="/moonbeam-glmr-logo.svg" className="w-4 h-4 object-contain" alt="Moonbeam" />,
        color: "bg-purple-600"
    },
    BNC: {
        symbol: "BNC",
        label: "Bifrost",
        iconPath: "/biforst.svg",
        icon: <img src="/biforst.svg" className="w-4 h-4 object-contain" alt="Bifrost" />,
        color: "bg-green-600"
    },
    PAXG: {
        symbol: "PAXG",
        label: "PAX Gold",
        iconPath: "/-paxg-logo.svg",
        icon: <img src="/-paxg-logo.svg" className="w-4 h-4 object-contain" alt="PAXG" />,
        color: "bg-yellow-500"
    },
    MANTA: {
        symbol: "MANTA",
        label: "Manta Network",
        iconPath: "/Manta_icon.svg",
        icon: <img src="/Manta_icon.svg" className="w-4 h-4 object-contain" alt="Manta" />,
        color: "bg-blue-400"
    },
    ETH: {
        symbol: "ETH",
        label: "Ethereum",
        iconPath: "/ethereum-eth-logo.svg",
        icon: <img src="/ethereum-eth-logo.svg" className="w-4 h-4 object-contain" alt="Ethereum" />,
        color: "bg-slate-600"
    },
    FIL: {
        symbol: "FIL",
        label: "Filecoin",
        iconPath: "/filecoin-fil-logo.svg",
        icon: <img src="/filecoin-fil-logo.svg" className="w-4 h-4 object-contain" alt="Filecoin" />,
        color: "bg-blue-300"
    },
    BTC: {
        symbol: "BTC",
        label: "Bitcoin",
        iconPath: "/bitcoin-btc-logo.svg",
        icon: <img src="/bitcoin-btc-logo.svg" className="w-4 h-4 object-contain" alt="Bitcoin" />,
        color: "bg-orange-500"
    },
    LINK: {
        symbol: "LINK",
        label: "Chainlink",
        iconPath: "/chainlink-link-logo.svg",
        icon: <img src="/chainlink-link-logo.svg" className="w-4 h-4 object-contain" alt="Chainlink" />,
        color: "bg-blue-700"
    },
    LDO: {
        symbol: "LDO",
        label: "Lido",
        iconPath: "/lido-dao-ldo-logo.svg",
        icon: <img src="/lido-dao-ldo-logo.svg" className="w-4 h-4 object-contain" alt="Lido" />,
        color: "bg-teal-500"
    },
    SUI: {
        symbol: "SUI",
        label: "Sui",
        iconPath: "/sui-sui-logo.svg",
        icon: <img src="/sui-sui-logo.svg" className="w-4 h-4 object-contain" alt="Sui" />,
        color: "bg-blue-400"
    },
    SOL: {
        symbol: "SOL",
        label: "Solana",
        iconPath: "/solana-sol-logo.svg",
        icon: <img src="/solana-sol-logo.svg" className="w-4 h-4 object-contain" alt="Solana" />,
        color: "bg-indigo-500"
    },
    DAI: {
        symbol: "DAI",
        label: "Dai",
        iconPath: "/multi-collateral-dai-dai-logo.svg",
        icon: <img src="/multi-collateral-dai-dai-logo.svg" className="w-4 h-4 object-contain" alt="Dai" />,
        color: "bg-yellow-600"
    },
    VIRTUAL: {
        symbol: "VIRTUAL",
        label: "Virtual Protocol",
        iconPath: "/virtual-protocol-virtual-logo.svg",
        icon: <img src="/virtual-protocol-virtual-logo.svg" className="w-4 h-4 object-contain" alt="Virtual" />,
        color: "bg-purple-500"
    },
    AAVE: {
        symbol: "AAVE",
        label: "Aave",
        iconPath: "/aave-aave-logo.svg",
        icon: <img src="/aave-aave-logo.svg" className="w-4 h-4 object-contain" alt="Aave" />,
        color: "bg-purple-700"
    },
    USDT: {
        symbol: "USDT",
        label: "Tether",
        iconPath: "/tether-usdt-logo.svg",
        icon: <img src="/tether-usdt-logo.svg" className="w-4 h-4 object-contain" alt="Tether" />,
        color: "bg-green-500"
    },
    USDC: {
        symbol: "USDC",
        label: "USD Coin",
        iconPath: "/usd-coin-usdc-logo.svg",
        icon: <img src="/usd-coin-usdc-logo.svg" className="w-4 h-4 object-contain" alt="USD Coin" />,
        color: "bg-blue-500"
    },
    VDOT: {
        symbol: "vDOT",
        label: "vDOT",
        iconPath: "/polkadot-new-dot-logo.svg",
        icon: <img src="/polkadot-new-dot-logo.svg" className="w-4 h-4 object-contain" alt="vDOT" />,
        color: "bg-pink-500"
    },
    LDOT: {
        symbol: "LDOT",
        label: "LDOT",
        iconPath: "/polkadot-new-dot-logo.svg",
        icon: <img src="/polkadot-new-dot-logo.svg" className="w-4 h-4 object-contain" alt="LDOT" />,
        color: "bg-orange-500"
    },
    ACA: {
        symbol: "ACA",
        label: "Acala",
        color: "bg-orange-600"
    }
};

const toLookupSymbol = (symbol: string): string => symbol.trim().toUpperCase();

export const resolveSupportedTokenSymbol = (symbol: string): string | null => {
    const lookupSymbol = toLookupSymbol(symbol);

    if (!lookupSymbol) return null;

    if (lookupSymbol.includes("DOT")) {
        return TOKEN_CONFIG.DOT.iconPath ? "DOT" : null;
    }

    if (TOKEN_CONFIG[lookupSymbol]?.iconPath) {
        return lookupSymbol;
    }

    if (lookupSymbol.startsWith("V") && lookupSymbol.length > 1) {
        const baseSymbol = lookupSymbol.substring(1);
        if (TOKEN_CONFIG[baseSymbol]?.iconPath) {
            return baseSymbol;
        }
    }

    if (lookupSymbol.startsWith("L") && lookupSymbol.length > 3) {
        const baseSymbol = lookupSymbol.substring(1);
        if (TOKEN_CONFIG[baseSymbol]?.iconPath) {
            return baseSymbol;
        }
    }

    return null;
};

export const hasSupportedTokenIcon = (symbol: string): boolean => {
    return resolveSupportedTokenSymbol(symbol) !== null;
};

export const getTokenConfig = (symbol: string): TokenInfo | null => {
    const supportedSymbol = resolveSupportedTokenSymbol(symbol);

    if (!supportedSymbol) {
        return null;
    }

    const baseConfig = TOKEN_CONFIG[supportedSymbol];

    return {
        ...baseConfig,
        symbol,
        label: symbol,
    };
};
