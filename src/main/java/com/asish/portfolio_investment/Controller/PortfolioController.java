package com.asish.portfolio_investment.Controller;


import com.asish.portfolio_investment.Entity.Holding;
import com.asish.portfolio_investment.Entity.Portfolio;
import com.asish.portfolio_investment.Entity.Trade;
import com.asish.portfolio_investment.Service.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
    @DeleteMapping("/{id}")
    public void deletePortfolio(@PathVariable Long id) {
        portfolioService.deletePortfolio(id);
    }
    @GetMapping("/{id}/holdings")
    public List<Holding> getHoldings(@PathVariable Long id) {
        return portfolioService.getHoldings(id);
    }

    @GetMapping("/statement/csv/{portfolioId}")
    public ResponseEntity<String> exportCSV(@PathVariable Long portfolioId) {

        List<Trade> trades = tradeService.getTradesByPortfolio(portfolioId);

        StringBuilder csv = new StringBuilder();
        csv.append("Date,Type,Symbol,Quantity,Price\n");

        for (Trade t : trades) {
            csv.append(t.getCreatedAt())
                    .append(",")
                    .append(t.getType())
                    .append(",")
                    .append(t.getSymbol())
                    .append(",")
                    .append(t.getQuantity())
                    .append(",")
                    .append(t.getPrice())
                    .append("\n");
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=portfolio_statement.csv")
                .contentType(MediaType.TEXT_PLAIN)
                .body(csv.toString());
    }
    @PostMapping("/{id}/withdraw-funds")
    public Portfolio withdrawFunds(
            @PathVariable Long id,
            @RequestParam double amount) {

        return portfolioService.withdrawFunds(id, amount);
    }



}
