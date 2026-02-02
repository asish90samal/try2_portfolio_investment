import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Plus,
  Trash2,
  Download,
  PieChart,
  TrendingUp,
  Wallet,
  Edit,
} from 'lucide-react';
import { usePortfolioStore } from '../store/useStore';
import { portfolioAPI } from '../services/api';

export default function Portfolio() {
  const { portfolios, selectedPortfolio, fetchPortfolios, createPortfolio, addFunds, deletePortfolio } = usePortfolioStore();
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [initialAmount, setInitialAmount] = useState('');
  const [fundsAmount, setFundsAmount] = useState('');

  const { data: holdings } = useQuery({
    queryKey: ['holdings', selectedPortfolio?.id],
    queryFn: () => portfolioAPI.getHoldings(selectedPortfolio.id),
    enabled: !!selectedPortfolio,
  });

  const { data: pnl } = useQuery({
    queryKey: ['pnl', selectedPortfolio?.id],
    queryFn: () => portfolioAPI.getPnL(selectedPortfolio.id),
    enabled: !!selectedPortfolio,
  });

  const handleCreatePortfolio = async () => {
    if (!newPortfolioName || !initialAmount) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      await createPortfolio(newPortfolioName, parseFloat(initialAmount));
      toast.success('Portfolio created successfully');
      setShowCreateModal(false);
      setNewPortfolioName('');
      setInitialAmount('');
    } catch (error) {
      toast.error('Failed to create portfolio');
    }
  };

  const handleAddFunds = async () => {
    if (!fundsAmount || !selectedPortfolio) return;

    try {
      await addFunds(selectedPortfolio.id, parseFloat(fundsAmount));
      toast.success('Funds added successfully');
      setShowAddFundsModal(false);
      setFundsAmount('');
      queryClient.invalidateQueries(['pnl']);
    } catch (error) {
      toast.error('Failed to add funds');
    }
  };

  const handleDeletePortfolio = async (portfolioId) => {
    if (!confirm('Are you sure? Portfolio must have zero balance.')) return;

    try {
      await deletePortfolio(portfolioId);
      toast.success('Portfolio deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete portfolio');
    }
  };

  const downloadStatement = async () => {
    try {
      const { data } = await portfolioAPI.getStatement(selectedPortfolio.id);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `portfolio-${selectedPortfolio.id}-statement.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Statement downloaded');
    } catch (error) {
      toast.error('Failed to download statement');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold gradient-text">Portfolio</h1>
          <p className="text-gray-400 mt-2">Manage your investment portfolios</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-night-500 to-indigo-night-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-night-500/50 transition-all"
        >
          <Plus className="w-5 h-5" />
          Create Portfolio
        </motion.button>
      </div>

      {/* All Portfolios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map((portfolio) => (
          <motion.div
            key={portfolio.id}
            whileHover={{ y: -5 }}
            className="glass-card glow-on-hover"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-indigo-night-600 to-indigo-night-800 rounded-xl">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{portfolio.name}</h3>
                  <p className="text-xs text-gray-400">ID: {portfolio.id}</p>
                </div>
              </div>
              <button
                onClick={() => handleDeletePortfolio(portfolio.id)}
                className="p-2 hover:bg-loss-red/20 rounded-lg transition-colors text-loss-red"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400">Cash Balance</p>
                <p className="text-2xl font-bold">₹{portfolio.cashBalance?.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected Portfolio Details */}
      {selectedPortfolio && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-indigo-night-500/20 rounded-xl">
                  <Wallet className="w-6 h-6 text-indigo-night-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Cash Balance</p>
                  <p className="text-2xl font-bold">₹{selectedPortfolio.cashBalance?.toLocaleString()}</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddFundsModal(true)}
                className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-semibold transition-colors"
              >
                Add Funds
              </button>
            </div>

            <div className="glass-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-profit-green/20 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-profit-green" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total P&L</p>
                  <p className={`text-2xl font-bold ${
                    pnl?.data?.totalPnL >= 0 ? 'text-profit-green' : 'text-loss-red'
                  }`}>
                    ₹{pnl?.data?.totalPnL?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                {pnl?.data?.totalPnLPercent?.toFixed(2)}% return
              </p>
            </div>

            <div className="glass-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-sakura-500/20 rounded-xl">
                  <PieChart className="w-6 h-6 text-sakura-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Holdings</p>
                  <p className="text-2xl font-bold">{holdings?.data?.length || 0}</p>
                </div>
              </div>
              <button
                onClick={downloadStatement}
                className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Statement
              </button>
            </div>
          </div>

          {/* Holdings Table */}
          <div className="glass-card">
            <h2 className="text-xl font-bold mb-6">Current Holdings</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-sm text-gray-400 font-semibold">Symbol</th>
                    <th className="text-right py-3 px-4 text-sm text-gray-400 font-semibold">Quantity</th>
                    <th className="text-right py-3 px-4 text-sm text-gray-400 font-semibold">Avg Price</th>
                    <th className="text-right py-3 px-4 text-sm text-gray-400 font-semibold">Invested</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings?.data?.map((holding, idx) => (
                    <motion.tr
                      key={holding.symbol}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <p className="font-semibold">{holding.symbol}</p>
                      </td>
                      <td className="py-4 px-4 text-right">{holding.quantity}</td>
                      <td className="py-4 px-4 text-right">₹{holding.averagePrice?.toFixed(2)}</td>
                      <td className="py-4 px-4 text-right font-semibold">
                        ₹{(holding.quantity * holding.averagePrice).toLocaleString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {(!holdings?.data || holdings.data.length === 0) && (
                <p className="text-center text-gray-400 py-8">No holdings yet</p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Create Portfolio Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card max-w-md w-full"
          >
            <h3 className="text-2xl font-bold mb-6">Create New Portfolio</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Portfolio Name</label>
                <input
                  type="text"
                  value={newPortfolioName}
                  onChange={(e) => setNewPortfolioName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-night-500 focus:outline-none"
                  placeholder="e.g., Long Term Growth"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Initial Amount (₹)</label>
                <input
                  type="number"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-night-500 focus:outline-none"
                  placeholder="100000"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePortfolio}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-night-500 to-indigo-night-600 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Create
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Funds Modal */}
      {showAddFundsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card max-w-md w-full"
          >
            <h3 className="text-2xl font-bold mb-6">Add Funds</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount (₹)</label>
                <input
                  type="number"
                  value={fundsAmount}
                  onChange={(e) => setFundsAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-night-500 focus:outline-none"
                  placeholder="50000"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddFundsModal(false)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddFunds}
                  className="flex-1 py-3 bg-gradient-to-r from-profit-green to-green-600 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Add Funds
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}