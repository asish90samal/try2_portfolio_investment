import yfinance as yf
from datetime import datetime

RANGE_MAP = {
    "1D": "1d",
    "5D": "5d",
    "1M": "1mo",
    "3M": "3mo",
    "6M": "6mo",
    "1Y": "1y",
    "5Y": "5y"
}

def normalize_symbol(symbol: str) -> str:
    symbol = symbol.upper()

    if "." in symbol or symbol.startswith("^"):
        return symbol

    us_stocks = {"AAPL", "GOOGL", "MSFT", "AMZN", "META", "TSLA", "NFLX"}

    if symbol in us_stocks:
        return symbol

    return symbol + ".NS"

def get_history(symbol: str, range_key: str) -> dict:
    range_key = range_key.upper()

    if range_key not in RANGE_MAP:
        raise Exception("Invalid range")

    symbol = normalize_symbol(symbol)
    period = RANGE_MAP[range_key]

    ticker = yf.Ticker(symbol)
    hist = ticker.history(period=period, interval="1d")

    if hist.empty:
        raise Exception("No historical data found")

    prices = []
    for date, row in hist.iterrows():
        prices.append({
            "date": date.strftime("%Y-%m-%d"),
            "close": round(float(row["Close"]), 2)
        })

    return {
        "symbol": symbol,
        "range": range_key,
        "prices": prices,
        "source": "yahoo",
        "timestamp": datetime.utcnow().isoformat()
    }
