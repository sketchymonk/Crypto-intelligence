import {
  DataGuardrailsConfig,
  DataProvenance,
  DataSource,
  CustomValidationRule,
  ConsensusMethod,
  OutlierRule,
  CryptoMarketData
} from '../types';

const STORAGE_KEY = 'crypto_intelligence_data_guardrails';

/**
 * Preset configurations for different guardrail modes
 */
const PRESET_CONFIGS: Record<'strict' | 'web_scraping' | 'custom', Partial<DataGuardrailsConfig>> = {
  strict: {
    mode: 'strict',
    maxPriceAge: 5, // 5 minutes
    maxSupplyAge: 60, // 1 hour
    maxVolumeAge: 10, // 10 minutes
    maxOnChainDataAge: 30, // 30 minutes
    maxSocialDataAge: 60, // 1 hour
    maxDevActivityAge: 1440, // 24 hours
    minConsensusSources: 3,
    consensusMethod: 'median',
    maxPriceRelativeDeviation: 5, // 5%
    maxSupplyRelativeDeviation: 1, // 1%
    maxVolumeRelativeDeviation: 15, // 15%
    outlierRule: 'mad',
    autoBlacklistAfterStaleCount: 3,
    customRules: []
  },
  web_scraping: {
    mode: 'web_scraping',
    maxPriceAge: 30, // 30 minutes
    maxSupplyAge: 360, // 6 hours
    maxVolumeAge: 60, // 1 hour
    maxOnChainDataAge: 120, // 2 hours
    maxSocialDataAge: 240, // 4 hours
    maxDevActivityAge: 2880, // 48 hours
    minConsensusSources: 2,
    consensusMethod: 'mean',
    maxPriceRelativeDeviation: 15, // 15%
    maxSupplyRelativeDeviation: 5, // 5%
    maxVolumeRelativeDeviation: 30, // 30%
    outlierRule: 'iqr',
    autoBlacklistAfterStaleCount: 5,
    customRules: [
      {
        id: 'low_volume_price_deviation',
        name: 'Disregard price deviation for low volume tokens',
        condition: 'volume < 500000',
        action: 'disregard_price_deviation',
        enabled: true
      }
    ]
  },
  custom: {
    mode: 'custom',
    maxPriceAge: 15,
    maxSupplyAge: 120,
    maxVolumeAge: 30,
    maxOnChainDataAge: 60,
    maxSocialDataAge: 120,
    maxDevActivityAge: 1440,
    minConsensusSources: 2,
    consensusMethod: 'median',
    maxPriceRelativeDeviation: 10,
    maxSupplyRelativeDeviation: 2,
    maxVolumeRelativeDeviation: 20,
    outlierRule: 'mad',
    autoBlacklistAfterStaleCount: 3,
    customRules: []
  }
};

/**
 * Service for managing data quality guardrails
 */
class DataQualityService {
  private config: DataGuardrailsConfig;
  private sourceBlacklist: Set<string>;

  constructor() {
    this.config = this.loadConfig();
    this.sourceBlacklist = new Set();
  }

