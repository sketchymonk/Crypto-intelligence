import { SavedAnalysis, AIProvider } from '../types';
import { getProviderManager } from './aiProvider';

/**
 * Service for AI-powered auto-tagging of analyses
 */
class AITaggingService {
  /**
   * Generate tags for an analysis using AI
   */
  async generateTags(analysis: SavedAnalysis): Promise<string[]> {
    try {
      const providerManager = getProviderManager();

      const prompt = `Based on this crypto project analysis, suggest 3-5 relevant tags that categorize it.

Project: ${analysis.projectName}${analysis.projectSymbol ? ` (${analysis.projectSymbol})` : ''}

Analysis excerpt:
${analysis.response.substring(0, 1500)}...

Common crypto categories include: DeFi, NFT, Layer1, Layer2, DEX, Lending, Staking, Gaming, Metaverse, DAO, Privacy, Oracle, Bridge, Wallet, Infrastructure, Meme, AI, RWA (Real World Assets), etc.

Respond with ONLY a comma-separated list of 3-5 tags. Be specific and relevant.
Example format: DeFi, Lending, Ethereum, High-Risk, Innovation`;

      const response = await providerManager.runFastAnalysis(prompt);

      // Parse the response to extract tags
      const tags = response.text
        .split(',')
        .map(tag => tag.trim().replace(/[^a-zA-Z0-9-]/g, ''))
        .filter(tag => tag.length > 0 && tag.length < 30)
        .slice(0, 5); // Max 5 tags

      return tags;
    } catch (error) {
      console.error('Failed to generate tags:', error);
      return this.generateFallbackTags(analysis);
    }
  }

  /**
   * Generate fallback tags using keyword extraction (no AI)
   */
  private generateFallbackTags(analysis: SavedAnalysis): string[] {
    const tags: string[] = [];
    const text = `${analysis.projectName} ${analysis.response}`.toLowerCase();

    // Common crypto keywords to look for
    const keywords = {
      'DeFi': ['defi', 'decentralized finance', 'yield', 'liquidity'],
      'NFT': ['nft', 'non-fungible', 'collectible', 'digital art'],
      'Layer1': ['layer 1', 'l1', 'blockchain', 'mainnet'],
      'Layer2': ['layer 2', 'l2', 'rollup', 'scaling'],
      'DEX': ['dex', 'decentralized exchange', 'swap', 'amm'],
      'Lending': ['lending', 'borrow', 'collateral', 'interest'],
      'Staking': ['staking', 'stake', 'validator', 'pos'],
      'Gaming': ['gaming', 'game', 'play-to-earn', 'p2e'],
      'Metaverse': ['metaverse', 'virtual world', 'vr'],
      'DAO': ['dao', 'governance', 'voting'],
      'Privacy': ['privacy', 'anonymous', 'zero-knowledge', 'zkp'],
      'Oracle': ['oracle', 'price feed', 'data feed'],
      'Bridge': ['bridge', 'cross-chain', 'interoperability'],
      'Meme': ['meme', 'meme coin', 'community-driven']
    };

    // Check for keywords
    for (const [tag, patterns] of Object.entries(keywords)) {
      if (patterns.some(pattern => text.includes(pattern))) {
        tags.push(tag);
      }
    }

    // Add analysis type as tag
    tags.push(analysis.analysisType);

    // Add provider as tag if it's interesting
    if (analysis.provider === 'consensus') {
      tags.push('Multi-Provider');
    }

    return tags.slice(0, 5);
  }

  /**
   * Batch generate tags for multiple analyses
   */
  async batchGenerateTags(analyses: SavedAnalysis[]): Promise<Map<string, string[]>> {
    const results = new Map<string, string[]>();

    // Process in batches to avoid rate limiting
    for (const analysis of analyses) {
      if (!analysis.tags || analysis.tags.length === 0) {
        try {
          const tags = await this.generateTags(analysis);
          results.set(analysis.id, tags);
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Failed to generate tags for ${analysis.id}:`, error);
        }
      }
    }

    return results;
  }

  /**
   * Suggest additional tags based on existing analysis content
   */
  async suggestAdditionalTags(analysis: SavedAnalysis, currentTags: string[]): Promise<string[]> {
    try {
      const providerManager = getProviderManager();

      const prompt = `This crypto analysis already has these tags: ${currentTags.join(', ')}

Based on this analysis excerpt, suggest 2-3 ADDITIONAL tags that would be useful but are NOT already included:

${analysis.response.substring(0, 1000)}...

Respond with ONLY a comma-separated list of 2-3 new tags. Do NOT repeat existing tags.`;

      const response = await providerManager.runFastAnalysis(prompt);

      const tags = response.text
        .split(',')
        .map(tag => tag.trim().replace(/[^a-zA-Z0-9-]/g, ''))
        .filter(tag =>
          tag.length > 0 &&
          tag.length < 30 &&
          !currentTags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
        )
        .slice(0, 3);

      return tags;
    } catch (error) {
      console.error('Failed to suggest additional tags:', error);
      return [];
    }
  }
}

export const aiTaggingService = new AITaggingService();
