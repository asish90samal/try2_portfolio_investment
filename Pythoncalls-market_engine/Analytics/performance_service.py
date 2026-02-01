import yfinance as yf
from datetime import datetime

def portfolio_performance(holdings, range_key="1M"):
    RANGE_MAP = {
        "1M": "1mo",
        "3M": "3mo",
        "6M": "6mo",
        "1Y": "1y"
    }

    period = RANGE_MAP.get(range_key, "1mo")

    history_map = {}

    for h in holdings:
        symbol = h["symbol"]
        qty = h["quantity"]

        ticker = yf.Ticker(symbol)
        hist = ticker.history(period=period)

        if hist.empty:
            continue

        for date, row in hist.iterrows():
            day = date.strftime("%Y-%m-%d")
            value = row["Close"] * qty
            history_map[day] = history_map.get(day, 0) + value

    points = [
        {"date": d, "value": round(v, 2)}
        for d, v in sorted(history_map.items())
    ]

    return {
        "range": range_key,
        "points": points
    }