  /**
   * Load configuration from localStorage or use default
   */
  private loadConfig(): DataGuardrailsConfig {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load data guardrails config:', error);
    }
    return PRESET_CONFIGS.strict as DataGuardrailsConfig;
  }

  /**
   * Save configuration to localStorage
   */
  private saveConfig(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
    } catch (error) {
      console.error('Failed to save data guardrails config:', error);
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): DataGuardrailsConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<DataGuardrailsConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
  }

  /**
   * Set configuration mode and apply preset
   */
  setMode(mode: 'strict' | 'web_scraping' | 'custom'): void {
    const preset = PRESET_CONFIGS[mode];
    this.config = { ...preset, mode } as DataGuardrailsConfig;
    this.saveConfig();
  }

  /**
   * Add custom validation rule
   */
  addCustomRule(rule: CustomValidationRule): void {
    this.config.customRules.push(rule);
    this.saveConfig();
  }

  /**
   * Remove custom validation rule
   */
  removeCustomRule(ruleId: string): void {
    this.config.customRules = this.config.customRules.filter(r => r.id !== ruleId);
    this.saveConfig();
  }

  /**
   * Update custom validation rule
   */
  updateCustomRule(ruleId: string, updates: Partial<CustomValidationRule>): void {
    const index = this.config.customRules.findIndex(r => r.id === ruleId);
    if (index !== -1) {
      this.config.customRules[index] = { ...this.config.customRules[index], ...updates };
      this.saveConfig();
    }
  }

  /**
   * Check if data source is stale
   */
  isDataStale(timestamp: number, maxAge: number): boolean {
    const ageMinutes = (Date.now() - timestamp) / (1000 * 60);
    return ageMinutes > maxAge;
  }

  /**
   * Calculate staleness in minutes
   */
  calculateStaleness(timestamp: number): number {
    return Math.floor((Date.now() - timestamp) / (1000 * 60));
  }

  /**
   * Create data source from CoinGecko data
   */
  createDataSourceFromCoinGecko(data: CryptoMarketData, metricType: 'price' | 'supply' | 'volume'): DataSource {
    const timestamp = new Date(data.last_updated).getTime();
    const staleness = this.calculateStaleness(timestamp);

    let maxAge: number;
    switch (metricType) {
      case 'price':
        maxAge = this.config.maxPriceAge;
        break;
      case 'supply':
        maxAge = this.config.maxSupplyAge;
        break;
      case 'volume':
        maxAge = this.config.maxVolumeAge;
        break;
    }

    const isStale = this.isDataStale(timestamp, maxAge);
    const isBlacklisted = this.sourceBlacklist.has('coingecko');

    return {
      name: 'CoinGecko API',
      type: 'api',
      url: 'https://www.coingecko.com',
      timestamp,
      confidence: isStale ? 60 : 95,
      isStale,
      staleness,
      status: isBlacklisted ? 'blacklisted' : (isStale ? 'warning' : 'active'),
      staleCount: 0
    };
  }

  /**
   * Calculate consensus value from multiple sources
   */
  calculateConsensus(values: number[], method: ConsensusMethod = this.config.consensusMethod): number {
    if (values.length === 0) return 0;
    if (values.length === 1) return values[0];

    switch (method) {
      case 'median':
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0
          ? (sorted[mid - 1] + sorted[mid]) / 2
          : sorted[mid];

      case 'mean':
        return values.reduce((sum, v) => sum + v, 0) / values.length;

      case 'mode':
        const counts = new Map<number, number>();
        values.forEach(v => counts.set(v, (counts.get(v) || 0) + 1));
        let maxCount = 0;
        let modeValue = values[0];
        counts.forEach((count, value) => {
          if (count > maxCount) {
            maxCount = count;
            modeValue = value;
          }
        });
        return modeValue;

      default:
        return values[0];
    }
  }

  /**
   * Detect outliers using Median Absolute Deviation (MAD)
   */
  detectOutliersMAD(values: number[], threshold: number = 3): number[] {
    if (values.length < 3) return [];

    const median = this.calculateConsensus(values, 'median');
    const deviations = values.map(v => Math.abs(v - median));
    const mad = this.calculateConsensus(deviations, 'median');

    if (mad === 0) return [];

    const outliers: number[] = [];
    values.forEach((v, i) => {
      const modifiedZScore = 0.6745 * (v - median) / mad;
      if (Math.abs(modifiedZScore) > threshold) {
        outliers.push(i);
      }
    });

    return outliers;
  }

  /**
   * Detect outliers using Interquartile Range (IQR)
   */
  detectOutliersIQR(values: number[]): number[] {
    if (values.length < 4) return [];

    const sorted = [...values].sort((a, b) => a - b);
    const q1Index = Math.floor(sorted.length * 0.25);
    const q3Index = Math.floor(sorted.length * 0.75);
    const q1 = sorted[q1Index];
    const q3 = sorted[q3Index];
    const iqr = q3 - q1;

    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    const outliers: number[] = [];
    values.forEach((v, i) => {
      if (v < lowerBound || v > upperBound) {
        outliers.push(i);
      }
    });

    return outliers;
  }

  /**
   * Calculate relative deviation percentage
   */
  calculateRelativeDeviation(value: number, consensus: number): number {
    if (consensus === 0) return 0;
    return Math.abs((value - consensus) / consensus) * 100;
  }

  /**
   * Validate data provenance
   */
  validateProvenance(provenance: DataProvenance, context?: { volume?: number }): DataProvenance {
    const messages: string[] = [];
    let status: 'pass' | 'warning' | 'fail' = 'pass';

    // Check number of sources
    if (provenance.sources.length < this.config.minConsensusSources) {
      messages.push(`Insufficient sources (${provenance.sources.length} < ${this.config.minConsensusSources})`);
      status = 'warning';
    }

    // Check for stale sources
    const staleSources = provenance.sources.filter(s => s.isStale);
    if (staleSources.length > 0) {
      messages.push(`${staleSources.length} stale source(s) detected`);
      if (status === 'pass') status = 'warning';
    }

    // Check for blacklisted sources
    const blacklistedSources = provenance.sources.filter(s => s.status === 'blacklisted');
    if (blacklistedSources.length === provenance.sources.length) {
      messages.push('All sources are blacklisted');
      status = 'fail';
    }

    // Check deviation if consensus exists
    if (provenance.consensus?.deviation !== undefined) {
      let maxDeviation: number;

      if (provenance.metric.toLowerCase().includes('price')) {
        maxDeviation = this.config.maxPriceRelativeDeviation;
      } else if (provenance.metric.toLowerCase().includes('supply')) {
        maxDeviation = this.config.maxSupplyRelativeDeviation;
      } else if (provenance.metric.toLowerCase().includes('volume')) {
        maxDeviation = this.config.maxVolumeRelativeDeviation;
      } else {
        maxDeviation = this.config.maxPriceRelativeDeviation; // default
      }

      // Apply custom rules
      let applyDeviationCheck = true;
      if (context?.volume !== undefined) {
        for (const rule of this.config.customRules) {
          if (rule.enabled && rule.action === 'disregard_price_deviation') {
            // Simple condition evaluation (volume < 500000)
            if (rule.condition.includes('volume <')) {
              const threshold = parseInt(rule.condition.split('<')[1].trim());
              if (context.volume < threshold) {
                applyDeviationCheck = false;
                messages.push(`Applied rule: ${rule.name}`);
                break;
              }
            }
          }
        }
      }

      if (applyDeviationCheck && provenance.consensus.deviation > maxDeviation) {
        messages.push(`High deviation: ${provenance.consensus.deviation.toFixed(2)}% > ${maxDeviation}%`);
        status = 'fail';
      }
    }

    return {
      ...provenance,
      validationStatus: status,
      validationMessages: messages.length > 0 ? messages : undefined
    };
  }

  /**
   * Create data provenance for a metric
   */
  createProvenance(
    metric: string,
    value: string | number,
    sources: DataSource[],
    numericValues?: number[]
  ): DataProvenance {
    const provenance: DataProvenance = {
      metric,
      value,
      sources,
      validationStatus: 'pass'
    };

    // Calculate consensus if multiple numeric values provided
    if (numericValues && numericValues.length > 1) {
      const consensus = this.calculateConsensus(numericValues);
      const deviations = numericValues.map(v => this.calculateRelativeDeviation(v, consensus));
      const maxDeviation = Math.max(...deviations);

      // Detect outliers
      let outlierIndices: number[] = [];
      if (this.config.outlierRule === 'mad') {
        outlierIndices = this.detectOutliersMAD(numericValues);
      } else if (this.config.outlierRule === 'iqr') {
        outlierIndices = this.detectOutliersIQR(numericValues);
      }

      provenance.consensus = {
        method: this.config.consensusMethod,
        deviation: maxDeviation,
        outliers: outlierIndices.map(i => sources[i]?.name || `Source ${i}`)
      };
    }

    return provenance;
  }

  /**
   * Track stale count for source and auto-blacklist if needed
   */
  trackStaleSource(sourceName: string): void {
    const key = `stale_count_${sourceName.toLowerCase().replace(/\s+/g, '_')}`;
    const currentCount = parseInt(localStorage.getItem(key) || '0');
    const newCount = currentCount + 1;

    localStorage.setItem(key, newCount.toString());

    if (newCount >= this.config.autoBlacklistAfterStaleCount) {
      this.blacklistSource(sourceName);
    }
  }

  /**
   * Blacklist a data source
   */
  blacklistSource(sourceName: string): void {
    this.sourceBlacklist.add(sourceName.toLowerCase());
    localStorage.setItem('blacklisted_sources', JSON.stringify(Array.from(this.sourceBlacklist)));
  }

  /**
   * Remove source from blacklist
   */
  unblacklistSource(sourceName: string): void {
    this.sourceBlacklist.delete(sourceName.toLowerCase());
    localStorage.setItem('blacklisted_sources', JSON.stringify(Array.from(this.sourceBlacklist)));
  }

  /**
   * Get all blacklisted sources
   */
  getBlacklistedSources(): string[] {
    return Array.from(this.sourceBlacklist);
  }

  /**
   * Reset all source tracking
   */
  resetSourceTracking(): void {
    this.sourceBlacklist.clear();
    localStorage.removeItem('blacklisted_sources');

    // Clear all stale counts
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('stale_count_')) {
        localStorage.removeItem(key);
      }
    });
  }
}

// Export singleton instance
export const dataQualityService = new DataQualityService();
