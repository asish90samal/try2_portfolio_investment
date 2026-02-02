import axios from "axios";

const API_BASE = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =======================
   PORTFOLIO APIs
   ======================= */
export const portfolioAPI = {
  // CREATE portfolio → returns { id, name, cashBalance }
  create: async (name, amount) => {
    const res = await api.post(
      `/portfolios?name=${name}&amount=${amount}`
    );
    return res.data;
  },

  // GET all portfolios
  getAll: async () => {
    const res = await api.get("/portfolios");
    return res.data;
  },

  // ADD funds
  addFunds: async (id, amount) => {
    await api.post(`/portfolios/${id}/add-funds?amount=${amount}`);
  },

  // DELETE portfolio
  delete: async (id) => {
    await api.delete(`/portfolios/${id}`);
  },

  // GET holdings by portfolio id
  getHoldings: async (id) => {
    const res = await api.get(`/portfolios/${id}/holdings`);
    return res.data;
  },

  // GET PnL
  getPnL: async (id) => {
    const res = await api.get(`/portfolio/${id}/pnl`);
    return res.data;
  },

  // DOWNLOAD statement CSV
  getStatement: async (id) => {
    const res = await api.get(
      `/portfolios/statement/csv/${id}`,
      { responseType: "blob" }
    );
    return res.data;
  },

  // DOWNLOAD diversity report CSV
  getDiversityReport: async (id) => {
    const res = await api.get(
      `/portfolio/diversity/csv/${id}`,
      { responseType: "blob" }
    );
    return res.data;
  },
};

/* =======================
   TRADE APIs
   ======================= */
export const tradeAPI = {
  buy: async (portfolioId, symbol, quantity) => {
    const res = await api.post(
      `/trades/buy?portfolioId=${portfolioId}&symbol=${symbol}&quantity=${quantity}`
    );
    return res.data;
  },

  sell: async (portfolioId, symbol, quantity) => {
    const res = await api.post(
      `/trades/sell?portfolioId=${portfolioId}&symbol=${symbol}&quantity=${quantity}`
    );
    return res.data;
  },

  getHistory: async (portfolioId) => {
    const res = await api.get(`/trades/portfolio/${portfolioId}`);
    return res.data;
  },
};

/* =======================
   MARKET APIs
   ======================= */
export const marketAPI = {
  getLivePrice: async (symbol) => {
    const res = await api.get(`/market/live?symbol=${symbol}`);
    return res.data;
  },

  // Flask service
  getIndices: async () => {
    const res = await axios.get("http://localhost:5000/indices");
    return res.data;
  },

  getHistory: async (symbol, range = "1Y") => {
    const res = await axios.get(
      `http://localhost:5000/market/history?symbol=${symbol}&range=${range}`
    );
    return res.data;
  },
};

/* =======================
   ANALYTICS APIs
   ======================= */
export const analyticsAPI = {
  getHealth: async (holdings) => {
    const res = await api.post("/portfolio/health", { holdings });
    return res.data;
  },

  getHealthById: async (portfolioId) => {
    const res = await api.post(`/portfolio/${portfolioId}/health`);
    return res.data;
  },

  getRisk: async (holdings) => {
    const res = await api.post("/portfolio/risk", { holdings });
    return res.data;
  },

  getRiskById: async (portfolioId) => {
    const res = await api.post(`/portfolio/${portfolioId}/risk`);
    return res.data;
  },

  getDiversity: async (holdings) => {
    const res = await api.post("/portfolio/diversity", { holdings });
    return res.data;
  },

  whatIf: async (symbol, amount, date) => {
    const res = await api.post("/portfolio/what-if", {
      symbol,
      amount,
      date,
    });
    return res.data;
  },

  aiChat: async (question, holdings) => {
    const res = await api.post("/portfolio/ai-chat", {
      question,
      holdings,
    });
    return res.data;
  },

  aiChatById: async (portfolioId, question) => {
    const res = await api.post(`/portfolio/${portfolioId}/ai-chat`, {
      question,
    });
    return res.data;
  },
};

export default api;
