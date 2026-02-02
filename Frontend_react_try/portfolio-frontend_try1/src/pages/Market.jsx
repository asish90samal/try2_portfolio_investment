import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { marketAPI } from '../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function Market() {
  const [searchSymbol, setSearchSymbol] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('^NSEI');
  const [timeRange, setTimeRange] = useState('1M');

  const { data: livePrice, refetch } = useQuery({
    queryKey: ['market-live', selectedSymbol],
    queryFn: () => marketAPI.getLivePrice(selectedSymbol),
    refetchInterval: 10000,
  });

  const { data: history } = useQuery({
    queryKey: ['market-history', selectedSymbol, timeRange],
    queryFn: () => marketAPI.getHistory(selectedSymbol, timeRange),
  });

  const popularSymbols = [
    { symbol: '^NSEI', name: 'NIFTY 50' },
    { symbol: '^BSESN', name: 'SENSEX' },
    { symbol: '^NSEBANK', name: 'BANK NIFTY' },
    { symbol: 'TCS', name: 'TCS' },
    { symbol: 'INFY', name: 'Infosys' },
    { symbol: 'RELIANCE', name: 'Reliance' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold gradient-text">Market</h1>
          <p className="text-gray-400 mt-2">Real-time market data and indices</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 bg-profit-green rounded-full live-indicator" />
          <span className="text-gray-400">Live Data</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-card">
            <h3 className="font-bold mb-4">Quick Access</h3>
            <div className="space-y-2">
              {popularSymbols.map(item => (
                <button
                  key={item.symbol}
                  onClick={() => setSelectedSymbol(item.symbol)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedSymbol === item.symbol
                      ? 'bg-indigo-night-500 text-white'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.symbol}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search symbol..."
                value={searchSymbol}
                onChange={e => setSearchSymbol(e.target.value.toUpperCase())}
                onKeyDown={e => {
                  if (e.key === 'Enter' && searchSymbol) {
                    setSelectedSymbol(searchSymbol);
                    setSearchSymbol('');
                  }
                }}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-night-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="glass-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold">{selectedSymbol}</h2>
                {livePrice?.data && (
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-4xl font-bold">
                      ₹{livePrice.data.price.toFixed(2)}
                    </p>
                    <div
                      className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                        livePrice.data.change >= 0
                          ? 'bg-profit-green/10 text-profit-green'
                          : 'bg-loss-red/10 text-loss-red'
                      }`}
                    >
                      {livePrice.data.change >= 0 ? (
                        <TrendingUp className="w-5 h-5" />
                      ) : (
                        <TrendingDown className="w-5 h-5" />
                      )}
                      <span className="font-semibold">
                        {livePrice.data.change >= 0 ? '+' : ''}
                        {livePrice.data.change.toFixed(2)} (
                        {livePrice.data.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => refetch()}
                className="p-3 hover:bg-white/5 rounded-xl"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-2 mb-6">
              {['1D', '1M', '3M', '6M', '1Y', '5Y'].map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                    timeRange === range
                      ? 'bg-indigo-night-500 text-white'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={history?.data || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Line type="monotone" dataKey="close" stroke="#6366f1" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
