package com.asish.portfolio_investment.Service;



import com.asish.portfolio_investment.Entity.Holding;
import com.asish.portfolio_investment.Entity.Portfolio;
import com.asish.portfolio_investment.Entity.Trade;
import com.asish.portfolio_investment.Repository.HoldingRepository;
import com.asish.portfolio_investment.Repository.PortfolioRepository;
import com.asish.portfolio_investment.Repository.TradeRepository;
import com.asish.portfolio_investment.dto.MarketPriceResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TradeService {

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private TradeRepository tradeRepository;

    @Autowired
    private HoldingRepository holdingRepository;

    @Autowired
    private MarketDataService marketDataService;

    @Transactional
    public Trade buyAsset(Long portfolioId, String symbol, int quantity) {

        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        MarketPriceResponseDTO marketPrice =
                marketDataService.getLivePrice(symbol);

        double price = marketPrice.getPrice();
        double totalCost = price * quantity;

        if (portfolio.getCashBalance() < totalCost) {
            throw new RuntimeException("Insufficient balance");
        }

        portfolio.setCashBalance(portfolio.getCashBalance() - totalCost);

        Trade trade = new Trade();
        trade.setSymbol(symbol);
        trade.setPrice(price);
        trade.setQuantity(quantity);
        trade.setType("BUY");
        trade.setPortfolio(portfolio);
        tradeRepository.save(trade);

        Holding holding = holdingRepository
                .findByPortfolioAndSymbol(portfolio, symbol)
                .orElse(new Holding());

        holding.setPortfolio(portfolio);
        holding.setSymbol(symbol);

        int newQty = holding.getQuantity() + quantity;
        double newAvg =
                ((holding.getAveragePrice() * holding.getQuantity())
                        + (price * quantity)) / newQty;

        holding.setQuantity(newQty);
        holding.setAveragePrice(newAvg);

        holdingRepository.save(holding);
        portfolioRepository.save(portfolio);

        return trade;
    }

    @Transactional
    public Trade sellAsset(Long portfolioId, String symbol, int quantity) {

        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        Holding holding = holdingRepository
                .findByPortfolioAndSymbol(portfolio, symbol)
                .orElseThrow(() -> new RuntimeException("No holding found"));

        if (holding.getQuantity() < quantity) {
            throw new RuntimeException("Not enough quantity to sell");
        }

        MarketPriceResponseDTO marketPrice =
                marketDataService.getLivePrice(symbol);

        double sellPrice = marketPrice.getPrice();
        double totalValue = sellPrice * quantity;

        // Add cash
        portfolio.setCashBalance(
                portfolio.getCashBalance() + totalValue
        );

        // Reduce holding
        holding.setQuantity(holding.getQuantity() - quantity);

        if (holding.getQuantity() == 0) {
            holdingRepository.delete(holding);
        } else {
            holdingRepository.save(holding);
        }

        // Save trade
        Trade trade = new Trade();
        trade.setSymbol(symbol);
        trade.setPrice(sellPrice);
        trade.setQuantity(quantity);
        trade.setType("SELL");
        trade.setPortfolio(portfolio);

        tradeRepository.save(trade);
        portfolioRepository.save(portfolio);

        return trade;
    }



    public List<Trade> getTradesByPortfolio(Long portfolioId) {

        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        return tradeRepository.findByPortfolio(portfolio);
    }


}

