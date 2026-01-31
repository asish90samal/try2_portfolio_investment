package com.asish.portfolio_investment.Service;



import com.asish.portfolio_investment.Entity.Portfolio;
import com.asish.portfolio_investment.Repository.PortfolioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PortfolioService {

    private final PortfolioRepository repo;

    public PortfolioService(PortfolioRepository repo) {
        this.repo = repo;
    }

    public Portfolio createPortfolio(String name, double balance) {
        Portfolio p = new Portfolio();
        p.setName(name);
        p.setBalance(balance);
        return repo.save(p);
    }

    public List<Portfolio> getAll() {
        return repo.findAll();
    }
}
