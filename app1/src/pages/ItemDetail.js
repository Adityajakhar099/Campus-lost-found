import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/ItemDetail.css";
import API from "../api/config";

function ItemDetail({ type }) { // type = "lost" or "found"
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [allItemIds, setAllItemIds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const apiType = type === "lost" ? "lost-items" : "found-items";

  useEffect(() => {
  const fetchData = async () => {
    const itemRes = await fetch(
      `${API}/api/${apiType}/${id}`,
      { credentials: "include" }
    );
    const itemData = await itemRes.json();
    setItem(itemData);

    const allRes = await fetch(
      `${API}/api/${apiType}`,
      { credentials: "include" }
    );
    const allItems = await allRes.json();

    const ids = allItems.map((i) => i._id);
    setAllItemIds(ids);

    const index = ids.findIndex((itemId) => itemId === id);
    setCurrentIndex(index);
  };

  fetchData();
}, [id, apiType]);

  if (!item) return <p style={{ textAlign: "center" }}>Loading...</p>;

  const goPrev = () => {
    if (currentIndex > 0) {
      navigate(
        `/${type === "lost" ? "item" : "found-item"}/${allItemIds[currentIndex - 1]}`
      );
    }
  };

  const goNext = () => {
    if (currentIndex < allItemIds.length - 1) {
      navigate(
        `/${type === "lost" ? "item" : "found-item"}/${allItemIds[currentIndex + 1]}`
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="detail-page">
        <div className="detail-card">
          <div className="detail-image">
            <img
  src={`${API}/uploads/${item.image}`}
  alt={item.itemName}
/>
          </div>

          <div className="detail-info">
            <div className="detail-header">
              <h2>{item.itemName}</h2>
              <span className={`badge ${type === "lost" ? "lost" : "found"}`}>
                {type === "lost" ? "Lost" : "Found"}
              </span>
            </div>

            <p className="desc">{item.description}</p>

            <div className="detail-row">
              <span className="label">📍 Location</span>
              <span className="value">{item.locationName}</span>
            </div>

            <div className="detail-row">
              <span className="label">📅 Reported on</span>
              <span className="value">
                {new Date(item.createdAt).toDateString()}
              </span>
            </div>

            <div className="action-row">
              <button
                className="nav-btn"
                onClick={goPrev}
                disabled={currentIndex <= 0}
              >
                ⬅ Previous
              </button>

              {/* ✅ CLAIM BUTTON ONLY FOR FOUND ITEMS */}
              {type === "found" && (
                <button
                  className="claim-btn"
                  onClick={() =>
                    navigate(`/claim/${item._id}?type=${type}`)
                  }
                >
                  Claim this Item
                </button>
              )}

              <button
                className="nav-btn"
                onClick={goNext}
                disabled={currentIndex === allItemIds.length - 1}
              >
                Next ➡
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ItemDetail;
