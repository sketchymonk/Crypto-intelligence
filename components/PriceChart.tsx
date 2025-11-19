import React, { useMemo, useState } from 'react';
import { ChartDataPoint } from '../types';

interface PriceChartProps {
  data: ChartDataPoint[];
  width?: number;
  height?: number;
  showExpandButton?: boolean;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, width = 800, height = 300, showExpandButton = true }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number; price: number; timestamp: number } | null>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No chart data available
      </div>
    );
  }

  const formatPrice = (price: number) => {
    if (price >= 1) return `$${price.toFixed(2)}`;
    if (price >= 0.01) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(8)}`;
  };

  const ChartContent = ({ w, h, isExpandedView = false }: { w: number; h: number; isExpandedView?: boolean }) => {
    const localSvgRef = React.useRef<SVGSVGElement>(null);
    const [localHoverPoint, setLocalHoverPoint] = useState<{ x: number; y: number; price: number; timestamp: number } | null>(null);

    const chartDataForSize = useMemo(() => {
      if (!data || data.length === 0) return null;

      const prices = data.map(d => d.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const priceRange = maxPrice - minPrice;
      const padding = { top: 30, right: 30, bottom: 40, left: 70 };
      const chartWidth = w - padding.left - padding.right;
      const chartHeight = h - padding.top - padding.bottom;

      const points = data.map((point, index) => {
        const x = padding.left + (index / (data.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - ((point.price - minPrice) / priceRange) * chartHeight;
        return { x, y, price: point.price, timestamp: point.timestamp };
      });

      const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
      const areaPath = `${pathData} L ${points[points.length - 1].x} ${h - padding.bottom} L ${padding.left} ${h - padding.bottom} Z`;

      const startPrice = prices[0];
      const endPrice = prices[prices.length - 1];
      const priceChange = ((endPrice - startPrice) / startPrice) * 100;
      const isPositive = priceChange >= 0;

      const yAxisSteps = 5;
      const yAxisLabels = Array.from({ length: yAxisSteps }, (_, i) => {
        const value = minPrice + (priceRange / (yAxisSteps - 1)) * i;
        const y = padding.top + chartHeight - ((value - minPrice) / priceRange) * chartHeight;
        return { value, y };
      }).reverse();

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
    }, [data, w, h]);

    if (!chartDataForSize) return null;

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
      if (!localSvgRef.current) return;

      const rect = localSvgRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const scaleX = w / rect.width;
      const actualX = x * scaleX;

      // Find closest point
      const closestPoint = chartDataForSize.points.reduce((prev, curr) => {
        return Math.abs(curr.x - actualX) < Math.abs(prev.x - actualX) ? curr : prev;
      });

      setLocalHoverPoint(closestPoint);
    };

    const handleMouseLeave = () => {
      setLocalHoverPoint(null);
    };

    const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
      if (!localSvgRef.current || e.touches.length === 0) return;

      const rect = localSvgRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const scaleX = w / rect.width;
      const actualX = x * scaleX;

      const closestPoint = chartDataForSize.points.reduce((prev, curr) => {
        return Math.abs(curr.x - actualX) < Math.abs(prev.x - actualX) ? curr : prev;
      });

      setLocalHoverPoint(closestPoint);
    };

    return (
      <>
        {/* Price change indicator */}
        <div className={`absolute top-2 right-2 px-3 py-1 rounded text-sm font-bold z-10 ${
          chartDataForSize.isPositive ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
        }`}>
          {chartDataForSize.isPositive ? '↑' : '↓'} {Math.abs(chartDataForSize.priceChange).toFixed(2)}%
        </div>

        {/* Hover tooltip */}
        {localHoverPoint && (
          <div
            className="absolute bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded text-xs shadow-lg z-20 pointer-events-none"
            style={{
              left: `${(localHoverPoint.x / w) * 100}%`,
              top: `${(localHoverPoint.y / h) * 100}%`,
              transform: 'translate(-50%, -120%)'
            }}
          >
            <div className="font-bold">{formatPrice(localHoverPoint.price)}</div>
            <div className="text-gray-400 text-[10px]">
              {new Date(localHoverPoint.timestamp).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        )}

        <svg
          ref={localSvgRef}
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-auto cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseLeave}
        >
          {/* Grid lines */}
          <g>
            {chartDataForSize.yAxisLabels.map((label, i) => (
              <line
                key={i}
                x1={chartDataForSize.padding.left}
                y1={label.y}
                x2={w - chartDataForSize.padding.right}
                y2={label.y}
                stroke="#374151"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            ))}
          </g>

          {/* Area fill */}
          <path
            d={chartDataForSize.areaPath}
            fill={chartDataForSize.isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'}
          />

          {/* Line */}
          <path
            d={chartDataForSize.pathData}
            fill="none"
            stroke={chartDataForSize.isPositive ? '#22c55e' : '#ef4444'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {chartDataForSize.points.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="3"
              fill={chartDataForSize.isPositive ? '#22c55e' : '#ef4444'}
              className="hover:r-5 transition-all cursor-pointer"
            >
              <title>{formatPrice(point.price)} - {new Date(point.timestamp).toLocaleDateString()}</title>
            </circle>
          ))}

          {/* Y-axis labels */}
          {chartDataForSize.yAxisLabels.map((label, i) => (
            <text
              key={i}
              x={chartDataForSize.padding.left - 10}
              y={label.y + 4}
              textAnchor="end"
              fill="#9ca3af"
              fontSize="12"
            >
              {formatPrice(label.value)}
            </text>
          ))}

          {/* X-axis labels */}
          {chartDataForSize.xAxisLabels.map((label, i) => (
            <text
              key={i}
              x={label.x}
              y={h - chartDataForSize.padding.bottom + 20}
              textAnchor="middle"
              fill="#9ca3af"
              fontSize="12"
            >
              {label.label}
            </text>
          ))}

          {/* Axes */}
          <line
            x1={chartDataForSize.padding.left}
            y1={chartDataForSize.padding.top}
            x2={chartDataForSize.padding.left}
            y2={h - chartDataForSize.padding.bottom}
            stroke="#4b5563"
            strokeWidth="2"
          />
          <line
            x1={chartDataForSize.padding.left}
            y1={h - chartDataForSize.padding.bottom}
            x2={w - chartDataForSize.padding.right}
            y2={h - chartDataForSize.padding.bottom}
            stroke="#4b5563"
            strokeWidth="2"
          />

          {/* Crosshair */}
          {localHoverPoint && (
            <g>
              {/* Vertical line */}
              <line
                x1={localHoverPoint.x}
                y1={chartDataForSize.padding.top}
                x2={localHoverPoint.x}
                y2={h - chartDataForSize.padding.bottom}
                stroke="#8b5cf6"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.7"
              />
              {/* Horizontal line */}
              <line
                x1={chartDataForSize.padding.left}
                y1={localHoverPoint.y}
                x2={w - chartDataForSize.padding.right}
                y2={localHoverPoint.y}
                stroke="#8b5cf6"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.7"
              />
              {/* Point highlight */}
              <circle
                cx={localHoverPoint.x}
                cy={localHoverPoint.y}
                r="6"
                fill="#8b5cf6"
                stroke="white"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {/* Legend */}
        <div className="mt-2 text-xs text-gray-400 text-center">
          {formatPrice(chartDataForSize.minPrice)} → {formatPrice(chartDataForSize.maxPrice)}
        </div>
      </>
    );
  };

  return (
    <>
      <div className="relative">
        <ChartContent w={width} h={height} />

        {/* Expand button */}
        {showExpandButton && (
          <button
            onClick={() => setIsExpanded(true)}
            className="absolute bottom-2 right-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs transition flex items-center gap-1"
            title="Expand chart"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            Expand
          </button>
        )}
      </div>

      {/* Expanded modal */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative w-full h-full max-w-7xl max-h-[90vh] bg-gray-800 rounded-lg p-6">
            {/* Close button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full transition z-10"
              title="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Expanded chart */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-full" style={{ maxHeight: 'calc(90vh - 100px)' }}>
                <h3 className="text-xl font-bold text-white mb-4">Price Chart - Expanded View</h3>
                <div className="relative">
                  <ChartContent w={1200} h={600} isExpandedView={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PriceChart;
