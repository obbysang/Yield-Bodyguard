import { PoolData, RiskAnalysisResult, RiskScoreComponents } from '../types';

// Helper sigmoid function
function sigmoid(x: number, k: number = 1, x0: number = 0.1): number {
  return 1 / (1 + Math.exp(-k * (x - x0)));
}

// Clamp helper
function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

export function computeScore(pool: PoolData): RiskAnalysisResult {
  const {
    tvl,
    apy,
    tokenVol,
    ageDays,
    auditScore,
    concentration,
    liquidityDepth,
    apyChange24h,
  } = pool;

  // 1. Compute Sub-scores (normalized 0..1)
  
  // s_tvl = sigmoid(log(TVL_t + 1)) — more TVL => safer
  // Using a flatter sigmoid for TVL to scale well with millions
  const s_tvl = sigmoid(Math.log10(tvl + 1) / 5, 1, 1); 

  // s_audit = Audit_score
  const s_audit = auditScore;

  // s_age = sigmoid(Age_pool_days / 30) — older is safer
  const s_age = sigmoid(ageDays / 30, 1, 1);

  // s_concentration = 1 - Concentration — more decentralization safer
  const s_concentration = 1 - concentration;

  // s_liquidity = sigmoid(Liquidity_depth_threshold / Liquidity_depth)
  // PDF formula: sigmoid(Liquidity_depth / 1000, 1, 1)
  const s_liquidity = sigmoid(liquidityDepth / 1000, 1, 1);

  // s_apyy_change = 1 - clamp(|ΔAPY_24h| / 0.5, 0, 1) — huge APY swings unsafe
  const s_apy_change = 1 - clamp(Math.abs(apyChange24h) / 0.5, 0, 1);

  // s_volatility = 1 - sigmoid(Vol_token_30d, k=1, x0=0.1) — lower vol => safer
  // PDF uses k=5 for vol penalty
  const s_volatility = 1 - sigmoid(tokenVol, 5, 0.1);

  // s_apy = clamp((APY_t / APY_baseline), 0, 1) where baseline=0.2
  // But wait, PDF formula for final score uses `(1 - s_apy)` effectively penalizing high APY?
  // Let's re-read carefully: "The s_APY_weighted penalizes 'too high' APY beyond sustainable ranges."
  // w7*(1 - s_volatility) * (1 - s_APY_weighted)
  const s_apy_weighted = clamp(apy / 0.2, 0, 1); 


  // 2. Weights
  const w = {
    w1: 0.22, // TVL
    w2: 0.18, // Audit
    w3: 0.12, // Age
    w4: 0.12, // Concentration
    w5: 0.12, // Liquidity
    w6: 0.12, // APY Stability
    w7: 0.12, // Volatility & Sustainable APY interaction
  };

  // 3. Final Calculation
  // S = 100 * ( ... )
  let rawScore = 
    w.w1 * s_tvl +
    w.w2 * s_audit +
    w.w3 * s_age +
    w.w4 * s_concentration +
    w.w5 * s_liquidity +
    w.w6 * s_apy_change +
    w.w7 * (1 - s_volatility) * (1 - s_apy_weighted); // If vol is high OR apy is crazy high, this term drops

  // Normalize to 0-100 integer
  const score = Math.round(Math.max(0, Math.min(rawScore * 100, 100)));

  // 4. Explainability Reasons
  const reasons: string[] = [];
  if (apy > 1.0) reasons.push("APY is unusually high (>100%)");
  if (tokenVol > 0.2) reasons.push("High reward token volatility");
  if (auditScore === 0) reasons.push("No external audit detected");
  if (concentration > 0.3) reasons.push("High token holder concentration");
  if (Math.abs(apyChange24h) > 0.2) reasons.push("Rapid APY swings in last 24h");
  if (tvl < 100000) reasons.push("Low Total Value Locked");

  const details: RiskScoreComponents = {
    s_tvl, s_audit, s_age, s_concentration, s_liquidity, s_apy_change, s_volatility, s_apy: s_apy_weighted
  };

  return {
    score,
    details,
    reasons,
    summary: reasons.slice(0, 3).join("; ") || "Pool metrics appear stable.",
  };
}