import numpy as np
from market.history_service import get_history


def portfolio_health(holdings: list) -> dict:
    """
    Calculate portfolio health score (0–100)
    """

    if not holdings or len(holdings) == 0:
        raise Exception("Holdings required")

    returns = []
    weights = []

    total_amount = sum(h["amount"] for h in holdings)

    for h in holdings:
        symbol = h["symbol"]
        amount = h["amount"]

        history = get_history(symbol, "6M")
        prices = [p["close"] for p in history["prices"]]

        # daily returns
        daily_returns = np.diff(prices) / prices[:-1]
        avg_return = np.mean(daily_returns)
        volatility = np.std(daily_returns)

        returns.append(avg_return)
        weights.append(amount / total_amount)

    portfolio_return = np.dot(returns, weights)
    portfolio_risk = np.sqrt(np.dot(np.square(weights), np.square(returns)))

    diversification_score = min(len(holdings) * 10, 40)  # max 40
    return_score = min(portfolio_return * 1000, 30)      # max 30
    risk_penalty = min(portfolio_risk * 1000, 30)        # max 30

    health_score = diversification_score + return_score - risk_penalty
    health_score = max(0, min(100, round(health_score, 2)))

    return {
        "healthScore": health_score,
        "diversificationScore": round(diversification_score, 2),
        "returnScore": round(return_score, 2),
        "riskPenalty": round(risk_penalty, 2)
    }
