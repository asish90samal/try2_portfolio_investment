package com.asish.portfolio_investment.Controller;



import com.asish.portfolio_investment.Entity.Trade;
import com.asish.portfolio_investment.Service.TradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trades")
public class TradeController {

    @Autowired
    private TradeService tradeService;

    @PostMapping("/buy")
    public Trade buyAsset(
            @RequestParam Long portfolioId,
            @RequestParam String symbol,
            @RequestParam int quantity) {

        return tradeService.buyAsset(portfolioId, symbol, quantity);
    }
}
