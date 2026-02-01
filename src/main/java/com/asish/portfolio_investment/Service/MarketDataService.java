
package com.asish.portfolio_investment.Service;



import com.asish.portfolio_investment.dto.MarketPriceResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
public class MarketDataService {

    private static final String PYTHON_BASE_URL = "http://localhost:5000";

    @Autowired
    private RestTemplate restTemplate;

    /**
     * Fetch live price for stock / index from Python service
     */
    public MarketPriceResponseDTO getLivePrice(String symbol) {
        try {
            String url = PYTHON_BASE_URL + "/market/live?symbol=" + symbol;
            return restTemplate.getForObject(url, MarketPriceResponseDTO.class);
        } catch (RestClientException ex) {
            throw new RuntimeException("Live market data service unavailable");
        }
    }
}
