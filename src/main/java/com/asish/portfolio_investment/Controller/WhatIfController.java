//package com.asish.portfolio_investment.Controller;
//
//
//import com.asish.portfolio_investment.Service.WhatIfService;
//import com.asish.portfolio_investment.dto.WhatIfRequestDTO;
//import com.asish.portfolio_investment.dto.WhatIfResponseDTO;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/what-if")
//public class WhatIfController {
//
//    @Autowired
//    private WhatIfService whatIfService;
//
//    @PostMapping
//    public WhatIfResponseDTO analyzeWhatIf(
//            @RequestParam String symbol,
//            @RequestParam double amount,
//            @RequestParam String date) {
//
//        WhatIfRequestDTO request = new WhatIfRequestDTO();
//        request.setSymbol(symbol);
//        request.setAmount(amount);
//        request.setDate(date);
//
//        return whatIfService.analyzeWhatIf(request);
//    }
//}
