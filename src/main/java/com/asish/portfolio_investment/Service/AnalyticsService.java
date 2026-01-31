package com.asish.portfolio_investment.Service;



import com.asish.portfolio_investment.Entity.Holding;
import com.asish.portfolio_investment.Entity.Portfolio;
import com.asish.portfolio_investment.Repository.HoldingRepository;
import com.asish.portfolio_investment.Repository.PortfolioRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AnalyticsService {

    private final PortfolioRepository portfolioRepo;
    private final HoldingRepository holdingRepo;
    private final MarketDataService marketService;

    public AnalyticsService(
            PortfolioRepository portfolioRepo,
            HoldingRepository holdingRepo,
            MarketDataService marketService) {

        this.portfolioRepo = portfolioRepo;
        this.holdingRepo = holdingRepo;
        this.marketService = marketService;
    }

    public Map<String, Object> portfolioSummary(Long portfolioId) {

        Optional<Portfolio> optionalPortfolio = portfolioRepo.findById(portfolioId);

        if (optionalPortfolio.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Portfolio not found");
            error.put("portfolioId", portfolioId);
            return error;
        }

        Portfolio portfolio = optionalPortfolio.get();
        List<Holding> holdings = holdingRepo.findAll();

        double invested = 0;
        double currentValue = 0;

        List<Map<String, Object>> holdingDetails = new ArrayList<>();

        for (Holding h : holdings) {

            if (!h.getPortfolio().getId().equals(portfolioId)) continue;

            double buyValue = h.getBuyPrice() * h.getQuantity();

            Map<String, Object> live =
                    marketService.getLivePrice(h.getSymbol());

            double livePrice;
            try {
                livePrice = Double.parseDouble(live.get("price").toString());
            } catch (Exception e) {
                livePrice = h.getBuyPrice(); // fallback
            }

            double currValue = livePrice * h.getQuantity();

            invested += buyValue;
            currentValue += currValue;

            Map<String, Object> map = new HashMap<>();
            map.put("symbol", h.getSymbol());
            map.put("quantity", h.getQuantity());
            map.put("avgPrice", h.getBuyPrice());
            map.put("currentPrice", livePrice);
            map.put("pnl", currValue - buyValue);

            holdingDetails.add(map);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("portfolioId", portfolioId);
        result.put("cashBalance", portfolio.getBalance());
        result.put("investedAmount", invested);
        result.put("currentValue", currentValue);
        result.put("totalPnL", currentValue - invested);
        result.put("holdings", holdingDetails);

        return result;
    }
}
