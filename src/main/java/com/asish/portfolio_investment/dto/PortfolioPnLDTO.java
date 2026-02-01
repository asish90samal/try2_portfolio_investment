package com.asish.portfolio_investment.dto;

public class PortfolioPnLDTO {

    private double investedAmount;
    private double currentValue;
    private double totalPnL;

    public PortfolioPnLDTO(double investedAmount, double currentValue, double totalPnL) {
        this.investedAmount = investedAmount;
        this.currentValue = currentValue;
        this.totalPnL = totalPnL;
    }
    public PortfolioPnLDTO(){}

    public double getInvestedAmount() {
        return investedAmount;
    }

    public void setInvestedAmount(double investedAmount) {
        this.investedAmount = investedAmount;
    }

    public double getCurrentValue() {
        return currentValue;
    }

    public void setCurrentValue(double currentValue) {
        this.currentValue = currentValue;
    }

    public double getTotalPnL() {
        return totalPnL;
    }

    public void setTotalPnL(double totalPnL) {
        this.totalPnL = totalPnL;
    }
    // getters & setters
}
