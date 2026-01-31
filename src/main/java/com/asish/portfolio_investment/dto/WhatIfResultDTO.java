package com.asish.portfolio_investment.dto;


import lombok.*;

@Getter @Setter @AllArgsConstructor
public class WhatIfResultDTO {
    private String symbol;
    private String investDate;
    private double investedAmount;
    private double thenPrice;
    private double nowPrice;
    private double units;
    private double currentValue;
    private double pnl;
    private double cagr;
}
