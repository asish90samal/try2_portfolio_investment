package com.asish.portfolio_investment.Controller;


import com.asish.portfolio_investment.Service.WhatIfService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/whatif")
@CrossOrigin
public class WhatIfController {

    private final WhatIfService service;

    public WhatIfController(WhatIfService service) {
        this.service = service;
    }

    @GetMapping("/investment")
    public Map<String, Object> whatIf(
            @RequestParam String symbol,
            @RequestParam double amount,
            @RequestParam String range) {

        return service.whatIfInvestment(symbol, amount, range);
    }
}
