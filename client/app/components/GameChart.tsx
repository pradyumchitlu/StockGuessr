"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import { createChart, CandlestickSeries, HistogramSeries, LineSeries, IChartApi, createSeriesMarkers } from "lightweight-charts";

interface Candle {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

interface GameChartProps {
    contextCandles: Candle[];
    gameCandles: Candle[];
    currentWeek: number; // 0-3
    gameState: "matchmaking" | "ready" | "playing" | "completed" | "error";
}

// Helper to aggregate daily candles into weekly
const aggregateToWeekly = (dailies: Candle[]): Candle[] => {
    const weeklies: Candle[] = [];
    let currentWeekCandles: Candle[] = [];

    dailies.forEach((candle, index) => {
        currentWeekCandles.push(candle);

        if (currentWeekCandles.length === 5 || index === dailies.length - 1) {
            const open = currentWeekCandles[0].open;
            const close = currentWeekCandles[currentWeekCandles.length - 1].close;
            const high = Math.max(...currentWeekCandles.map(c => c.high));
            const low = Math.min(...currentWeekCandles.map(c => c.low));
            const volume = currentWeekCandles.reduce((acc, c) => acc + c.volume, 0);
            const date = currentWeekCandles[currentWeekCandles.length - 1].date;

            weeklies.push({ date, open, high, low, close, volume });
            currentWeekCandles = [];
        }
    });

    return weeklies;
};

// Helper to aggregate daily candles into monthly (approximately 20 trading days)
const aggregateToMonthly = (dailies: Candle[]): Candle[] => {
    const monthlies: Candle[] = [];
    let currentMonthCandles: Candle[] = [];
    let currentMonth = -1;

    dailies.forEach((candle, index) => {
        const candleDate = new Date(candle.date);
        const month = candleDate.getMonth();

        if (currentMonth !== month && currentMonthCandles.length > 0) {
            // Aggregate previous month
            const open = currentMonthCandles[0].open;
            const close = currentMonthCandles[currentMonthCandles.length - 1].close;
            const high = Math.max(...currentMonthCandles.map(c => c.high));
            const low = Math.min(...currentMonthCandles.map(c => c.low));
            const volume = currentMonthCandles.reduce((acc, c) => acc + c.volume, 0);
            const date = currentMonthCandles[currentMonthCandles.length - 1].date;

            monthlies.push({ date, open, high, low, close, volume });
            currentMonthCandles = [];
        }

        currentMonth = month;
        currentMonthCandles.push(candle);

        // Handle last candle
        if (index === dailies.length - 1 && currentMonthCandles.length > 0) {
            const open = currentMonthCandles[0].open;
            const close = currentMonthCandles[currentMonthCandles.length - 1].close;
            const high = Math.max(...currentMonthCandles.map(c => c.high));
            const low = Math.min(...currentMonthCandles.map(c => c.low));
            const volume = currentMonthCandles.reduce((acc, c) => acc + c.volume, 0);
            const date = currentMonthCandles[currentMonthCandles.length - 1].date;

            monthlies.push({ date, open, high, low, close, volume });
        }
    });

    return monthlies;
};

type Timeframe = 'daily' | 'weekly' | 'monthly';

// Calculate RSI (14-period standard)
// Returns null for periods without enough data instead of fake 50 values
const calculateRSI = (closes: number[], period: number = 14): (number | null)[] => {
    const rsiValues: (number | null)[] = [];

    if (closes.length < period + 1) {
        return closes.map(() => null); // Not enough data
    }

    // Calculate price changes
    const changes: number[] = [];
    for (let i = 1; i < closes.length; i++) {
        changes.push(closes[i] - closes[i - 1]);
    }

    // Initial average gain/loss
    let avgGain = 0;
    let avgLoss = 0;
    for (let i = 0; i < period; i++) {
        if (changes[i] > 0) avgGain += changes[i];
        else avgLoss += Math.abs(changes[i]);
    }
    avgGain /= period;
    avgLoss /= period;

    // Fill initial values with null (not enough data)
    for (let i = 0; i < period; i++) {
        rsiValues.push(null);
    }

    // Calculate RSI for each subsequent price
    for (let i = period; i < changes.length; i++) {
        const change = changes[i];
        const gain = change > 0 ? change : 0;
        const loss = change < 0 ? Math.abs(change) : 0;

        avgGain = (avgGain * (period - 1) + gain) / period;
        avgLoss = (avgLoss * (period - 1) + loss) / period;

        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        const rsi = 100 - (100 / (1 + rs));
        rsiValues.push(rsi);
    }

    // Add null for alignment with first candle
    rsiValues.unshift(null);

    return rsiValues;
};

export default function GameChart({ contextCandles, gameCandles, currentWeek, gameState }: GameChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const rsiContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const rsiChartRef = useRef<IChartApi | null>(null);
    const candleSeriesRef = useRef<any>(null);
    const volumeSeriesRef = useRef<any>(null);
    const rsiSeriesRef = useRef<any>(null);
    const rsi30LineRef = useRef<any>(null);
    const rsi70LineRef = useRef<any>(null);
    const markersPluginRef = useRef<any>(null);

    const [timeframe, setTimeframe] = useState<Timeframe>('weekly');

    // Prepare combined data based on timeframe
    const { candleData, volumeData, rsiData, weekBoundaries } = useMemo(() => {
        if (!contextCandles || !gameCandles) {
            return { candleData: [], volumeData: [], rsiData: [], weekBoundaries: [] };
        }

        // Aggregate context based on timeframe
        let aggregatedContext: Candle[];
        if (timeframe === 'daily') {
            aggregatedContext = contextCandles;
        } else if (timeframe === 'monthly') {
            aggregatedContext = aggregateToMonthly(contextCandles);
        } else {
            aggregatedContext = aggregateToWeekly(contextCandles);
        }

        // Get revealed game days
        const revealedGameDays = gameState === "completed"
            ? gameCandles
            : gameCandles.slice(0, (currentWeek + 1) * 5);

        // Combine aggregated context with revealed game days
        const combined = [...aggregatedContext, ...revealedGameDays];

        // Convert to lightweight-charts format
        const candleData = combined.map(c => ({
            time: c.date.split('T')[0],
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
        }));

        const volumeData = combined.map(c => ({
            time: c.date.split('T')[0],
            value: c.volume,
            color: c.close >= c.open ? "rgba(38, 166, 154, 0.3)" : "rgba(239, 83, 80, 0.3)",
        }));

        // Calculate RSI - only include valid data points
        const closes = combined.map(c => c.close);
        const rsiValues = calculateRSI(closes);
        const rsiData = combined
            .map((c, i) => ({
                time: c.date.split('T')[0],
                value: rsiValues[i],
            }))
            .filter(d => d.value !== null) as { time: string; value: number }[];

        // Calculate week boundaries
        const weekBoundaries: string[] = [];
        if (revealedGameDays.length > 0) {
            weekBoundaries.push(revealedGameDays[0].date.split('T')[0]);
        }
        for (let week = 1; week <= 3; week++) {
            const dayIndex = week * 5;
            if (dayIndex < revealedGameDays.length) {
                weekBoundaries.push(revealedGameDays[dayIndex].date.split('T')[0]);
            }
        }

        return { candleData, volumeData, rsiData, weekBoundaries };
    }, [contextCandles, gameCandles, currentWeek, gameState, timeframe]);

    // Create charts
    useEffect(() => {
        if (!chartContainerRef.current || !rsiContainerRef.current) return;

        // Create main chart
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { color: "transparent" },
                textColor: "#666",
            },
            grid: {
                vertLines: { color: "rgba(255, 255, 255, 0.03)" },
                horzLines: { color: "rgba(255, 255, 255, 0.03)" },
            },
            crosshair: {
                mode: 1,
                vertLine: {
                    color: "rgba(255, 255, 255, 0.3)",
                    width: 1,
                    style: 2,
                    labelBackgroundColor: "#333",
                },
                horzLine: {
                    color: "rgba(255, 255, 255, 0.3)",
                    width: 1,
                    style: 2,
                    labelBackgroundColor: "#333",
                },
            },
            timeScale: {
                borderColor: "#333",
                timeVisible: true,
                secondsVisible: false,
            },
            rightPriceScale: {
                borderColor: "#333",
            },
        });

