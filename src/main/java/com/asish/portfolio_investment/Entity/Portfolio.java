package com.asish.portfolio_investment.Entity;




import jakarta.persistence.*;

@Entity
public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private double balance;

    public Long getId() { return id; }
    public String getName() { return name; }
    public double getBalance() { return balance; }

    public void setName(String name) { this.name = name; }
    public void setBalance(double balance) { this.balance = balance; }
}


