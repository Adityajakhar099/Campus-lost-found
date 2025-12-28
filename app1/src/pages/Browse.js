import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styles/Browse.css";

function Browse() {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [displayLost, setDisplayLost] = useState([]);
  const [displayFound, setDisplayFound] = useState([]);
  const [lostSearch, setLostSearch] = useState("");
  const [foundSearch, setFoundSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const lostRes = await fetch("http://localhost:5000/api/lost-items");
        const foundRes = await fetch("http://localhost:5000/api/found-items");

        const lostData = await lostRes.json();
        const foundData = await foundRes.json();

        setLostItems(lostData);
        setFoundItems(foundData);

        // Default: top 4 recent items
        setDisplayLost(lostData.slice(0, 4));
        setDisplayFound(foundData.slice(0, 4));
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleLostSearch = (e) => {
    const value = e.target.value;
    setLostSearch(value);

    if (value.trim() === "") {
      setDisplayLost(lostItems.slice(0, 4));
    } else {
      const filtered = lostItems.filter((item) =>
        item.itemName.toLowerCase().includes(value.toLowerCase())
      );
      setDisplayLost(filtered);
    }
  };

  const handleFoundSearch = (e) => {
    const value = e.target.value;
    setFoundSearch(value);

    if (value.trim() === "") {
      setDisplayFound(foundItems.slice(0, 4));
    } else {
      const filtered = foundItems.filter((item) =>
        item.itemName.toLowerCase().includes(value.toLowerCase())
      );
      setDisplayFound(filtered);
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />

      {/* Lost Items Section */}
      <div className="recent-items" style={{ marginTop: "30px" }}>
        <h3>Browse Lost Items</h3>
        <input
          type="text"
          placeholder="Search lost items..."
          value={lostSearch}
          onChange={handleLostSearch}
          className="nav-search"
          style={{ marginBottom: "16px" }}
        />
        {loading ? (
          <p>Loading...</p>
        ) : displayLost.length === 0 ? (
          <p className="recent-empty">No lost items found.</p>
        ) : (
          <div className="recent-items-grid">
            {displayLost.map((item) => (
              <div className="item-card lost" key={item._id}>
                <h4>{item.itemName}</h4>
                <span className="status lost">{item.status}</span>
                <p className="location">{item.locationName}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Found Items Section */}
      <div className="recent-items" style={{ marginTop: "40px" }}>
        <h3>Browse Found Items</h3>
        <input
          type="text"
          placeholder="Search found items..."
          value={foundSearch}
          onChange={handleFoundSearch}
          className="nav-search"
          style={{ marginBottom: "16px" }}
        />
        {loading ? (
          <p>Loading...</p>
        ) : displayFound.length === 0 ? (
          <p className="recent-empty">No found items found.</p>
        ) : (
          <div className="recent-items-grid">
            {displayFound.map((item) => (
              <div className="item-card found" key={item._id}>
                <h4>{item.itemName}</h4>
                <span className="status found">{item.status}</span>
                <p className="location">{item.locationName}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Browse;
