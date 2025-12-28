import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "../styles/Founditems.css";




function FoundItems() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/found-items", {
          credentials: "include",
        });
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Error fetching found items:", err);
      }
    };

    fetchItems();
  }, []);

  return (
    <>
      <Navbar />

      <div className="reported-page">
        <h2 className="page-title">Reported Found Items</h2>

        {items.length === 0 ? (
          <p className="no-items">No found items reported yet.</p>
        ) : (
          <div className="card-grid">
            {items.map((item) => (
              <div
                className="found-card"
                key={item._id}
                onClick={() => navigate(`/found-item/${item._id}`)}
              >
                <img
                  src={`http://localhost:5000/uploads/${item.image}`}
                  alt={item.itemName}
                  className="card-img"
                />

                <div className="card-content">
                  <h3>{item.itemName}</h3>
                  <p className="description">{item.description}</p>

                  <div className="info-row">
                    <span>📍 {item.locationName}</span>
                    <span className="status found">Found</span>
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

export default FoundItems;
