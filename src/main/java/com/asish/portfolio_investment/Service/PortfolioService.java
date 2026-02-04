package com.asish.portfolio_investment.Service;


import com.asish.portfolio_investment.Entity.Holding;
import com.asish.portfolio_investment.Entity.Portfolio;
import com.asish.portfolio_investment.Repository.HoldingRepository;
import com.asish.portfolio_investment.Repository.PortfolioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PortfolioService {

    @Autowired
    private HoldingRepository holdingRepository;


    @Autowired
    private PortfolioRepository portfolioRepository;

    public Portfolio createPortfolio(String name, double initialAmount) {

        Portfolio portfolio = new Portfolio();
        portfolio.setName(name);
        portfolio.setCashBalance(initialAmount);

        return portfolioRepository.save(portfolio);
    }
    @Transactional
    public void deletePortfolio(Long portfolioId) {

        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        if (!portfolio.getHoldings().isEmpty()) {
            throw new RuntimeException("Cannot delete portfolio with holdings");
        }

        portfolioRepository.delete(portfolio);
    }


    public Portfolio addFunds(Long portfolioId, double amount) {

        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        portfolio.setCashBalance(
                portfolio.getCashBalance() + amount
        );

        return portfolioRepository.save(portfolio);
    }

    public List<Portfolio> getAllPortfolios() {
        return portfolioRepository.findAll();
    }

    public List<Holding> getHoldings(Long portfolioId) {

        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        return holdingRepository.findByPortfolio(portfolio);
    }
    public Portfolio withdrawFunds(Long portfolioId, double amount) {

        if (amount <= 0) {
            throw new RuntimeException("Withdrawal amount must be positive");
        }

        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        if (portfolio.getCashBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        portfolio.setCashBalance(
                portfolio.getCashBalance() - amount
        );

        return portfolioRepository.save(portfolio);
    }



}
