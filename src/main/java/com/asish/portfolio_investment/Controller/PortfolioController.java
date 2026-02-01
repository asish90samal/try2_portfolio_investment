package com.asish.portfolio_investment.Controller;


import com.asish.portfolio_investment.Entity.Portfolio;
import com.asish.portfolio_investment.Entity.Trade;
import com.asish.portfolio_investment.Service.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.asish.portfolio_investment.Service.TradeService;

import java.util.List;
@RestController
@RequestMapping("/api/portfolios")
public class PortfolioController {

    @Autowired
    private PortfolioService portfolioService;

    @Autowired
    private TradeService tradeService;   // ✅ THIS WAS MISSING

    @PostMapping
    public Portfolio createPortfolio(
            @RequestParam String name,
            @RequestParam double amount) {
        return portfolioService.createPortfolio(name, amount);
    }

    @GetMapping
    public List<Portfolio> getAllPortfolios() {
        return portfolioService.getAllPortfolios();
    }

    @GetMapping("/{portfolioId}/trades")
    public List<Trade> getTradesByPortfolio(@PathVariable Long portfolioId) {
        return tradeService.getTradesByPortfolio(portfolioId);
    }

    @PostMapping("/{id}/add-funds")
    public Portfolio addFunds(
            @PathVariable Long id,
            @RequestParam double amount) {
        return portfolioService.addFunds(id, amount);
    }
}
