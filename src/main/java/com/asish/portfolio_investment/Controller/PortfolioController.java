package com.asish.portfolio_investment.Controller;



import com.asish.portfolio_investment.Entity.Portfolio;
import com.asish.portfolio_investment.Service.PortfolioService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolio")
@CrossOrigin
public class PortfolioController {

    private final PortfolioService service;

    public PortfolioController(PortfolioService service) {
        this.service = service;
    }

    @PostMapping("/create")
    public Portfolio create(
            @RequestParam String name,
            @RequestParam double balance) {
        return service.createPortfolio(name, balance);
    }

    @GetMapping("/all")
    public List<Portfolio> all() {
        return service.getAll();
    }
}
