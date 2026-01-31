package com.asish.portfolio_investment.dto;


import lombok.*;

@Getter @Setter @AllArgsConstructor
public class HoldingAnalyticsDTO {
    private String symbol;
    private int quantity;
    private double avgPrice;
    private double currentPrice;
    private double invested;
    private double currentValue;
    private double pnl;
    private double pnlPercent;
}
