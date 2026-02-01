package com.asish.portfolio_investment.Repository;


import com.asish.portfolio_investment.Entity.Portfolio;
import com.asish.portfolio_investment.Entity.Trade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TradeRepository extends JpaRepository<Trade, Long> {

    // Get all trades for a portfolio
    List<Trade> findByPortfolio(Portfolio portfolio);

    // Get all trades for a portfolio and symbol
    List<Trade> findByPortfolioAndSymbol(Portfolio portfolio, String symbol);
}
