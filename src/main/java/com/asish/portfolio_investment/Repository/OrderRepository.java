package com.asish.portfolio_investment.Repository;

import com.asish.portfolio_investment.Entity.TradeOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<TradeOrder, Long> {}
