package com.asish.portfolio_investment.Service;


import com.asish.portfolio_investment.Entity.Portfolio;
import com.asish.portfolio_investment.Repository.PortfolioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PortfolioService {

    @Autowired
    private PortfolioRepository portfolioRepository;

    public Portfolio createPortfolio(String name, double initialAmount) {

        Portfolio portfolio = new Portfolio();
        portfolio.setName(name);
        portfolio.setCashBalance(initialAmount);

        return portfolioRepository.save(portfolio);
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

}
