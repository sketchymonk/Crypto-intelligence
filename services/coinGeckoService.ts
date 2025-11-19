import { CryptoMarketData, ChartDataPoint } from '../types';

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';
const CACHE_DURATION = 60 * 1000; // 1 minute cache

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * CoinGecko API Service for fetching real-time crypto market data
 * Uses free public API (no key required, but rate limited)
 */
class CoinGeckoService {
  private cache = new Map<string, CacheEntry<any>>();

  /**
   * Search for a coin by name or symbol
   */
  async searchCoin(query: string): Promise<Array<{ id: string; symbol: string; name: string }>> {
    const cacheKey = `search_${query}`;
    const cached = this.getFromCache<Array<{ id: string; symbol: string; name: string }>>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${COINGECKO_API_BASE}/search?query=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();
      const results = data.coins?.slice(0, 10).map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name
      })) || [];

      this.setCache(cacheKey, results);
      return results;
    } catch (error) {
      console.error('Failed to search coin:', error);
      throw error;
    }
  }

  /**
   * Get detailed market data for a coin
   */
  async getCoinData(coinId: string): Promise<CryptoMarketData> {
    const cacheKey = `coin_${coinId}`;
    const cached = this.getFromCache<CryptoMarketData>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${COINGECKO_API_BASE}/coins/markets?vs_currency=usd&ids=${coinId}&order=market_cap_desc&sparkline=false&price_change_percentage=24h,7d,30d`
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        throw new Error(`Coin ${coinId} not found`);
      }

      const coin = data[0];
      const marketData: CryptoMarketData = {
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        current_price: coin.current_price || 0,
        market_cap: coin.market_cap || 0,
        market_cap_rank: coin.market_cap_rank || 0,
        total_volume: coin.total_volume || 0,
        price_change_percentage_24h: coin.price_change_percentage_24h || 0,
        price_change_percentage_7d: coin.price_change_percentage_7d_in_currency || 0,
        price_change_percentage_30d: coin.price_change_percentage_30d_in_currency || 0,
        circulating_supply: coin.circulating_supply || 0,
        total_supply: coin.total_supply || 0,
        max_supply: coin.max_supply || 0,
        ath: coin.ath || 0,
        ath_date: coin.ath_date || '',
        atl: coin.atl || 0,
        atl_date: coin.atl_date || '',
        last_updated: coin.last_updated || new Date().toISOString()
      };

      this.setCache(cacheKey, marketData);
      return marketData;
    } catch (error) {
      console.error('Failed to fetch coin data:', error);
      throw error;
    }
  }

  /**
   * Get historical price chart data
   */
  async getChartData(coinId: string, days: number | 'max' = 30): Promise<ChartDataPoint[]> {
    const cacheKey = `chart_${coinId}_${days}`;
    const cached = this.getFromCache<ChartDataPoint[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${COINGECKO_API_BASE}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();

      const chartData: ChartDataPoint[] = data.prices.map((point: [number, number], index: number) => ({
        timestamp: point[0],
        price: point[1],
        volume: data.total_volumes[index]?.[1]
      }));

      this.setCache(cacheKey, chartData);
      return chartData;
    } catch (error) {
      console.error('Failed to fetch chart data:', error);
      throw error;
    }
  }

  /**
   * Get trending coins
   */
  async getTrendingCoins(): Promise<Array<{ id: string; symbol: string; name: string; market_cap_rank: number }>> {
    const cacheKey = 'trending';
    const cached = this.getFromCache<Array<{ id: string; symbol: string; name: string; market_cap_rank: number }>>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${COINGECKO_API_BASE}/search/trending`);

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();
      const trending = data.coins?.map((item: any) => ({
        id: item.item.id,
        symbol: item.item.symbol,
        name: item.item.name,
        market_cap_rank: item.item.market_cap_rank || 0
      })) || [];

      this.setCache(cacheKey, trending);
      return trending;
    } catch (error) {
      console.error('Failed to fetch trending coins:', error);
      throw error;
    }
  }

  /**
   * Cache management
   */
  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    if (age > CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get popular coin IDs for quick access
   */
  getPopularCoins(): Array<{ id: string; name: string; symbol: string }> {
    return [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
      { id: 'binancecoin', name: 'BNB', symbol: 'BNB' },
      { id: 'solana', name: 'Solana', symbol: 'SOL' },
      { id: 'ripple', name: 'XRP', symbol: 'XRP' },
      { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
      { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX' },
      { id: 'polkadot', name: 'Polkadot', symbol: 'DOT' },
      { id: 'chainlink', name: 'Chainlink', symbol: 'LINK' },
      { id: 'uniswap', name: 'Uniswap', symbol: 'UNI' }
    ];
  }
}

// Export singleton instance
export const coinGeckoService = new CoinGeckoService();
