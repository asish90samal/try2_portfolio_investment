from market.yahoo_service import fetch_live_price

# Mapping for frontend-friendly names
INDICES = {
    "NIFTY50": "^NSEI",
    "SENSEX": "^BSESN"
}


def get_all_indices() -> list:
    """
    Get live data for all supported indices
    """
    results = []

    for name, symbol in INDICES.items():
        try:
            data = fetch_live_price(symbol)
            data["name"] = name
            results.append(data)
        except Exception as e:
            results.append({
                "name": name,
                "symbol": symbol,
                "error": str(e)
            })

    return results


def get_index_detail(index_name: str) -> dict:
    """
    Get live data for a single index
    """
    index_name = index_name.upper()

    if index_name not in INDICES:
        raise Exception("Index not supported")

    symbol = INDICES[index_name]
    data = fetch_live_price(symbol)
    data["name"] = index_name

    return data
