import React, { useEffect, useState } from "react";

function Dashboard() {
  const [indices, setIndices] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/market/indices")
      .then(res => res.json())
      .then(data => setIndices(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px", color: "white", background: "#0f172a", minHeight: "100vh" }}>
      <h1>Market Dashboard</h1>

      <div style={{ display: "flex", gap: "20px" }}>
        {indices.map((i, idx) => (
          <div key={idx} style={{ background: "#111827", padding: "20px", borderRadius: "10px" }}>
            <h3>{i.name}</h3>
            <p>{i.value}</p>
            <p style={{ color: i.change < 0 ? "red" : "green" }}>
              {i.change} ({i.percent}%)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
