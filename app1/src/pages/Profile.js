import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProfileStats from "../components/ProfileStats";
import ClaimRequests from "../components/ClaimRequests";
import MyClaims from "../components/MyClaims";
import "../styles/ProfileNew.css";
import API from "../api/config";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [claimedCount, setClaimedCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);

useEffect(() => {
  fetch(`${API}/me`, { credentials: "include" })
    .then(res => res.json())
    .then(setUser);

  fetch(`${API}/api/claim/sent`, {
    credentials: "include",
  })
    .then(res => res.json())
    .then(data => setClaimedCount(data.length));

  fetch(`${API}/api/claim/received`, {
    credentials: "include",
  })
    .then(res => res.json())
    .then(data => setRequestCount(data.length));
}, []);

  if (!user) return null;

  return (
    <>
      <Navbar />

      <div className="profile-new-container">
        {/* USER INFO */}
        <div className="user-card">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>

        {/* GRAPH */}
        <div className="graph-card">
          <h3>Activity Overview</h3>
          <ProfileStats />
        </div>

        {/* STATS */}
        <div className="stats-row">
          <div className="stat-box">
            <h4>{claimedCount}</h4>
            <p>Items You Claimed</p>
          </div>

          <div className="stat-box">
            <h4>{requestCount}</h4>
            <p>Claim Requests Received</p>
          </div>
        </div>

        {/* 🔥 CLAIM MANAGEMENT SECTION (THIS WAS MISSING VISUALLY) */}
        <div className="claims-container">
          <MyClaims />
          <ClaimRequests />
        </div>
      </div>
    </>
  );
}
