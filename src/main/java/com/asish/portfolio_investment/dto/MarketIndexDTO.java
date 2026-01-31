package com.asish.portfolio_investment.dto;


import lombok.*;

@Getter @Setter @AllArgsConstructor
public class MarketIndexDTO {
    private String name;
    private String symbol;
    private double price;
    private double change;
    private double percent;
}
