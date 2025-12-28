import { useEffect, useState } from "react";
import API from "../api/config";

export default function MyClaims() {
  const [claims, setClaims] = useState([]);

 useEffect(() => {
  fetch(`${API}/api/claim/sent`, {
    credentials: "include",
  })
    .then(res => res.json())
    .then(setClaims)
    .catch(err => console.error("My claims fetch error:", err));
}, []);


  return (
    <div className="claims-wrapper">
      <h3 className="section-title">My Claims</h3>

      {claims.length === 0 ? (
        <p className="empty-text">No claims</p>
      ) : (
        claims.map(c => (
          <div key={c._id} className="claim-card">
            <p><b>Item:</b> {c.itemId?.itemName}</p>

            <span className={`claim-status ${c.status}`}>
              {c.status}
            </span>

            {c.status === "approved" && (
              <p style={{ marginTop: "6px", color: "#2ecc71" }}>
                🎉 Approved — item received
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}
