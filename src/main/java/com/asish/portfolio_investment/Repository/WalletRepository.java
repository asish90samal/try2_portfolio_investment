package com.asish.portfolio_investment.Repository;

import com.asish.portfolio_investment.Entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WalletRepository extends JpaRepository<Wallet, Long> {
}
