import yfinance as yf
from datetime import datetime
from market.history_service import normalize_symbol


def what_if_investment(symbol: str, amount: float, date: str) -> dict:
    """
    What-if investment analysis
    """
    symbol = normalize_symbol(symbol)

    try:
        invest_date = datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise Exception("Date must be in YYYY-MM-DD format")

    ticker = yf.Ticker(symbol)

    # Fetch historical data from invest date till now
    hist = ticker.history(start=invest_date.strftime("%Y-%m-%d"))

    if hist.empty:
        raise Exception("No historical data available for given date")

    buy_price = float(hist["Close"].iloc[0])
    current_price = float(hist["Close"].iloc[-1])

    units = amount / buy_price
    current_value = units * current_price

    profit_loss = current_value - amount
    profit_percent = (profit_loss / amount) * 100 if amount else 0

    return {
        "symbol": symbol,
        "investedAmount": round(amount, 2),
        "investmentDate": date,
        "buyPrice": round(buy_price, 2),
        "currentPrice": round(current_price, 2),
        "unitsBought": round(units, 4),
        "currentValue": round(current_value, 2),
        "profitLoss": round(profit_loss, 2),
        "profitPercent": round(profit_percent, 2),
        "timestamp": datetime.utcnow().isoformat()
    }
