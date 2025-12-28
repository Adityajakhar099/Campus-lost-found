import { useEffect, useState } from "react";
import "../styles/ProfileComponents.css";
import API from "../api/config";

export default function ProfileInfo() {
  const [user, setUser] = useState(null);

  useEffect(() => {
  fetch(`${API}/me`, {
    credentials: "include",
  })
    .then(res => res.json())
    .then(setUser)
    .catch(err => console.error("User fetch error:", err));
}, []);

  if (!user) return null;

  return (
    <div className="profile-info">
      <h2 className="profile-name">{user.name}</h2>
      <p className="profile-email">{user.email}</p>
      <button className="profile-btn">Edit Profile</button>
    </div>
  );
}
