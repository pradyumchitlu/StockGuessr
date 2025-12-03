"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Play, Pause, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { scenariosAPI, matchesAPI } from "@/lib/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar } from "recharts";

interface Candle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface News {
  week: number;
  headline: string;
  date: string;
}

interface Scenario {
  _id: string;
  ticker: string;
  contextCandles: Candle[];
  gameCandles: Candle[];
  news: News[];
  description: string;
}

interface Trade {
  week: number;
  action: "BUY" | "SELL" | "HOLD";
  price: number;
  shares?: number;
  pnl?: number;
}

export default function GamePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [gameState, setGameState] = useState("matchmaking");
  const [currentWeek, setCurrentWeek] = useState(0);
  const [playerEquity, setPlayerEquity] = useState(100000);
  const [position, setPosition] = useState<any>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [opponentEquity, setOpponentEquity] = useState(100000);
  const [opponentTrades, setOpponentTrades] = useState<Trade[]>([]);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoadingScenario, setIsLoadingScenario] = useState(true);

  // Fetch scenario
  useEffect(() => {
    if (!loading && isAuthenticated) {
      fetchScenario();
    } else if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading]);

  const fetchScenario = async () => {
    try {
      setIsLoadingScenario(true);
      const response = await scenariosAPI.getRandomScenario();
      setScenario(response.data);
      prepareChartData(response.data);
      setGameState("ready");
    } catch (error) {
      console.error("Failed to fetch scenario:", error);
      setGameState("error");
    } finally {
      setIsLoadingScenario(false);
    }
  };

  const prepareChartData = (scen: Scenario) => {
    const combined = [...(scen.contextCandles || []), ...(scen.gameCandles || [])];
    const data = combined.map((candle) => ({
      date: new Date(candle.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      open: candle.open,
      close: candle.close,
      high: candle.high,
      low: candle.low,
      volume: candle.volume,
      price: candle.close,
    }));
    setChartData(data);
  };

  const startGame = () => {
    setGameState("playing");
    setCurrentWeek(0);
  };

  const handleTrade = async (action: "BUY" | "SELL" | "HOLD") => {
    if (!scenario) return;

    const gameCandle = scenario.gameCandles[currentWeek];
    if (!gameCandle) return;

    const newTrade: Trade = {
      week: currentWeek,
      action,
      price: gameCandle.close,
    };

    let newEquity = playerEquity;

    if (action === "BUY" && !position) {
      const sharesBought = Math.floor(playerEquity / gameCandle.close);
      newTrade.shares = sharesBought;
      newEquity = playerEquity - sharesBought * gameCandle.close;
      setPosition({
        shares: sharesBought,
        entryPrice: gameCandle.close,
        entryWeek: currentWeek,
      });
    } else if (action === "SELL" && position) {
      const proceeds = position.shares * gameCandle.close;
      newTrade.pnl = proceeds - position.shares * position.entryPrice;
      newEquity = playerEquity + newTrade.pnl;
      setPosition(null);
    }

    setTrades([...trades, newTrade]);
    setPlayerEquity(newEquity);

    // Advance week
    if (currentWeek < 3) {
      setCurrentWeek(currentWeek + 1);
    } else {
      endGame();
    }
  };

  const endGame = async () => {
    if (!user || !scenario || !matchId) return;

    // Calculate final equity
    let finalEquity = playerEquity;
    if (position) {
      const lastCandle = scenario.gameCandles[3];
      const proceeds = position.shares * lastCandle.close;
      finalEquity = playerEquity + (proceeds - position.shares * position.entryPrice);
    }

    try {
      await matchesAPI.updateMatch(matchId, {
        player1FinalEquity: finalEquity,
        player2FinalEquity: opponentEquity,
        player1Trades: trades,
        player2Trades: opponentTrades,
      });
      setGameState("completed");
    } catch (error) {
      console.error("Failed to end game:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Loading state
  if (isLoadingScenario || !scenario) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="animate-spin mb-4">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full" />
        </div>
        <p className="text-gray-400">Finding the perfect trading scenario...</p>
      </div>
    );
  }

  // Ready state
  if (gameState === "ready") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        <motion.div
          className="relative z-10 text-center max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold mb-4">Ready to Trade?</h1>
          <p className="text-gray-400 text-lg mb-8">
            You'll trade {scenario.ticker} with $100,000 starting capital. 4 weeks of action, real-time market moves, and news catalysts await.
          </p>

          <motion.button
            onClick={startGame}
            className="px-12 py-4 rounded-lg bg-gradient-primary text-white font-bold text-lg hover:shadow-2xl glow-primary transition-all duration-300 flex items-center gap-3 mx-auto mb-8"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="w-6 h-6" />
            Start Trading
          </motion.button>

          <p className="text-gray-500 text-sm">Stock: {scenario.ticker} | Difficulty: {scenario.difficulty}</p>
        </motion.div>
      </div>
    );
  }

  // Playing state
  if (gameState === "playing") {
    const currentCandle = scenario.gameCandles[currentWeek];
    const newsForWeek = scenario.news.filter((n) => n.week === currentWeek);
    const contextStartIndex = Math.max(0, scenario.contextCandles.length - 20);
    const displayChartData = [
      ...scenario.contextCandles.slice(contextStartIndex),
      ...scenario.gameCandles.slice(0, currentWeek + 1),
    ].map((c) => ({
      date: new Date(c.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      price: c.close,
      volume: c.volume,
    }));

    return (
      <div className="min-h-screen bg-black text-white overflow-hidden">
        {/* Header */}
        <div className="border-b border-white/10 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/dashboard">
              <motion.button
                className="flex items-center gap-2 text-gray-400 hover:text-white transition"
                whileHover={{ scale: 1.05 }}
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </motion.button>
            </Link>
            <div className="text-center">
              <p className="text-sm text-gray-400">Week {currentWeek + 1} of 4</p>
              <h2 className="text-2xl font-bold">{scenario.ticker}</h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Your Equity</p>
              <p className="text-2xl font-bold text-green-400">${playerEquity.toFixed(0)}</p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart - Left side */}
            <motion.div
              className="lg:col-span-2 glassmorphism p-6 rounded-2xl border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-lg font-bold mb-4">Stock Chart</h3>
              {displayChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={displayChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" style={{ fontSize: "12px" }} />
                    <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.2)" }}
                      formatter={(value) => `$${value.toFixed(2)}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#a78bfa"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                    <Bar dataKey="volume" fill="rgba(168,107,250,0.2)" yAxisId="right" />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-400 text-center py-12">Loading chart...</p>
              )}
            </motion.div>

            {/* Controls - Right side */}
            <motion.div
              className="glassmorphism p-6 rounded-2xl border border-white/10 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-lg font-bold mb-6">Trading Actions</h3>

              <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-sm text-gray-400 mb-2">Current Price</p>
                <p className="text-3xl font-bold text-gradient">${currentCandle?.close.toFixed(2)}</p>
              </div>

              {position && (
                <motion.div
                  className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-sm text-gray-400 mb-1">Position</p>
                  <p className="text-lg font-bold text-green-400">{position.shares} shares @ ${position.entryPrice.toFixed(2)}</p>
                  <p className="text-sm text-green-400 mt-1">Entry Week: {position.entryWeek + 1}</p>
                </motion.div>
              )}

              <div className="space-y-3 flex-1 flex flex-col justify-center">
                <motion.button
                  onClick={() => handleTrade("BUY")}
                  disabled={position !== null}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <TrendingUp className="w-5 h-5" />
                  Buy (Long)
                </motion.button>

                <motion.button
                  onClick={() => handleTrade("HOLD")}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold hover:shadow-lg transition flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Pause className="w-5 h-5" />
                  Hold
                </motion.button>

                <motion.button
                  onClick={() => handleTrade("SELL")}
                  disabled={position === null}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <TrendingDown className="w-5 h-5" />
                  Sell (Close)
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* News Section */}
          {newsForWeek.length > 0 && (
            <motion.div
              className="mt-8 glassmorphism p-6 rounded-2xl border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-lg font-bold mb-4">📰 Market News</h3>
              <div className="space-y-3">
                {newsForWeek.map((news, idx) => (
                  <motion.div
                    key={idx}
                    className="p-4 rounded-lg bg-white/5 border border-white/10"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <p className="text-gray-300">{news.headline}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // Completed state
  if (gameState === "completed") {
    const playerFinalEquity = playerEquity;
    const playerPnL = playerFinalEquity - 100000;

    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <motion.div
          className="text-center max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold mb-4">Game Complete!</h1>
          <p className="text-gray-400 text-lg mb-8">
            Stock: {scenario.ticker}
          </p>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="glassmorphism p-6 rounded-xl border border-white/10">
              <p className="text-gray-400 text-sm mb-2">Your Final Equity</p>
              <p className="text-3xl font-bold text-gradient">${playerFinalEquity.toFixed(0)}</p>
            </div>
            <div className={`glassmorphism p-6 rounded-xl border ${playerPnL >= 0 ? 'border-green-500/50' : 'border-red-500/50'}`}>
              <p className="text-gray-400 text-sm mb-2">Profit/Loss</p>
              <p className={`text-3xl font-bold ${playerPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${playerPnL.toFixed(0)}
              </p>
            </div>
          </div>

          <Link href="/dashboard">
            <motion.button
              className="px-8 py-4 rounded-lg bg-gradient-primary text-white font-bold text-lg hover:shadow-2xl glow-primary transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Back to Dashboard
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return null;
}
