import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Briefcase,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useStore } from '../store/useStore';
import { portfolioAPI, marketAPI, analyticsAPI } from '../services/api';

const COLORS = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

const StatCard = ({ icon: Icon, label, value, change, changePercent, loading }) => {
  const isPositive = change >= 0;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass-card glow-on-hover"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${isPositive ? 'bg-profit-green/10' : 'bg-loss-red/10'}`}>
          <Icon className={`w-6 h-6 ${isPositive ? 'text-profit-green' : 'text-loss-red'}`} />
        </div>
        {!loading && changePercent !== undefined && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
            isPositive ? 'bg-profit-green/10 text-profit-green' : 'bg-loss-red/10 text-loss-red'
          }`}>
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(changePercent).toFixed(2)}%
          </div>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-2">{label}</p>
      {loading ? (
        <div className="h-8 bg-white/5 rounded animate-pulse" />
      ) : (
        <>
          <p className="text-3xl font-bold count-up">
            ₹{(value || 0).toLocaleString()}
          </p>
          {change !== undefined && (
            <p className={`text-sm mt-1 ${isPositive ? 'text-profit-green' : 'text-loss-red'}`}>
              {isPositive ? '+' : ''}₹{(change || 0).toLocaleString()}
            </p>
          )}
        </>
      )}
    </motion.div>
  );
};

const MarketOverview = () => {
  const [indices, setIndices] = useState([
    { symbol: '^NSEI', name: 'NIFTY 50', price: 0, change: 0 },
    { symbol: '^BSESN', name: 'SENSEX', price: 0, change: 0 },
    { symbol: '^NSEBANK', name: 'BANK NIFTY', price: 0, change: 0 },
  ]);

  useEffect(() => {
    const fetchIndices = async () => {
      for (const index of indices) {
        try {
          const response = await marketAPI.getLivePrice(index.symbol);
          const data = response.data;
          setIndices(prev => 
            prev.map(idx => 
              idx.symbol === index.symbol 
                ? { ...idx, price: data.price || 0, change: data.changePercent || 0 } 
                : idx
            )
          );
        } catch (error) {
          console.error(`Error fetching ${index.symbol}:`, error);
        }
      }
    };

    fetchIndices();
    const interval = setInterval(fetchIndices, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold gradient-text">Market Overview</h2>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 bg-profit-green rounded-full live-indicator" />
          <span className="text-gray-400">Live</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {indices.map((index, idx) => {
          const isPositive = index.change >= 0;
          return (
            <motion.div
              key={index.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 rounded-xl bg-white/5 hover:bg-white/[0.07] transition-all"
            >
              <p className="text-sm text-gray-400 mb-1">{index.name}</p>
              <p className="text-2xl font-bold mb-2">{index.price.toLocaleString()}</p>
              <div className={`flex items-center gap-2 ${isPositive ? 'text-profit-green' : 'text-loss-red'}`}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-sm font-semibold">
                  {isPositive ? '+' : ''}{index.change.toFixed(2)}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const HoldingsDistribution = ({ portfolioId }) => {
  const { data: holdings, isLoading } = useQuery({
    queryKey: ['holdings', portfolioId],
    queryFn: async () => {
      const response = await portfolioAPI.getHoldings(portfolioId);
      return Array.isArray(response.data) ? response.data : response.data?.data || [];
    },
    enabled: !!portfolioId,
  });

  if (isLoading || !holdings?.length) {
    return null;
  }

  const chartData = holdings.map(h => ({
    name: h.symbol,
    value: h.quantity * h.averagePrice,
  }));

  return (
    <div className="glass-card">
      <h2 className="text-xl font-bold gradient-text mb-6">Holdings Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '8px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default function Dashboard() {
  const { selectedPortfolio, fetchPortfolios } = useStore();
  
  const { data: pnlData, isLoading: pnlLoading } = useQuery({
    queryKey: ['pnl', selectedPortfolio?.id],
    queryFn: async () => {
      const response = await portfolioAPI.getPnL(selectedPortfolio.id);
      return response.data;
    },
    enabled: !!selectedPortfolio,
    refetchInterval: 30000,
  });

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const totalValue = (selectedPortfolio?.cashBalance || 0) + (pnlData?.currentValue || 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold gradient-text">Dashboard</h1>
          <p className="text-gray-400 mt-2">
            {selectedPortfolio ? `Viewing: ${selectedPortfolio.name}` : 'Welcome to your investment hub'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={DollarSign}
          label="Total Value"
          value={totalValue}
          change={pnlData?.totalPnL}
          changePercent={pnlData?.totalPnLPercent}
          loading={pnlLoading}
        />
        <StatCard
          icon={Briefcase}
          label="Invested Amount"
          value={pnlData?.investedAmount}
          loading={pnlLoading}
        />
        <StatCard
          icon={Activity}
          label="Current Holdings"
          value={pnlData?.currentValue}
          change={pnlData?.unrealizedPnL}
          changePercent={pnlData?.unrealizedPnLPercent}
          loading={pnlLoading}
        />
        <StatCard
          icon={TrendingUp}
          label="Cash Balance"
          value={selectedPortfolio?.cashBalance}
          loading={!selectedPortfolio}
        />
      </div>

      <MarketOverview />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HoldingsDistribution portfolioId={selectedPortfolio?.id} />
      </div>
    </div>
  );
}
