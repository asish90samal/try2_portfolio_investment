package com.asish.portfolio_investment.Controller;



import com.asish.portfolio_investment.Service.MarketDataService;
import com.asish.portfolio_investment.dto.MarketPriceResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/market")
public class MarketController {

    @Autowired
    private MarketDataService marketDataService;

    @GetMapping("/live")
    public ResponseEntity<MarketPriceResponseDTO> getLiveMarketPrice(
            @RequestParam String symbol) {

        MarketPriceResponseDTO response =
                marketDataService.getLivePrice(symbol);

        return ResponseEntity.ok(response);
    }
}
