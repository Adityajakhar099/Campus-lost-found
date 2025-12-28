import React, { useState, useEffect } from "react";
import "../styles/Login.css";

function Login() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const lights = document.querySelectorAll(".light");
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      lights.forEach((light, index) => {
        const depth = (index + 1) * 15;
        light.style.transform = `
          translate(${x * depth}px, ${y * depth}px)
        `;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleLogin = () => {
    setLoading(true);
    window.open("http://localhost:5000/auth/google", "_self");
  };

  return (
    <div className="login-container">
      {/* Bubbles */}
      <div className="light light1"></div>
      <div className="light light2"></div>
      <div className="light light3"></div>
      <div className="light light4"></div>
      <div className="light light5"></div>
      <div className="light light6"></div>
      <div className="light light7"></div>

      <div className="login-card">
        <div className="logo-circle">LF</div>
        <h1 className="title">College Lost & Found</h1>
        <p className="subtitle">
          Secure login using your college Google account
        </p>

        <button
          className="google-btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Redirecting..." : "Login with Google"}
        </button>

        <p className="security-note">
          Only authorized college accounts can access this portal
        </p>

        <div className="login-footer">
          © 2025 College Lost & Found
        </div>
      </div>
    </div>
  );
}

export default Login;
