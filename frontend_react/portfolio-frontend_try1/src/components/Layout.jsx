import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Briefcase, TrendingUp, BarChart3, Globe, Bot, Menu, X, Wallet } from 'lucide-react';
import { useStore } from '../store/useStore';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/portfolios', icon: Briefcase, label: 'Portfolios' },
  { path: '/trading', icon: TrendingUp, label: 'Trading' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/market', icon: Globe, label: 'Market' },
  { path: '/ai', icon: Bot, label: 'AI Assistant' },
];

export default function Layout({ children }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { selectedPortfolio, fetchPortfolios } = useStore();

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      {sidebarOpen && (
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="fixed left-0 top-0 h-screen w-72 glass-card border-r border-white/10 z-50 overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <Wallet className="w-7 h-7" />
              </div>
              <div>
                <h1 className="font-bold text-xl gradient-text">NOVA-VEST</h1>
                <p className="text-xs text-gray-400">Smart Portfolio Manager</p>
              </div>
            </div>

            {selectedPortfolio && (
              <div className="mb-6 p-4 bg-primary-500/10 border border-primary-500/30 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Selected Portfolio</p>
                <p className="font-semibold">{selectedPortfolio.name}</p>
                <p className="text-sm text-gray-400">ID: {selectedPortfolio.id}</p>
                <p className="text-lg font-bold mt-2">₹{selectedPortfolio.cashBalance?.toLocaleString()}</p>
              </div>
            )}

            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link key={item.path} to={item.path}>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white' : 'hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-semibold">{item.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </motion.aside>
      )}

      {/* Main Content */}
      <div className={`flex-1 transition-all ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        <header className="sticky top-0 z-40 glass-card border-b border-white/10">
          <div className="flex items-center justify-between px-6 py-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg">
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="text-right">
              <p className="text-sm font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
              <p className="text-xs text-gray-400">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}