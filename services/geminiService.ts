import { GoogleGenAI } from "@google/genai";
import { PoolData, RiskAnalysisResult } from '../types';

// Initialize Gemini
// Note: In a real app, strict error handling for missing key is needed.
const apiKey = process.env.API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export async function getAiRiskExplanation(pool: PoolData, risk: RiskAnalysisResult): Promise<string> {
  if (!ai) {
    return "AI Agent not connected. Please provide API Key to enable autonomous analysis.";
  }

  try {
    const prompt = `
      You are YieldBodyguard, an autonomous DeFi safety agent.
      Analyze the following DeFi pool metrics and the calculated risk score.
      
      Pool Name: ${pool.name}
      Protocol: ${pool.protocol}
      Risk Score: ${risk.score}/100 (0 is dangerous, 100 is safe)
      
      Key Metrics:
      - TVL: $${pool.tvl.toLocaleString()}
      - APY: ${(pool.apy * 100).toFixed(2)}%
      - Volatility: ${pool.tokenVol}
      - Audit: ${pool.auditScore === 1 ? 'Yes' : 'No'}
      - Concentration: ${(pool.concentration * 100).toFixed(1)}%
      
      Identified Risk Factors: ${risk.reasons.join(', ')}
      
      Provide a 2-sentence explanation for a non-technical user.
      First sentence: Explain the main driver of the score.
      Second sentence: Give a direct recommendation (Hold, Monitor, or Exit).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Agent is offline. Unable to generate real-time explanation.";
  }
}