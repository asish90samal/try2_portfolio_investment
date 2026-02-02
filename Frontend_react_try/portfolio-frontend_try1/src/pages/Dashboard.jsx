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
  Eye,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { usePortfolioStore } from '../store/useStore';
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
        {!loading && (
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
            ₹{value?.toLocaleString()}
          </p>
          <p className={`text-sm mt-1 ${isPositive ? 'text-profit-green' : 'text-loss-red'}`}>
            {isPositive ? '+' : ''}₹{change?.toLocaleString()}
          </p>
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
          const { data } = await marketAPI.getLivePrice(index.symbol);
          setIndices(prev => 
            prev.map(idx => 
              idx.symbol === index.symbol 
                ? { ...idx, price: data.price, change: data.changePercent } 
                : idx
            )
          );
        } catch (error) {
          console.error(`Error fetching ${index.symbol}:`, error);
        }
      }
    };

    fetchIndices();
    const interval = setInterval(fetchIndices, 30000); // Update every 30s
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

const PortfolioChart = ({ portfolioId }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['portfolio-performance', portfolioId],
    queryFn: async () => {
      const { data: holdings } = await portfolioAPI.getHoldings(portfolioId);
      if (holdings.length === 0) return [];
      
      const holdingsFormatted = holdings.map(h => ({
        symbol: h.symbol,
        amount: h.quantity * h.averagePrice,
      }));
      
      const { data: performance } = await analyticsAPI.getPerformance(holdingsFormatted, '1M');
      return performance;
    },
    enabled: !!portfolioId,
  });

  if (isLoading) {
    return (
      <div className="glass-card">
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-night-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <h2 className="text-xl font-bold gradient-text mb-6">Portfolio Performance</h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
          <YAxis stroke="#9ca3af" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '8px',
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#6366f1"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const HoldingsDistribution = ({ portfolioId }) => {
  const { data: holdings, isLoading } = useQuery({
    queryKey: ['holdings', portfolioId],
    queryFn: () => portfolioAPI.getHoldings(portfolioId),
    enabled: !!portfolioId,
  });

  if (isLoading || !holdings?.data?.length) {
    return null;
  }

  const chartData = holdings.data.map(h => ({
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
  const { selectedPortfolio, fetchPortfolios } = usePortfolioStore();
  
  const { data: pnlData, isLoading: pnlLoading } = useQuery({
    queryKey: ['pnl', selectedPortfolio?.id],
    queryFn: () => portfolioAPI.getPnL(selectedPortfolio.id),
    enabled: !!selectedPortfolio,
    refetchInterval: 30000, // Refresh every 30s
  });

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  const pnl = pnlData?.data;
  const totalValue = (selectedPortfolio?.cashBalance || 0) + (pnl?.currentValue || 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold gradient-text">Dashboard</h1>
          <p className="text-gray-400 mt-2">Welcome back to your investment hub</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={DollarSign}
          label="Total Value"
          value={totalValue}
          change={pnl?.totalPnL || 0}
          changePercent={pnl?.totalPnLPercent || 0}
          loading={pnlLoading}
        />
        <StatCard
          icon={Briefcase}
          label="Invested Amount"
          value={pnl?.investedAmount || 0}
          change={0}
          changePercent={0}
          loading={pnlLoading}
        />
        <StatCard
          icon={Activity}
          label="Current Holdings"
          value={pnl?.currentValue || 0}
          change={pnl?.unrealizedPnL || 0}
          changePercent={pnl?.unrealizedPnLPercent || 0}
          loading={pnlLoading}
        />
        <StatCard
          icon={TrendingUp}
          label="Cash Balance"
          value={selectedPortfolio?.cashBalance || 0}
          change={0}
          changePercent={0}
          loading={!selectedPortfolio}
        />
      </div>

      {/* Market Overview */}
      <MarketOverview />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PortfolioChart portfolioId={selectedPortfolio?.id} />
        </div>
        <HoldingsDistribution portfolioId={selectedPortfolio?.id} />
      </div>
    </div>
  );
}