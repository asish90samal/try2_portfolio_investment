//package com.asish.portfolio_investment.Service;
//
//
//import com.asish.portfolio_investment.dto.PortfolioAnalyticsRequestDTO;
//import com.asish.portfolio_investment.dto.PortfolioAnalyticsResponseDTO;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestTemplate;
//
//@Service
//public class AnalyticsService {
//
//    private static final String PYTHON_BASE_URL = "http://localhost:5000";
//
//    @Autowired
//    private RestTemplate restTemplate;
//
//    public PortfolioAnalyticsResponseDTO analyzePortfolio(
//            PortfolioAnalyticsRequestDTO request) {
//
//        String url = PYTHON_BASE_URL + "/analyze-portfolio";
//
//        return restTemplate.postForObject(
//                url,
//                request,
//                PortfolioAnalyticsResponseDTO.class
//        );
//    }
//}
