import { AIProvider } from './types';

/**
 * Feature suggestion system for continuous improvement feedback loop
 * Generates 4 contextual suggestions based on current analysis context
 */

export interface FeatureSuggestion {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'data' | 'analysis' | 'visualization' | 'workflow' | 'integration';
}

/**
 * Core feature suggestions that are always relevant
 */
const CORE_SUGGESTIONS: FeatureSuggestion[] = [
  {
    title: 'Real-time Price Alerts',
    description: 'Set up automated alerts for price movements, TVL changes, or significant on-chain events',
    priority: 'high',
    category: 'data'
  },
  {
    title: 'Historical Comparison Mode',
    description: 'Compare current metrics against historical snapshots (30d, 90d, 1y ago) to identify trends',
    priority: 'medium',
    category: 'analysis'
  },
  {
    title: 'Multi-Token Portfolio Analysis',
    description: 'Analyze multiple tokens simultaneously with correlation matrices and portfolio optimization',
    priority: 'high',
    category: 'analysis'
  },
  {
    title: 'Export to Investment Memo PDF',
    description: 'One-click export of analysis to formatted PDF investment memo with charts and citations',
    priority: 'medium',
    category: 'workflow'
  },
  {
    title: 'Smart Contract Risk Scanner',
    description: 'Automated security analysis of smart contracts with vulnerability detection and audit history',
    priority: 'high',
    category: 'data'
  },
  {
    title: 'Social Sentiment Dashboard',
    description: 'Real-time Twitter/Reddit sentiment analysis with influencer tracking and narrative trends',
    priority: 'medium',
    category: 'data'
  },
  {
    title: 'Whale Wallet Tracker',
    description: 'Monitor large holder movements, accumulation patterns, and smart money flows',
    priority: 'high',
    category: 'data'
  },
  {
    title: 'Automated Daily Briefing',
    description: 'Scheduled daily/weekly summaries of tracked tokens with key changes and action items',
    priority: 'medium',
    category: 'workflow'
  },
  {
    title: 'On-Chain Metrics Dashboard',
    description: 'Interactive charts for active addresses, transaction volumes, DEX flows, and network health',
    priority: 'high',
    category: 'visualization'
  },
  {
    title: 'Competitor Benchmark Matrix',
    description: 'Side-by-side comparison of similar protocols with automated ranking and scoring',
    priority: 'medium',
    category: 'analysis'
  },
  {
    title: 'Token Unlock Calendar',
    description: 'Visual timeline of upcoming vesting schedules, team unlocks, and supply inflation events',
    priority: 'high',
    category: 'data'
  },
  {
    title: 'Regulatory News Aggregator',
    description: 'Automated tracking of regulatory developments, compliance changes, and legal risks',
    priority: 'medium',
    category: 'data'
  },
  {
    title: 'Backtesting Framework',
    description: 'Test trading strategies against historical data with risk-adjusted returns analysis',
    priority: 'high',
    category: 'analysis'
  },
  {
    title: 'DeFi Yield Optimizer',
    description: 'Find best yield opportunities across protocols with risk-adjusted APY recommendations',
    priority: 'medium',
    category: 'analysis'
  },
  {
    title: 'Custom Metric Builder',
    description: 'Create custom formulas and ratios (e.g., P/F ratio, Realized Cap MVRV) for your analysis',
    priority: 'medium',
    category: 'workflow'
  },
  {
    title: 'Blockchain Explorer Integration',
    description: 'Direct links to transaction data, contract code, and wallet analytics on Etherscan/etc.',
    priority: 'low',
    category: 'integration'
  },
  {
    title: 'AI-Powered Anomaly Detection',
    description: 'Automatically flag unusual patterns in price, volume, or on-chain metrics',
    priority: 'high',
    category: 'analysis'
  },
  {
    title: 'Team Collaboration Features',
    description: 'Share analyses, leave comments, and collaborate on research with team members',
    priority: 'low',
    category: 'workflow'
  },
  {
    title: 'Macro Correlation Analysis',
    description: 'Correlate crypto metrics with traditional markets (S&P500, DXY, gold, etc.)',
    priority: 'medium',
    category: 'analysis'
  },
  {
    title: 'Voice-to-Research Mode',
    description: 'Speak your research questions and get instant AI-generated analysis',
    priority: 'low',
    category: 'workflow'
  }
];

