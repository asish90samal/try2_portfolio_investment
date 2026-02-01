//package com.asish.portfolio_investment.Service;
//
//
//import com.asish.portfolio_investment.dto.WhatIfRequestDTO;
//import com.asish.portfolio_investment.dto.WhatIfResponseDTO;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestTemplate;
//
//@Service
//public class WhatIfService {
//
//    private static final String PYTHON_BASE_URL = "http://localhost:5000";
//
//    @Autowired
//    private RestTemplate restTemplate;
//
//    public WhatIfResponseDTO analyzeWhatIf(WhatIfRequestDTO request) {
//
//        String url = PYTHON_BASE_URL + "/what-if";
//
//        return restTemplate.postForObject(
//                url,
//                request,
//                WhatIfResponseDTO.class
//        );
//    }
//}
