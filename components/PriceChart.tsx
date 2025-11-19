import React, { useMemo } from 'react';
import { ChartDataPoint } from '../types';

interface PriceChartProps {
  data: ChartDataPoint[];
  width?: number;
  height?: number;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, width = 800, height = 300 }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const prices = data.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    // Calculate padding
    const padding = { top: 20, right: 20, bottom: 30, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Generate path for line chart
    const points = data.map((point, index) => {
      const x = padding.left + (index / (data.length - 1)) * chartWidth;
      const y = padding.top + chartHeight - ((point.price - minPrice) / priceRange) * chartHeight;
      return { x, y, price: point.price, timestamp: point.timestamp };
    });

    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    // Generate area path (filled under the line)
    const areaPath = `${pathData} L ${points[points.length - 1].x} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`;

    // Calculate price change
    const startPrice = prices[0];
    const endPrice = prices[prices.length - 1];
    const priceChange = ((endPrice - startPrice) / startPrice) * 100;
    const isPositive = priceChange >= 0;

    // Y-axis labels
    const yAxisSteps = 5;
    const yAxisLabels = Array.from({ length: yAxisSteps }, (_, i) => {
      const value = minPrice + (priceRange / (yAxisSteps - 1)) * i;
      const y = padding.top + chartHeight - ((value - minPrice) / priceRange) * chartHeight;
      return { value, y };
    }).reverse();

    // X-axis labels (show 5 evenly spaced dates)
    const xAxisSteps = 5;
    const xAxisLabels = Array.from({ length: xAxisSteps }, (_, i) => {
      const index = Math.floor((i / (xAxisSteps - 1)) * (data.length - 1));
      const point = data[index];
      const x = padding.left + (index / (data.length - 1)) * chartWidth;
      const date = new Date(point.timestamp);
      const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return { label, x };
    });

    return {
      points,
      pathData,
      areaPath,
      minPrice,
      maxPrice,
      priceChange,
      isPositive,
      padding,
      yAxisLabels,
      xAxisLabels
    };
  }, [data, width, height]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No chart data available
      </div>
    );
  }

  if (!chartData) return null;

  const formatPrice = (price: number) => {
    if (price >= 1) return `$${price.toFixed(2)}`;
    if (price >= 0.01) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(8)}`;
  };

  return (
    <div className="relative">
      {/* Price change indicator */}
      <div className={`absolute top-0 right-0 px-3 py-1 rounded text-sm font-bold ${
        chartData.isPositive ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
      }`}>
        {chartData.isPositive ? '↑' : '↓'} {Math.abs(chartData.priceChange).toFixed(2)}%
      </div>

      <svg width={width} height={height} className="w-full h-auto">
        {/* Grid lines */}
        <g>
          {chartData.yAxisLabels.map((label, i) => (
            <line
              key={i}
              x1={chartData.padding.left}
              y1={label.y}
              x2={width - chartData.padding.right}
              y2={label.y}
              stroke="#374151"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}
        </g>

        {/* Area fill */}
        <path
          d={chartData.areaPath}
          fill={chartData.isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'}
        />

        {/* Line */}
        <path
          d={chartData.pathData}
          fill="none"
          stroke={chartData.isPositive ? '#22c55e' : '#ef4444'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {chartData.points.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="3"
            fill={chartData.isPositive ? '#22c55e' : '#ef4444'}
            className="hover:r-5 transition-all cursor-pointer"
          >
            <title>{formatPrice(point.price)} - {new Date(point.timestamp).toLocaleDateString()}</title>
          </circle>
        ))}

        {/* Y-axis labels */}
        {chartData.yAxisLabels.map((label, i) => (
          <text
            key={i}
            x={chartData.padding.left - 10}
            y={label.y + 4}
            textAnchor="end"
            fill="#9ca3af"
            fontSize="12"
          >
            {formatPrice(label.value)}
          </text>
        ))}

        {/* X-axis labels */}
        {chartData.xAxisLabels.map((label, i) => (
          <text
            key={i}
            x={label.x}
            y={height - chartData.padding.bottom + 20}
            textAnchor="middle"
            fill="#9ca3af"
            fontSize="12"
          >
            {label.label}
          </text>
        ))}

        {/* Axes */}
        <line
          x1={chartData.padding.left}
          y1={chartData.padding.top}
          x2={chartData.padding.left}
          y2={height - chartData.padding.bottom}
          stroke="#4b5563"
          strokeWidth="2"
        />
        <line
          x1={chartData.padding.left}
          y1={height - chartData.padding.bottom}
          x2={width - chartData.padding.right}
          y2={height - chartData.padding.bottom}
          stroke="#4b5563"
          strokeWidth="2"
        />
      </svg>

      {/* Legend */}
      <div className="mt-2 text-xs text-gray-400 text-center">
        {formatPrice(chartData.minPrice)} → {formatPrice(chartData.maxPrice)}
      </div>
    </div>
  );
};

export default PriceChart;
