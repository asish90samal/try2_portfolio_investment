package com.asish.portfolio_investment.Controller;


import com.asish.portfolio_investment.Service.PortfolioAnalyticsService;
import com.asish.portfolio_investment.dto.AIChatRequestDTO;
import com.asish.portfolio_investment.dto.PortfolioHealthRequestDTO;
import com.asish.portfolio_investment.dto.PortfolioPnLDTO;
import com.asish.portfolio_investment.dto.WhatIfRequestDTO;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.util.JSONPObject;

import java.util.Map;

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
    @GetMapping("/{id}/pnl")
    public PortfolioPnLDTO getPortfolioPnL(@PathVariable Long id) {
        return service.calculatePortfolioPnL(id);
    }
    @PostMapping(
            value = "/diversity",
            consumes = "application/json",
            produces = "application/json"
    )
    public String portfolioDiversity(
            @RequestBody String requestJson) {

        return service.getPortfolioDiversity(requestJson);
    }
    @PostMapping("/{portfolioId}/health")
    public String healthByPortfolio(@PathVariable Long portfolioId) {
        return service.healthByPortfolioId(portfolioId);
    }

    @PostMapping("/{portfolioId}/risk")
    public String riskByPortfolio(@PathVariable Long portfolioId) {
        return service.riskByPortfolioId(portfolioId);
    }
    @GetMapping("/diversity/csv/{portfolioId}")
    public ResponseEntity<String> downloadDiversityCSV(
            @PathVariable Long portfolioId) throws Exception {

        String json = service.diversityByPortfolioId(portfolioId);

        ObjectMapper mapper = new ObjectMapper();
        JsonNode obj = mapper.readTree(json);

        StringBuilder csv = new StringBuilder();
        csv.append("Metric,Value\n");
        csv.append("Diversity Score,")
                .append(obj.get("diversityScore").asDouble())
                .append("\n");
        csv.append("Label,")
                .append(obj.get("label").asText())
                .append("\n");
        csv.append("Number Of Holdings,")
                .append(obj.get("numberOfHoldings").asInt())
                .append("\n");
        csv.append("Recommendation,\"")
                .append(obj.get("recommendation").asText())
                .append("\"\n");

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=diversity_report.csv")
                .contentType(MediaType.TEXT_PLAIN)
                .body(csv.toString());
    }

    @PostMapping("/{portfolioId}/ai-chat")
    public String aiChatByPortfolio(
            @PathVariable Long portfolioId,
            @RequestBody Map<String, String> body) {

        String question = body.get("question");

        if (question == null || question.isBlank()) {
            throw new RuntimeException("Question is required");
        }

        return service.aiChatByPortfolioId(portfolioId, question);
    }








}
