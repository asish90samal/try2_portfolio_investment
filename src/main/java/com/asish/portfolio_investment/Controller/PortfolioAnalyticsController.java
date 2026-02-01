package com.asish.portfolio_investment.Controller;


import com.asish.portfolio_investment.Service.PortfolioAnalyticsService;
import com.asish.portfolio_investment.dto.AIChatRequestDTO;
import com.asish.portfolio_investment.dto.PortfolioHealthRequestDTO;
import com.asish.portfolio_investment.dto.WhatIfRequestDTO;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioAnalyticsController {

    private final PortfolioAnalyticsService service;
    private final tools.jackson.databind.ObjectMapper mapper = new ObjectMapper();

    public PortfolioAnalyticsController(PortfolioAnalyticsService service) {
        this.service = service;
    }

    @PostMapping("/health")
    public String portfolioHealth(
            @RequestBody PortfolioHealthRequestDTO request) throws Exception {

        String json = mapper.writeValueAsString(request);
        return service.getPortfolioHealth(json);
    }
    @PostMapping(
            value = "/risk",
            consumes = "application/json",
            produces = "application/json"
    )
    public String portfolioRisk(
            @RequestBody PortfolioHealthRequestDTO request) throws Exception {

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(request);

        return service.getPortfolioRisk(json);
    }
    @PostMapping(
            value = "/what-if",
            consumes = "application/json",
            produces = "application/json"
    )
    public String whatIf(
            @RequestBody WhatIfRequestDTO request) throws Exception {

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(request);

        return service.whatIfInvestment(json);
    }
    @PostMapping(
            value = "/ai-chat",
            consumes = "application/json",
            produces = "application/json"
    )
    public String aiChat(
            @RequestBody AIChatRequestDTO request) throws Exception {

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(request);

        return service.aiChat(json);
    }




}
