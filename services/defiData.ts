import { PoolData } from '../types';

interface DefiLlamaPool {
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number;
  pool: string; // unique id
  apyPct1D?: number;
  apyPct7D?: number;
}

// Fallback data in case API fails
const FALLBACK_POOLS: PoolData[] = [
  {
    id: '1',
    name: 'Curve.usd3CRV',
    protocol: 'Curve',
    chain: 'Ethereum',
    tvl: 450000000,
    apy: 0.045,
    apyChange24h: 0.002,
    tokenVol: 0.05,
    ageDays: 1200,
    auditScore: 1,
    concentration: 0.15,
    liquidityDepth: 5000000
  },
  {
    id: '2',
    name: 'Aave.USDC',
    protocol: 'Aave',
    chain: 'Ethereum',
    tvl: 890000000,
    apy: 0.038,
    apyChange24h: 0.001,
    tokenVol: 0.02,
    ageDays: 1500,
    auditScore: 1,
    concentration: 0.10,
    liquidityDepth: 12000000
  }
];

export async function fetchRealTimePools(limit: number = 30): Promise<PoolData[]> {
  try {
    const r = await fetch(`http://localhost:8787/pools?limit=${limit}`)
    if (r.ok) {
      const data = await r.json()
      return data.map((p: any) => ({ ...p, score: 0 }))
    }
  } catch {}
  try {
    const response = await fetch('https://yields.llama.fi/pools');
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    const pools: DefiLlamaPool[] = data.data;
    const relevantPools = pools
      .filter(p => p.tvlUsd > 5000000 && p.apy > 0 && p.apy < 500)
      .sort((a, b) => b.tvlUsd - a.tvlUsd)
      .slice(0, limit);
    return relevantPools.map(p => enrichPoolData(p));
  } catch (error) {
    console.error("Failed to fetch live DeFi data:", error);
    return FALLBACK_POOLS;
  }
}

// Helper to generate missing risk metrics based on heuristics
function enrichPoolData(apiPool: DefiLlamaPool): PoolData {
  const isStable = 
    apiPool.symbol.includes('USD') || 
    apiPool.symbol.includes('DAI') || 
    apiPool.symbol.includes('USDT') ||
    apiPool.symbol.includes('USDC');

  const isMajorProtocol = ['aave-v2', 'aave-v3', 'curve', 'uniswap-v3', 'lido', 'compound', 'makerdao'].includes(apiPool.project);
  const isMajorChain = ['Ethereum', 'Arbitrum', 'Optimism', 'Polygon'].includes(apiPool.chain);

  // 1. Audit Score: Major protocols are usually audited
  const auditScore = isMajorProtocol ? 1 : (Math.random() > 0.4 ? 1 : 0);

  // 2. Token Volatility: Stables are low, others depend
  let tokenVol = isStable ? (0.005 + Math.random() * 0.02) : (0.3 + Math.random() * 0.5);
  // Penalize unknown chains slightly
  if (!isMajorChain) tokenVol += 0.1;

  // 3. Age: Random but weighted by protocol fame
  const ageDays = isMajorProtocol ? (800 + Math.floor(Math.random() * 500)) : (30 + Math.floor(Math.random() * 300));

  // 4. Concentration: Random
  const concentration = Math.random() * 0.4 + (isMajorProtocol ? 0 : 0.2);

  // 5. Liquidity Depth: Correlated to TVL
  const liquidityDepth = apiPool.tvlUsd * (isStable ? 0.15 : 0.05);

  // 6. APY Change: Mock 24h fluctuation
  const apyChange24h = (Math.random() - 0.5) * (apiPool.apy / 10);

  // 7. Format Name
  const formattedName = `${apiPool.project.charAt(0).toUpperCase() + apiPool.project.slice(1)}.${apiPool.symbol}`;

  return {
    id: apiPool.pool,
    name: formattedName,
    protocol: apiPool.project.charAt(0).toUpperCase() + apiPool.project.slice(1),
    chain: apiPool.chain,
    tvl: apiPool.tvlUsd,
    apy: apiPool.apy / 100, // Convert 5.5 to 0.055
    apyChange24h,
    tokenVol,
    ageDays,
    auditScore,
    concentration,
    liquidityDepth,
    score: 0, // Calculated by Risk Engine later
    status: 'Safe'
  };
}
