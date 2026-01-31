package com.asish.portfolio_investment.Controller;



import com.asish.portfolio_investment.Service.MarketDataService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/market")
@CrossOrigin
public class MarketController {

    private final MarketDataService marketDataService;

    public MarketController(MarketDataService marketDataService) {
        this.marketDataService = marketDataService;
    }

    /* ================= LIVE PRICE ================= */
    @GetMapping("/price")
    public Map<String, Object> getLivePrice(
            @RequestParam String symbol) {
        return marketDataService.getLivePrice(symbol);
    }

    /* ================= INDICES ================= */
    @GetMapping("/indices")
    public List<Map<String, Object>> getIndices() {
        return marketDataService.getIndices();
    }

    /* ================= HISTORICAL CHART ================= */
    @GetMapping("/history")
    public List<Map<String, Object>> getHistory(
            @RequestParam String symbol,
            @RequestParam String range) {
        return marketDataService.getHistory(symbol, range);
    }
}
