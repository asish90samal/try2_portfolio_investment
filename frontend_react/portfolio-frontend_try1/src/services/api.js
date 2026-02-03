import axios from "axios";

/**
 * =========================================================
 * SINGLE AXIOS INSTANCE (DO NOT CREATE ANOTHER ONE)
 * =========================================================
 */
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
  withCredentials: true,
});

/**
 * =========================================================
 * RESPONSE INTERCEPTOR (DEBUG + ERROR VISIBILITY)
 * =========================================================
 */
api.interceptors.response.use(
  (response) => {
    console.log(
      `✅ ${response.config.method?.toUpperCase()} ${response.config.url}`,
      response.data
    );
    return response;
  },
  (error) => {
    console.error(
      `❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

/**
 * =========================================================
 * PORTFOLIO APIs
 * =========================================================
 */
export const portfolioAPI = {
  // GET /api/portfolios
  getAll: () => api.get("/portfolios"),

  // POST /api/portfolios?name=&amount=
  create: (name, amount) =>
    api.post(
      `/portfolios?name=${encodeURIComponent(name)}&amount=${amount}`
    ),

  // POST /api/portfolios/{id}/add-funds?amount=
  addFunds: (id, amount) =>
    api.post(`/portfolios/${id}/add-funds?amount=${amount}`),

  // DELETE /api/portfolios/{id}
  delete: (id) => api.delete(`/portfolios/${id}`),

  // GET /api/portfolios/{id}/holdings
  getHoldings: (id) => api.get(`/portfolios/${id}/holdings`),

  // GET /api/portfolio/{id}/pnl
  getPnL: (id) => api.get(`/portfolio/${id}/pnl`),

  // GET /api/portfolios/statement/csv/{id}
  getStatement: (id) =>
    api.get(`/portfolios/statement/csv/${id}`, {
      responseType: "blob",
    }),
};

/**
 * =========================================================
 * TRADE APIs
 * =========================================================
 */
export const tradeAPI = {
  // POST /api/trades/buy
  buy: (portfolioId, symbol, quantity) =>
    api.post(
      `/trades/buy?portfolioId=${portfolioId}&symbol=${encodeURIComponent(
        symbol
      )}&quantity=${quantity}`
    ),

  // POST /api/trades/sell
  sell: (portfolioId, symbol, quantity) =>
    api.post(
      `/trades/sell?portfolioId=${portfolioId}&symbol=${encodeURIComponent(
        symbol
      )}&quantity=${quantity}`
    ),

  // GET /api/trades/portfolio/{portfolioId}
  getHistory: (portfolioId) =>
    api.get(`/trades/portfolio/${portfolioId}`),
};

/**
 * =========================================================
 * MARKET APIs
 * =========================================================
 */
export const marketAPI = {
  // GET /api/market/live?symbol=
  getLivePrice: (symbol) =>
    api.get(`/market/live?symbol=${encodeURIComponent(symbol)}`),
};

/**
 * =========================================================
 * ANALYTICS APIs
 * =========================================================
 */
export const analyticsAPI = {
  // POST /api/portfolio/{id}/health
  getHealthById: (portfolioId) =>
    api.post(`/portfolio/${portfolioId}/health`),

  // POST /api/portfolio/{id}/risk
  getRiskById: (portfolioId) =>
    api.post(`/portfolio/${portfolioId}/risk`),

  // POST /api/portfolio/health
  getHealth: (holdings) =>
    api.post("/portfolio/health", { holdings }),

  // POST /api/portfolio/risk
  getRisk: (holdings) =>
    api.post("/portfolio/risk", { holdings }),

  // POST /api/portfolio/diversity
  getDiversity: (holdings) =>
    api.post("/portfolio/diversity", { holdings }),

  // POST /api/portfolio/what-if
  whatIf: (symbol, amount, date) =>
    api.post("/portfolio/what-if", {
      symbol,
      amount,
      date,
    }),

  // GET /api/portfolio/diversity/csv/{id}
  getDiversityCSV: (portfolioId) =>
    api.get(`/portfolio/diversity/csv/${portfolioId}`, {
      responseType: "blob",
    }),
};

/**
 * =========================================================
 * AI APIs
 * =========================================================
 */
export const aiAPI = {
  // POST /api/portfolio/ai-chat
  chat: (question, holdings) =>
    api.post("/portfolio/ai-chat", {
      question,
      holdings,
    }),

  // POST /api/portfolio/{id}/ai-chat
  chatById: (portfolioId, question) =>
    api.post(`/portfolio/${portfolioId}/ai-chat`, {
      question,
    }),
};

export default api;
