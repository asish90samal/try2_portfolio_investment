import numpy as np
from market.history_service import get_history

# analytics/portfolio_risk_service.py

import math


def risk_label(score: int) -> str:
    if score <= 20:
        return "VERY LOW RISK"
    elif score <= 40:
        return "LOW RISK"
    elif score <= 60:
        return "MEDIUM RISK"
    elif score <= 80:
        return "HIGH RISK"
    else:
        return "VERY HIGH RISK"


def portfolio_risk(holdings: list) -> dict:
    """
    holdings example:
    [
        { "symbol": "TCS", "amount": 20000 },
        { "symbol": "INFY", "amount": 15000 }
    ]
    """

    if not holdings:
        return {
            "riskScore": 0,
            "riskLevel": "VERY LOW RISK",
            "annualVolatility": 0.0,
            "maxDrawdownPercent": 0.0,
            "valueAtRisk95Percent": 0.0
        }

    total_amount = sum(h["amount"] for h in holdings)
    weights = [h["amount"] / total_amount for h in holdings]

    # 
    # ------------------------------------------------------------------
    # Large-cap assumed less volatile, others more volatile
    large_caps = {"TCS", "INFY", "RELIANCE", "HDFCBANK", "ICICIBANK"}

    stock_vols = []
    for h in holdings:
        if h["symbol"].upper() in large_caps:
            stock_vols.append(0.18)   # 18% annual volatility
        else:
            stock_vols.append(0.30)   # 30% annual volatility

    volatility = math.sqrt(
        sum((weights[i] * stock_vols[i]) ** 2 for i in range(len(weights)))
    )

    # ------------------------------------------------------------------
    # =
    # High volatility → higher drawdown
    if volatility < 0.15:
        max_drawdown = 0.10
    elif volatility < 0.25:
        max_drawdown = 0.20
    else:
        max_drawdown = 0.35

    # 
    # 
    # Z-score for 95% confidence ≈ 1.65
    var_95 = 1.65 * volatility

    # 
    # 
    diversification_score = min(len(holdings) * 6, 30)

    max_allocation_percent = max(
        (h["amount"] / total_amount) * 100 for h in holdings
    )

    if max_allocation_percent > 40:
        concentration_score = 30
    elif max_allocation_percent > 25:
        concentration_score = 20
    else:
        concentration_score = 10

    volatility_score = min(int(volatility * 100), 20)

    risk_score = 100 - (
        diversification_score
        + concentration_score
        + volatility_score
    )

    risk_score = max(0, min(100, int(risk_score)))

    # 
    # 
    return {
        "riskScore": risk_score,
        "riskLevel": risk_label(risk_score),
        "annualVolatility": round(volatility * 100, 2),
        "maxDrawdownPercent": round(max_drawdown * 100, 2),
        "valueAtRisk95Percent": round(var_95 * 100, 2)
    }
