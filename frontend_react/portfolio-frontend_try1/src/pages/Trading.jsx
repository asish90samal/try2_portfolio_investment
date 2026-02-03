import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Search, RefreshCw } from 'lucide-react';
import { useStore } from '../store/useStore';
import { tradeAPI, marketAPI } from '../services/api';

/* =====================================================
   DISCOVERY DATA
===================================================== */

const MARKET_SECTORS = {
  IT: ['TCS', 'INFY', 'WIPRO', 'HCLTECH'],
  FINANCIALS: ['HDFCBANK', 'ICICIBANK', 'SBIN', 'AXISBANK'],
  HEALTHCARE: ['SUNPHARMA', 'DRREDDY', 'CIPLA'],
  ENERGY: ['RELIANCE', 'ONGC'],
  FMCG: ['ITC', 'HINDUNILVR', 'NESTLEIND'],
  INDUSTRIALS: ['LT', 'SIEMENS'],
};

const ASSET_CLASSES = {
  EQUITIES: ['TCS', 'INFY', 'RELIANCE', 'HDFCBANK'],
  MUTUAL_FUNDS: ['HDFC_BLUECHIP', 'SBI_LARGE_CAP'],
  ETFS: ['NIFTYBEES', 'BANKBEES'],
  REITS: ['EMBASSY', 'MINDSPACE'],
  COMMODITIES: ['GOLD', 'SILVER'],
  CRYPTO: ['BTC', 'ETH', 'SOL', 'XRP'],
};

const popularStocks = ['TCS', 'INFY', 'RELIANCE', 'HDFCBANK'];

/* =====================================================
   CRYPTO SUPPORT
===================================================== */

const CRYPTO_MAP = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  XRP: 'ripple',
};

const isCrypto = (s) => !!CRYPTO_MAP[s];

const fetchCryptoPrice = async (symbol, currency) => {
  const id = CRYPTO_MAP[symbol];
  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=${currency}`
  );
  const data = await res.json();
  return data[id][currency];
};

const fetchCryptoChart = async (symbol, currency) => {
  const id = CRYPTO_MAP[symbol];
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=7`
  );
  const data = await res.json();
  return data.prices.map(p => p[1]);
};

/* =====================================================
   COMPONENT
===================================================== */

