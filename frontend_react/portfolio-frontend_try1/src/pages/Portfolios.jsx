import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus, Trash2, Users, RefreshCw, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { portfolioAPI } from '../services/api';

export default function Portfolios() {
  const { portfolios, fetchPortfolios, createPortfolio, deletePortfolio, selectPortfolio } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchPortfolios(); }, []);

  const openClient = (portfolio) => {
    selectPortfolio(portfolio);
    navigate(`/portfolio/${portfolio.id}`);
  };

  const handleCreate = async () => {
    if (!name.trim()) return toast.error('Enter client name');
    setCreating(true);
    try {
      await createPortfolio(name.trim(), parseFloat(amount) || 0);
      toast.success(`Created portfolio for ${name}`);
      setShowModal(false);
      setName('');
      setAmount('');
      fetchPortfolios();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setCreating(false);
    }
  };

  const PnLBadge = ({ id }) => {
    const { data } = useQuery({
      queryKey: ['pnl', id],
      queryFn: async () => (await portfolioAPI.getPnL(id)).data,
      refetchInterval: 30000,
    });

    const pnl = data?.totalPnL || 0;
    return (
      <span className={`font-semibold ${pnl >= 0 ? 'text-success' : 'text-danger'}`}>
        {pnl >= 0 ? '+' : ''}₹{pnl.toLocaleString()}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold gradient-text">Client Portfolios</h1>
          <p className="text-gray-400 mt-2">Select a client to manage</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchPortfolios} className="btn-secondary flex items-center gap-2">
            <RefreshCw className="w-5 h-5" /> Refresh
          </button>
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add Client
          </button>
        </div>
      </div>

      {/* LIST HEADER */}
      <div className="grid grid-cols-5 gap-4 px-4 text-gray-400 text-sm">
        <span>Name</span>
        <span>ID</span>
        <span>Cash</span>
        <span>PnL</span>
        <span>Action</span>
      </div>

      {/* LIST */}
      <div className="space-y-2">
        {portfolios.map(p => (
          <motion.div
            key={p.id}
            whileHover={{ scale: 1.01 }}
            onClick={() => openClient(p)}
            className="grid grid-cols-5 gap-4 items-center px-4 py-3 glass-card cursor-pointer"
          >
            <span className="font-semibold">{p.name}</span>
            <span className="text-sm">#{p.id}</span>
            <span>₹{p.cashBalance?.toLocaleString()}</span>
            <PnLBadge id={p.id} />
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Delete portfolio?')) {
                  deletePortfolio(p.id).catch(e => toast.error(e.message));
                }
              }}
              className="text-danger hover:bg-danger/20 p-2 rounded-lg w-fit"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* MODAL (unchanged logic) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="glass-card max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Add New Client</h3>
            <input className="input-field mb-3" placeholder="Client name" value={name} onChange={e => setName(e.target.value)} />
            <input className="input-field mb-4" placeholder="Initial amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
            <div className="flex gap-3">
              <button className="btn-secondary flex-1" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary flex-1" disabled={creating} onClick={handleCreate}>
                {creating ? 'Creating…' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
