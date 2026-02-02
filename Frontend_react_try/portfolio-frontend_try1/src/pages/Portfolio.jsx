import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Plus,
  Trash2,
  Download,
  PieChart,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { usePortfolioStore } from "../store/useStore";
import { portfolioAPI } from "../services/api";

export default function Portfolio() {
  const {
    portfolios,
    selectedPortfolio,
    fetchPortfolios,
    createPortfolio,
    addFunds,
    deletePortfolio,
  } = usePortfolioStore();

  const queryClient = useQueryClient();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const [initialAmount, setInitialAmount] = useState("");
  const [fundsAmount, setFundsAmount] = useState("");

  /* 🔑 VERY IMPORTANT: LOAD SQL DATA */
  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  /* -------------------- QUERIES -------------------- */

  const { data: holdings } = useQuery({
    queryKey: ["holdings", selectedPortfolio?.id],
    queryFn: () => portfolioAPI.getHoldings(selectedPortfolio.id),
    enabled: !!selectedPortfolio,
  });

  const { data: pnl } = useQuery({
    queryKey: ["pnl", selectedPortfolio?.id],
    queryFn: () => portfolioAPI.getPnL(selectedPortfolio.id),
    enabled: !!selectedPortfolio,
  });

  /* -------------------- ACTIONS -------------------- */

  const handleCreatePortfolio = async () => {
    if (!newPortfolioName || !initialAmount) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const created = await createPortfolio(
        newPortfolioName,
        parseFloat(initialAmount)
      );

      toast.success(
        `Portfolio created successfully (ID: ${created.id})`
      );

      setShowCreateModal(false);
      setNewPortfolioName("");
      setInitialAmount("");

      fetchPortfolios(); // 🔑 refresh SQL data
    } catch (error) {
      toast.error("Failed to create portfolio");
      console.error(error);
    }
  };

  const handleAddFunds = async () => {
    if (!fundsAmount || !selectedPortfolio) return;

    try {
      await addFunds(selectedPortfolio.id, parseFloat(fundsAmount));
      toast.success("Funds added successfully");
      setShowAddFundsModal(false);
      setFundsAmount("");

      queryClient.invalidateQueries({ queryKey: ["pnl"] });
      fetchPortfolios();
    } catch (error) {
      toast.error("Failed to add funds");
    }
  };

  const handleDeletePortfolio = async (portfolioId) => {
    if (!window.confirm("Are you sure? Portfolio must have zero balance.")) return;

    try {
      await deletePortfolio(portfolioId);
      toast.success("Portfolio deleted");
      fetchPortfolios();
    } catch (error) {
      toast.error("Failed to delete portfolio");
    }
  };

  const downloadStatement = async () => {
    try {
      const data = await portfolioAPI.getStatement(selectedPortfolio.id);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `portfolio-${selectedPortfolio.id}-statement.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Statement downloaded");
    } catch (error) {
      toast.error("Failed to download statement");
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Portfolio</h1>
          <p className="text-gray-400 mt-2">
            Manage your investment portfolios
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 rounded-xl font-semibold"
        >
          <Plus className="w-5 h-5" />
          Create Portfolio
        </button>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map((portfolio) => (
          <motion.div
            key={portfolio.id}
            whileHover={{ y: -5 }}
            className="border border-white/10 rounded-xl p-5"
          >
            <div className="flex justify-between mb-3">
              <div>
                <h3 className="font-bold">{portfolio.name}</h3>
                <p className="text-xs text-gray-400">
                  ID: {portfolio.id}
                </p>
              </div>
              <button
                onClick={() => handleDeletePortfolio(portfolio.id)}
                className="text-red-400"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <p className="text-xl font-bold">
              ₹{portfolio.cashBalance?.toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Selected Portfolio Details */}
      {selectedPortfolio && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-white/10 rounded-xl p-5">
              <p className="text-gray-400 text-sm">Cash Balance</p>
              <p className="text-2xl font-bold">
                ₹{selectedPortfolio.cashBalance?.toLocaleString()}
              </p>
              <button
                onClick={() => setShowAddFundsModal(true)}
                className="mt-3 w-full bg-white/10 py-2 rounded-lg"
              >
                Add Funds
              </button>
            </div>

            <div className="border border-white/10 rounded-xl p-5">
              <p className="text-gray-400 text-sm">Total P&L</p>
              <p
                className={`text-2xl font-bold ${
                  pnl?.data?.totalPnL >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                ₹{pnl?.data?.totalPnL || 0}
              </p>
            </div>

            <div className="border border-white/10 rounded-xl p-5">
              <p className="text-gray-400 text-sm">Holdings</p>
              <p className="text-2xl font-bold">
                {holdings?.data?.length || 0}
              </p>
              <button
                onClick={downloadStatement}
                className="mt-3 w-full bg-white/10 py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <Download size={16} /> Download Statement
              </button>
            </div>
          </div>
        </>
      )}
      {showCreateModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-900 p-6 rounded-xl w-full max-w-md"
    >
      <h3 className="text-2xl font-bold mb-4">Create Portfolio</h3>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Portfolio name"
          value={newPortfolioName}
          onChange={(e) => setNewPortfolioName(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 border border-gray-700"
        />

        <input
          type="number"
          placeholder="Initial amount"
          value={initialAmount}
          onChange={(e) => setInitialAmount(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 border border-gray-700"
        />

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => setShowCreateModal(false)}
            className="flex-1 bg-gray-700 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleCreatePortfolio}
            className="flex-1 bg-indigo-600 py-2 rounded font-semibold"
          >
            Create
          </button>
        </div>
      </div>
    </motion.div>
  </div>
)}


{showAddFundsModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-900 p-6 rounded-xl w-full max-w-md"
    >
      <h3 className="text-2xl font-bold mb-4">Add Funds</h3>

      <input
        type="number"
        placeholder="Amount"
        value={fundsAmount}
        onChange={(e) => setFundsAmount(e.target.value)}
        className="w-full p-3 rounded bg-gray-800 border border-gray-700 mb-4"
      />

      <div className="flex gap-3">
        <button
          onClick={() => setShowAddFundsModal(false)}
          className="flex-1 bg-gray-700 py-2 rounded"
        >
          Cancel
        </button>

        <button
          onClick={handleAddFunds}
          className="flex-1 bg-green-600 py-2 rounded font-semibold"
        >
          Add
        </button>
      </div>
    </motion.div>
  </div>
)}

    </div>
  );
}
