
package com.asish.portfolio_investment.Service;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@SuppressWarnings("unchecked")
@Service
public class MarketDataService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${alphavantage.api.key}")
    private String alphaKey;

    // ================= CACHE =================
    private static class CacheItem {
        Object data;
        long expiry;
    }

    private final Map<String, CacheItem> cache = new ConcurrentHashMap<>();

    private Object getFromCache(String key) {
        CacheItem item = cache.get(key);
        if (item != null && item.expiry > Instant.now().getEpochSecond()) {
            return item.data;
        }
        return null;
    }

    private void putInCache(String key, Object data, int ttlSeconds) {
        CacheItem item = new CacheItem();
        item.data = data;
        item.expiry = Instant.now().getEpochSecond() + ttlSeconds;
        cache.put(key, item);
    }

    // ================= LIVE PRICE =================
    public Map<String, Object> getLivePrice(String symbol) {

        String cacheKey = "LIVE_" + symbol;
        Object cached = getFromCache(cacheKey);
        if (cached != null) return (Map<String, Object>) cached;

        try {
            // 1️⃣ Alpha Vantage (PRIMARY)
            String url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE"
                    + "&symbol=" + symbol.replace(".NS", "")
                    + "&apikey=" + alphaKey;

            Map res = restTemplate.getForObject(url, Map.class);
            Map quote = (Map) res.get("Global Quote");

            double price = Double.parseDouble(
                    quote.get("05. price").toString());

            Map<String, Object> result = Map.of(
                    "symbol", symbol,
                    "price", price,
                    "source", "ALPHA_VANTAGE"
            );

            putInCache(cacheKey, result, 60);
            return result;

        } catch (Exception e) {
            // 2️⃣ Yahoo fallback
            return yahooLivePrice(symbol);
        }
    }

    private Map<String, Object> yahooLivePrice(String symbol) {
        String url = "https://query1.finance.yahoo.com/v7/finance/quote?symbols=" + symbol;
        Map res = restTemplate.getForObject(url, Map.class);

        Map quote = (Map) ((List)
                ((Map) res.get("quoteResponse"))
                        .get("result")).get(0);

        double price = Double.parseDouble(
                quote.get("regularMarketPrice").toString());

        return Map.of(
                "symbol", symbol,
                "price", price,
                "source", "YAHOO_FALLBACK"
        );
    }
    public List<Map<String, Object>> getHistory(String symbol, String range) {
        // range ignored for Alpha Vantage free tier
        // kept only for backward compatibility
        return getHistory(symbol);
    }
public List<Map<String, Object>> getIndices() {

    List<Map<String, Object>> indices = new ArrayList<>();

    indices.add(Map.of(
            "name", "NIFTY 50",
            "value", 25320.65,
            "change", -98.25,
            "percent", -0.39
    ));

    indices.add(Map.of(
            "name", "SENSEX",
            "value", 82269.78,
            "change", -296.59,
            "percent", -0.36
    ));

    return indices;
}



//     ================= HISTORICAL DATA =================
    public List<Map<String, Object>> getHistory(String symbol) {

        String cacheKey = "HIST_" + symbol;
        Object cached = getFromCache(cacheKey);
        if (cached != null) return (List<Map<String, Object>>) cached;

        String url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY"
                + "&symbol=" + symbol.replace(".NS", "")
                + "&apikey=" + alphaKey;

        Map res = restTemplate.getForObject(url, Map.class);
        Map series = (Map) res.get("Time Series (Daily)");

        List<Map<String, Object>> data = new ArrayList<>();

        for (Object date : series.keySet()) {
            Map d = (Map) series.get(date);
            data.add(Map.of(
                    "date", date,
                    "close", Double.parseDouble(d.get("4. close").toString())
            ));
        }

        data.sort(Comparator.comparing(m -> m.get("date").toString()));
        putInCache(cacheKey, data, 300);

        return data;
    }
}
