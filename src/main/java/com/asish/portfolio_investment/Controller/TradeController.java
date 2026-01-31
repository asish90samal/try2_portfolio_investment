package com.asish.portfolio_investment.Controller;



import com.asish.portfolio_investment.Service.TradeService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trade")
@CrossOrigin
public class TradeController {

    private final TradeService service;

    public TradeController(TradeService service) {
        this.service = service;
    }

    @PostMapping("/buy")
    public String buy(
            @RequestParam Long portfolioId,
            @RequestParam String symbol,
            @RequestParam int qty) {
        return service.buyStock(portfolioId, symbol, qty);
    }
}
