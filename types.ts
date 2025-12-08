export interface PoolData {
  id: string;
  name: string;
  chain: string;
  protocol: string;
  // Raw Metrics
  tvl: number; // in USD
  apy: number; // decimal (0.1 = 10%)
  apyChange24h: number; // relative change
  tokenVol: number; // 30-day volatility
  ageDays: number;
  auditScore: 0 | 1; // 1 = audited, 0 = no
  concentration: number; // top 10 holders share
  liquidityDepth: number; // slippage est for 10k
  
  // Computed State
  score?: number;
  status?: 'Safe' | 'Caution' | 'Risky';
  lastUpdated?: Date;
}

export interface RiskScoreComponents {
  s_tvl: number;
  s_audit: number;
  s_age: number;
  s_concentration: number;
  s_liquidity: number;
  s_apy_change: number;
  s_volatility: number;
  s_apy: number;
}

export interface RiskAnalysisResult {
  score: number;
  details: RiskScoreComponents;
  summary: string;
  reasons: string[];
}

export interface Alert {
  id: string;
  poolId: string;
  title: string;
  message: string;
  timestamp: number;
  type: 'info' | 'warning' | 'critical';
}