import { AIProvider } from './types';

/**
 * Guardrails for AI responses based on provider and use case
 */

export interface GuardrailConfig {
  dataFreshness: {
    required: boolean;
    maxAge: string;
    verificationSources: number;
    description: string;
  };
  factChecking: {
    required: boolean;
    multiSourceValidation: boolean;
    description: string;
  };
  disclaimers: string[];
}

/**
 * Strict guardrails for paid APIs (Claude)
 * Maximum emphasis on data freshness and multi-source verification
 */
export const STRICT_GUARDRAILS: GuardrailConfig = {
  dataFreshness: {
    required: true,
    maxAge: '24-48 hours',
    verificationSources: 3,
    description: 'All market data, prices, and metrics must be from the last 24-48 hours'
  },
  factChecking: {
    required: true,
    multiSourceValidation: true,
    description: 'Verify all claims across minimum 3 independent sources'
  },
  disclaimers: [
    'Crypto markets are highly volatile - data may change rapidly',
    'Always verify critical information from official sources',
    'This analysis is for informational purposes only, not financial advice'
  ]
};

/**
 * Real-time guardrails for web search APIs (Gemini Free)
 * VERY strict - web search enables near real-time data access
 */
export const MODERATE_GUARDRAILS: GuardrailConfig = {
  dataFreshness: {
    required: true,
    maxAge: 'Last 24 hours (real-time preferred)',
    verificationSources: 3,
    description: 'USE WEB SEARCH to get real-time or last 24-hour data - no exceptions for time-sensitive metrics'
  },
  factChecking: {
    required: true,
    multiSourceValidation: true,
    description: 'Verify all claims across minimum 3 independent web sources using Google Search'
  },
  disclaimers: [
    'MANDATORY: Use Google Search for all price, volume, TVL, and market data',
    'Crypto markets change by the minute - only real-time data is acceptable',
    'Cross-verify all metrics from multiple live sources (CoinGecko, DeFiLlama, blockchain explorers, official project sites)',
    'This analysis is for informational purposes only, not financial advice'
  ]
};

/**
 * Relaxed guardrails for local models (Ollama)
 * Acknowledge limitations of training data cutoff
 */
export const RELAXED_GUARDRAILS: GuardrailConfig = {
  dataFreshness: {
    required: false,
    maxAge: 'Training data cutoff',
    verificationSources: 1,
    description: 'Note: Local models have knowledge cutoff dates - recommend verifying current data externally'
  },
  factChecking: {
    required: true,
    multiSourceValidation: false,
    description: 'Provide analysis based on available training data with appropriate caveats'
  },
  disclaimers: [
    'Local model analysis based on training data - may not reflect current market conditions',
    'ALWAYS verify current prices, metrics, and developments from live sources',
    'Use this for conceptual analysis, not real-time trading decisions',
    'This analysis is for informational purposes only, not financial advice'
  ]
};

/**
 * Get appropriate guardrails based on provider
 */
export function getGuardrailsForProvider(provider: AIProvider): GuardrailConfig {
  switch (provider) {
    case 'claude':
      return STRICT_GUARDRAILS;
    case 'gemini':
      return MODERATE_GUARDRAILS;
    case 'ollama':
      return RELAXED_GUARDRAILS;
    default:
      return MODERATE_GUARDRAILS;
  }
}

/**
 * Generate guardrail instructions to append to prompts
 */
