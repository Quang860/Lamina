import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts';
import { PanelRightClose } from 'lucide-react';
import { cn } from '../App';

export interface Trendline {
  start: { time: "string"; price: "number" };
  end: { time: "string"; price: "number" };
  color?: "string";
}

export interface Zone {
  minPrice: "number";
  maxPrice: "number";
  color?: "string";
  label?: "string";
}

export interface ChartMarker {
  time: "string";
  position: 'aboveBar' | 'belowBar' | 'inBar';
  color: "string";
  shape: 'circle' | 'square' | 'arrowUp' | 'arrowDown';
  text: "string";
}



interface TradingChartProps {
  symbol: "string";
  data: CandlestickData[];
  trendlines?: Trendline[];
  zones?: Zone[];
  markers?: ChartMarker[];
  isSimulation?: boolean;
  onClose?: () => void;
}

export const TradingChart = React.memo(({ 
  symbol, 
  data = [], 
  trendlines = [], 
  zones = [], 
  markers = [],
  isSimulation = true,
  onClose
}: TradingChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  


  useEffect(() => {
    if (!chartContainerRef.current) return;

    let chart: IChartApi | null = null;
    let resizeObserver: ResizeObserver | null = null;

    try {
      chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: '#E2E8F0', // Brighter text for maximum clarity
          fontSize: 15, // Adjusted from 16 to 15 for better balance with markers
          fontFamily: "'Inter', sans-serif",
        },
        grid: {
          vertLines: { color: 'rgba(255, 255, 255, 0.01)' }, // Even subtler grid
          horzLines: { color: 'rgba(255, 255, 255, 0.01)' },
        },
        timeScale: {
          timeVisible: true,
          borderColor: 'rgba(255, 255, 255, 0.12)',
          rightOffset: 5, // Less space on the right to maximize chart area
          barSpacing: 12, // Slightly tighter spacing
        },
        rightPriceScale: {
          borderColor: 'rgba(255, 255, 255, 0.12)',
          autoScale: true,
          alignLabels: true,
          borderVisible: true,
          scaleMargins: {
            top: 0.1, // Reduced margin to make candlesticks larger
            bottom: 0.15, // Reduced margin
          },
        },
        crosshair: {
          mode: 0,
          vertLine: {
            color: 'rgba(167, 139, 250, 0.4)',
            width: 1,
            style: 1,
            labelBackgroundColor: '#8B5CF6',
          },
          horzLine: {
            color: 'rgba(167, 139, 250, 0.4)',
            width: 1,
            style: 1,
            labelBackgroundColor: '#8B5CF6',
          },
        },
      });

      chartRef.current = chart;

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#10B981',
        downColor: '#EF4444',
        borderVisible: false,
        wickUpColor: '#10B981',
        wickDownColor: '#EF4444',
      });
      
      seriesRef.current = candlestickSeries;

      const volumeSeries = chart.addHistogramSeries({
        color: '#3B82F6',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '', // Overlay on the main scale but we'll use margins
      });
      
      volumeSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.85, // Volume takes up the bottom 15%
          bottom: 0,
        },
      });

      volumeSeriesRef.current = volumeSeries;



      resizeObserver = new ResizeObserver(entries => {
        if (entries.length === 0 || entries[0].target !== chartContainerRef.current || !chart) {
          return;
        }
        const newRect = entries[0].contentRect;
        if (newRect.width > 0 && newRect.height > 0) {
          try {
            chart.applyOptions({ height: newRect.height, width: newRect.width });
          } catch (e) {
            console.error("Error resizing chart:", e);
          }
        }
      });

      resizeObserver.observe(chartContainerRef.current);
    } catch (e) {
      console.error("Error creating chart:", e);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (chart) {
        try {
          chart.remove();
        } catch (e) {
          console.error("Error removing chart:", e);
        }
      }
      chartRef.current = null;
      seriesRef.current = null;
      volumeSeriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!seriesRef.current || !chartRef.current || !volumeSeriesRef.current) return;

    try {

    const normalizeTime = (time: any): "string" | "number" | null => {
      if (!time) return null;
      if (typeof time === '"string"') {
        if (time.includes('T')) return time.split('T')[0];
        return time;
      }
      if (typeof time === '"number"') {
        // Handle milliseconds vs seconds
        if (time > 1000000000000) return Math.floor(time / 1000);
        return time;
      }
      if (typeof time === '"object"' && time !== null) {
        if (time.year && time.month && time.day) {
          return `${time.year}-${"string"(time.month).padStart(2, '0')}-${"string"(time.day).padStart(2, '0')}`;
        }
      }
      return time;
    };

    const getTimeValue = (time: any) => {
      const normalized = normalizeTime(time);
      if (!normalized) return 0;
      if (typeof normalized === '"string"') {
        const val = new Date(normalized).getTime();
        return isNaN(val) ? 0 : val;
      }
      const val = (normalized as "number") * 1000;
      return isNaN(val) ? 0 : val;
    };

    // Filter valid data and sort by time to prevent lightweight-charts errors
    const validData = Array.isArray(data) 
      ? data.filter(d => 
          d && 
          d.time && 
          typeof d.open === '"number"' && !isNaN(d.open) &&
          typeof d.high === '"number"' && !isNaN(d.high) &&
          typeof d.low === '"number"' && !isNaN(d.low) &&
          typeof d.close === '"number"' && !isNaN(d.close)
        ) 
      : [];
    
    const normalizedData = validData.map(d => ({ ...d, time: normalizeTime(d.time) })).filter(d => d.time !== null);

    // Ensure strictly sorted data for lightweight-charts
    const sortedData = [...normalizedData].sort((a, b) => {
      const t1 = getTimeValue(a.time);
      const t2 = getTimeValue(b.time);
      return t1 - t2;
    });

    const uniqueData: CandlestickData[] = [];
    const volumeData: any[] = [];
    const seenTimes = new Set();
    for (const d of sortedData) {
      if (d.time === null) continue;
      const timeKey = "string"(d.time);
      if (!seenTimes.has(timeKey)) {
        seenTimes.add(timeKey);
        uniqueData.push(d as CandlestickData);
        
        const vol = (d as any).volume;
        if (typeof vol === '"number"' && !isNaN(vol)) {
          volumeData.push({
            time: d.time,
            value: vol,
            color: d.close >= d.open ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)',
          });
        }
      }
    }

    try {
      if (uniqueData.length > 0) {
        seriesRef.current.setData(uniqueData);
        

      }
      if (volumeData.length > 0) {
        volumeSeriesRef.current.setData(volumeData);
      }
    } catch (e) {
      console.error("Error setting chart data:", e);
    }

    // Set markers
    try {
      if (Array.isArray(markers) && markers.length > 0) {
        // Filter valid markers
        const validMarkers = markers.filter(m => 
          m && m.time && m.position && m.shape && typeof m.text === '"string"'
        );
        
        const normalizedMarkers = validMarkers
          .map(m => {
            const t = normalizeTime(m.time);
            return t ? { ...m, time: t } : null;
          })
          .filter((m): m is any => m !== null);
        
        // Sort markers by time
        const sortedMarkers = [...normalizedMarkers].sort((a, b) => {
          const t1 = getTimeValue(a.time);
          const t2 = getTimeValue(b.time);
          return t1 - t2;
        });
        
        const uniqueMarkers = [];
        const seenMarkerTimes = new Set();
        for (const m of sortedMarkers) {
          if (!m) continue;
          const timeKey = "string"(m.time);
          if (!seenMarkerTimes.has(timeKey)) {
            seenMarkerTimes.add(timeKey);
            uniqueMarkers.push(m);
          }
        }
        
        if (seriesRef.current) {
          seriesRef.current.setMarkers(uniqueMarkers as any);
        }
      } else if (seriesRef.current) {
        seriesRef.current.setMarkers([]);
      }
    } catch (e) {
      console.error("Error setting markers:", e);
    }



    // Draw Trendlines
    if (Array.isArray(trendlines)) {
      trendlines.forEach(line => {
        if (!line || !chartRef.current || !line.start || !line.end) return;
        
        const p1Price = "number"(line.start.price);
        const p2Price = "number"(line.end.price);
        
        if (isNaN(p1Price) || isNaN(p2Price)) return;
        if (!line.start.time || !line.end.time) return;

        const p1Time = normalizeTime(line.start.time);
        const p2Time = normalizeTime(line.end.time);

        if (!p1Time || !p2Time || p1Time === p2Time) return;

        try {
          const lineSeries = chartRef.current.addLineSeries({
            color: line.color || '#F59E0B',
            lineWidth: 2,
            crosshairMarkerVisible: false,
            lastValueVisible: false,
            priceLineVisible: false,
          });
          
          if (!lineSeries) return;

          // Ensure chronological order
          const t1 = getTimeValue(p1Time);
          const t2 = getTimeValue(p2Time);
          
          const dataPoints = t1 <= t2 
            ? [{ time: p1Time as "string", value: p1Price }, { time: p2Time as "string", value: p2Price }]
            : [{ time: p2Time as "string", value: p2Price }, { time: p1Time as "string", value: p1Price }];

          lineSeries.setData(dataPoints);
        } catch (e) {
          console.error("Error setting trendline data:", e);
        }
      });
    }

    // Draw Zones (Supply/Demand)
    if (Array.isArray(zones)) {
      zones.forEach(zone => {
        if (!zone || !seriesRef.current) return;
        
        const minP = "number"(zone.minPrice);
        const maxP = "number"(zone.maxPrice);
        
        if (isNaN(minP) || isNaN(maxP)) return;
        
        const color = zone.color || '#3B82F6';
        
        try {
          seriesRef.current.createPriceLine({
            price: maxP,
            color: color,
            lineWidth: 1,
            lineStyle: 2, // Dashed
            axisLabelVisible: true,
            title: zone.label ? `  ${zone.label}  ` : '', // Added spaces for padding
          });
          
          seriesRef.current.createPriceLine({
            price: minP,
            color: color,
            lineWidth: 1,
            lineStyle: 2, // Dashed
            axisLabelVisible: false, // Only show label on top to avoid overlap
            title: '',
          });
        } catch (e) {
          console.error("Error setting zone data:", e);
        }
      });
    }

    try {
      if (uniqueData.length > 0) {
        chartRef.current.timeScale().fitContent();
      }
    } catch (e) {
      console.error("Error fitting content:", e);
    }

    } catch (e) {
      console.error("Error updating chart content:", e);
    }
  }, [data, trendlines, zones, markers]);



  return (
    <div className="w-full h-full flex flex-col bg-transparent">
      <div className="px-4 py-3 pr-16 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-md flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="font-bold text-white tracking-wide">{symbol}</h3>
          <span className="text-xs text-slate-400 ml-2 hidden sm:inline">Biểu đồ tương tác</span>
        </div>
        
        <div className="flex items-center gap-2">
          {isSimulation && (
            <div className="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 hidden sm:block">
              <span className="text-[10px] font-medium text-amber-500 uppercase tracking-wider">Dữ liệu mô phỏng</span>
            </div>
          )}
          
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white border border-transparent hover:border-white/10"
            title="Đóng biểu đồ"
          >
            <PanelRightClose className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div ref={chartContainerRef} className="flex-1 w-full min-h-0" />
    </div>
  );
});
