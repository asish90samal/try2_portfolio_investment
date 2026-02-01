package com.asish.portfolio_investment.dto;


import java.util.List;

public class PortfolioHealthRequestDTO {
    private List<HoldingDTO> holdings;

    public List<HoldingDTO> getHoldings() {
        return holdings;
    }

    public void setHoldings(List<HoldingDTO> holdings) {
        this.holdings = holdings;
    }
}
