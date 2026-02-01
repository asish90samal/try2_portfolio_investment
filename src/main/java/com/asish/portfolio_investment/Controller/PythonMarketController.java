//package com.asish.portfolio_investment.Controller;
//
//
//import com.asish.portfolio_investment.Service.PythonMarketClient;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/python-market")
//public class PythonMarketController {
//
//    private final PythonMarketClient client;
//
//    public PythonMarketController(PythonMarketClient client) {
//        this.client = client;
//    }
//
//    @GetMapping("/live")
//    public String livePrice(@RequestParam String symbol) {
//        return client.getLivePrice(symbol);
//    }
//
//    @GetMapping("/indices")
//    public String indices() {
//        return client.getIndices();
//    }
//
//    @GetMapping("/history")
//    public String history(
//            @RequestParam String symbol,
//            @RequestParam String range) {
//        return client.getHistory(symbol, range);
//    }
//
//    @PostMapping("/what-if")
//    public String whatIf(@RequestBody String body) {
//        return client.whatIfInvestment(body);
//    }
//}