export default function Trading() {
  const { selectedPortfolio, fetchPortfolios } = useStore();
  const queryClient = useQueryClient();

  const [searchSymbol, setSearchSymbol] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [tradeType, setTradeType] = useState('buy');

  const [filterType, setFilterType] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);

  const [currency, setCurrency] = useState('inr'); // inr | usd

  /* ================= DATA ================= */

  const { data: trades } = useQuery({
    queryKey: ['trades', selectedPortfolio?.id],
    queryFn: () => tradeAPI.getHistory(selectedPortfolio.id),
    enabled: !!selectedPortfolio,
  });

  const { data: livePrice, refetch, isLoading } = useQuery({
    queryKey: ['price', selectedStock, currency],
    enabled: !!selectedStock,
    queryFn: async () => {
      if (isCrypto(selectedStock)) {
        return fetchCryptoPrice(selectedStock, currency);
      }
      const res = await marketAPI.getLivePrice(selectedStock);
      return res.data.price;
    },
  });

  const { data: cryptoChart } = useQuery({
    queryKey: ['crypto-chart', selectedStock, currency],
    enabled: !!selectedStock && isCrypto(selectedStock),
    queryFn: () => fetchCryptoChart(selectedStock, currency),
  });

  const tradeMutation = useMutation({
    mutationFn: ({ type, symbol, qty }) =>
      type === 'buy'
        ? tradeAPI.buy(selectedPortfolio.id, symbol, qty)
        : tradeAPI.sell(selectedPortfolio.id, symbol, qty),
    onSuccess: () => {
      toast.success(`${tradeType.toUpperCase()} ${selectedStock}`);
      queryClient.invalidateQueries(['trades']);
      fetchPortfolios();
    },
  });

  /* ================= DERIVED ================= */

  const filteredStocks =
    filterType === 'SECTOR' && selectedFilter
      ? MARKET_SECTORS[selectedFilter]
      : filterType === 'ASSET' && selectedFilter
      ? ASSET_CLASSES[selectedFilter]
      : popularStocks;

  const totalCost = (livePrice || 0) * quantity;

  /* ================= UI ================= */

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-4xl font-bold gradient-text">Trading</h1>

      {/* CATEGORY */}
      <div className="glass-card">
        <div className="flex gap-2 mb-3">
          <button onClick={() => setFilterType('SECTOR')} className="btn-secondary">Sector</button>
          <button onClick={() => setFilterType('ASSET')} className="btn-secondary">Asset</button>
        </div>

        {filterType && (
          <div className="flex flex-wrap gap-2">
            {Object.keys(filterType === 'SECTOR' ? MARKET_SECTORS : ASSET_CLASSES).map(k => (
              <button
                key={k}
                onClick={() => setSelectedFilter(k)}
                className="px-3 py-2 bg-white/5 rounded-lg"
              >
                {k}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SEARCH */}
      <div className="glass-card">
        <input
          value={searchSymbol}
          onChange={(e) => setSearchSymbol(e.target.value.toUpperCase())}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setSelectedStock(searchSymbol);
              setSearchSymbol('');
            }
          }}
          placeholder="Search (TCS, BTC)"
          className="input-field mb-3"
        />

        <div className="flex gap-2 flex-wrap">
          {filteredStocks.map(s => (
            <button
              key={s}
              onClick={() => setSelectedStock(s)}
              className="px-4 py-2 bg-white/5 rounded-lg"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* PRICE */}
      {selectedStock && (
        <div className="glass-card">
          <div className="flex justify-between mb-2">
            <h2 className="text-xl font-bold">{selectedStock}</h2>
            <button onClick={refetch}><RefreshCw /></button>
          </div>

          {/* Currency Toggle (Crypto only) */}
          {isCrypto(selectedStock) && (
            <div className="flex gap-2 mb-2">
              <button onClick={() => setCurrency('inr')} className="btn-secondary">INR</button>
              <button onClick={() => setCurrency('usd')} className="btn-secondary">USD</button>
            </div>
          )}

          {!isLoading && (
            <p className="text-4xl font-bold">
              {currency === 'usd' ? '$' : '₹'}
              {livePrice?.toLocaleString()}
            </p>
          )}

          {/* MINI CRYPTO CHART */}
          {cryptoChart && (
            <div className="flex gap-1 mt-4 h-20 items-end">
              {cryptoChart.map((p, i) => (
                <div
                  key={i}
                  className="bg-indigo-500 w-1"
                  style={{ height: `${(p / Math.max(...cryptoChart)) * 100}%` }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ORDER */}
      {selectedStock && (
        <div className="glass-card">
          <div className="flex gap-2 mb-3">
            <button onClick={() => setTradeType('buy')} className="btn-secondary">Buy</button>
            <button onClick={() => setTradeType('sell')} className="btn-secondary">Sell</button>
          </div>

          <input
            type="number"
            value={quantity}
            min="1"
            onChange={(e) => setQuantity(+e.target.value)}
            className="input-field mb-3"
          />

          <div className="flex justify-between mb-3">
            <span>Total</span>
            <span className="font-bold">
              {currency === 'usd' ? '$' : '₹'}
              {totalCost.toLocaleString()}
            </span>
          </div>

          <button onClick={() => tradeMutation.mutate({
            type: tradeType,
            symbol: selectedStock,
            qty: quantity,
          })} className="btn-primary w-full">
            Confirm {tradeType.toUpperCase()}
          </button>
        </div>
      )}
    </div>
  );
}
