import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Search } from 'lucide-react';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

const TIME_RANGES = {
  '1D': '1d',
  '1M': '1mo',
  '3M': '3mo',
  '6M': '6mo',
  '1Y': '1y',
  '5Y': '5y',
};

export default function Market() {
  const [symbol, setSymbol] = useState('RELIANCE');
  const [input, setInput] = useState('RELIANCE');
  const [range, setRange] = useState('1M');
  const [prices, setPrices] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH HISTORICAL DATA ================= */

  const fetchHistory = async () => {
    try {
      setLoading(true);

      // Yahoo Finance public chart API (frontend-safe)
      const res = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${TIME_RANGES[range]}&interval=1d`
      );
      const json = await res.json();

      const result = json.chart.result[0];
      const timestamps = result.timestamp;
      const closePrices = result.indicators.quote[0].close;

      setLabels(
        timestamps.map(t =>
          new Date(t * 1000).toLocaleDateString()
        )
      );
      setPrices(closePrices);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [symbol, range]);

  /* ================= CHART CONFIG ================= */

  const chartData = {
    labels,
    datasets: [
      {
        label: `${symbol} Price`,
        data: prices,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { ticks: { color: '#9ca3af' } },
      y: { ticks: { color: '#9ca3af' } },
    },
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-4xl font-bold gradient-text">Market Analysis</h1>

      {/* SEARCH BAR */}
      <div className="glass-card flex items-center gap-3">
        <Search className="text-gray-400" />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setSymbol(input);
          }}
          placeholder="Search symbol (RELIANCE, TCS, ^NSEI)"
          className="flex-1 bg-transparent outline-none"
        />
        <button
          onClick={() => setSymbol(input)}
          className="btn-primary"
        >
          Search
        </button>
      </div>

      {/* TIME FILTER */}
      <div className="flex gap-2">
        {Object.keys(TIME_RANGES).map(t => (
          <button
            key={t}
            onClick={() => setRange(t)}
            className={`px-4 py-2 rounded-lg text-sm ${
              range === t
                ? 'bg-indigo-600 text-white'
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* CHART */}
      <div className="glass-card">
        {loading ? (
          <p className="text-gray-400">Loading chart...</p>
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
}
