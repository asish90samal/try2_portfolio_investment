package com.asish.portfolio_investment.Entity;



import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class TradeOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String symbol;
    private int quantity;
    private double price;
    private String type; // BUY / SELL
    private LocalDateTime time;

    @ManyToOne
    private Portfolio portfolio;

    public void setSymbol(String symbol) { this.symbol = symbol; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public void setPrice(double price) { this.price = price; }
    public void setType(String type) { this.type = type; }
    public void setTime(LocalDateTime time) { this.time = time; }
    public void setPortfolio(Portfolio portfolio) { this.portfolio = portfolio; }
}


