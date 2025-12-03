"use client";

import { motion } from "framer-motion";
import { LogOut, Play, History, TrendingUp, Trophy, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { matchesAPI } from "@/lib/api";

interface Match {
  _id: string;
  stockTicker: string;
  stockDate: string;
  player1FinalEquity?: number;
  player2FinalEquity?: number;
  winner?: string;
  status: string;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (user) {
      fetchMatches();
    }
  }, [user]);

  const fetchMatches = async () => {
    try {
      setLoadingMatches(true);
      if (user) {
        const response = await matchesAPI.getUserMatches(user._id);
        setMatches(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch matches:", error);
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handlePlayGame = () => {
    router.push("/game");
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

  const winRate =
    user!.stats.totalMatches > 0
      ? ((user!.stats.wins / user!.stats.totalMatches) * 100).toFixed(1)
      : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/">
            <motion.div
              className="text-2xl font-bold text-gradient cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              StockGuessr
            </motion.div>
          </Link>
          <motion.button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition"
            whileHover={{ scale: 1.05 }}
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </motion.button>
        </div>
      </nav>

      {/* Background elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 100, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, -100, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <motion.div
          className="mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="text-5xl font-bold mb-4" variants={itemVariants}>
            Welcome, <span className="text-gradient">{user?.username}</span>
          </motion.h1>
          <motion.p className="text-gray-400 text-lg" variants={itemVariants}>
            Track your progress and master the markets
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { label: "Matches Played", value: user?.stats.totalMatches || 0, icon: Zap, color: "from-yellow-400 to-orange-600" },
            { label: "Win Rate", value: `${winRate}%`, icon: Trophy, color: "from-purple-400 to-pink-600" },
            { label: "Total PnL", value: `$${(user?.stats.totalPnL || 0).toFixed(0)}`, icon: TrendingUp, color: "from-green-400 to-emerald-600" },
            { label: "Avg PnL/Match", value: `$${(user?.stats.avgPnL || 0).toFixed(0)}`, icon: TrendingUp, color: "from-blue-400 to-cyan-600" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              className="glassmorphism p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -5, borderColor: "rgba(255,255,255,0.3)" }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} p-3 mb-4`}>
                <stat.icon className="w-full h-full text-white" />
              </div>
              <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Play Button */}
        <motion.div
          className="mb-12 flex justify-center"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.button
            onClick={handlePlayGame}
            className="px-12 py-4 rounded-lg bg-gradient-primary text-white font-bold text-lg hover:shadow-2xl glow-primary transition-all duration-300 flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="w-6 h-6" />
            Find Match & Play Now
          </motion.button>
        </motion.div>

        {/* Match History Section */}
        <motion.div
          className="mb-12"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-3 mb-6">
            <History className="w-6 h-6" />
            <h2 className="text-3xl font-bold">Recent Matches</h2>
          </div>

          {loadingMatches ? (
            <div className="text-center py-12">
              <div className="animate-spin inline-block">
                <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full" />
              </div>
            </div>
          ) : matches.length === 0 ? (
            <motion.div
              className="glassmorphism p-12 rounded-2xl border border-white/10 text-center"
              variants={itemVariants}
            >
              <Zap className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-400 text-lg mb-4">No matches yet! Start playing to build your history.</p>
              <button
                onClick={handlePlayGame}
                className="px-6 py-2 rounded-lg bg-gradient-primary text-white font-semibold hover:shadow-lg transition-all"
              >
                Play Your First Game
              </button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {matches.map((match, idx) => (
                <motion.div
                  key={match._id}
                  className="glassmorphism p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
                  variants={itemVariants}
                  whileHover={{ x: 5, borderColor: "rgba(255,255,255,0.3)" }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">
                        {match.stockTicker || "STOCK"}
                        <span className="text-gray-400 font-normal text-sm ml-3">
                          {new Date(match.createdAt).toLocaleDateString()}
                        </span>
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">Status: {match.status}</p>
                    </div>
                    <motion.button
                      className="px-6 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-200 transition-all"
                      whileHover={{ scale: 1.05 }}
                    >
                      View
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
