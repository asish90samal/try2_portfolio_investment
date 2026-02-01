package com.asish.portfolio_investment.Service;


import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PortfolioAnalyticsService {

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





}
