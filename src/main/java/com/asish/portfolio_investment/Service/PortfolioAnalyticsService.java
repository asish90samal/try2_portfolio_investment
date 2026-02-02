package com.asish.portfolio_investment.Service;


import com.asish.portfolio_investment.Entity.Holding;
import com.asish.portfolio_investment.Entity.Portfolio;
import com.asish.portfolio_investment.Repository.HoldingRepository;
import com.asish.portfolio_investment.Repository.PortfolioRepository;
import com.asish.portfolio_investment.dto.MarketPriceResponseDTO;
import com.asish.portfolio_investment.dto.PortfolioPnLDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PortfolioAnalyticsService {


        @Autowired
        private PortfolioRepository portfolioRepository;

        @Autowired
        private HoldingRepository holdingRepository;

        @Autowired
        private MarketDataService marketDataService;



        private final RestTemplate restTemplate = new RestTemplate();
    private static final String PYTHON_BASE = "http://localhost:5000";

    public String getPortfolioHealth(String requestJson) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity =
                new HttpEntity<>(requestJson, headers);

        return restTemplate.postForObject(
                PYTHON_BASE + "/portfolio/health",
                entity,
                String.class
        );
    }
    public String getPortfolioRisk(String requestJson) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity =
                new HttpEntity<>(requestJson, headers);

        return restTemplate.postForObject(
                PYTHON_BASE + "/portfolio/risk",
                entity,
                String.class
        );
    }
    public String whatIfInvestment(String requestJson) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity =
                new HttpEntity<>(requestJson, headers);

        return restTemplate.postForObject(
                PYTHON_BASE + "/what-if",
                entity,
                String.class
        );
    }
    public String aiChat(String requestJson) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity =
                new HttpEntity<>(requestJson, headers);

        return restTemplate.postForObject(
                PYTHON_BASE + "/portfolio/ai-chat",
                entity,
                String.class
        );
    }
    public PortfolioPnLDTO calculatePortfolioPnL(Long portfolioId) {

        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        List<Holding> holdings =
                holdingRepository.findByPortfolio(portfolio);

        double invested = 0;
        double current = 0;

        for (Holding h : holdings) {

            MarketPriceResponseDTO price =
                    marketDataService.getLivePrice(h.getSymbol());

            invested += h.getAveragePrice() * h.getQuantity();
            current += price.getPrice() * h.getQuantity();
        }

        PortfolioPnLDTO dto = new PortfolioPnLDTO();
        dto.setInvestedAmount(invested);
        dto.setCurrentValue(current);
        dto.setTotalPnL(current - invested);

        return dto;
    }
    public String getPortfolioDiversity(String requestJson) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity =
                new HttpEntity<>(requestJson, headers);

        return restTemplate.postForObject(
                PYTHON_BASE + "/portfolio/diversity",
                entity,
                String.class
        );
    }
    public String healthByPortfolioId(Long portfolioId) {

        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        List<Holding> holdings =
                holdingRepository.findByPortfolio(portfolio);

        List<Map<String, Object>> payload = holdings.stream()
                .map(h -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("symbol", h.getSymbol());
                    map.put("amount", h.getQuantity() * h.getAveragePrice());
                    return map;
                })
                .collect(Collectors.toList());


        Map<String, Object> body = Map.of("holdings", payload);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(body, headers);

        return restTemplate.postForObject(
                PYTHON_BASE + "/portfolio/health",
                entity,
                String.class
        );
    }

    public String riskByPortfolioId(Long portfolioId) {

        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        List<Holding> holdings =
                holdingRepository.findByPortfolio(portfolio);

        List<Map<String, Object>> payload = holdings.stream()
                .map(h -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("symbol", h.getSymbol());
                    map.put("amount", h.getQuantity() * h.getAveragePrice());
                    return map;
                })
                .collect(Collectors.toList());


        Map<String, Object> body = Map.of("holdings", payload);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(body, headers);

        return restTemplate.postForObject(
                PYTHON_BASE + "/portfolio/risk",
                entity,
                String.class
        );
    }
    public String diversityByPortfolioId(Long portfolioId) {

        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        List<Holding> holdings =
                holdingRepository.findByPortfolio(portfolio);

        List<Map<String, Object>> payload = holdings.stream()
                .map(h -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("symbol", h.getSymbol());
                    map.put("amount", h.getQuantity() * h.getAveragePrice());
                    return map;
                })
                .collect(Collectors.toList());

        Map<String, Object> body = Map.of("holdings", payload);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(body, headers);

        return restTemplate.postForObject(
                PYTHON_BASE + "/portfolio/diversity",
                entity,
                String.class
        );
    }
    public String aiChatByPortfolioId(Long portfolioId, String question) {

        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        List<Holding> holdings =
                holdingRepository.findByPortfolio(portfolio);

        List<Map<String, Object>> payload = holdings.stream()
                .map(h -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("symbol", h.getSymbol());
                    map.put("amount", h.getQuantity() * h.getAveragePrice());
                    return map;
                })
                .collect(Collectors.toList());


        Map<String, Object> body = Map.of(
                "question", question,
                "holdings", payload
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(body, headers);

        return restTemplate.postForObject(
                PYTHON_BASE + "/portfolio/ai-chat",
                entity,
                String.class
        );
    }












}
