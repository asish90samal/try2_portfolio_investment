import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  TrendingUp,
  TrendingDown,
  Search,
  ShoppingCart,
  DollarSign,
  Activity,
  RefreshCw,
} from 'lucide-react';
import { usePortfolioStore } from '../store/useStore';
import { tradeAPI, marketAPI } from '../services/api';

const popularStocks = [
  'TCS', 'INFY', 'RELIANCE', 'HDFCBANK', 'ICICIBANK',
  'WIPRO', 'BHARTIARTL', 'ITC', 'SBIN', 'HINDUNILVR',
];

export default function Trading() {
  const { selectedPortfolio, fetchPortfolios } = usePortfolioStore();
  const queryClient = useQueryClient();
  const [searchSymbol, setSearchSymbol] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [tradeType, setTradeType] = useState('buy'); // 'buy' or 'sell'

  const { data: holdings } = useQuery({
    queryKey: ['holdings', selectedPortfolio?.id],
    queryFn: () => tradeAPI.getHistory(selectedPortfolio.id),
    enabled: !!selectedPortfolio,
  });

  const { data: livePrice, refetch: refetchPrice, isLoading: priceLoading } = useQuery({
    queryKey: ['live-price', selectedStock],
    queryFn: () => marketAPI.getLivePrice(selectedStock),
    enabled: !!selectedStock,
    refetchInterval: 10000,
  });

  const tradeMutation = useMutation({
    mutationFn: ({ type, symbol, qty }) => {
      if (type === 'buy') {
        return tradeAPI.buy(selectedPortfolio.id, symbol, qty);
      } else {
        return tradeAPI.sell(selectedPortfolio.id, symbol, qty);
      }
    },
    onSuccess: () => {
      toast.success(`${tradeType === 'buy' ? 'Bought' : 'Sold'} ${quantity} shares of ${selectedStock}`);
      queryClient.invalidateQueries(['holdings']);
      queryClient.invalidateQueries(['pnl']);
      fetchPortfolios();
      setQuantity(1);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Trade failed');
    },
  });

  const handleTrade = () => {
    if (!selectedStock || !quantity) {
      toast.error('Please select a stock and quantity');
      return;
    }

    if (!selectedPortfolio) {
      toast.error('Please select a portfolio');
      return;
    }

    tradeMutation.mutate({
      type: tradeType,
      symbol: selectedStock,
      qty: quantity,
    });
  };

  const totalCost = (livePrice?.data?.price || 0) * quantity;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-display font-bold gradient-text">Trading</h1>
        <p className="text-gray-400 mt-2">Buy and sell stocks in real-time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trading Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stock Search */}
          <div className="glass-card">
            <h2 className="text-xl font-bold mb-4">Select Stock</h2>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search symbol (e.g., TCS, RELIANCE)"
                value={searchSymbol}
                onChange={(e) => setSearchSymbol(e.target.value.toUpperCase())}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && searchSymbol) {
                    setSelectedStock(searchSymbol);
                    setSearchSymbol('');
                  }
                }}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-night-500 focus:outline-none transition-all"
              />
            </div>

            {/* Popular Stocks */}
            <div>
              <p className="text-sm text-gray-400 mb-3">Popular Stocks</p>
              <div className="flex flex-wrap gap-2">
                {popularStocks.map((symbol) => (
                  <motion.button
                    key={symbol}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedStock(symbol)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      selectedStock === symbol
                        ? 'bg-indigo-night-500 text-white'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {symbol}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Price */}
          {selectedStock && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{selectedStock}</h2>
                <button
                  onClick={() => refetchPrice()}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  disabled={priceLoading}
                >
                  <RefreshCw className={`w-5 h-5 ${priceLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {priceLoading ? (
                <div className="h-20 bg-white/5 rounded-lg animate-pulse" />
              ) : livePrice?.data ? (
                <div>
                  <div className="flex items-end gap-4 mb-4">
                    <p className="text-4xl font-bold">₹{livePrice.data.price.toFixed(2)}</p>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-semibold mb-2 ${
                      livePrice.data.change >= 0
                        ? 'bg-profit-green/10 text-profit-green'
                        : 'bg-loss-red/10 text-loss-red'
                    }`}>
                      {livePrice.data.change >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {livePrice.data.changePercent.toFixed(2)}%
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Change</p>
                      <p className={`font-semibold ${livePrice.data.change >= 0 ? 'text-profit-green' : 'text-loss-red'}`}>
                        {livePrice.data.change >= 0 ? '+' : ''}₹{livePrice.data.change.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Source</p>
                      <p className="font-semibold">{livePrice.data.source}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">Unable to fetch price</p>
              )}
            </motion.div>
          )}

          {/* Trade Form */}
          {selectedStock && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card"
            >
              <h2 className="text-xl font-bold mb-6">Place Order</h2>

              {/* Buy/Sell Toggle */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setTradeType('buy')}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                    tradeType === 'buy'
                      ? 'bg-profit-green text-white'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setTradeType('sell')}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                    tradeType === 'sell'
                      ? 'bg-loss-red text-white'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  Sell
                </button>
              </div>

              {/* Quantity Input */}
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-night-500 focus:outline-none transition-all"
                />
              </div>

              {/* Order Summary */}
              <div className="p-4 bg-white/5 rounded-xl mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Price per share</span>
                  <span className="font-semibold">₹{livePrice?.data?.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Quantity</span>
                  <span className="font-semibold">{quantity}</span>
                </div>
                <div className="border-t border-white/10 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold">₹{totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleTrade}
                disabled={tradeMutation.isPending || !livePrice}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                  tradeType === 'buy'
                    ? 'bg-gradient-to-r from-profit-green to-green-600 hover:shadow-lg hover:shadow-profit-green/50'
                    : 'bg-gradient-to-r from-loss-red to-red-600 hover:shadow-lg hover:shadow-loss-red/50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {tradeMutation.isPending ? 'Processing...' : `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${selectedStock}`}
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Sidebar - Portfolio Info */}
        <div className="space-y-6">
          {/* Cash Balance */}
          <div className="glass-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-indigo-night-500/20 rounded-xl">
                <DollarSign className="w-6 h-6 text-indigo-night-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Available Cash</p>
                <p className="text-2xl font-bold">
                  ₹{selectedPortfolio?.cashBalance?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Trades */}
          <div className="glass-card">
            <h3 className="text-lg font-bold mb-4">Recent Trades</h3>
            <div className="space-y-3">
              {holdings?.data?.slice(0, 5).map((trade, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{trade.symbol}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(trade.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      trade.type === 'BUY' ? 'text-profit-green' : 'text-loss-red'
                    }`}>
                      {trade.type}
                    </p>
                    <p className="text-sm text-gray-400">{trade.quantity} shares</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}