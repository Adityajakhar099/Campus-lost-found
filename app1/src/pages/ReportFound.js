import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FoundItem.css";

function ReportFoundItem() {
  const navigate = useNavigate();

  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  // 📍 Get current location and convert to readable address
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLatitude(lat);
        setLongitude(lng);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await res.json();

          setLocation(data.display_name || "Address not found");
        } catch (err) {
          console.error(err);
          setLocation("Error fetching address");
        }
      },
      () => {
        alert("Location permission denied");
      }
    );
  };

  // 🔹 Submit found item form
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🟢 Found Item Submit started");

    const formData = new FormData();
    formData.append("itemName", itemName);
    formData.append("description", description);
    formData.append("locationName", location);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("dateFound", date);
    formData.append("image", image);

    try {
      // ✅ Corrected backend route
      const res = await fetch("http://localhost:5000/api/report-found", {
        method: "POST",
        body: formData,
        credentials: "include", // required for session
      });

      console.log("🟢 Found Item API status:", res.status);

      const data = await res.json();
      console.log("🟢 Found Item API response:", data);

      if (!res.ok) {
        console.error("❌ Found Item failed:", data.message);
        alert(data.message || "Failed to report found item");
        return;
      }

      console.log("🟢 Redirecting to dashboard...");
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Found Item submit error:", err);
      alert("Server error");
    }
  };

  return (
    <div className="found-container">
      <form className="found-form" onSubmit={handleSubmit}>
        <h2>Report Found Item</h2>

        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          required
        />

        <textarea
          placeholder="Item Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <div className="location-group">
          <input
            type="text"
            placeholder="Found Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <button
            type="button"
            className="location-btn"
            onClick={getCurrentLocation}
          >
            📍 Use Current
          </button>
        </div>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

        <button type="submit">Submit Found Item</button>
      </form>
    </div>
  );
}

export default ReportFoundItem;
