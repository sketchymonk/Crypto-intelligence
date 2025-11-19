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
 * Strict guardrails for paid APIs (Claude, paid Gemini)
 * Emphasize data freshness and multi-source verification
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
 * Moderate guardrails for free APIs with web search (Gemini Free)
 * Still emphasize freshness but slightly relaxed
 */
export const MODERATE_GUARDRAILS: GuardrailConfig = {
  dataFreshness: {
    required: true,
    maxAge: '1-7 days',
    verificationSources: 2,
    description: 'Prioritize recent data (within 1-7 days) and cross-reference key metrics'
  },
  factChecking: {
    required: true,
    multiSourceValidation: true,
    description: 'Cross-reference important claims with at least 2 sources'
  },
  disclaimers: [
    'Use web search to find the most recent available data',
    'Verify time-sensitive information from multiple sources',
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
    instructions += `### Use Google Search\n`;
    instructions += `- Actively use Google Search to find the most recent data\n`;
    instructions += `- Include URLs to sources in your analysis\n`;
    instructions += `- Prioritize official project websites, blockchain explorers, and reputable data aggregators\n\n`;
  } else if (provider === 'ollama') {
    instructions += `### Knowledge Limitations\n`;
    instructions += `- Clearly state your training data cutoff date\n`;
    instructions += `- For any time-sensitive data, explicitly note that users should verify from current sources\n`;
    instructions += `- Focus on conceptual analysis and frameworks rather than specific current metrics\n\n`;
  }

  instructions += `### Output Requirements\n`;
  instructions += `- Always timestamp your analysis with "Analysis Date: [current date]"\n`;
  instructions += `- Note the recency of all data points used (e.g., "as of [date]")\n`;
  instructions += `- Include a "Data Quality" section noting any limitations or gaps\n`;
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
