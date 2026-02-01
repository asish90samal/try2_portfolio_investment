from market.yahoo_service import fetch_live_price
from market.alpha_service import fetch_live_price_alpha

def normalize_symbol(symbol: str) -> str:
    symbol = symbol.upper()

    # If symbol already has exchange suffix
    if "." in symbol or symbol.startswith("^"):
        return symbol

    # Known US stocks (extendable list)
    us_stocks = {"AAPL", "GOOGL", "MSFT", "AMZN", "META", "TSLA", "NFLX"}

    if symbol in us_stocks:
        return symbol

    # Default to NSE
    return symbol + ".NS"


def get_live_price(symbol: str) -> dict:
    symbol = normalize_symbol(symbol)

    # 1️⃣ Try Yahoo
    try:
        return fetch_live_price(symbol)
    except Exception as yahoo_error:
        print("Yahoo failed:", yahoo_error)

    # 2️⃣ Fallback to Alpha Vantage
    return fetch_live_price_alpha(symbol)
