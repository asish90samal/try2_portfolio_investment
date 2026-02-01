import requests
from datetime import datetime

ALPHA_API_KEY = "TEEJX7Z8R6SOHC7M"  # replace later with real key


def fetch_live_price_alpha(symbol: str) -> dict:
    """
    Fetch live price from Alpha Vantage
    """
    symbol = symbol.replace(".NS", "")

    url = "https://www.alphavantage.co/query"
    params = {
        "function": "GLOBAL_QUOTE",
        "symbol": symbol,
        "apikey": ALPHA_API_KEY
    }

    response = requests.get(url, params=params, timeout=10)
    data = response.json()

    if "Global Quote" not in data or not data["Global Quote"]:
        raise Exception("Alpha Vantage data not available")

    quote = data["Global Quote"]

    price = float(quote["05. price"])
    previous_close = float(quote["08. previous close"])

    change = price - previous_close
    change_percent = (change / previous_close) * 100 if previous_close else 0

    return {
        "symbol": symbol,
        "price": round(price, 2),
        "change": round(change, 2),
        "changePercent": round(change_percent, 2),
        "source": "alpha_vantage",
        "timestamp": datetime.utcnow().isoformat()
    }
