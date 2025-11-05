import { FormSection } from './types';

export const sections: FormSection[] = [
  {
    id: 'context',
    title: '1. Research Context & Goals',
    fields: [
      {
        id: 'experts',
        label: 'Expert(s) conducting the research',
        type: 'checkbox',
        options: [
            { value: 'Lead Tokenomics Analyst', label: 'Lead Tokenomics Analyst' },
            { value: 'On-Chain/Data Engineer', label: 'On-Chain/Data Engineer' },
            { value: 'Macro Strategist', label: 'Macro Strategist' },
            { value: 'Security Auditor', label: 'Security Auditor' },
            { value: 'Regulatory Counsel', label: 'Regulatory Counsel' },
        ]
      },
      { id: 'project', label: 'Coin/Project Name', type: 'text', placeholder: 'e.g., Ethereum' },
      { id: 'ticker', label: 'Ticker Symbol', type: 'text', placeholder: 'e.g., ETH' },
      { id: 'chain', label: 'Primary Chain', type: 'text', placeholder: 'e.g., Ethereum Mainnet' },
      {
        id: 'purpose',
        label: 'My purpose is to',
        type: 'select',
        options: [
            { value: 'Inform trading/investment decision', label: 'Inform trading/investment decision' },
            { value: 'Long-form report', label: 'Long-form report' },
            { value: 'Pitch deck', label: 'Pitch deck' },
            { value: 'Risk memo', label: 'Risk memo' },
        ]
      },
      { id: 'priorKnowledge', label: 'I already know (briefly)', type: 'textarea', placeholder: 'Your prior knowledge/assumptions' },
      { id: 'gaps', label: 'Potential Gaps in Existing Research', type: 'textarea', placeholder: 'e.g., unclear token unlock effects' },
      {
        id: 'actionability',
        label: 'Actionability of Findings',
        type: 'select',
        options: [
            { value: 'Theoretical', label: 'Theoretical' },
            { value: 'Strategic', label: 'Strategic' },
            { value: 'Practical trading plan', label: 'Practical trading plan' },
        ]
      },
    ],
  },
  {
    id: 'coreQuestion',
    title: '2. Core Research Question & Hypothesis',
    fields: [
      { id: 'primaryQuestion', label: 'Primary Question', type: 'textarea', placeholder: 'e.g., What is the risk-adjusted return potential over 1-5 years?' },
      { id: 'hypothesis', label: 'Hypothesis or Expected Insights', type: 'textarea', placeholder: 'What you expect to learn or validate' },
      { id: 'counterfactuals', label: 'Counterfactuals & Alternative Perspectives', type: 'textarea', placeholder: 'e.g., Bull vs. Bear on adoption rates' },
    ],
  },
  {
    id: 'specifications',
    title: '3. Specifications & Parameters',
    fields: [
      { id: 'timePeriod', label: 'Time Period', type: 'text', placeholder: 'e.g., Last 12–24 months' },
      { id: 'geographicLocation', label: 'Geographic Location', type: 'text', placeholder: 'Global / Specific regions' },
      {
        id: 'sectorFocus',
        label: 'Industry/Sector Focus',
        type: 'checkbox',
        options: [
            { value: 'L1', label: 'L1' },
            { value: 'L2', label: 'L2' },
            { value: 'DeFi', label: 'DeFi' },
            { value: 'RWA', label: 'RWA' },
            { value: 'AI', label: 'AI' },
            { value: 'Gaming', label: 'Gaming' },
            { value: 'Infrastructure', label: 'Infrastructure' },
            { value: 'Privacy', label: 'Privacy' },
        ]
      },
      {
        id: 'demographicFocus',
        label: 'Demographic Focus',
        type: 'checkbox',
        options: [
            { value: 'Retail', label: 'Retail' },
            { value: 'Institutional', label: 'Institutional' },
            { value: 'Developer cohorts', label: 'Developer cohorts' },
            { value: 'Geographies', label: 'Geographies' },
        ]
      },
      {
        id: 'methodology',
        label: 'Methodological Approach',
        type: 'checkbox',
        options: [
            { value: 'Fundamental Analysis', label: 'Fundamental Analysis' },
            { value: 'On-chain Quant Analysis', label: 'On-chain Quant Analysis' },
            { value: 'Technical/Chart Analysis', label: 'Technical/Chart Analysis' },
            { value: 'Sentiment Analysis', label: 'Sentiment Analysis' },
            { value: 'Event-Driven Analysis', label: 'Event-Driven Analysis' },
            { value: 'Predictive Modeling', label: 'Predictive Modeling' },
        ]
      },
      { id: 'ethics', label: 'Ethical Considerations', type: 'textarea', placeholder: 'Market manipulation concerns...' },
    ],
  },
  {
    id: 'output',
    title: '4. Desired Report Output',
    fields: [
      { id: 'structure', label: 'Structure', type: 'text', placeholder: 'Structured report with sections...' },
      {
        id: 'executiveSummary',
        label: 'Include an Executive Summary?',
        type: 'select',
        options: [
          { value: 'Yes', label: 'Yes' },
          { value: 'No', label: 'No' },
        ],
      },
      {
        id: 'depth',
        label: 'Level of Depth',
        type: 'select',
        options: [
          { value: 'Level 1', label: 'Level 1: Executive summary' },
          { value: 'Level 2', label: 'Level 2: Medium-depth report' },
          { value: 'Level 3', label: 'Level 3: Comprehensive deep dive' },
        ],
      },
      {
        id: 'contentElements',
        label: 'Content Elements',
        type: 'checkbox',
        options: [
          { value: 'trends', label: 'Key Trends & Developments' },
          { value: 'dataCharts', label: 'Statistical Data & Charts' },
          { value: 'caseStudies', label: 'Case Studies/Examples' },
          { value: 'players', label: 'Major Players/Organizations' },
          { value: 'viewpoints', label: 'Opposing Viewpoints/Debates' },
          { value: 'predictions', label: 'Expert Opinions/Predictions' },
          { value: 'implications', label: 'Policy/Regulatory Implications' },
          { value: 'alphaSignals', label: 'Alpha Signals & Unfair Advantages' },
        ],
      },
      {
        id: 'visualizations',
        label: 'Visualization Preferences',
        type: 'checkbox',
        options: [
            { value: 'Price/Volume charts', label: 'Price/Volume charts' },
            { value: 'TVL/Fee heatmaps', label: 'TVL/Fee heatmaps' },
            { value: 'Wallet cohort flows', label: 'Wallet cohort flows' },
            { value: 'Unlock timelines', label: 'Unlock timelines' },
            { value: 'Network graphs', label: 'Network graphs' },
            { value: 'RSI/MACD indicators', label: 'RSI/MACD indicators' },
        ]
      },
      { id: 'targetLength', label: 'Target Length (approximate)', type: 'text', placeholder: 'e.g., 1,500–3,000 words' },
      {
        id: 'citationStyle',
        label: 'Citation Style',
        type: 'select',
        options: [
            { value: 'APA', label: 'APA' },
            { value: 'Chicago', label: 'Chicago' },
            { value: 'Inline links', label: 'Inline links' },
            { value: 'Footnotes', label: 'Footnotes' },
        ]
      },
    ],
  },
  {
    id: 'format',
    title: '5. Output Format Preferences',
    fields: [
        {
            id: 'writingFormat',
            label: 'Preferred Writing Format',
            type: 'select',
            options: [
              { value: 'Markdown-formatted report', label: 'Markdown Report' },
              { value: 'Investment Memo', label: 'Investment Memo' },
              { value: 'Academic Paper', label: 'Academic Paper' },
              { value: 'White Paper', label: 'White Paper' },
            ],
          },
          {
            id: 'writingPerspective',
            label: 'Preferred Writing Perspective',
            type: 'select',
            options: [
              { value: 'Third-person', label: 'Third-person' },
              { value: 'First-person', label: 'First-person' },
              { value: 'Neutral/Formal Tone', label: 'Neutral/Formal Tone' },
              { value: 'Narrative Style', label: 'Narrative Style' },
            ],
          },
    ]
  },
  {
    id: 'cryptoModules',
    title: '8. Crypto-Specific Modules',
    fields: [
        {
            id: 'modules',
            label: 'Include Modules (check all required)',
            type: 'checkbox',
            options: [
              { value: 'tokenomics', label: 'Tokenomics and Supply Mechanics' },
              { value: 'onChain', label: 'On-Chain Activity and Adoption' },
              { value: 'marketStructure', label: 'Market Structure, Liquidity, and Derivatives' },
              { value: 'security', label: 'Security, Audits, and Incidents' },
              { value: 'governance', label: 'Governance and Treasury' },
              { value: 'competitive', label: 'Competitive Landscape and Moat' },
              { value: 'newsflow', label: 'Newsflow, Narratives, and Catalyst Calendar' },
              { value: 'social', label: 'Social and Sentiment Intelligence' },
              { value: 'technical', label: 'Technical/Chart Analysis' },
            ],
          },
    ]
  }
];