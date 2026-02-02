package com.asish.portfolio_investment.Entity;




import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "portfolios")
public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(nullable = false)
    private double cashBalance;

    @OneToMany(mappedBy = "portfolio", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Holding> holdings;

    @OneToMany(mappedBy = "portfolio", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Trade> trades;

    // ===== Getters & Setters =====

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getCashBalance() {
        return cashBalance;
    }

    public void setCashBalance(double cashBalance) {
        this.cashBalance = cashBalance;
    }

    public List<Holding> getHoldings() {
        return holdings;
    }

    public List<Trade> getTrades() {
        return trades;
    }
}



