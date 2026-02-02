import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, PieChart, Activity } from 'lucide-react';
import { usePortfolioStore } from '../store/useStore';
import { analyticsAPI, portfolioAPI } from '../services/api';

export default function Analytics() {
  const { selectedPortfolio } = usePortfolioStore();
  const [whatIfSymbol, setWhatIfSymbol] = useState('TCS');
  const [whatIfAmount, setWhatIfAmount] = useState('20000');
  const [whatIfDate, setWhatIfDate] = useState('2023-01-01');

  const { data: holdings } = useQuery({
    queryKey: ['holdings', selectedPortfolio?.id],
    queryFn: () => portfolioAPI.getHoldings(selectedPortfolio.id),
    enabled: !!selectedPortfolio,
  });

  const holdingsFormatted =
    holdings?.data?.map(h => ({
      symbol: h.symbol,
      amount: h.quantity * h.averagePrice,
    })) || [];

  const { data: healthData } = useQuery({
    queryKey: ['health', selectedPortfolio?.id],
    queryFn: () => analyticsAPI.getHealthById(selectedPortfolio.id),
    enabled: !!selectedPortfolio && holdings?.data?.length > 0,
  });

  const { data: riskData } = useQuery({
    queryKey: ['risk', selectedPortfolio?.id],
    queryFn: () => analyticsAPI.getRiskById(selectedPortfolio.id),
    enabled: !!selectedPortfolio && holdings?.data?.length > 0,
  });

  const { data: diversityData } = useQuery({
    queryKey: ['diversity', holdingsFormatted],
    queryFn: () => analyticsAPI.getDiversity(holdingsFormatted),
    enabled: holdingsFormatted.length > 0,
  });

  const { data: whatIfData, refetch: refetchWhatIf } = useQuery({
    queryKey: ['whatif', whatIfSymbol, whatIfAmount, whatIfDate],
    queryFn: () =>
      analyticsAPI.whatIf(
        whatIfSymbol,
        parseFloat(whatIfAmount),
        whatIfDate
      ),
    enabled: false,
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-4xl font-display font-bold gradient-text">
        Analytics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-profit-green/20 rounded-xl">
              <Activity className="w-6 h-6 text-profit-green" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Health Score</p>
              <p className="text-3xl font-bold">
                {healthData?.data?.healthScore?.toFixed(1) || '-'}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            {healthData?.data?.healthLabel || 'Calculating...'}
          </p>
        </div>

        <div className="glass-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-loss-red/20 rounded-xl">
              <Shield className="w-6 h-6 text-loss-red" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Risk Score</p>
              <p className="text-3xl font-bold">
                {riskData?.data?.riskScore?.toFixed(1) || '-'}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            {riskData?.data?.riskLabel || 'Calculating...'}
          </p>
        </div>

        <div className="glass-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-indigo-night-500/20 rounded-xl">
              <PieChart className="w-6 h-6 text-indigo-night-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Diversity Score</p>
              <p className="text-3xl font-bold">
                {diversityData?.data?.diversityScore?.toFixed(1) || '-'}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            {diversityData?.data?.stabilityLabel || 'Calculating...'}
          </p>
        </div>
      </div>

      <div className="glass-card">
        <h2 className="text-xl font-bold mb-6">What-If Analysis</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <input
            value={whatIfSymbol}
            onChange={e => setWhatIfSymbol(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl"
            placeholder="Symbol"
          />
          <input
            type="number"
            value={whatIfAmount}
            onChange={e => setWhatIfAmount(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl"
            placeholder="Amount"
          />
          <input
            type="date"
            value={whatIfDate}
            onChange={e => setWhatIfDate(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl"
          />
          <button
            onClick={refetchWhatIf}
            className="px-6 py-3 bg-gradient-to-r from-indigo-night-500 to-indigo-night-600 rounded-xl font-semibold"
          >
            Analyze
          </button>
        </div>

        {whatIfData?.data && (
          <div className="p-6 bg-white/5 rounded-xl">
            <h3 className="font-bold mb-4">Analysis Results</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-400">Invested</p>
                <p className="text-xl font-bold">
                  ₹{whatIfData.data.investedAmount?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Current Value</p>
                <p className="text-xl font-bold">
                  ₹{whatIfData.data.currentValue?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Profit / Loss</p>
                <p
                  className={`text-xl font-bold ${
                    whatIfData.data.profitLoss >= 0
                      ? 'text-profit-green'
                      : 'text-loss-red'
                  }`}
                >
                  ₹{whatIfData.data.profitLoss?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Return %</p>
                <p
                  className={`text-xl font-bold ${
                    whatIfData.data.profitLossPercent >= 0
                      ? 'text-profit-green'
                      : 'text-loss-red'
                  }`}
                >
                  {whatIfData.data.profitLossPercent?.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
