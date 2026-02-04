import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { portfolioAPI, tradeAPI, marketAPI } from '../services/api';

export default function PortfolioDetail() {
  const { id } = useParams();
  const portfolioId = id;

  const [mode, setMode] = useState('BUY');
  const [holdings, setHoldings] = useState([]);
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(null);

  // NEW: withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
    loadHoldings();
  }, [portfolioId]);

  const loadHoldings = async () => {
    const res = await portfolioAPI.getHoldings(portfolioId);
    setHoldings(res.data);
  };

  const fetchPrice = async () => {
    if (!symbol) return toast.error('Enter symbol');
    const res = await marketAPI.getLivePrice(symbol);
    setPrice(res.data.price);
  };

  const buy = async () => {
    try {
      await tradeAPI.buy(portfolioId, symbol, quantity);
      toast.success('Stock bought');
      setPrice(null);
      loadHoldings();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Buy failed');
    }
  };

  const sell = async () => {
    const holding = holdings.find(h => h.symbol === symbol);
    if (!holding || quantity > holding.quantity) {
      return toast.error('Not enough quantity');
    }
    try {
      await tradeAPI.sell(portfolioId, symbol, quantity);
      toast.success('Stock sold');
      setPrice(null);
      loadHoldings();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Sell failed');
    }
  };

  // NEW: withdraw handler
  const withdraw = async () => {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      return toast.error('Enter valid withdraw amount');
    }
    try {
      await portfolioAPI.withdrawFunds(portfolioId, withdrawAmount);
      toast.success(`₹${withdrawAmount} withdrawn`);
      setWithdrawAmount('');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Withdraw failed');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-4xl font-bold gradient-text">
        Client Portfolio (ID: {portfolioId})
      </h1>

      {/* BUY / SELL MODE */}
      <div className="flex gap-4">
        <button
          onClick={() => setMode('BUY')}
          className={`btn-secondary ${mode === 'BUY' && 'bg-success/30'}`}
        >
          Buy
        </button>
        <button
          onClick={() => setMode('SELL')}
          className={`btn-secondary ${mode === 'SELL' && 'bg-danger/30'}`}
        >
          Sell
        </button>
      </div>

      {/* BUY / SELL CARD */}
      <div className="glass-card space-y-4 max-w-md">
        <input
          className="input-field"
          placeholder="Symbol (TCS, RELIANCE)"
          value={symbol}
          onChange={e => setSymbol(e.target.value.toUpperCase())}
        />

        <input
          className="input-field"
          type="number"
          min="1"
          value={quantity}
          onChange={e => setQuantity(+e.target.value)}
        />

        <button onClick={fetchPrice} className="btn-secondary">
          Get Live Price
        </button>

        {price && <p>Live Price: ₹{price}</p>}

        <button
          onClick={mode === 'BUY' ? buy : sell}
          className="btn-primary"
        >
          Confirm {mode}
        </button>
      </div>

      {/* HOLDINGS */}
      <div>
        <h3 className="text-xl font-bold mb-2">Holdings</h3>
        {holdings.length === 0 && (
          <p className="text-gray-400">No holdings yet</p>
        )}
        {holdings.map(h => (
          <div
            key={h.id}
            className="flex justify-between glass-card mb-2 p-3"
          >
            <span>{h.symbol}</span>
            <span>Qty: {h.quantity}</span>
          </div>
        ))}
      </div>

      {/* 🔴 NEW: WITHDRAW FUNDS */}
      <div className="glass-card max-w-md space-y-4">
        <h3 className="text-xl font-bold text-red-400">
          Withdraw Funds
        </h3>

        <input
          type="number"
          min="1"
          className="input-field"
          placeholder="Enter amount (₹)"
          value={withdrawAmount}
          onChange={e => setWithdrawAmount(e.target.value)}
        />

        <button
          onClick={withdraw}
          className="btn-primary bg-red-600 hover:bg-red-700"
        >
          Withdraw Amount
        </button>
      </div>
    </div>
  );
}
