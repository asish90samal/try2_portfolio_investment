import yfinance as yf
from datetime import datetime


def fetch_live_price(symbol: str) -> dict:
    """
    Fetch live market price from Yahoo Finance
    Robust version with fallback
    """
    ticker = yf.Ticker(symbol)

    price = None
    previous_close = None

    # ✅ Try fast_info first
    try:
        info = ticker.fast_info
        price = info.get("lastPrice")
        previous_close = info.get("previousClose")
    except Exception:
        pass

    # ✅ Fallback to history if fast_info fails
    if price is None:
        hist = ticker.history(period="2d")

        if hist.empty:
            raise Exception("Yahoo data not available")

        price = hist["Close"].iloc[-1]
        previous_close = hist["Close"].iloc[-2] if len(hist) > 1 else price

    change = price - previous_close
    change_percent = (change / previous_close) * 100 if previous_close else 0

    return {
        "symbol": symbol,
        "price": round(float(price), 2),
        "change": round(float(change), 2),
        "changePercent": round(float(change_percent), 2),
        "source": "yahoo",
        "timestamp": datetime.utcnow().isoformat()
    }