        // Candlestick series
        const candleSeries = chart.addSeries(CandlestickSeries, {
            upColor: "#26a69a",
            downColor: "#ef5350",
            borderUpColor: "#26a69a",
            borderDownColor: "#ef5350",
            wickUpColor: "#26a69a",
            wickDownColor: "#ef5350",
        });

        // Volume series
        const volumeSeries = chart.addSeries(HistogramSeries, {
            priceFormat: { type: "volume" },
            priceScaleId: "",
        });

        volumeSeries.priceScale().applyOptions({
            scaleMargins: {
                top: 0.8,
                bottom: 0,
            },
        });

        // Create RSI chart
        const rsiChart = createChart(rsiContainerRef.current, {
            layout: {
                background: { color: "transparent" },
                textColor: "#666",
            },
            grid: {
                vertLines: { color: "rgba(255, 255, 255, 0.03)" },
                horzLines: { color: "rgba(255, 255, 255, 0.05)" },
            },
            crosshair: {
                mode: 1,
                vertLine: {
                    color: "rgba(255, 255, 255, 0.3)",
                    width: 1,
                    style: 2,
                    labelBackgroundColor: "#333",
                },
                horzLine: {
                    color: "rgba(255, 255, 255, 0.3)",
                    width: 1,
                    style: 2,
                    labelBackgroundColor: "#333",
                },
            },
            timeScale: {
                borderColor: "#333",
                visible: false, // Hide time scale since main chart shows it
            },
            rightPriceScale: {
                borderColor: "#333",
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.1,
                },
            },
        });

        // RSI line series
        const rsiSeries = rsiChart.addSeries(LineSeries, {
            color: "#9333ea",
            lineWidth: 2,
            priceFormat: {
                type: "custom",
                formatter: (price: number) => price.toFixed(0),
            },
        });

        // Set fixed price scale for RSI (0-100)
        rsiSeries.priceScale().applyOptions({
            autoScale: false,
            scaleMargins: { top: 0.05, bottom: 0.05 },
        });

        // Add 30/70 reference lines (oversold/overbought)
        const rsi30Line = rsiChart.addSeries(LineSeries, {
            color: 'rgba(34, 197, 94, 0.5)', // Green for oversold
            lineWidth: 1,
            lineStyle: 2, // Dashed
            priceLineVisible: false,
            lastValueVisible: false,
            crosshairMarkerVisible: false,
        });

        const rsi70Line = rsiChart.addSeries(LineSeries, {
            color: 'rgba(239, 68, 68, 0.5)', // Red for overbought
            lineWidth: 1,
            lineStyle: 2, // Dashed
            priceLineVisible: false,
            lastValueVisible: false,
            crosshairMarkerVisible: false,
        });

        rsi30LineRef.current = rsi30Line;
        rsi70LineRef.current = rsi70Line;

        chartRef.current = chart;
        rsiChartRef.current = rsiChart;
        candleSeriesRef.current = candleSeries;
        volumeSeriesRef.current = volumeSeries;
        rsiSeriesRef.current = rsiSeries;

        // Sync time scales
        const syncHandler = (range: any) => {
            if (range) {
                rsiChart.timeScale().setVisibleLogicalRange(range);
            }
        };
        chart.timeScale().subscribeVisibleLogicalRangeChange(syncHandler);

        // Handle resize
        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                    height: chartContainerRef.current.clientHeight,
                });
            }
            if (rsiContainerRef.current) {
                rsiChart.applyOptions({
                    width: rsiContainerRef.current.clientWidth,
                    height: rsiContainerRef.current.clientHeight,
                });
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
            chart.timeScale().unsubscribeVisibleLogicalRangeChange(syncHandler);
            chart.remove();
            rsiChart.remove();
            chartRef.current = null;
            rsiChartRef.current = null;
            candleSeriesRef.current = null;
            volumeSeriesRef.current = null;
            rsiSeriesRef.current = null;
            rsi30LineRef.current = null;
            rsi70LineRef.current = null;
        };
    }, []);

    // Update data when it changes
    useEffect(() => {
        if (!chartRef.current || !candleSeriesRef.current || !volumeSeriesRef.current || !rsiSeriesRef.current) return;

        if (candleData.length > 0) {
            candleSeriesRef.current.setData(candleData);
        }

        if (volumeData.length > 0) {
            volumeSeriesRef.current.setData(volumeData);
        }

        if (rsiData.length > 0) {
            rsiSeriesRef.current.setData(rsiData);

            // Set 30/70 reference line data (horizontal lines spanning full range)
            if (rsi30LineRef.current && rsi70LineRef.current && candleData.length > 0) {
                const firstTime = candleData[0].time;
                const lastTime = candleData[candleData.length - 1].time;

                rsi30LineRef.current.setData([
                    { time: firstTime, value: 30 },
                    { time: lastTime, value: 30 }
                ]);
                rsi70LineRef.current.setData([
                    { time: firstTime, value: 70 },
                    { time: lastTime, value: 70 }
                ]);
            }
        }

        // Add week boundary markers
        if (weekBoundaries.length > 0 && candleSeriesRef.current) {
            const markers = weekBoundaries.map((time, index) => ({
                time,
                position: 'aboveBar' as const,
                color: '#9333ea',
                shape: 'arrowDown' as const,
                text: index === 0 ? 'G' : `W${index + 1}`,
            }));

            if (!markersPluginRef.current) {
                markersPluginRef.current = createSeriesMarkers(candleSeriesRef.current, markers);
            } else {
                markersPluginRef.current.setMarkers(markers);
            }
        }

        // Fit content
        chartRef.current.timeScale().fitContent();
    }, [candleData, volumeData, rsiData, weekBoundaries]);

    return (
        <div className="w-full h-full flex flex-col">
            {/* Timeframe Toggle */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Timeframe:</span>
                {(['daily', 'weekly', 'monthly'] as Timeframe[]).map((tf) => (
                    <button
                        key={tf}
                        onClick={() => setTimeframe(tf)}
                        className={`px-3 py-1 text-xs font-medium rounded transition ${timeframe === tf
                            ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'
                            }`}
                    >
                        {tf.charAt(0).toUpperCase() + tf.slice(1)}
                    </button>
                ))}
            </div>

            {/* Main Chart */}
            <div ref={chartContainerRef} className="flex-1 min-h-0" />

            {/* RSI Indicator */}
            <div className="h-24 border-t border-white/10 relative">
                <div className="absolute left-2 top-1 text-xs text-gray-500 z-10 flex items-center gap-2">
                    <span className="text-purple-400 font-medium">RSI(14)</span>
                    <span className="text-gray-600">70/30</span>
                </div>
                {/* Overbought/Oversold lines drawn via CSS overlay */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute w-full border-t border-red-500/30" style={{ top: '30%' }} />
                    <div className="absolute w-full border-t border-green-500/30" style={{ top: '70%' }} />
                </div>
                <div ref={rsiContainerRef} className="w-full h-full" />
            </div>
        </div>
    );
}
