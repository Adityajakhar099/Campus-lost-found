import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import Navbar from "../components/Navbar";


// ✅ Import images from src/images
import lostImg from "../images/p8193.png";
import browseImg from "../images/p8194.jpg";
import foundImg from "../images/p8195.jpg";

function Dashboard({ user }) {
  console.log("🔥 DASHBOARD UPDATED - VERSION CHECK");

  const [recentLostItems, setRecentLostItems] = useState([]);
  const [recentFoundItems, setRecentFoundItems] = useState([]);


  // ✅ FIX 1: ADD STATS STATE (REQUIRED)
  const [stats, setStats] = useState({
    reported: 0,
    active: 0,
    resolved: 0,
    total: 0,
    lost: 0,
    found: 0,
  });

  const navigate = useNavigate();

  // ✅ API BASE URL (SAFE OVERRIDE)
const API =
  process.env.REACT_APP_API_URL ||
  "https://campus-lost-found-se43.onrender.com";


  // 🔐 AUTH CHECK
  useEffect(() => {
    fetch(`${API}/me`, {
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 401) navigate("/");
      })
      .catch(() => navigate("/"));
  }, [navigate, API]);

  // Fetch latest lost items
  useEffect(() => {
    const fetchRecentLost = async () => {
      try {
        const res = await fetch(
          `${API}/api/recent-lost`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (res.ok) setRecentLostItems(data.slice(-2).reverse());
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecentLost();
  }, [API]);

  // Fetch latest found items
  useEffect(() => {
    const fetchRecentFound = async () => {
      try {
        const res = await fetch(
          `${API}/api/recent-found`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (res.ok) setRecentFoundItems(data.slice(-2).reverse());
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecentFound();
  }, [API]);

  // Scroll reveal effects
  useEffect(() => {
    const sections = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35, rootMargin: "0px 0px -80px 0px" }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll(".reveal");
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const revealPoint = 150;
      sections.forEach((el) => {
        const elementTop = el.getBoundingClientRect().top;
        const elementBottom = el.getBoundingClientRect().bottom;
        if (
          elementTop < windowHeight - revealPoint &&
          elementBottom > revealPoint
        ) {
          el.classList.add("active");
        } else {
          el.classList.remove("active");
        }
      });
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ FIX 2: FETCH DASHBOARD STATS (ENV-BASED)
  useEffect(() => {
    fetch(`${API}/api/profile/stats`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        const { lost = [], found = [], resolved = [] } = res || {};

        setStats({
          reported: lost.length + found.length,
          active: found.length - resolved.length,
          resolved: resolved.length,
          total: lost.length + found.length,
          lost: lost.length,
          found: found.length,
        });
      })
      .catch((err) => console.error("Dashboard stats error:", err));
  }, [API]);

  return (
    <div className="dashboard-container">
      {/* ===== NAVBAR ===== */}
      <Navbar />

      {/* ===== WELCOME + STATS ===== */}
      <div className="dashboard-card">
        <h2>Welcome, {user?.name} 👋</h2>
        <p className="user-email">
          {user?.email}{" "}
          <span className="verified-badge">✔ Google Verified</span>
        </p>

        <div className="user-activity">
          <h4>Your Activity</h4>
          <div className="activity-stats">
            <span>Reported: {stats.reported}</span>
            <span>Active: {stats.active}</span>
            <span>Resolved: {stats.resolved}</span>
          </div>
        </div>

        <p className="welcome-tip">
          💡 Tip: Add clear images to increase chances of item recovery.
        </p>
        <p className="last-login">Last login: Today at 10:42 AM</p>
      </div>

      {/* ===== STATS ===== */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Items</h3>
          <p>{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Lost Items</h3>
          <p>{stats.lost}</p>
        </div>
        <div className="stat-card">
          <h3>Found Items</h3>
          <p>{stats.found}</p>
        </div>
        <div className="stat-card">
          <h3>Resolved</h3>
          <p>{stats.resolved}</p>
        </div>
      </div>

      {/* ===== SECTION 1: REPORT LOST ITEM ===== */}
      <section className="report-section full-height reveal">
        <div className="report-content left">
          <div className="report-text">
            <h3>Report Lost Item</h3>
            <p>
              Lost an item on campus? Quickly submit a detailed report including
              item name, description, and location. Adding a clear image will
              help others identify and return your lost item faster.
            </p>
            <button
              className="report-btn"
              onClick={() => navigate("/report-lost")}
            >
              ➕ Report Lost Item
            </button>
          </div>
          <div className="report-image">
            <img src={lostImg} alt="Report Lost Item" />
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: BROWSE ITEMS ===== */}
      <section className="report-section full-height reveal">
        <div className="report-content right">
          <div className="report-image">
            <img src={browseImg} alt="Browse Items" />
          </div>
          <div className="report-text">
            <h3>Browse Items</h3>
            <p>
              Explore all reported lost and found items across the campus.
            </p>
            <button
              className="report-btn"
              onClick={() => navigate("/browse")}
            >
              🔍 Browse Items
            </button>
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: REPORT FOUND ITEM ===== */}
      <section className="report-section full-height reveal">
        <div className="report-content left">
          <div className="report-text">
            <h3>Report Found Item</h3>
            <p>
              Found something on campus? Help reunite it with its rightful owner.
            </p>
            <button
              className="report-btn"
              onClick={() => navigate("/report-found")}
            >
              ➕ Report Found Item
            </button>
          </div>
          <div className="report-image">
            <img src={foundImg} alt="Report Found Item" />
          </div>
        </div>
      </section>

      {/* ===== RECENT ITEMS ===== */}
      <div className="recent-items">
        <h3>Recent Items</h3>
        {recentLostItems.length === 0 && recentFoundItems.length === 0 ? (
          <p className="recent-empty">No recent items found.</p>
        ) : (
          <div className="recent-items-grid">
            {recentLostItems.map((item) => (
              <div className="item-card lost" key={item._id}>
                <h4>{item.itemName}</h4>
                <span className="status">Lost</span>
                <p className="location">{item.locationName}</p>
              </div>
            ))}
            {recentFoundItems.map((item) => (
              <div className="item-card found" key={item._id}>
                <h4>{item.itemName}</h4>
                <span className="status">Found</span>
                <p className="location">{item.locationName}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== FOOTER (UNCHANGED) ===== */}
      <footer className="footer">
        © 2025 Campus Lost & Found | All Rights Reserved
      </footer>
    </div>
  );
}

export default Dashboard;
