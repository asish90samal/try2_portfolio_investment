import requests
from analytics.portfolio_health_service import portfolio_health
from analytics.portfolio_risk_service import portfolio_risk


OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "phi3"


def ai_portfolio_chat(question: str, holdings: list) -> dict:
    health = portfolio_health(holdings)
    risk = portfolio_risk(holdings)

    prompt = f"""
You are a professional financial assistant.

Portfolio health score: {health['healthScore']}
Annual volatility: {risk['annualVolatility']}%
Max drawdown: {risk['maxDrawdownPercent']}%
Value at Risk (95%): {risk['valueAtRisk95Percent']}%

User question:
{question}

Give educational, responsible advice.
Do NOT give buy/sell commands.
"""

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL,
            "prompt": prompt,
            "stream": False
        },
        timeout=300
    )

    result = response.json()

    return {
        "question": question,
        "answer": result.get("response", "").strip(),
        "healthScore": health["healthScore"],
        "risk": risk,
        "llm": "ollama"
    }