/**
 * Template-specific suggestions based on research type
 */
const TEMPLATE_SUGGESTIONS: Record<string, FeatureSuggestion[]> = {
  'defi-protocol': [
    {
      title: 'TVL Decomposition Analysis',
      description: 'Break down TVL by asset type, chain, and pool to identify concentration risks',
      priority: 'high',
      category: 'data'
    },
    {
      title: 'Smart Contract Upgrade Tracker',
      description: 'Monitor protocol upgrades, governance proposals, and parameter changes',
      priority: 'medium',
      category: 'data'
    },
    {
      title: 'IL Calculator for Liquidity Providers',
      description: 'Calculate impermanent loss scenarios across different price movements',
      priority: 'medium',
      category: 'analysis'
    },
    {
      title: 'Protocol Revenue vs Token Price',
      description: 'Analyze correlation between protocol fees and token valuation',
      priority: 'high',
      category: 'analysis'
    }
  ],
  'token-analysis': [
    {
      title: 'Token Distribution Visualization',
      description: 'Interactive Sankey diagram of token allocation and vesting schedules',
      priority: 'high',
      category: 'visualization'
    },
    {
      title: 'Holder Concentration Analysis',
      description: 'Gini coefficient and top-10/top-100 holder percentage tracking',
      priority: 'high',
      category: 'data'
    },
    {
      title: 'Exchange Flow Monitoring',
      description: 'Track net inflows/outflows from exchanges as buy/sell pressure indicators',
      priority: 'high',
      category: 'data'
    },
    {
      title: 'Liquidity Depth Analysis',
      description: 'Measure order book depth and slippage for different trade sizes',
      priority: 'medium',
      category: 'data'
    }
  ],
  'investment-thesis': [
    {
      title: 'Risk-Adjusted Return Calculator',
      description: 'Calculate Sharpe ratio, Sortino ratio, and max drawdown for portfolio sizing',
      priority: 'high',
      category: 'analysis'
    },
    {
      title: 'Scenario Analysis Tool',
      description: 'Model bull/base/bear cases with probability-weighted expected returns',
      priority: 'high',
      category: 'analysis'
    },
    {
      title: 'Position Sizing Optimizer',
      description: 'Recommend optimal position sizes based on conviction level and risk tolerance',
      priority: 'medium',
      category: 'analysis'
    },
    {
      title: 'Thesis Tracking Dashboard',
      description: 'Monitor key metrics that validate or invalidate your investment thesis over time',
      priority: 'high',
      category: 'workflow'
    }
  ],
  'security-audit': [
    {
      title: 'Historical Exploit Database',
      description: 'Search past hacks and exploits for similar protocols or contract patterns',
      priority: 'high',
      category: 'data'
    },
    {
      title: 'Audit Firm Reputation Tracker',
      description: 'Compare audit quality across firms based on post-audit incident rates',
      priority: 'medium',
      category: 'analysis'
    },
    {
      title: 'Bug Bounty Program Monitor',
      description: 'Track bug bounty payouts and vulnerability disclosure history',
      priority: 'medium',
      category: 'data'
    },
    {
      title: 'Admin Key Risk Analysis',
      description: 'Identify multisig configurations, upgrade capabilities, and centralization vectors',
      priority: 'high',
      category: 'analysis'
    }
  ]
};

/**
 * Provider-specific suggestions
 */
