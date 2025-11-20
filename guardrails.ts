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

  instructions += `### PROFESSIONAL FORMATTING REQUIREMENTS\n`;
  instructions += `**MANDATORY: Use tables and bullet points extensively for maximum readability and professionalism**\n\n`;

  instructions += `**When to Use Tables:**\n`;
  instructions += `- ✅ Comparing multiple items (competitors, metrics over time, feature comparisons)\n`;
  instructions += `- ✅ Displaying numerical data (prices, volumes, performance metrics)\n`;
  instructions += `- ✅ Showing relationships between categories and values\n`;
  instructions += `- ✅ Presenting time-series data (historical performance, roadmap milestones)\n`;
  instructions += `- ✅ Feature matrices, risk assessments, scoring rubrics\n\n`;

  instructions += `**Table Formatting Standards:**\n`;
  instructions += `\`\`\`markdown\n`;
  instructions += `| Metric | Current Value | 7d Change | 30d Change | Source |\n`;
  instructions += `|--------|---------------|-----------|------------|--------|\n`;
  instructions += `| Price | $2.45 | +12.3% | -8.5% | [CoinGecko](url) |\n`;
  instructions += `| Market Cap | $1.2B | +15.7% | -5.2% | [CMC](url) |\n`;
  instructions += `| 24h Volume | $145M | +23.1% | +12.4% | [CoinGecko](url) |\n`;
  instructions += `\`\`\`\n\n`;

  instructions += `**When to Use Bullet Points:**\n`;
  instructions += `- ✅ Listing features, benefits, or risks\n`;
  instructions += `- ✅ Breaking down complex concepts into digestible points\n`;
  instructions += `- ✅ Enumeration of steps, processes, or recommendations\n`;
  instructions += `- ✅ Key takeaways and highlights\n`;
  instructions += `- ✅ Pros and cons lists\n\n`;

  instructions += `**Bullet Point Formatting Standards:**\n`;
  instructions += `- Use **bold** for the main point, then explain:\n`;
  instructions += `  * **Strong Community Growth**: Discord members increased 45% (12K → 17.4K) in 30 days\n`;
  instructions += `  * **Institutional Interest**: Grayscale added $8M position (source: 13F filing)\n`;
  instructions += `- Use sub-bullets (with *, -, or indentation) for supporting details\n`;
  instructions += `- Keep each point concise (1-2 sentences maximum)\n`;
  instructions += `- Start with action verbs or key descriptors\n`;
  instructions += `- Include data/evidence in parentheses or as sub-bullets\n\n`;

  instructions += `**Required Table Uses (Must Include):**\n`;
  instructions += `1. **Performance Comparison Table** - Show price/volume/metrics across timeframes:\n`;
  instructions += `   | Timeframe | Price Change | Volume Change | Key Events |\n`;
  instructions += `   |-----------|--------------|---------------|-----------|\n\n`;

  instructions += `2. **Competitive Analysis Table** - Compare with 3-5 competitors:\n`;
  instructions += `   | Project | Market Cap | TVL | Users | Key Advantage |\n`;
  instructions += `   |---------|------------|-----|-------|---------------|\n\n`;

  instructions += `3. **Risk Matrix Table** - Quantify each risk dimension:\n`;
  instructions += `   | Risk Category | Rating | Impact | Mitigation | Likelihood |\n`;
  instructions += `   |---------------|--------|--------|------------|------------|\n\n`;

  instructions += `4. **Token Metrics Table** - Key tokenomics data:\n`;
  instructions += `   | Metric | Value | Notes | Source |\n`;
  instructions += `   |--------|-------|-------|--------|\n\n`;

  instructions += `**Example: Professional Multi-Table Analysis**\n`;
  instructions += `\`\`\`markdown\n`;
  instructions += `## Market Performance Analysis\n\n`;

  instructions += `### Current Metrics (as of 2025-01-15 14:30 UTC)\n\n`;

  instructions += `| Metric | Value | 24h Change | 7d Change | Source |\n`;
  instructions += `|--------|-------|------------|-----------|--------|\n`;
  instructions += `| Price | $2.45 | +5.2% 🟢 | -3.1% 🔴 | [CoinGecko](url) |\n`;
  instructions += `| Market Cap | $1.2B | +4.8% 🟢 | -2.9% 🔴 | [CMC](url) |\n`;
  instructions += `| 24h Volume | $145M | +23.4% 🟢 | +15.7% 🟢 | [CoinGecko](url) |\n`;
  instructions += `| Circ. Supply | 489M | - | - | [Etherscan](url) |\n\n`;

  instructions += `### Key Strengths\n`;
  instructions += `- **Revenue Growth**: Protocol revenue up 127% QoQ ($2.1M → $4.8M)\n`;
  instructions += `  * Fee revenue: $3.2M (+145%)\n`;
  instructions += `  * Token burns: $1.6M (+98%)\n`;
  instructions += `- **User Adoption**: Daily active users increased 34% (45K → 60K)\n`;
  instructions += `  * Retention rate: 67% (industry avg: 42%)\n`;
  instructions += `  * Power users (>10 txns/day): +89%\n`;
  instructions += `- **Partnership Momentum**: 3 major integrations announced\n`;
  instructions += `  * Chainlink integration (Jan 10) - oracle services\n`;
  instructions += `  * Aave V3 (Jan 12) - lending integration\n`;
  instructions += `  * MakerDAO (upcoming Q1) - collateral addition\n\n`;

  instructions += `### Competitive Positioning\n\n`;

  instructions += `| Project | Market Cap | TVL | Daily Users | Unique Feature |\n`;
  instructions += `|---------|------------|-----|-------------|----------------|\n`;
  instructions += `| **This Project** | $1.2B | $450M | 60K | Cross-chain native |\n`;
  instructions += `| Competitor A | $2.1B | $890M | 85K | Established brand |\n`;
  instructions += `| Competitor B | $890M | $320M | 42K | Low fees |\n`;
  instructions += `| Competitor C | $1.5B | $510M | 71K | Mobile-first |\n`;
  instructions += `\`\`\`\n\n`;

  instructions += `**Writing Quality Standards:**\n`;
  instructions += `- Use precise numbers with sources, not vague terms\n`;
  instructions += `- Good: "TVL increased 47% from $120M to $176M (DeFiLlama)"\n`;
  instructions += `- Bad: "TVL increased significantly"\n`;
  instructions += `- Be objective - present both positive and negative aspects\n`;
  instructions += `- Use consistent formatting throughout\n`;
  instructions += `- **ALWAYS use tables for comparisons and numerical data**\n`;
  instructions += `- **ALWAYS use bullet points for lists and enumerations**\n`;
  instructions += `- Use emojis sparingly for visual indicators (🟢 🔴 🟡 ⚠️ ✅ ❌)\n`;
  instructions += `- Bold key metrics and conclusions\n`;
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
