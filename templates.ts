import { FormData } from './types';

/**
 * Pre-configured templates for common crypto research scenarios
 */

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'defi' | 'l1' | 'token' | 'security' | 'trading';
  formData: FormData;
}

export const TEMPLATES: Template[] = [
  {
    id: 'defi-protocol',
    name: 'DeFi Protocol Analysis',
    description: 'Comprehensive analysis of DeFi protocols including TVL, smart contracts, and tokenomics',
    category: 'defi',
    formData: {
      context: {
        experts: ['Lead Tokenomics Analyst', 'On-Chain/Data Engineer', 'Security Auditor'],
        purpose: 'Inform trading/investment decision',
        actionability: 'Practical trading plan',
        priorKnowledge: 'Understanding of DeFi primitives, AMMs, and yield farming',
        gaps: 'Current TVL trends, recent smart contract changes, competitor comparison'
      },
      coreQuestion: {
        primaryQuestion: 'What is the risk-adjusted return potential for this DeFi protocol over the next 6-12 months?',
        hypothesis: 'Protocol has sustainable tokenomics and growing TVL with competitive yields',
        counterfactuals: 'Bull case: Increasing adoption and fee revenue. Bear case: TVL migration to competitors or regulatory pressure'
      },
      specifications: {
        timePeriod: 'Last 6 months',
        sectorFocus: ['DeFi'],
        demographicFocus: ['Retail', 'Institutional'],
        methodology: ['Fundamental Analysis', 'On-chain Quant Analysis', 'Technical/Chart Analysis'],
        ethics: 'Assess smart contract risks, team doxxing, and potential rug pull indicators'
      },
      output: {
        executiveSummary: 'Yes',
        depth: 'Level 3',
        contentElements: ['trends', 'dataCharts', 'players', 'viewpoints', 'alphaSignals'],
        visualizations: ['TVL/Fee heatmaps', 'Price/Volume charts'],
        targetLength: '2,500-4,000 words',
        citationStyle: 'Inline links'
      },
      format: {
        writingFormat: 'Investment Memo',
        writingPerspective: 'Third-person'
      },
      cryptoModules: {
        modules: ['tokenomics', 'onChain', 'marketStructure', 'security', 'competitive']
      }
    }
  },
  {
    id: 'l1-comparison',
    name: 'L1 Blockchain Comparison',
    description: 'Side-by-side analysis of Layer 1 blockchains focusing on performance, ecosystem, and valuation',
    category: 'l1',
    formData: {
      context: {
        experts: ['On-Chain/Data Engineer', 'Macro Strategist'],
        purpose: 'Long-form report',
        actionability: 'Strategic',
        priorKnowledge: 'Basics of blockchain consensus, TPS, and finality',
        gaps: 'Developer activity trends, real-world TPS vs theoretical, institutional adoption'
      },
      coreQuestion: {
        primaryQuestion: 'Which L1 blockchain offers the best risk-reward for the next bull cycle?',
        hypothesis: 'Certain L1s are undervalued relative to developer activity and ecosystem growth',
        counterfactuals: 'Bull: Strong developer community and institutional adoption. Bear: Network congestion and high fees drive users away'
      },
      specifications: {
        timePeriod: 'Last 12 months',
        sectorFocus: ['L1', 'Infrastructure'],
        demographicFocus: ['Institutional', 'Developer cohorts'],
        methodology: ['Fundamental Analysis', 'On-chain Quant Analysis', 'Predictive Modeling'],
        ethics: 'Decentralization concerns, validator concentration'
      },
      output: {
        executiveSummary: 'Yes',
        depth: 'Level 3',
        contentElements: ['trends', 'dataCharts', 'caseStudies', 'players', 'predictions', 'alphaSignals'],
        visualizations: ['Network graphs', 'Price/Volume charts'],
        targetLength: '3,000-5,000 words',
        citationStyle: 'Inline links'
      },
      format: {
        writingFormat: 'White Paper',
        writingPerspective: 'Neutral/Formal Tone'
      },
      cryptoModules: {
        modules: ['tokenomics', 'onChain', 'governance', 'competitive', 'technical']
      }
    }
  },
  {
    id: 'new-token',
    name: 'New Token Evaluation',
    description: 'Due diligence framework for newly launched tokens and projects',
    category: 'token',
    formData: {
      context: {
        experts: ['Lead Tokenomics Analyst', 'Security Auditor', 'Regulatory Counsel'],
        purpose: 'Risk memo',
        actionability: 'Practical trading plan',
        priorKnowledge: 'Token just launched, limited historical data',
        gaps: 'Team background verification, tokenomics sustainability, smart contract audit status'
      },
      coreQuestion: {
        primaryQuestion: 'Is this new token a legitimate investment opportunity or a potential scam?',
        hypothesis: 'Token has credible team, audited contracts, and sustainable tokenomics',
        counterfactuals: 'Bull: Early entry into legitimate project. Bear: Rug pull, poor tokenomics leading to dump'
      },
      specifications: {
        timePeriod: 'Last 30 days',
        sectorFocus: ['DeFi', 'Gaming', 'Infrastructure'],
        demographicFocus: ['Retail'],
        methodology: ['Fundamental Analysis', 'Sentiment Analysis', 'Event-Driven Analysis'],
        ethics: 'Red flags: anonymous team, no audit, high token concentration, unrealistic promises'
      },
      output: {
        executiveSummary: 'Yes',
        depth: 'Level 2',
        contentElements: ['trends', 'players', 'viewpoints', 'implications', 'alphaSignals'],
        visualizations: ['Unlock timelines', 'Wallet cohort flows'],
        targetLength: '1,500-2,500 words',
        citationStyle: 'Inline links'
      },
      format: {
        writingFormat: 'Investment Memo',
        writingPerspective: 'Third-person'
      },
      cryptoModules: {
        modules: ['tokenomics', 'security', 'social', 'newsflow']
      }
    }
  },
  {
    id: 'security-audit',
    name: 'Security Audit Review',
    description: 'Deep dive into smart contract security, audit reports, and historical vulnerabilities',
    category: 'security',
    formData: {
      context: {
        experts: ['Security Auditor', 'On-Chain/Data Engineer'],
        purpose: 'Risk memo',
        actionability: 'Strategic',
        priorKnowledge: 'Basic understanding of smart contract vulnerabilities',
        gaps: 'Recent audit findings, historical exploit patterns, bug bounty program details'
      },
      coreQuestion: {
        primaryQuestion: 'What are the critical security risks and how well are they mitigated?',
        hypothesis: 'Protocol has robust security practices and minimal vulnerability surface',
        counterfactuals: 'Bull: Multiple audits, active bug bounty, no incidents. Bear: Unaudited code, complex architecture, history of exploits'
      },
      specifications: {
        timePeriod: 'All-time (focus on last 12 months)',
        sectorFocus: ['DeFi', 'Infrastructure'],
        demographicFocus: ['Institutional'],
        methodology: ['Fundamental Analysis', 'Event-Driven Analysis'],
        ethics: 'Disclosure of vulnerabilities, responsible reporting'
      },
      output: {
        executiveSummary: 'Yes',
        depth: 'Level 3',
        contentElements: ['trends', 'caseStudies', 'players', 'implications'],
        visualizations: [],
        targetLength: '2,000-3,500 words',
        citationStyle: 'Footnotes'
      },
      format: {
        writingFormat: 'Academic Paper',
        writingPerspective: 'Neutral/Formal Tone'
      },
      cryptoModules: {
        modules: ['security', 'governance', 'newsflow']
      }
    }
  },
  {
    id: 'trading-setup',
    name: 'Trading Setup Analysis',
    description: 'Technical analysis and entry/exit strategy for active trading',
    category: 'trading',
    formData: {
      context: {
        experts: ['Macro Strategist', 'On-Chain/Data Engineer'],
        purpose: 'Inform trading/investment decision',
        actionability: 'Practical trading plan',
        priorKnowledge: 'Basic technical analysis, support/resistance levels',
        gaps: 'Current market sentiment, whale wallet movements, funding rates'
      },
      coreQuestion: {
        primaryQuestion: 'What is the optimal entry, target, and stop-loss for this trade setup?',
        hypothesis: 'Technical indicators and on-chain metrics align for a high-probability trade',
        counterfactuals: 'Bull: Breakout above resistance with volume. Bear: Rejection at resistance, negative funding'
      },
      specifications: {
        timePeriod: 'Last 7-30 days',
        sectorFocus: ['L1', 'L2', 'DeFi'],
        demographicFocus: ['Retail', 'Institutional'],
        methodology: ['Technical/Chart Analysis', 'On-chain Quant Analysis', 'Sentiment Analysis'],
        ethics: 'No market manipulation, responsible position sizing'
      },
      output: {
        executiveSummary: 'Yes',
        depth: 'Level 2',
        contentElements: ['trends', 'dataCharts', 'predictions', 'alphaSignals'],
        visualizations: ['Price/Volume charts', 'RSI/MACD indicators', 'Wallet cohort flows'],
        targetLength: '1,000-1,500 words',
        citationStyle: 'Inline links'
      },
      format: {
        writingFormat: 'Markdown Report',
        writingPerspective: 'Third-person'
      },
      cryptoModules: {
        modules: ['onChain', 'marketStructure', 'social', 'technical']
      }
    }
  },
  {
    id: 'tokenomics-deep-dive',
    name: 'Tokenomics Deep Dive',
    description: 'Comprehensive analysis of token distribution, vesting, emissions, and economic model',
    category: 'token',
    formData: {
      context: {
        experts: ['Lead Tokenomics Analyst', 'Macro Strategist'],
        purpose: 'Long-form report',
        actionability: 'Strategic',
        priorKnowledge: 'Understanding of token supply dynamics and incentive mechanisms',
        gaps: 'Upcoming unlock schedules, emission rate changes, treasury management'
      },
      coreQuestion: {
        primaryQuestion: 'Is the tokenomics model sustainable and aligned with long-term value accrual?',
        hypothesis: 'Token has balanced emissions, clear utility, and value capture mechanisms',
        counterfactuals: 'Bull: Deflationary pressure from burns/buybacks. Bear: Heavy upcoming unlocks, no real utility'
      },
      specifications: {
        timePeriod: 'Launch to present + 12 months forward',
        sectorFocus: ['DeFi', 'L1', 'L2'],
        demographicFocus: ['Institutional', 'Developer cohorts'],
        methodology: ['Fundamental Analysis', 'Predictive Modeling'],
        ethics: 'Fair distribution concerns, insider allocations'
      },
      output: {
        executiveSummary: 'Yes',
        depth: 'Level 3',
        contentElements: ['trends', 'dataCharts', 'caseStudies', 'viewpoints', 'predictions'],
        visualizations: ['Unlock timelines', 'Price/Volume charts'],
        targetLength: '3,000-4,500 words',
        citationStyle: 'Inline links'
      },
      format: {
        writingFormat: 'White Paper',
        writingPerspective: 'Neutral/Formal Tone'
      },
      cryptoModules: {
        modules: ['tokenomics', 'governance', 'competitive']
      }
    }
  }
];

/**
 * Get template by ID
 */
export function getTemplateById(id: string): Template | undefined {
  return TEMPLATES.find(t => t.id === id);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: Template['category']): Template[] {
  return TEMPLATES.filter(t => t.category === category);
}

/**
 * Get all template categories
 */
export function getTemplateCategories(): Array<{ value: Template['category']; label: string }> {
  return [
    { value: 'defi', label: 'DeFi' },
    { value: 'l1', label: 'Layer 1' },
    { value: 'token', label: 'Tokens' },
    { value: 'security', label: 'Security' },
    { value: 'trading', label: 'Trading' }
  ];
}
