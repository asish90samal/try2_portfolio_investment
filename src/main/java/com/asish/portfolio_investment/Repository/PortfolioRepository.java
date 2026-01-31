package com.asish.portfolio_investment.Repository;

import com.asish.portfolio_investment.Entity.Holding;
import com.asish.portfolio_investment.Entity.Portfolio;
import com.asish.portfolio_investment.Entity.TradeOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {}

