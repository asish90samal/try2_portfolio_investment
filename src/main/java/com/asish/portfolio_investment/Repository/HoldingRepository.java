package com.asish.portfolio_investment.Repository;


import com.asish.portfolio_investment.Entity.Holding;
import com.asish.portfolio_investment.Entity.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HoldingRepository extends JpaRepository<Holding, Long> {
    Optional<Holding> findByPortfolioAndSymbol(Portfolio portfolio, String symbol);
}
