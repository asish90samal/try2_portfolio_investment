const BASE = "http://localhost:8080/api";
const params = new URLSearchParams(window.location.search);
const symbol = params.get("symbol");

document.getElementById("title").innerText = symbol;

function loadPrice() {
    fetch(`${BASE}/market/price?symbol=${symbol}`)
        .then(r => r.json())
        .then(d => {
            document.getElementById("price").innerText =
                JSON.stringify(d, null, 2);
        });
}

function whatIf() {
    const a = document.getElementById("amount").value;
    const r = document.getElementById("range").value;

    fetch(`${BASE}/whatif/investment?symbol=${symbol}&amount=${a}&range=${r}`)
        .then(r => r.json())
        .then(d => {
            document.getElementById("whatif").innerText =
                JSON.stringify(d, null, 2);
        });
}
