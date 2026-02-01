//package com.asish.portfolio_investment.Controller;
//
//
//import com.asish.portfolio_investment.Service.PaymentService;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/payment")
//@CrossOrigin
//public class PaymentController {
//
//    private final PaymentService paymentService;
//
//    public PaymentController(PaymentService paymentService) {
//        this.paymentService = paymentService;
//    }
//
//    @PostMapping("/add")
//    public String addFunds(@RequestParam double amount) {
//        double balance = paymentService.addFunds(amount);
//        return "Payment successful. Wallet balance: " + balance;
//    }
//
//    @GetMapping("/balance")
//    public double balance() {
//        return paymentService.getBalance();
//    }
//}