export function generateGuardrailInstructions(provider: AIProvider, enabled: boolean = true): string {
  if (!enabled) return '';

  const guardrails = getGuardrailsForProvider(provider);

  let instructions = '\n\n---\n## CRITICAL ANALYSIS REQUIREMENTS\n\n';

  // Data freshness requirements
  if (guardrails.dataFreshness.required) {
    instructions += `### Data Freshness\n`;
    instructions += `- **Requirement**: ${guardrails.dataFreshness.description}\n`;
    instructions += `- **Max Age**: ${guardrails.dataFreshness.maxAge}\n`;
    if (guardrails.dataFreshness.verificationSources > 1) {
      instructions += `- **Verification**: Cross-reference data from at least ${guardrails.dataFreshness.verificationSources} independent sources\n`;
    }
    instructions += '\n';
  }

  // Fact-checking requirements
  if (guardrails.factChecking.required) {
    instructions += `### Fact-Checking Protocol\n`;
    instructions += `- ${guardrails.factChecking.description}\n`;
    if (guardrails.factChecking.multiSourceValidation) {
      instructions += `- When making claims about prices, TVL, volumes, or other metrics, cite multiple sources\n`;
      instructions += `- Highlight any discrepancies between sources\n`;
    }
    instructions += '\n';
  }

  // Disclaimers and caveats
  if (guardrails.disclaimers.length > 0) {
    instructions += `### Important Disclaimers\n`;
    guardrails.disclaimers.forEach(disclaimer => {
      instructions += `- ${disclaimer}\n`;
    });
    instructions += '\n';
  }

  // Provider-specific instructions
  if (provider === 'gemini') {
    instructions += `### MANDATORY: Real-Time Web Search Requirements\n`;
    instructions += `- **YOU MUST** use Google Search for ALL price data, trading volumes, TVL, and market metrics\n`;
    instructions += `- **NEVER** rely on training data for numerical crypto data - it's outdated\n`;
    instructions += `- Search for: "[token] price", "[protocol] TVL", "[token] trading volume 24h", etc.\n`;
    instructions += `- Cross-reference from multiple sources:\n`;
    instructions += `  * CoinGecko (https://coingecko.com)\n`;
    instructions += `  * CoinMarketCap (https://coinmarketcap.com)\n`;
    instructions += `  * DeFiLlama (https://defillama.com)\n`;
    instructions += `  * Official project websites and dashboards\n`;
    instructions += `  * Blockchain explorers (Etherscan, etc.)\n`;
    instructions += `- Include clickable URLs to ALL sources\n`;
    instructions += `- If sources disagree, highlight discrepancies and explain why\n`;
    instructions += `- Data must be from the last 24 hours - search with "last 24 hours" qualifier\n\n`;
  } else if (provider === 'ollama') {
    instructions += `### Knowledge Limitations\n`;
    instructions += `- Clearly state your training data cutoff date\n`;
    instructions += `- For any time-sensitive data, explicitly note that users should verify from current sources\n`;
    instructions += `- Focus on conceptual analysis and frameworks rather than specific current metrics\n\n`;
  }

  instructions += `### MANDATORY Output Requirements\n`;
  instructions += `- **Analysis Date**: State the exact date and time (UTC) at the top: "Analysis Date: [YYYY-MM-DD HH:MM UTC]"\n`;
  instructions += `- **Data Timestamps**: Every single metric must include its timestamp:\n`;
  instructions += `  * "Price: $X.XX (as of YYYY-MM-DD HH:MM UTC)"\n`;
  instructions += `  * "24h Volume: $X.XXM (as of YYYY-MM-DD HH:MM UTC)"\n`;
  instructions += `  * "TVL: $X.XXM (as of YYYY-MM-DD HH:MM UTC)"\n`;
  instructions += `- **Source Citations**: Link to every source used:\n`;
  instructions += `  * Use inline links: [metric name](source URL)\n`;
  instructions += `  * Example: "Current price is [$0.15](https://coingecko.com/...) (CoinGecko) and [$0.16](https://coinmarketcap.com/...) (CMC)"\n`;
  instructions += `- **Data Quality Section**: Include at end with:\n`;
  instructions += `  * All sources used with URLs\n`;
  instructions += `  * Any data discrepancies found\n`;
  instructions += `  * Confidence level in the data (High/Medium/Low)\n`;
  instructions += `  * Any limitations or gaps in available data\n\n`;

  instructions += `### Quality & Consistency Standards\n`;
  instructions += `**CRITICAL: Follow this EXACT structure for consistent, repeatable results:**\n\n`;
  instructions += `1. **Executive Summary** (First, always)\n`;
  instructions += `   - 2-3 sentence overview\n`;
  instructions += `   - Clear investment recommendation: BUY / HOLD / SELL / AVOID\n`;
  instructions += `   - Key risk rating: LOW / MEDIUM / HIGH / CRITICAL\n`;
  instructions += `   - One-line takeaway\n\n`;
  instructions += `2. **Key Metrics Dashboard** (Bullet format)\n`;
  instructions += `   - Price & Market Cap (with timestamps)\n`;
  instructions += `   - 24h/7d/30d Performance\n`;
  instructions += `   - Volume & Liquidity\n`;
  instructions += `   - Key fundamentals (TVL, users, transactions, etc.)\n\n`;
  instructions += `3. **Core Analysis** (Main body - organized sections)\n`;
  instructions += `   Use clear H2/H3 headers for each section\n`;
  instructions += `   Be specific, quantitative, and cite sources\n\n`;
  instructions += `4. **Risk Assessment** (Dedicated section)\n`;
  instructions += `   Rate each risk category as: 🟢 LOW | 🟡 MEDIUM | 🔴 HIGH | ⚠️ CRITICAL\n`;
  instructions += `   - Smart Contract Risk:\n`;
  instructions += `   - Team & Execution Risk:\n`;
  instructions += `   - Market & Liquidity Risk:\n`;
  instructions += `   - Regulatory Risk:\n`;
  instructions += `   - Competitive Risk:\n\n`;
  instructions += `5. **Investment Thesis** (Bull/Bear cases)\n`;
  instructions += `   **Bull Case (3-5 points):**\n`;
  instructions += `   - [Specific reason with data]\n`;
  instructions += `   **Bear Case (3-5 points):**\n`;
  instructions += `   - [Specific reason with data]\n\n`;
  instructions += `6. **Actionable Recommendations** (Concrete, specific)\n`;
  instructions += `   - Entry Strategy: [Specific price levels or conditions]\n`;
  instructions += `   - Position Sizing: [Recommended % of portfolio]\n`;
  instructions += `   - Stop Loss: [Specific price or percentage]\n`;
  instructions += `   - Take Profit Targets: [Specific levels]\n`;
  instructions += `   - Time Horizon: [Days/weeks/months]\n`;
  instructions += `   - Catalysts to Watch: [Specific upcoming events with dates]\n\n`;
  instructions += `**Writing Quality Standards:**\n`;
  instructions += `- Use precise numbers with sources, not vague terms\n`;
  instructions += `- Good: "TVL increased 47% from $120M to $176M (DeFiLlama)"\n`;
  instructions += `- Bad: "TVL increased significantly"\n`;
  instructions += `- Be objective - present both positive and negative aspects\n`;
  instructions += `- Use consistent formatting throughout\n`;
  instructions += `- Bold key metrics and conclusions\n`;
  instructions += `- Use tables/lists for easy scanning\n`;
  instructions += `- Write for decision-making, not just information\n`;
  instructions += `\n---\n`;

  return instructions;
}

/**
 * Get user-friendly description of guardrails for a provider
 */
export function getGuardrailDescription(provider: AIProvider): string {
  const guardrails = getGuardrailsForProvider(provider);
  return guardrails.dataFreshness.description;
}