const PROVIDER_SUGGESTIONS: Record<AIProvider, FeatureSuggestion[]> = {
  'claude': [
    {
      title: 'Long-Form Report Generation',
      description: 'Leverage Claude\'s extended context for comprehensive 10,000+ word research reports',
      priority: 'high',
      category: 'analysis'
    },
    {
      title: 'Complex Financial Modeling',
      description: 'Use Claude for advanced DCF models, Monte Carlo simulations, and options pricing',
      priority: 'medium',
      category: 'analysis'
    }
  ],
  'gemini': [
    {
      title: 'Real-Time News Integration',
      description: 'Use Gemini\'s web search to auto-fetch breaking news and recent developments',
      priority: 'high',
      category: 'data'
    },
    {
      title: 'Multi-Source Price Aggregation',
      description: 'Automatically pull prices from CoinGecko, CMC, and DEXes via web search',
      priority: 'high',
      category: 'data'
    }
  ],
  'ollama': [
    {
      title: 'Offline Research Mode',
      description: 'Create comprehensive analysis frameworks that work without internet connectivity',
      priority: 'medium',
      category: 'workflow'
    },
    {
      title: 'Privacy-First Analysis',
      description: 'Analyze sensitive portfolio positions locally without exposing data to APIs',
      priority: 'high',
      category: 'workflow'
    }
  ]
};

/**
 * Generate 4 contextual feature suggestions
 */
export function generateFeatureSuggestions(
  templateId?: string,
  provider?: AIProvider,
  includeProviderSpecific: boolean = true
): FeatureSuggestion[] {
  const suggestions: FeatureSuggestion[] = [];

  // Add template-specific suggestions (1-2 suggestions)
  if (templateId && TEMPLATE_SUGGESTIONS[templateId]) {
    const templateSuggs = TEMPLATE_SUGGESTIONS[templateId];
    // Pick 2 random template-specific suggestions
    const shuffled = [...templateSuggs].sort(() => Math.random() - 0.5);
    suggestions.push(...shuffled.slice(0, 2));
  }

  // Add provider-specific suggestion (0-1 suggestions)
  if (includeProviderSpecific && provider && PROVIDER_SUGGESTIONS[provider]) {
    const providerSuggs = PROVIDER_SUGGESTIONS[provider];
    const randomProvider = providerSuggs[Math.floor(Math.random() * providerSuggs.length)];
    suggestions.push(randomProvider);
  }

  // Fill remaining slots with core suggestions
  const remainingSlots = 4 - suggestions.length;
  if (remainingSlots > 0) {
    const usedTitles = new Set(suggestions.map(s => s.title));
    const availableCore = CORE_SUGGESTIONS.filter(s => !usedTitles.has(s.title));
    const shuffled = [...availableCore].sort(() => Math.random() - 0.5);
    suggestions.push(...shuffled.slice(0, remainingSlots));
  }

  // Ensure we always return exactly 4 suggestions
  return suggestions.slice(0, 4);
}

/**
 * Format feature suggestions as markdown for appending to prompts
 */
export function formatFeatureSuggestionsMarkdown(suggestions: FeatureSuggestion[]): string {
  let markdown = '\n\n---\n## 💡 Suggested Enhancements\n\n';
  markdown += '*Consider these features to improve your next analysis:*\n\n';

  suggestions.forEach((suggestion, index) => {
    const priorityEmoji = {
      high: '🔥',
      medium: '⭐',
      low: '💡'
    }[suggestion.priority];

    const categoryLabel = {
      data: 'Data',
      analysis: 'Analysis',
      visualization: 'Visualization',
      workflow: 'Workflow',
      integration: 'Integration'
    }[suggestion.category];

    markdown += `${index + 1}. **${suggestion.title}** ${priorityEmoji}\n`;
    markdown += `   - ${suggestion.description}\n`;
    markdown += `   - *Category: ${categoryLabel} | Priority: ${suggestion.priority.toUpperCase()}*\n\n`;
  });

  markdown += '*Which of these features would be most valuable for your research? Let us know!*\n';

  return markdown;
}

/**
 * Get user-friendly description of the feature suggestion system
 */
export function getFeatureSuggestionDescription(): string {
  return 'Every analysis includes 4 contextual feature suggestions for continuous improvement';
}
