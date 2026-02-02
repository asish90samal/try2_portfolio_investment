import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Briefcase,
  TrendingUp,
  BarChart3,
  Globe,
  Bot,
  Menu,
  X,
  Wallet,
  ChevronDown,
} from 'lucide-react';
import { usePortfolioStore } from '../store/useStore';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', jp: 'ダッシュボード' },
  { path: '/portfolio', icon: Briefcase, label: 'Portfolio', jp: 'ポートフォリオ' },
  { path: '/trading', icon: TrendingUp, label: 'Trading', jp: '取引' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics', jp: '分析' },
  { path: '/market', icon: Globe, label: 'Market', jp: '市場' },
  { path: '/ai', icon: Bot, label: 'AI Assistant', jp: 'AIアシスタント' },
];

export default function Layout({ children }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [portfolioDropdown, setPortfolioDropdown] = useState(false);
  const { portfolios, selectedPortfolio, selectPortfolio } = usePortfolioStore();

  return (
    <div className="min-h-screen flex">
      {/* Floating Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="floating-orb w-96 h-96 bg-indigo-night-500 top-20 -left-20" style={{ animationDelay: '0s' }} />
        <div className="floating-orb w-80 h-80 bg-sakura-500 bottom-20 -right-20" style={{ animationDelay: '2s' }} />
        <div className="floating-orb w-72 h-72 bg-indigo-night-400 top-1/2 left-1/2" style={{ animationDelay: '4s' }} />
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed left-0 top-0 h-screen w-72 glass border-r border-white/10 z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-night-500 to-sakura-500 rounded-xl flex items-center justify-center animate-glow">
                  <Wallet className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="font-display text-xl font-bold gradient-text">
                    InvestHub
                  </h1>
                  <p className="text-xs text-gray-400">投資ハブ</p>
                </div>
              </div>

              {/* Portfolio Selector */}
              {selectedPortfolio && (
                <div className="mb-6">
                  <button
                    onClick={() => setPortfolioDropdown(!portfolioDropdown)}
                    className="w-full glass-card flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-night-600 to-indigo-night-800 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold">{selectedPortfolio.name}</p>
                        <p className="text-xs text-gray-400">
                          ₹{selectedPortfolio.cashBalance?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${portfolioDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {portfolioDropdown && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 space-y-2"
                      >
                        {portfolios.map(portfolio => (
                          <button
                            key={portfolio.id}
                            onClick={() => {
                              selectPortfolio(portfolio);
                              setPortfolioDropdown(false);
                            }}
                            className={`w-full p-3 rounded-lg text-left transition-all ${
                              portfolio.id === selectedPortfolio.id
                                ? 'bg-indigo-night-500/20 border border-indigo-night-500'
                                : 'hover:bg-white/5'
                            }`}
                          >
                            <p className="text-sm font-medium">{portfolio.name}</p>
                            <p className="text-xs text-gray-400">
                              ₹{portfolio.cashBalance?.toLocaleString()}
                            </p>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Navigation */}
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;

                  return (
                    <Link key={item.path} to={item.path}>
                      <motion.div
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-indigo-night-500 to-indigo-night-600 text-white shadow-lg'
                            : 'hover:bg-white/5 text-gray-300'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{item.label}</p>
                          <p className="text-xs opacity-60">{item.jp}</p>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </nav>

              {/* Live Market Indicator */}
              <div className="mt-8 p-4 glass-card">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-profit-green rounded-full animate-pulse" />
                  <span className="text-xs text-gray-400">Markets Live</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Real-time data</p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-40 glass border-b border-white/10">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center gap-4">
              {/* Current Date/Time */}
              <div className="text-right">
                <p className="text-sm font-semibold">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="relative z-10 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}