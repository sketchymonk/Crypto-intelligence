import React, { useState, useEffect } from 'react';
import { CryptoMarketData, ChartDataPoint } from '../types';
import { coinGeckoService } from '../services/coinGeckoService';
import PriceChart from './PriceChart';

interface LiveDataPanelProps {
  coinId?: string;
  onCoinChange?: (coinId: string) => void;
}

const LiveDataPanel: React.FC<LiveDataPanelProps> = ({ coinId: initialCoinId, onCoinChange }) => {
  const [coinId, setCoinId] = useState<string>(initialCoinId || 'bitcoin');
  const [marketData, setMarketData] = useState<CryptoMarketData | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id: string; symbol: string; name: string }>>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [chartDays, setChartDays] = useState<number | 'max'>(30);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [showApiKeySetup, setShowApiKeySetup] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');

  // Check if API key is set
  useEffect(() => {
    setHasApiKey(coinGeckoService.hasApiKey());
  }, []);

  // Load data on mount and when coinId changes
  useEffect(() => {
    if (coinId) {
      loadCoinData();
    }
  }, [coinId]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      if (coinId) {
        loadCoinData(true); // Silent reload
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [coinId, autoRefresh]);

  const loadCoinData = async (silent = false) => {
    if (!silent) setLoading(true);
    setError('');

    try {
      const [data, chart] = await Promise.all([
        coinGeckoService.getCoinData(coinId),
        coinGeckoService.getChartData(coinId, chartDays)
      ]);

      setMarketData(data);
      setChartData(chart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const results = await coinGeckoService.searchCoin(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleSelectCoin = (newCoinId: string) => {
    setCoinId(newCoinId);
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
    onCoinChange?.(newCoinId);
  };

  const handleSaveApiKey = () => {
    if (!apiKeyInput.trim()) {
      alert('Please enter a valid API key');
      return;
    }
    coinGeckoService.saveApiKey(apiKeyInput.trim());
    setApiKeyInput('');
    setHasApiKey(true);
    setShowApiKeySetup(false);
    // Reload data with new API key
    loadCoinData();
  };

  const formatNumber = (num: number, decimals = 2) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(decimals)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(decimals)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(decimals)}K`;
    return `$${num.toFixed(decimals)}`;
  };

  const formatPrice = (price: number) => {
    if (price >= 1) return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (price >= 0.01) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(8)}`;
  };

  const formatPercentage = (value: number) => {
    const color = value >= 0 ? 'text-green-400' : 'text-red-400';
    const arrow = value >= 0 ? '↑' : '↓';
    return <span className={color}>{arrow} {Math.abs(value).toFixed(2)}%</span>;
  };

  const popularCoins = coinGeckoService.getPopularCoins();

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4 space-y-4">
      {/* Header with Search */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-purple-400">Live Market Data</h3>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`text-xs px-3 py-1 rounded ${
              autoRefresh ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
            }`}
            title={autoRefresh ? 'Auto-refresh enabled' : 'Auto-refresh disabled'}
          >
            {autoRefresh ? '🔄 Auto' : '⏸ Manual'}
          </button>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition"
          >
            {showSearch ? 'Hide Search' : '🔍 Search'}
          </button>
        </div>
      </div>

      {/* API Key Setup Banner */}
      {!hasApiKey && (
        <div className="bg-blue-900 border border-blue-700 text-blue-200 p-4 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                CoinGecko API Key Required (FREE)
              </h4>
              <p className="text-sm mb-3">
                CoinGecko now requires a free Demo API key. Get yours in 2 minutes!
              </p>
              {!showApiKeySetup ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowApiKeySetup(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition"
                  >
                    Setup API Key
                  </button>
                  <a
                    href="https://www.coingecko.com/en/api/pricing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm transition inline-flex items-center"
                  >
                    Get Free API Key
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                  </a>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveApiKey()}
                      placeholder="Paste your CoinGecko Demo API key here..."
                      className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleSaveApiKey}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setShowApiKeySetup(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm transition"
                    >
                      Cancel
                    </button>
                  </div>
                  <p className="text-xs text-blue-300">
                    💡 Sign up at CoinGecko, go to Developer Dashboard, and create a new API key
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search Interface */}
      {showSearch && (
        <div className="bg-gray-700 rounded-lg p-3 space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by name or symbol..."
              className="flex-1 bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white text-sm transition"
            >
              Search
            </button>
          </div>

          {/* Popular coins quick select */}
          <div className="flex gap-2 flex-wrap">
            <span className="text-gray-400 text-xs">Quick:</span>
            {popularCoins.slice(0, 6).map(coin => (
              <button
                key={coin.id}
                onClick={() => handleSelectCoin(coin.id)}
                className={`text-xs px-2 py-1 rounded transition ${
                  coinId === coin.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
              >
                {coin.symbol.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="bg-gray-600 rounded max-h-48 overflow-y-auto">
              {searchResults.map(result => (
                <button
                  key={result.id}
                  onClick={() => handleSelectCoin(result.id)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-500 transition text-sm text-white"
                >
                  <span className="font-medium">{result.name}</span>
                  <span className="text-gray-400 ml-2">({result.symbol.toUpperCase()})</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <p className="text-gray-400 mt-2">Loading market data...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 p-3 rounded">
          <p className="font-medium">Error loading data</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => loadCoinData()}
            className="mt-2 bg-red-700 hover:bg-red-600 px-3 py-1 rounded text-sm transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Market Data Display */}
      {!loading && !error && marketData && (
        <>
          {/* Coin Header */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-2xl font-bold text-white">{marketData.name}</h4>
                <p className="text-gray-400">{marketData.symbol.toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{formatPrice(marketData.current_price)}</p>
                <p className="text-sm">{formatPercentage(marketData.price_change_percentage_24h)}</p>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-gray-700 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">Market Cap</p>
              <p className="text-white font-bold">{formatNumber(marketData.market_cap)}</p>
              <p className="text-gray-400 text-xs">Rank #{marketData.market_cap_rank}</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">24h Volume</p>
              <p className="text-white font-bold">{formatNumber(marketData.total_volume)}</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">7d Change</p>
              <p className="text-white font-bold">{formatPercentage(marketData.price_change_percentage_7d)}</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">30d Change</p>
              <p className="text-white font-bold">{formatPercentage(marketData.price_change_percentage_30d)}</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">Circulating Supply</p>
              <p className="text-white font-bold">
                {marketData.circulating_supply.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">Max Supply</p>
              <p className="text-white font-bold">
                {marketData.max_supply ? marketData.max_supply.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '∞'}
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">All-Time High</p>
              <p className="text-white font-bold">{formatPrice(marketData.ath)}</p>
              <p className="text-gray-400 text-xs">{new Date(marketData.ath_date).toLocaleDateString()}</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">All-Time Low</p>
              <p className="text-white font-bold">{formatPrice(marketData.atl)}</p>
              <p className="text-gray-400 text-xs">{new Date(marketData.atl_date).toLocaleDateString()}</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">Last Updated</p>
              <p className="text-white font-bold text-xs">
                {new Date(marketData.last_updated).toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* Price Chart */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bold text-white">Price Chart</h4>
              <div className="flex gap-1">
                {[7, 30, 90, 365, 'max'].map(days => (
                  <button
                    key={days}
                    onClick={async () => {
                      setChartDays(days as number | 'max');
                      setChartLoading(true);
                      try {
                        const data = await coinGeckoService.getChartData(coinId, days === 'max' ? 'max' : days as number);
                        setChartData(data);
                      } catch (err) {
                        console.error('Failed to load chart data:', err);
                        setError(err instanceof Error ? err.message : 'Failed to load chart data');
                      } finally {
                        setChartLoading(false);
                      }
                    }}
                    disabled={chartLoading}
                    className={`text-xs px-2 py-1 rounded transition ${
                      chartDays === days
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    } ${chartLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={days === 'max' ? '1 Year (Free tier limit: 365 days)' : `${days} days`}
                  >
                    {days === 'max' ? '1Y' : `${days}d`}
                  </button>
                ))}
              </div>
            </div>
            {chartLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <PriceChart data={chartData} />
            )}
          </div>

          {/* Data Source Attribution */}
          <div className="text-center text-xs text-gray-500">
            Data provided by <a href="https://www.coingecko.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">CoinGecko</a>
          </div>
        </>
      )}
    </div>
  );
};

export default LiveDataPanel;
