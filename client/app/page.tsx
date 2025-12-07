"use client";

import { motion, useMotionValue, useSpring, Variants } from "framer-motion";
import { ArrowRight, TrendingUp, Zap, Trophy, Target, Clock, BarChart3, Brain, Users2, DollarSign, Newspaper, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";

// Logo component
function StockGuessrLogo() {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        className="relative"
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/50">
          <BarChart3 className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>
      </motion.div>
      <div>
        <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          StockGuessr
        </span>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [position, setPosition] = useState<"long" | "flat">("flat");
  const [cash, setCash] = useState(100000);
  const [equity, setEquity] = useState(100000);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const handleBuy = () => {
    if (position === "flat") {
      setPosition("long");
      setCash(95000);
      setEquity(100000);
    }
  };

  const handleSell = () => {
    if (position === "long") {
      setPosition("flat");
      setCash(102500);
      setEquity(102500);
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Tech Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Matrix-style grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Cyan glow - top right */}
        <motion.div
          className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            x: [0, 80, 0],
            y: [0, 40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Blue glow - bottom left */}
        <motion.div
          className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            x: [0, -60, 0],
            y: [0, -40, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* Teal accent - center */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(20, 184, 166, 0.08) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <motion.nav
          className="sticky top-0 w-full z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="absolute inset-0 backdrop-blur-xl bg-slate-950/80 border-b border-cyan-500/10" />
          <div className="relative max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
            <StockGuessrLogo />

            <motion.div
              className="flex gap-3 items-center"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <Link href="/login">
                <motion.button
                  className="px-6 py-2.5 text-sm font-semibold text-cyan-300 hover:text-cyan-200 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
              </Link>
              <Link href="/register">
                <motion.button
                  className="px-8 py-3 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/30"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-2">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <section className="w-full pt-20 pb-16 px-8 flex flex-col justify-center items-center">
          <motion.div
            className="max-w-6xl w-full text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Hero Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-sm mb-8"
            >
              <Brain className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-bold text-cyan-300 tracking-wide">
                THINK YOU CAN PREDICT THE MARKET?
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.05] tracking-tight"
            >
              <span className="text-white block">Prove Your</span>
              <motion.span
                className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                style={{
                  backgroundSize: "200% 200%",
                }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                Market Instinct
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Trade on hidden historical charts. 4 weeks. Real data. Real competition.
              <br />
              <span className="text-cyan-400 font-semibold">
                From retail trader to market legend.
              </span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex gap-6 justify-center mb-16">
              <Link href="/register">
                <motion.button
                  className="group px-10 py-4 rounded-lg text-lg font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 transition-all shadow-xl shadow-cyan-600/40 relative overflow-hidden"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-white/10"
                    initial={{ x: '-100%', skewX: -10 }}
                    whileHover={{ x: '200%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Start Competing
                  </span>
                </motion.button>
              </Link>
              <a href="#how-it-works">
                <motion.button
                  className="px-10 py-4 rounded-lg text-lg font-semibold text-cyan-300 border-2 border-cyan-500/30 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  See How It Works
                </motion.button>
              </a>
            </motion.div>

            {/* Stats - No fake numbers */}
            <motion.div
              className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-8 border-t border-slate-700/50"
              variants={containerVariants}
            >
              {[
                { label: "Match Duration", value: "60s", icon: Clock },
                { label: "Format", value: "1v1", icon: Users2 },
                { label: "Starting Cash", value: "$100K", icon: DollarSign },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="text-center"
                >
                  <stat.icon className="w-6 h-6 text-cyan-400 mx-auto mb-3" strokeWidth={2} />
                  <div className="text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Market Legend CTA - Moved Higher */}
        <section className="py-20 px-8 relative overflow-hidden">
          <motion.div
            className="max-w-4xl mx-auto relative"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="relative p-12 rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900/90 via-blue-950/70 to-slate-900/90 backdrop-blur-xl overflow-hidden shadow-2xl">
              <div className="relative text-center z-10">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="inline-block mb-6"
                >
                  <Trophy className="w-16 h-16 text-cyan-400" />
                </motion.div>

                <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                  <span className="text-white block">Ready to Become</span>
                  <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
                    A Market Legend?
                  </span>
                </h2>

                <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                  Join the arena. Test your instincts. Climb the ranks.
                  <br />
                  <span className="text-cyan-400 font-semibold">100% Free. No risk. Pure skill.</span>
                </p>

                <Link href="/register">
                  <motion.button
                    className="group relative px-12 py-4 rounded-xl text-lg font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 transition-all shadow-2xl shadow-cyan-500/40 overflow-hidden"
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ['-200%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    />
                    <span className="relative flex items-center gap-3">
                      Start Your Journey
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* How It Works - ACCURATE Game Flow */}
        <section id="how-it-works" className="py-32 px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-6"
              >
                <Target className="w-4 h-4 text-teal-400" />
                <span className="text-sm font-bold text-teal-300 tracking-wide">HOW IT WORKS</span>
              </motion.div>
              <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
                The Game Flow
              </h2>
              <p className="text-slate-400 text-xl max-w-3xl mx-auto">
                Trade on a hidden historical chart. 4 weeks of gameplay. Highest portfolio value wins.
              </p>
            </motion.div>

            {/* Game Flow Steps */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
              {[
                {
                  step: "1",
                  title: "Get Matched",
                  desc: "Find an opponent. You both start with $100,000 virtual cash.",
                  icon: Users2,
                  color: "from-cyan-500 to-blue-500"
                },
                {
                  step: "2",
                  title: "Chart Reveals",
                  desc: "See 3 months of historical context. Ticker and date are hidden.",
                  icon: BarChart3,
                  color: "from-blue-500 to-indigo-500"
                },
                {
                  step: "3",
                  title: "4 Weeks of Trading",
                  desc: "Each week reveals new candles + news. BUY, SELL, or HOLD.",
                  icon: Clock,
                  color: "from-teal-500 to-green-500"
                },
                {
                  step: "4",
                  title: "Winner Declared",
                  desc: "Highest portfolio value wins. AI analyzes your trades.",
                  icon: Trophy,
                  color: "from-green-500 to-emerald-500"
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="relative p-6 rounded-2xl border border-slate-700/50 bg-slate-900/50 backdrop-blur-md"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className={`inline-block mb-4 px-3 py-1 rounded-lg bg-gradient-to-r ${item.color} text-white font-black text-sm`}>
                    STEP {item.step}
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <item.icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Interactive Demo - Real Game Mechanics */}
            <motion.div
              className="relative p-8 rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-slate-900/90 to-blue-950/50 backdrop-blur-xl overflow-hidden shadow-2xl shadow-cyan-500/10"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-black text-white mb-2">Live Demo: Week {currentWeek} of 4</h3>
                <p className="text-slate-400">Real gameplay simulation</p>
              </div>

              {/* Portfolio Status */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-700/50">
                  <div className="text-slate-400 text-xs mb-1">Cash</div>
                  <div className="text-white font-bold">${cash.toLocaleString()}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-700/50">
                  <div className="text-slate-400 text-xs mb-1">Position</div>
                  <div className={`font-bold ${position === "long" ? "text-green-400" : "text-slate-400"}`}>
                    {position === "long" ? "LONG" : "FLAT"}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-700/50">
                  <div className="text-slate-400 text-xs mb-1">Equity</div>
                  <div className={`font-bold ${equity > 100000 ? "text-green-400" : equity < 100000 ? "text-red-400" : "text-white"}`}>
                    ${equity.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Chart with Candles */}
              <div className="mb-6 p-6 rounded-xl bg-slate-950/60 border border-slate-700/50">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-black text-2xl">???</span>
                      <span className="text-slate-400 text-sm">(Hidden)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span className="text-white font-bold text-sm">Week {currentWeek}/4</span>
                  </div>
                </div>

                {/* Simple candlestick chart */}
                <div className="relative flex items-end justify-between h-48 gap-1 mb-4">
                  {[65, 70, 68, 75, 73, 78, 82, 80, 85, 83, 88, 90].map((h, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 rounded-sm relative"
                      style={{
                        height: `${h}%`,
                        background: i % 2 === 0
                          ? 'linear-gradient(to top, rgba(16, 185, 129, 0.5), rgba(16, 185, 129, 0.9))'
                          : 'linear-gradient(to top, rgba(239, 68, 68, 0.5), rgba(239, 68, 68, 0.9))',
                      }}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                    />
                  ))}
                </div>

                {/* News Headline */}
                <motion.div
                  className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Newspaper className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-blue-300 font-semibold text-sm">Breaking News</div>
                    <div className="text-slate-300 text-xs mt-1">
                      "Company reports strong Q3 earnings, beating analyst expectations by 15%"
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Trading Actions */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <motion.button
                  className={`py-4 rounded-xl font-bold text-lg transition-all ${position === "long"
                    ? "bg-green-600 text-white shadow-lg shadow-green-500/30"
                    : "bg-slate-800 text-slate-300 hover:bg-green-600/20 border border-slate-700"
                    }`}
                  onClick={handleBuy}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={position === "long"}
                >
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    BUY
                  </div>
                </motion.button>

                <motion.button
                  className="py-4 rounded-xl bg-slate-800 text-slate-300 font-bold text-lg border border-slate-700 hover:bg-slate-700 transition-all"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  HOLD
                </motion.button>

                <motion.button
                  className={`py-4 rounded-xl font-bold text-lg transition-all ${position === "long"
                    ? "bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-500/30"
                    : "bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed"
                    }`}
                  onClick={handleSell}
                  whileHover={position === "long" ? { scale: 1.02, y: -2 } : {}}
                  whileTap={position === "long" ? { scale: 0.98 } : {}}
                  disabled={position === "flat"}
                >
                  <div className="flex items-center justify-center gap-2">
                    <XCircle className="w-5 h-5" />
                    SELL
                  </div>
                </motion.button>
              </div>

              {/* Instruction */}
              <div className="text-center p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <p className="text-cyan-300 text-sm font-semibold">
                  Try the controls above! BUY to go long, SELL to close your position, or HOLD to wait.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
                Why StockGuessr?
              </h2>
              <p className="text-slate-400 text-xl">Built for traders, by traders.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: "Fast-Paced Action",
                  desc: "4 weeks of trading compressed into 60 seconds. Quick decisions, instant results.",
                  color: "from-cyan-500 to-blue-500"
                },
                {
                  icon: Brain,
                  title: "Skill-Based Matches",
                  desc: "Analyze candles, read news, time your trades. May the best analyst win.",
                  color: "from-teal-500 to-green-500"
                },
                {
                  icon: BarChart3,
                  title: "Real Market Data",
                  desc: "Actual historical charts from volatile periods. No simulations, no delays.",
                  color: "from-blue-500 to-indigo-500"
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="group relative p-8 rounded-2xl border border-slate-700/50 bg-slate-900/50 backdrop-blur-md cursor-pointer overflow-hidden"
                  onMouseEnter={() => setHoveredFeature(idx)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />

                  <div className="relative">
                    <motion.div
                      className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg`}
                      animate={hoveredFeature === idx ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <item.icon className="w-8 h-8 text-white" strokeWidth={2} />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-8 border-t border-slate-800 bg-slate-950/60 backdrop-blur-md">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
              <StockGuessrLogo />
              <div className="flex gap-8 text-sm font-medium">
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">About</a>
                <a href="#how-it-works" className="text-slate-400 hover:text-cyan-400 transition-colors">How It Works</a>
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Leaderboard</a>
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Support</a>
              </div>
            </div>
            <div className="text-center text-sm text-slate-500 border-t border-slate-800 pt-6">
              <p className="mb-2">© 2025 StockGuessr - Test Your Market Instinct</p>
              <p className="text-xs">For educational and entertainment purposes only. Not financial advice.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
