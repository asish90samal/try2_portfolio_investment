const BASE = "http://localhost:8080/api";

fetch(`${BASE}/payment/balance`)
  .then(r => r.text())
  .then(b => {
      document.getElementById("wallet").innerText = "₹" + b;
  });

function openStock() {
    const s = document.getElementById("symbol").value;
    window.location.href = `stock.html?symbol=${s}`;
}
