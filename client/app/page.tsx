"use client";

import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Users, Crown, Lock, Play, Zap, Target, Brain } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Logo component
function StockGuessrLogo() {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white font-black text-sm"
        whileHover={{ scale: 1.1 }}
      >
        $
      </motion.div>
      <span className="font-black text-lg tracking-tight bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
        SG
      </span>
    </div>
  );
}

export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#0a0a0a]">
      {/* Subtle Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-96 -right-96 w-[900px] h-[900px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(0, 230, 197, 0.12) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute -bottom-96 -left-96 w-[800px] h-[800px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(216, 92, 224, 0.08) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{ x: [0, -40, 0], y: [0, -50, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,230,197,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,230,197,0.01)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <motion.nav
          className="fixed top-0 w-full z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="absolute inset-0 backdrop-blur-2xl bg-[#0a0a0a]/70 border-b border-white/5" />
          <div className="relative max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
            <StockGuessrLogo />
            <motion.div
              className="flex gap-3 items-center"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <Link href="/login">
                <motion.button
                  className="px-6 py-2 text-sm font-medium text-white/60 hover:text-white/90 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
              </Link>
              <Link href="/register">
                <motion.button
                  className="px-7 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 transition-all shadow-lg shadow-cyan-500/25"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Play Now
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <section className="min-h-screen w-full pt-32 px-8 flex flex-col justify-center items-center">
          <motion.div
            className="max-w-5xl w-full text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 mb-8"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-sm font-medium text-cyan-200">Live competition platform</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-7xl md:text-8xl font-black mb-6 leading-[1.1] tracking-tight"
            >
              <span className="text-white block">Trade in Real-Time.</span>
              <span
                className="block"
                style={{
                  background: "linear-gradient(135deg, #00e6c5 0%, #d85ce0 50%, #00e6c5 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Beat Your Rivals.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-gray-300/80 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Compete against traders worldwide in skill-based stock prediction matches. Predict price movements faster than your opponent and earn real rewards.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex gap-4 justify-center flex-wrap mb-16"
            >
              <Link href="/register">
                <motion.button
                  className="px-10 py-4 rounded-lg text-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 transition-all shadow-xl shadow-cyan-500/25 flex items-center gap-2"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-5 h-5 fill-current" />
                  Start Free
                </motion.button>
              </Link>
              <motion.button
                className="px-10 py-4 rounded-lg text-lg font-bold text-cyan-400 border-2 border-cyan-500/40 hover:border-cyan-500/70 hover:bg-cyan-500/5 transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {[
                { value: "50K+", label: "Players" },
                { value: "500K+", label: "Matches" },
                { value: "$5M+", label: "Winnings" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="p-6 rounded-xl border border-white/8 bg-white/[0.05] backdrop-blur-sm hover:border-cyan-500/30 transition-all"
                >
                  <div className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 mt-2">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Game Preview */}
        <section className="py-20 px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="p-12 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true, margin: "-150px" }}
            >
              {/* Match header */}
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/10">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600" />
                  <div>
                    <div className="text-sm font-bold text-white">You</div>
                    <div className="text-xs text-gray-400">+$1,240</div>
                  </div>
                </div>
                <div className="text-cyan-400 font-black text-lg">VS</div>
                <div className="flex gap-3">
                  <div>
                    <div className="text-sm font-bold text-white text-right">Opponent</div>
                    <div className="text-xs text-gray-400 text-right">+$890</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-magenta-500 to-magenta-600" />
                </div>
              </div>

              {/* Chart placeholder */}
              <div className="mb-8 p-6 rounded-lg bg-slate-800/30 border border-white/5">
                <div className="flex items-end justify-between h-40 gap-1 mb-4">
                  {[35, 48, 42, 55, 52, 68, 60, 75, 70, 85].map((h, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t"
                      style={{ height: `${h}%` }}
                      whileHover={{ opacity: 1 }}
                      initial={{ opacity: 0.6 }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>AAPL</span>
                  <span>Live • +3.2%</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-3 gap-3">
                <motion.button
                  className="py-3 rounded-lg bg-green-500/80 text-white font-bold hover:bg-green-500 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  BUY
                </motion.button>
                <motion.button
                  className="py-3 rounded-lg bg-red-500/80 text-white font-bold hover:bg-red-500 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  SELL
                </motion.button>
                <motion.button
                  className="py-3 rounded-lg border-2 border-gray-600 text-gray-300 font-bold hover:border-gray-500 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  HOLD
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 px-8">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              className="text-5xl md:text-6xl font-black text-center mb-20"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true, margin: "-200px" }}
            >
              <span className="text-white">Why Players Love</span>
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #00e6c5 0%, #d85ce0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Stock Guessr
              </span>
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Zap, title: "Quick Matches", desc: "5-minute matches for instant results" },
                { icon: Target, title: "Pure Skill", desc: "Win based on market intelligence, not luck" },
                { icon: Crown, title: "Climb Rankings", desc: "Competitive ladder with real rewards" },
                { icon: Brain, title: "Learn & Improve", desc: "AI-powered analysis of every trade" },
                { icon: Users, title: "Global Duels", desc: "Compete against traders worldwide" },
                { icon: Lock, title: "Secure Trading", desc: "Enterprise-grade security & encryption" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="p-8 rounded-xl border border-white/8 bg-white/[0.05] hover:border-cyan-500/30 hover:bg-white/[0.08] transition-all cursor-pointer"
                  onMouseEnter={() => setHoveredFeature(idx)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.06 }}
                  viewport={{ once: true, margin: "-150px" }}
                  whileHover={{ y: -4 }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center mb-4"
                    animate={hoveredFeature === idx ? { scale: 1.1 } : { scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <item.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-32 px-8 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent">
          <div className="max-w-5xl mx-auto">
            <motion.h2
              className="text-5xl md:text-6xl font-black text-center mb-20"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true, margin: "-200px" }}
            >
              <span className="text-white">How It Works</span>
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { num: "1", title: "Create Account", desc: "Sign up in 30 seconds" },
                { num: "2", title: "Find Opponent", desc: "Match with equal skill" },
                { num: "3", title: "Trade", desc: "Predict stock movements" },
                { num: "4", title: "Earn", desc: "Win real prizes" },
              ].map((step, idx) => (
                <motion.div
                  key={idx}
                  className="relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  viewport={{ once: true, margin: "-150px" }}
                >
                  <div className="p-6 rounded-xl border border-white/8 bg-white/[0.05]">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 font-black flex items-center justify-center mb-4">
                      {step.num}
                    </div>
                    <h3 className="font-bold text-white mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-400">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-200px" }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Ready to Compete?
            </h2>
            <p className="text-gray-300 text-xl mb-10 max-w-2xl mx-auto">
              Join thousands of traders in the ultimate competitive trading experience.
            </p>
            <Link href="/register">
              <motion.button
                className="px-12 py-5 rounded-lg text-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 transition-all shadow-xl shadow-cyan-500/30"
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Free
              </motion.button>
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-8 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <StockGuessrLogo />
            <div className="text-sm text-gray-400">
              © 2024 Stock Guessr. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
