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
  },
  {
    id: 'investment-thesis',
    name: 'Full Investment Thesis',
    description: 'Comprehensive all-around analysis covering fundamentals, technicals, on-chain data, and risk assessment',
    category: 'token',
    formData: {
      context: {
        experts: ['Lead Tokenomics Analyst', 'On-Chain/Data Engineer', 'Macro Strategist', 'Security Auditor'],
        purpose: 'Inform trading/investment decision',
        actionability: 'Practical trading plan',
        priorKnowledge: 'Basic understanding of the project and its value proposition',
        gaps: 'Complete fundamental analysis, risk factors, valuation metrics, competitive positioning'
      },
      coreQuestion: {
        primaryQuestion: 'Should I invest in this project, and if so, what is the optimal entry strategy and holding period?',
        hypothesis: 'This project has strong fundamentals, sustainable tokenomics, and favorable risk-reward profile',
        counterfactuals: 'Bull: Strong adoption and ecosystem growth. Bear: Competition, regulatory issues, or technical failures'
      },
      specifications: {
        timePeriod: 'Launch to present + 12-24 months forward',
        geographicLocation: 'Global',
        sectorFocus: ['L1', 'L2', 'DeFi', 'Infrastructure'],
        demographicFocus: ['Retail', 'Institutional'],
        methodology: ['Fundamental Analysis', 'On-chain Quant Analysis', 'Technical/Chart Analysis', 'Sentiment Analysis', 'Predictive Modeling'],
        ethics: 'Fair distribution, team credibility, regulatory compliance'
      },
      output: {
        executiveSummary: 'Yes',
        depth: 'Level 3',
        contentElements: ['trends', 'dataCharts', 'caseStudies', 'players', 'viewpoints', 'predictions', 'implications', 'alphaSignals'],
        visualizations: ['Price/Volume charts', 'TVL/Fee heatmaps', 'Unlock timelines', 'Wallet cohort flows', 'Network graphs', 'RSI/MACD indicators'],
        targetLength: '4,000-6,000 words',
        citationStyle: 'Inline links'
      },
      format: {
        writingFormat: 'Investment Memo',
        writingPerspective: 'Third-person'
      },
      cryptoModules: {
        modules: ['tokenomics', 'onChain', 'marketStructure', 'security', 'governance', 'competitive', 'newsflow', 'social', 'technical']
      }
    }
  },
  {
    id: 'airdrop-launch',
    name: 'Airdrop/Token Launch Analysis',
    description: 'Evaluate upcoming token launches, airdrops, and TGE events for participation opportunity',
    category: 'token',
    formData: {
      context: {
        experts: ['Lead Tokenomics Analyst', 'On-Chain/Data Engineer'],
        purpose: 'Inform trading/investment decision',
        actionability: 'Practical trading plan',
        priorKnowledge: 'Awareness of upcoming launch/airdrop event',
        gaps: 'Initial distribution, vesting schedules, likely price action, airdrop farming ROI'
      },
      coreQuestion: {
        primaryQuestion: 'Is this airdrop/launch worth participating in, and what is the expected ROI?',
        hypothesis: 'Fair distribution with reasonable initial circulating supply and strong fundamentals',
        counterfactuals: 'Bull: Limited supply, high demand, strong backing. Bear: Heavy unlock pressure, poor distribution, lack of utility'
      },
      specifications: {
        timePeriod: 'Pre-launch to first 90 days post-TGE',
        sectorFocus: ['DeFi', 'L1', 'L2', 'Infrastructure'],
        demographicFocus: ['Retail'],
        methodology: ['Fundamental Analysis', 'Event-Driven Analysis', 'Sentiment Analysis'],
        ethics: 'Airdrop farming ethics, sybil attack concerns, fair distribution'
      },
      output: {
        executiveSummary: 'Yes',
        depth: 'Level 2',
        contentElements: ['trends', 'dataCharts', 'players', 'predictions', 'alphaSignals'],
        visualizations: ['Unlock timelines', 'Wallet cohort flows'],
        targetLength: '1,500-2,500 words',
        citationStyle: 'Inline links'
      },
      format: {
        writingFormat: 'Markdown Report',
        writingPerspective: 'Third-person'
      },
      cryptoModules: {
        modules: ['tokenomics', 'onChain', 'social', 'newsflow']
      }
    }
  },
  {
    id: 'market-cycle',
    name: 'Macro Market Cycle Analysis',
    description: 'Analyze broader crypto market trends, cycles, and positioning for market phases',
    category: 'trading',
    formData: {
      context: {
        experts: ['Macro Strategist', 'On-Chain/Data Engineer'],
        purpose: 'Long-form report',
        actionability: 'Strategic',
        priorKnowledge: 'Understanding of crypto market cycles and Bitcoin halving',
        gaps: 'Current cycle phase, institutional flows, macro correlations, alt season indicators'
      },
      coreQuestion: {
        primaryQuestion: 'What phase of the market cycle are we in, and how should portfolios be positioned?',
        hypothesis: 'Identifiable patterns in market cycles can inform strategic positioning',
        counterfactuals: 'Bull: Early cycle accumulation. Bear: Late cycle distribution or bear market'
      },
      specifications: {
        timePeriod: 'Last 2-4 years + forward 12-18 months',
        geographicLocation: 'Global',
        sectorFocus: ['L1', 'DeFi', 'Infrastructure'],
        demographicFocus: ['Retail', 'Institutional'],
        methodology: ['Fundamental Analysis', 'On-chain Quant Analysis', 'Technical/Chart Analysis', 'Predictive Modeling'],
        ethics: 'Market manipulation awareness, responsible investment advice'
      },
      output: {
        executiveSummary: 'Yes',
        depth: 'Level 3',
        contentElements: ['trends', 'dataCharts', 'caseStudies', 'predictions', 'implications'],
        visualizations: ['Price/Volume charts', 'Network graphs', 'RSI/MACD indicators'],
        targetLength: '3,000-5,000 words',
        citationStyle: 'Inline links'
      },
      format: {
        writingFormat: 'Investment Memo',
        writingPerspective: 'Neutral/Formal Tone'
      },
      cryptoModules: {
        modules: ['onChain', 'marketStructure', 'social', 'technical']
      }
    }
  },
  {
    id: 'nft-gaming',
    name: 'NFT/Gaming Project Evaluation',
    description: 'Specialized analysis for NFT collections and blockchain gaming projects',
    category: 'defi',
    formData: {
      context: {
        experts: ['On-Chain/Data Engineer', 'Macro Strategist'],
        purpose: 'Inform trading/investment decision',
        actionability: 'Practical trading plan',
        priorKnowledge: 'NFT mechanics, gaming tokenomics, play-to-earn models',
        gaps: 'NFT floor price trends, player retention, in-game economy sustainability'
      },
      coreQuestion: {
        primaryQuestion: 'Is this NFT/Gaming project sustainable and worth investing in?',
        hypothesis: 'Strong community, engaging gameplay/art, and sustainable tokenomics',
        counterfactuals: 'Bull: Growing player base, rising floor prices. Bear: Ponzi-like mechanics, declining engagement'
      },
      specifications: {
        timePeriod: 'Last 6-12 months',
        sectorFocus: ['Gaming', 'AI', 'Infrastructure'],
        demographicFocus: ['Retail'],
        methodology: ['Fundamental Analysis', 'On-chain Quant Analysis', 'Sentiment Analysis'],
        ethics: 'Play-to-earn sustainability, gambling concerns, IP rights'
      },
      output: {
        executiveSummary: 'Yes',
        depth: 'Level 2',
        contentElements: ['trends', 'dataCharts', 'caseStudies', 'players', 'viewpoints', 'alphaSignals'],
        visualizations: ['Price/Volume charts', 'Wallet cohort flows', 'Network graphs'],
        targetLength: '2,000-3,500 words',
        citationStyle: 'Inline links'
      },
      format: {
        writingFormat: 'Markdown Report',
        writingPerspective: 'Third-person'
      },
      cryptoModules: {
        modules: ['tokenomics', 'onChain', 'social', 'competitive']
      }
    }
  },
  {
    id: 'stablecoin-analysis',
    name: 'Stablecoin Mechanism Analysis',
    description: 'Deep dive into stablecoin collateralization, peg stability, and systemic risks',
    category: 'defi',
    formData: {
      context: {
        experts: ['Lead Tokenomics Analyst', 'Security Auditor', 'Regulatory Counsel'],
        purpose: 'Risk memo',
        actionability: 'Strategic',
        priorKnowledge: 'Stablecoin mechanisms: algorithmic, fiat-backed, crypto-collateralized',
        gaps: 'Collateral ratios, depeg risks, regulatory status, audit transparency'
      },
      coreQuestion: {
        primaryQuestion: 'Is this stablecoin truly stable and safe to hold/use?',
        hypothesis: 'Adequate collateralization, transparent reserves, and proven stability mechanisms',
        counterfactuals: 'Bull: Overcollateralized, audited reserves. Bear: Under-collateralized, opacity, death spiral risk'
      },
      specifications: {
        timePeriod: 'All-time (focus on stress events)',
        sectorFocus: ['DeFi', 'Infrastructure'],
        demographicFocus: ['Institutional', 'Retail'],
        methodology: ['Fundamental Analysis', 'On-chain Quant Analysis', 'Event-Driven Analysis'],
        ethics: 'Reserve transparency, regulatory compliance, systemic risk'
      },
      output: {
        executiveSummary: 'Yes',
        depth: 'Level 3',
        contentElements: ['trends', 'dataCharts', 'caseStudies', 'viewpoints', 'implications'],
        visualizations: ['Price/Volume charts', 'TVL/Fee heatmaps'],
        targetLength: '2,500-4,000 words',
        citationStyle: 'Footnotes'
      },
      format: {
        writingFormat: 'Academic Paper',
        writingPerspective: 'Neutral/Formal Tone'
      },
      cryptoModules: {
        modules: ['tokenomics', 'security', 'governance', 'marketStructure']
      }
    }
  },
  {
    id: 'dao-governance',
    name: 'DAO Governance & Treasury Review',
    description: 'Analysis of DAO structure, voting mechanisms, treasury management, and decentralization',
    category: 'security',
    formData: {
      context: {
        experts: ['Regulatory Counsel', 'Lead Tokenomics Analyst', 'Security Auditor'],
        purpose: 'Long-form report',
        actionability: 'Strategic',
        priorKnowledge: 'DAO basics, governance tokens, proposal mechanisms',
        gaps: 'Voter participation rates, treasury runway, governance centralization risks'
      },
      coreQuestion: {
        primaryQuestion: 'Is this DAO effectively governed and financially sustainable?',
        hypothesis: 'Active governance, diversified treasury, and genuine decentralization',
        counterfactuals: 'Bull: High participation, prudent treasury management. Bear: Governance capture, treasury depletion'
      },
      specifications: {
        timePeriod: 'DAO inception to present',
        sectorFocus: ['DeFi', 'Infrastructure', 'L1'],
        demographicFocus: ['Institutional'],
        methodology: ['Fundamental Analysis', 'On-chain Quant Analysis'],
        ethics: 'Voting manipulation, plutocracy risks, treasury transparency'
      },
      output: {
        executiveSummary: 'Yes',
        depth: 'Level 3',
        contentElements: ['trends', 'dataCharts', 'caseStudies', 'players', 'viewpoints', 'implications'],
        visualizations: ['Network graphs', 'Wallet cohort flows'],
        targetLength: '3,000-4,500 words',
        citationStyle: 'Footnotes'
      },
      format: {
        writingFormat: 'White Paper',
        writingPerspective: 'Neutral/Formal Tone'
      },
      cryptoModules: {
        modules: ['governance', 'tokenomics', 'onChain', 'security']
      }
    }
  },
  {
    id: 'yield-farming',
    name: 'Yield Farming Strategy Analysis',
    description: 'Evaluate liquidity mining opportunities, risks, and sustainable APY strategies',
    category: 'defi',
    formData: {
      context: {
        experts: ['Lead Tokenomics Analyst', 'On-Chain/Data Engineer', 'Security Auditor'],
        purpose: 'Inform trading/investment decision',
        actionability: 'Practical trading plan',
        priorKnowledge: 'DeFi mechanics, impermanent loss, yield farming basics',
        gaps: 'Current APY sustainability, smart contract risks, token emission schedules'
      },
      coreQuestion: {
        primaryQuestion: 'What is the real risk-adjusted APY, and is this yield farming opportunity worth it?',
        hypothesis: 'Yields are sustainable and risks are acceptable for target return',
        counterfactuals: 'Bull: Sustainable fees, growing TVL. Bear: Unsustainable emissions, rug pull, impermanent loss'
      },
      specifications: {
        timePeriod: 'Last 30-90 days',
        sectorFocus: ['DeFi'],
        demographicFocus: ['Retail', 'Institutional'],
        methodology: ['Fundamental Analysis', 'On-chain Quant Analysis'],
        ethics: 'Ponzi-like tokenomics, rug pull risks, smart contract vulnerabilities'
      },
      output: {
        executiveSummary: 'Yes',
        depth: 'Level 2',
        contentElements: ['trends', 'dataCharts', 'viewpoints', 'alphaSignals'],
        visualizations: ['TVL/Fee heatmaps', 'Price/Volume charts'],
        targetLength: '1,500-2,500 words',
        citationStyle: 'Inline links'
      },
      format: {
        writingFormat: 'Investment Memo',
        writingPerspective: 'Third-person'
      },
      cryptoModules: {
        modules: ['tokenomics', 'security', 'onChain', 'marketStructure']
      }
    }
  },
  {
    id: 'exit-strategy',
    name: 'Exit Strategy & Risk Management',
    description: 'Plan profit-taking levels, stop-losses, and portfolio rebalancing strategy',
    category: 'trading',
    formData: {
      context: {
        experts: ['Macro Strategist', 'On-Chain/Data Engineer'],
        purpose: 'Practical trading plan',
        actionability: 'Practical trading plan',
        priorKnowledge: 'Current holdings and cost basis',
        gaps: 'Target exit prices, market cycle indicators, risk/reward ratios'
      },
      coreQuestion: {
        primaryQuestion: 'When and how should I take profits or cut losses on this position?',
        hypothesis: 'Pre-defined exit levels based on technical and fundamental signals',
        counterfactuals: 'Bull: Gradual profit-taking on strength. Bear: Stop-loss execution on breakdown'
      },
      specifications: {
        timePeriod: 'Next 3-12 months',
        sectorFocus: ['L1', 'DeFi', 'Infrastructure'],
        demographicFocus: ['Retail'],
        methodology: ['Technical/Chart Analysis', 'On-chain Quant Analysis', 'Sentiment Analysis'],
        ethics: 'Responsible position sizing, avoiding FOMO/panic'
      },
      output: {
        executiveSummary: 'Yes',
        depth: 'Level 2',
        contentElements: ['trends', 'dataCharts', 'predictions', 'alphaSignals'],
        visualizations: ['Price/Volume charts', 'RSI/MACD indicators', 'Unlock timelines'],
        targetLength: '1,000-2,000 words',
        citationStyle: 'Inline links'
      },
      format: {
        writingFormat: 'Markdown Report',
        writingPerspective: 'Third-person'
      },
      cryptoModules: {
        modules: ['technical', 'onChain', 'marketStructure', 'social']
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
 * Get all template categories with counts
 */
export function getTemplateCategories(): Array<{ value: Template['category']; label: string; count: number }> {
  const counts: Record<Template['category'], number> = {
    defi: TEMPLATES.filter(t => t.category === 'defi').length,
    l1: TEMPLATES.filter(t => t.category === 'l1').length,
    token: TEMPLATES.filter(t => t.category === 'token').length,
    security: TEMPLATES.filter(t => t.category === 'security').length,
    trading: TEMPLATES.filter(t => t.category === 'trading').length
  };

  return [
    { value: 'defi', label: 'DeFi', count: counts.defi },
    { value: 'l1', label: 'Layer 1', count: counts.l1 },
    { value: 'token', label: 'Tokens & Airdrops', count: counts.token },
    { value: 'security', label: 'Security & Governance', count: counts.security },
    { value: 'trading', label: 'Trading & Strategy', count: counts.trading }
  ];
}
