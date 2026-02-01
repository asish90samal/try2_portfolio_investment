package com.asish.portfolio_investment.dto;


import java.util.List;

public class AIChatRequestDTO {

    private String question;
    private List<HoldingDTO> holdings;

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public List<HoldingDTO> getHoldings() {
        return holdings;
    }

    public void setHoldings(List<HoldingDTO> holdings) {
        this.holdings = holdings;
    }
}
