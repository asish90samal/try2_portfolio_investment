def diversity_report(holdings):
    total = sum(h["amount"] for h in holdings)
    symbols = len(holdings)

    weights = [(h["amount"] / total) for h in holdings]

    # Herfindahl Index (lower = more diversified)
    hhi = sum(w * w for w in weights)

    diversity_score = round((1 - hhi) * 100, 2)

    if diversity_score >= 80:
        label = "VERY WELL DIVERSIFIED"
        recommendation = (
            "Your portfolio is well diversified across assets. "
            "This provides strong stability and lowers downside risk."
        )
    elif diversity_score >= 60:
        label = "MODERATELY DIVERSIFIED"
        recommendation = (
            "Portfolio has decent diversification. "
            "Consider adding exposure to new sectors for better stability."
        )
    elif diversity_score >= 40:
        label = "LOW DIVERSIFICATION"
        recommendation = (
            "Portfolio is concentrated in few assets. "
            "Adding different sectors or asset classes is recommended."
        )
    else:
        label = "HIGHLY CONCENTRATED"
        recommendation = (
            "Portfolio is highly risky due to concentration. "
            "Strongly consider diversifying across sectors and instruments."
        )

    return {
        "diversityScore": diversity_score,
        "label": label,
        "numberOfHoldings": symbols,
        "recommendation": recommendation
    }
