//package com.asish.portfolio_investment.Service;
//
//
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestTemplate;
//import org.springframework.web.util.UriComponentsBuilder;
//
//@Service
//public class PythonMarketClient {
//
//    private final RestTemplate restTemplate = new RestTemplate();
//    private static final String PYTHON_BASE_URL = "http://localhost:5000";
//
//    public String getLivePrice(String symbol) {
//        String url = UriComponentsBuilder
//                .fromUriString(PYTHON_BASE_URL + "/market/live")
//                .queryParam("symbol", symbol)
//                .toUriString();
//
//        return restTemplate.getForObject(url, String.class);
//    }
//
//    public String getIndices() {
//        return restTemplate.getForObject(
//                PYTHON_BASE_URL + "/indices",
//                String.class
//        );
//    }
//
//    public String getHistory(String symbol, String range) {
//        String url = UriComponentsBuilder
//                .fromUriString(PYTHON_BASE_URL + "/market/history")
//                .queryParam("symbol", symbol)
//                .queryParam("range", range)
//                .toUriString();
//
//        return restTemplate.getForObject(url, String.class);
//    }
//
//    public String whatIfInvestment(String requestBodyJson) {
//        return restTemplate.postForObject(
//                PYTHON_BASE_URL + "/what-if",
//                requestBodyJson,
//                String.class
//        );
//    }
//}
