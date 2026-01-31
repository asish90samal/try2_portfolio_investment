package com.asish.portfolio_investment.Service;



import com.asish.portfolio_investment.Entity.Holding;
import com.asish.portfolio_investment.Entity.Portfolio;
import com.asish.portfolio_investment.Repository.HoldingRepository;
import com.asish.portfolio_investment.Repository.PortfolioRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TradeService {

    private final PortfolioRepository portfolioRepository;
    private final HoldingRepository holdingRepository;
    private final MarketDataService marketDataService;
    private final PaymentService paymentService;

    public TradeService(
            PortfolioRepository portfolioRepository,
            HoldingRepository holdingRepository,
            MarketDataService marketDataService,
            PaymentService paymentService
    ) {
        this.portfolioRepository = portfolioRepository;
        this.holdingRepository = holdingRepository;
        this.marketDataService = marketDataService;
        this.paymentService = paymentService;
    }

    // ========================= BUY =========================
    public String buyStock(Long portfolioId, String symbol, int quantity) {

        // 1️⃣ Get live price
        double price = Double.parseDouble(
                marketDataService.getLivePrice(symbol)
                        .get("price").toString());

        double totalCost = price * quantity;

        // 2️⃣ Wallet check
        if (!paymentService.hasBalance(totalCost)) {
            throw new RuntimeException(
                    "Insufficient wallet balance. Please add funds.");
        }

        // 3️⃣ Deduct money
        paymentService.deduct(totalCost);

        // 4️⃣ Get portfolio
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() ->
                        new RuntimeException("Portfolio not found"));

        // 5️⃣ Check if holding exists
        Optional<Holding> existing =
                holdingRepository.findByPortfolioAndSymbol(
                        portfolio, symbol);

        if (existing.isPresent()) {
            Holding h = existing.get();
            h.setQuantity(h.getQuantity() + quantity);
            holdingRepository.save(h);
        } else {
            Holding h = new Holding();
            h.setSymbol(symbol);
            h.setQuantity(quantity);
            h.setBuyPrice(price);
            h.setPortfolio(portfolio);
            holdingRepository.save(h);
        }

        return "BUY SUCCESS: " + symbol +
                " | Qty: " + quantity +
                " | Price: " + price;
    }

    // ========================= SELL =========================
    public String sellStock(Long portfolioId, String symbol, int quantity) {

        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() ->
                        new RuntimeException("Portfolio not found"));

        Holding holding = holdingRepository
                .findByPortfolioAndSymbol(portfolio, symbol)
                .orElseThrow(() ->
                        new RuntimeException("Stock not found in portfolio"));

        if (holding.getQuantity() < quantity) {
            throw new RuntimeException("Not enough quantity to sell");
        }

        // 1️⃣ Get live price
        double price = Double.parseDouble(
                marketDataService.getLivePrice(symbol)
                        .get("price").toString());

        double sellValue = price * quantity;

        // 2️⃣ Add money to wallet
        paymentService.addFunds(sellValue);

        // 3️⃣ Update holding
        holding.setQuantity(holding.getQuantity() - quantity);

        if (holding.getQuantity() == 0) {
            holdingRepository.delete(holding);
        } else {
            holdingRepository.save(holding);
        }

        return "SELL SUCCESS: " + symbol +
                " | Qty: " + quantity +
                " | Price: " + price;
    }
}
