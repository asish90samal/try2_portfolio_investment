const BASE = "http://localhost:8080/api";

function loadPortfolio() {
    const id = document.getElementById("pid").value;

    fetch(`${BASE}/analytics/portfolio?portfolioId=${id}`)
        .then(r => r.json())
        .then(d => {
            document.getElementById("portfolio").innerText =
                JSON.stringify(d, null, 2);
        });
}
