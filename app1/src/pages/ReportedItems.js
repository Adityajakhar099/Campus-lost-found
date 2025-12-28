import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/ReportedItems.css";
import { useNavigate } from "react-router-dom";
import API from "../api/config";


function ReportedItems() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();


useEffect(() => {
  const fetchItems = async () => {
    const res = await fetch(`${API}/api/lost-items`, {
      credentials: "include",
    });
    const data = await res.json();
    setItems(data);
  };

  fetchItems();
}, []);

  return (
    <>
      <Navbar />

      <div className="reported-page">
        <h2 className="page-title">Reported Lost Items</h2>

        {items.length === 0 ? (
          <p className="no-items">No lost items reported yet.</p>
        ) : (
          <div className="card-grid">
            {items.map((item) => (
              <div
  className="lost-card"
  key={item._id}
  onClick={() => navigate(`/item/${item._id}`)}
>

                <img
  src={`${API}/uploads/${item.image}`}
  alt={item.itemName}
  className="card-img"
/>

                <div className="card-content">
                  <h3>{item.itemName}</h3>
                  <p className="description">{item.description}</p>

                  <div className="info-row">
                    <span>📍 {item.locationName}</span>
                    <span className="status">Lost</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ReportedItems;
