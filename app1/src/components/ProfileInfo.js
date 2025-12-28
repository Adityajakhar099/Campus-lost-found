import { useEffect, useState } from "react";
import "../styles/ProfileComponents.css";

export default function ProfileInfo() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/me", { credentials: "include" })
      .then(res => res.json())
      .then(setUser);
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
