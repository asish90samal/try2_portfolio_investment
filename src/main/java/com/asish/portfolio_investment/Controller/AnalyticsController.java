package com.asish.portfolio_investment.Controller;



import com.asish.portfolio_investment.Service.AnalyticsService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin
public class AnalyticsController {

    private final AnalyticsService service;

    public AnalyticsController(AnalyticsService service) {
        this.service = service;
    }

    @GetMapping("/portfolio")
    public Map<String, Object> portfolioAnalytics(
            @RequestParam Long portfolioId) {
        return service.portfolioSummary(portfolioId);
    }
}
