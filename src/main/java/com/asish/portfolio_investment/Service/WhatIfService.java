package com.asish.portfolio_investment.Service;


import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class WhatIfService {

    private final MarketDataService marketDataService;

    public WhatIfService(MarketDataService marketDataService) {
        this.marketDataService = marketDataService;
    }

    public Map<String, Object> whatIfInvestment(
            String symbol,
            double amount,
            String range) {

        List<Map<String, Object>> history =
                marketDataService.getHistory(symbol, range);

        double buyPrice;
        double currentPrice;

        // 🔥 FALLBACK if Yahoo blocks history
        if (history.isEmpty()) {

            // simulate realistic past growth
            currentPrice = getLivePriceSafe(symbol);
            buyPrice = currentPrice * 0.75; // assume 25% growth

        } else {

            buyPrice = Double.parseDouble(
                    history.get(0).get("close").toString());

            currentPrice = Double.parseDouble(
                    history.get(history.size() - 1)
                            .get("close").toString());
        }

        double quantity = amount / buyPrice;
        double currentValue = quantity * currentPrice;
        double profit = currentValue - amount;
        double percent = (profit / amount) * 100;

        Map<String, Object> result = new HashMap<>();
        result.put("symbol", symbol);
        result.put("investedAmount", amount);
        result.put("buyPrice", buyPrice);
        result.put("currentPrice", currentPrice);
        result.put("quantity", quantity);
        result.put("currentValue", currentValue);
        result.put("profitLoss", profit);
        result.put("returnPercent", percent);
        result.put("range", range);
        result.put("dataSource",
                history.isEmpty() ? "SIMULATED (Yahoo blocked)" : "YAHOO");

        return result;
    }

    private double getLivePriceSafe(String symbol) {
        try {
            Object p =
                    marketDataService.getLivePrice(symbol).get("price");
            return Double.parseDouble(p.toString());
        } catch (Exception e) {
            return 1000.0; // hard fallback
        }
    }
}
