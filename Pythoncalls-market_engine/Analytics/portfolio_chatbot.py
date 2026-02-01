from analytics.portfolio_health_service import portfolio_health
from analytics.portfolio_risk_service import portfolio_risk


def portfolio_chatbot(question: str, holdings: list) -> dict:
    """
    Rule-based AI portfolio chatbot
    """
    question = question.lower()

    health = portfolio_health(holdings)
    risk = portfolio_risk(holdings)

    response = ""

    if "risk" in question:
        response = (
            f"Your portfolio volatility is {risk['annualVolatility']}%. "
            f"Maximum drawdown observed is {risk['maxDrawdownPercent']}%. "
            "Consider diversifying if risk feels high."
        )

    elif "health" in question or "score" in question:
        response = (
            f"Your portfolio health score is {health['healthScore']}/100. "
            "A score above 70 is considered good."
        )

    elif "diversify" in question or "add" in question:
        if len(holdings) < 4:
            response = (
                "Your portfolio has limited diversification. "
                "Adding stocks from different sectors can reduce risk."
            )
        else:
            response = (
                "Your portfolio is reasonably diversified. "
                "Focus on maintaining balance."
            )

    elif "buy" in question or "sell" in question:
        response = (
            "This platform provides analysis, not direct buy/sell advice. "
            "Use risk and health metrics before making decisions."
        )

    else:
        response = (
            "I can help analyze portfolio health, risk, and diversification. "
            "Try asking about risk, health score, or diversification."
        )

    return {
        "question": question,
        "answer": response,
        "healthScore": health["healthScore"],
        "riskSummary": risk
    }
