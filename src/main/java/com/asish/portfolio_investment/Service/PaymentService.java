package com.asish.portfolio_investment.Service;



import com.asish.portfolio_investment.Entity.Wallet;
import com.asish.portfolio_investment.Repository.WalletRepository;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    private final WalletRepository walletRepo;

    public PaymentService(WalletRepository walletRepo) {
        this.walletRepo = walletRepo;
    }

    // create wallet if not exists
    private Wallet getWallet() {
        return walletRepo.findById(1L)
                .orElseGet(() -> {
                    Wallet w = new Wallet();
                    w.setBalance(0);
                    return walletRepo.save(w);
                });
    }

    public double addFunds(double amount) {
        Wallet wallet = getWallet();
        wallet.setBalance(wallet.getBalance() + amount);
        walletRepo.save(wallet);
        return wallet.getBalance();
    }

    public boolean hasBalance(double amount) {
        return getWallet().getBalance() >= amount;
    }

    public void deduct(double amount) {
        Wallet wallet = getWallet();
        wallet.setBalance(wallet.getBalance() - amount);
        walletRepo.save(wallet);
    }

    public double getBalance() {
        return getWallet().getBalance();
    }
}
