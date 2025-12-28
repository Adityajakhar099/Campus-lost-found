import { useEffect, useState } from "react";
import { approveClaim } from "../api/claimApi";
import API from "../api/config";

export default function ClaimRequests() {
  const [claims, setClaims] = useState([]);
  const [approvingId, setApprovingId] = useState(null);

  useEffect(() => {
  fetch(`${API}/api/claim/received`, {
    credentials: "include",
  })
    .then(res => res.json())
    .then(setClaims)
    .catch(err => console.error("Claim fetch error:", err));
}, []);

  const approve = async (id) => {
    setApprovingId(id);

    await approveClaim(id);

    setClaims(prev =>
      prev.map(c =>
        c._id === id ? { ...c, status: "approved" } : c
      )
    );

    setTimeout(() => setApprovingId(null), 1200);
  };

  return (
    <div className="claims-wrapper">
      <h3 className="section-title">Claim Requests</h3>

      {claims.length === 0 ? (
        <p className="empty-text">No claim requests</p>
      ) : (
        claims.map(c => (
          <div
            key={c._id}
            className={`claim-card ${
              c.status === "approved" ? "approved-glow" : ""
            }`}
          >
            <p><b>Item:</b> {c.itemId?.itemName}</p>
            <p><b>Claimed By:</b> {c.claimerId?.name}</p>

            <span className={`claim-status ${c.status}`}>
              {c.status}
            </span>

            {/* APPROVE BUTTON — ONLY FOR ANSWERED */}
            {c.status === "answered" && (
              <button
                className="approve-btn pulse"
                disabled={approvingId === c._id}
                onClick={() => approve(c._id)}
              >
                {approvingId === c._id ? "Approving..." : "Approve"}
              </button>
            )}

            {/* APPROVED MESSAGE */}
            {c.status === "approved" && (
              <p className="approved-text">
                ✔ Item approved & handed over
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}
