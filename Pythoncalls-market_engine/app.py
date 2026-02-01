print(">>> app.py started")
print(">>> app.py started")

from dotenv import load_dotenv
load_dotenv()

from flask import Flask, request, jsonify

from analytics.what_if_service import what_if_investment
from analytics.portfolio_health_service import portfolio_health
from analytics.portfolio_risk_service import portfolio_risk
from analytics.portfolio_chatbot import portfolio_chatbot
from analytics.ai_chatbot_service import ai_portfolio_chat

from market.history_service import get_history

from flask import Flask, request, jsonify
from market.price_service import get_live_price
from market.indices_service import get_all_indices, get_index_detail

app = Flask(__name__)


@app.route("/market/live", methods=["GET"])
def live_market_price():
    symbol = request.args.get("symbol")

    if not symbol:
        return jsonify({"error": "symbol is required"}), 400

    try:
        return jsonify(get_live_price(symbol))
    except Exception as e:
        return jsonify({
            "error": "Market data fetch failed",
            "message": str(e)
        }), 500


# 🔽🔽🔽 ADD THESE ROUTES HERE 🔽🔽🔽

@app.route("/indices", methods=["GET"])
def indices():
    return jsonify(get_all_indices())


@app.route("/indices/<index_name>", methods=["GET"])
def index_detail(index_name):
    try:
        return jsonify(get_index_detail(index_name))
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/market/history", methods=["GET"])
def market_history():
    symbol = request.args.get("symbol")
    range_key = request.args.get("range", "1M")

    if not symbol:
        return jsonify({"error": "symbol is required"}), 400

    try:
        return jsonify(get_history(symbol, range_key))
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/what-if", methods=["POST"])
def what_if():
    data = request.get_json()

    if not data:
        return jsonify({"error": "JSON body required"}), 400

    try:
        symbol = data["symbol"]
        amount = float(data["amount"])
        date = data["date"]

        return jsonify(what_if_investment(symbol, amount, date))
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/portfolio/health", methods=["POST"])
def portfolio_health_api():
    data = request.get_json()

    if not data or "holdings" not in data:
        return jsonify({"error": "holdings required"}), 400

    try:
        return jsonify(portfolio_health(data["holdings"]))
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/portfolio/risk", methods=["POST"])
def portfolio_risk_api():
    data = request.get_json()

    if not data or "holdings" not in data:
        return jsonify({"error": "holdings required"}), 400

    try:
        return jsonify(portfolio_risk(data["holdings"]))
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/portfolio/chat", methods=["POST"])
def portfolio_chat():
    data = request.get_json()

    if not data or "question" not in data or "holdings" not in data:
        return jsonify({"error": "question and holdings required"}), 400

    try:
        return jsonify(
            portfolio_chatbot(
                data["question"],
                data["holdings"]
            )
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/portfolio/ai-chat", methods=["POST"])
def ai_chat():
    data = request.get_json()

    if not data or "question" not in data or "holdings" not in data:
        return jsonify({"error": "question and holdings required"}), 400

    try:
        return jsonify(
            ai_portfolio_chat(
                data["question"],
                data["holdings"]
            )
        )
    except RuntimeError as e:
        # Likely raised when OPENAI_API_KEY is not set in the environment
        return jsonify({
            "error": "OpenAI API key missing",
            "message": str(e),
            "hint": "Set OPENAI_API_KEY in your environment or .env file"
        }), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def risk_label(score):
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

def health_label(score):
    if score >= 80:
        return "EXCELLENT"
    elif score >= 60:
        return "GOOD"
    elif score >= 40:
        return "AVERAGE"
    else:
        return "POOR"

from analytics.performance_service import portfolio_performance

@app.route("/portfolio/performance", methods=["POST"])
def portfolio_performance_api():
    data = request.get_json()

    return jsonify(
        portfolio_performance(
            data["holdings"],
            data.get("range", "1M")
        )
    )

from analytics.diversity_service import diversity_report

@app.route("/portfolio/diversity", methods=["POST"])
def portfolio_diversity():
    data = request.get_json()
    return jsonify(diversity_report(data["holdings"]))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
