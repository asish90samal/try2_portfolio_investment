import { create } from 'zustand';
import { portfolioAPI } from '../services/api';

export const usePortfolioStore = create((set, get) => ({
  portfolios: [],
  selectedPortfolio: null,
  holdings: [],
  loading: false,
  error: null,

  fetchPortfolios: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await portfolioAPI.getAll();
      set({ portfolios: data, loading: false });
      
      // Auto-select first portfolio if none selected
      if (!get().selectedPortfolio && data.length > 0) {
        set({ selectedPortfolio: data[0] });
        get().fetchHoldings(data[0].id);
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  selectPortfolio: (portfolio) => {
    set({ selectedPortfolio: portfolio });
    get().fetchHoldings(portfolio.id);
  },

  fetchHoldings: async (portfolioId) => {
    try {
      const { data } = await portfolioAPI.getHoldings(portfolioId);
      set({ holdings: data });
    } catch (error) {
      console.error('Error fetching holdings:', error);
    }
  },

  createPortfolio: async (name, amount) => {
  set({ loading: true, error: null });
  try {
    // ⛔ DO NOT destructure { data }
    const created = await portfolioAPI.create(name, amount);

    set((state) => ({
      portfolios: [...state.portfolios, created],
      selectedPortfolio: created,
      loading: false,
    }));

    return created; // 🔑 REQUIRED
  } catch (error) {
    set({ error: error.message, loading: false });
    throw error;
  }
},


  addFunds: async (portfolioId, amount) => {
    set({ loading: true, error: null });
    try {
      await portfolioAPI.addFunds(portfolioId, amount);
      await get().fetchPortfolios();
      set({ loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deletePortfolio: async (portfolioId) => {
    set({ loading: true, error: null });
    try {
      await portfolioAPI.delete(portfolioId);
      const portfolios = get().portfolios.filter(p => p.id !== portfolioId);
      set({ 
        portfolios, 
        selectedPortfolio: portfolios[0] || null,
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));

export const useMarketStore = create((set) => ({
  indices: [],
  watchlist: [],
  loading: false,

  addToWatchlist: (symbol) => {
    set((state) => ({
      watchlist: [...state.watchlist, symbol],
    }));
  },

  removeFromWatchlist: (symbol) => {
    set((state) => ({
      watchlist: state.watchlist.filter(s => s !== symbol),
    }));
  },
}));