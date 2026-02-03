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

  useEffect(() => { loadHoldings(); }, [portfolioId]);

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
    await tradeAPI.buy(portfolioId, symbol, quantity);
    toast.success('Stock bought');
    loadHoldings();
  };

  const sell = async () => {
    const holding = holdings.find(h => h.symbol === symbol);
    if (!holding || quantity > holding.quantity) {
      return toast.error('Not enough quantity');
    }
    await tradeAPI.sell(portfolioId, symbol, quantity);
    toast.success('Stock sold');
    loadHoldings();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-4xl font-bold gradient-text">Client Portfolio</h1>

      <div className="flex gap-4">
        <button onClick={() => setMode('BUY')} className={`btn-secondary ${mode === 'BUY' && 'bg-success/30'}`}>Buy</button>
        <button onClick={() => setMode('SELL')} className={`btn-secondary ${mode === 'SELL' && 'bg-danger/30'}`}>Sell</button>
      </div>

      <div className="glass-card space-y-4 max-w-md">
        <input className="input-field" placeholder="Symbol (TCS, RELIANCE)" value={symbol} onChange={e => setSymbol(e.target.value.toUpperCase())} />
        <input className="input-field" type="number" min="1" value={quantity} onChange={e => setQuantity(+e.target.value)} />
        <button onClick={fetchPrice} className="btn-secondary">Get Live Price</button>
        {price && <p>Live Price: ₹{price}</p>}
        <button onClick={mode === 'BUY' ? buy : sell} className="btn-primary">
          Confirm {mode}
        </button>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-2">Holdings</h3>
        {holdings.map(h => (
          <div key={h.id} className="flex justify-between glass-card mb-2 p-3">
            <span>{h.symbol}</span>
            <span>Qty: {h.quantity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
