import { create } from 'zustand';
import { portfolioAPI } from '../services/api';

export const useStore = create((set, get) => ({
  // State
  portfolios: [],
  selectedPortfolio: null,
  loading: false,
  error: null,

  // Actions
  fetchPortfolios: async () => {
    set({ loading: true, error: null });
    try {
      const response = await portfolioAPI.getAll();
      const portfolios = response.data; // Direct array from Spring Boot
      console.log('📊 Fetched portfolios:', portfolios);
      set({ portfolios, loading: false });
      
      // Auto-select first if none selected
      if (!get().selectedPortfolio && portfolios.length > 0) {
        set({ selectedPortfolio: portfolios[0] });
      }
    } catch (error) {
      console.error('Failed to fetch portfolios:', error);
      set({ error: error.message, loading: false, portfolios: [] });
    }
  },

  selectPortfolio: (portfolio) => {
    console.log('✅ Selected portfolio:', portfolio);
    set({ selectedPortfolio: portfolio });
  },

  createPortfolio: async (name, amount) => {
    set({ loading: true, error: null });
    try {
      const response = await portfolioAPI.create(name, amount);
      const newPortfolio = response.data;
      const portfolios = [...get().portfolios, newPortfolio];
      set({ portfolios, selectedPortfolio: newPortfolio, loading: false });
      return newPortfolio;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  addFunds: async (portfolioId, amount) => {
    set({ loading: true, error: null });
    try {
      const response = await portfolioAPI.addFunds(portfolioId, amount);
      const updated = response.data;
      
      // Update in list
      const portfolios = get().portfolios.map(p => 
        p.id === portfolioId ? updated : p
      );
      
      // Update selected if it's the same
      const selectedPortfolio = get().selectedPortfolio?.id === portfolioId 
        ? updated 
        : get().selectedPortfolio;
      
      set({ portfolios, selectedPortfolio, loading: false });
      return updated;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  deletePortfolio: async (portfolioId) => {
    set({ loading: true, error: null });
    try {
      await portfolioAPI.delete(portfolioId);
      const portfolios = get().portfolios.filter(p => p.id !== portfolioId);
      const selectedPortfolio = get().selectedPortfolio?.id === portfolioId 
        ? (portfolios[0] || null)
        : get().selectedPortfolio;
      
      set({ portfolios, selectedPortfolio, loading: false });
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  // Reset error
  clearError: () => set({ error: null }),
}));