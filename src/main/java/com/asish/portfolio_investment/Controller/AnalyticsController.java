//package com.asish.portfolio_investment.Controller;
//
//
//
//import com.asish.portfolio_investment.Service.AnalyticsService;
//import com.asish.portfolio_investment.dto.PortfolioAnalyticsRequestDTO;
//import com.asish.portfolio_investment.dto.PortfolioAnalyticsResponseDTO;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Collections;
//
//@RestController
//@RequestMapping("/api/analytics")
//public class AnalyticsController {
//
//    @Autowired
//    private AnalyticsService analyticsService;
//
//    @GetMapping("/portfolio/{portfolioId}")
//    public PortfolioAnalyticsResponseDTO getPortfolioAnalytics(
//            @PathVariable Long portfolioId) {
//
//        PortfolioAnalyticsRequestDTO request = new PortfolioAnalyticsRequestDTO();
//        request.setPortfolioId(portfolioId);
//
//        // symbols can be empty for now; Python can fetch from DB later
//        request.setSymbols(Collections.emptyList());
//
//        return analyticsService.analyzePortfolio(request);
//    }
//}
