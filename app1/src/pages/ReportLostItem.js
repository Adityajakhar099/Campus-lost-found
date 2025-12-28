import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ReportLostItem.css";

function ReportLostItem() {
  const navigate = useNavigate();

  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  // Get current location → readable address
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

          if (data.display_name) {
            setLocation(data.display_name);
          } else {
            setLocation("Address not found");
          }
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

const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("itemName", itemName);
  formData.append("description", description);
  formData.append("locationName", location); // fixed
  formData.append("latitude", latitude);
  formData.append("longitude", longitude);
  formData.append("dateLost", date); // fixed
  formData.append("image", image); // fixed

  try {
    const res = await fetch("http://localhost:5000/api/report-lost", {
      method: "POST",
      body: formData,
      credentials: "include", // important for session
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to report item");
      return;
    }

    // ✅ Redirect after successful submission
    navigate("/dashboard");
  } catch (err) {
    console.error(err);
    alert("Server error, try again later");
  }
};



  return (
    <div className="lost-container">
      <form className="lost-form" onSubmit={handleSubmit}>
        <h2>Report Lost Item</h2>

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
            placeholder="Last Seen Location"
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

        <button type="submit">Submit Lost Item</button>
      </form>
    </div>
  );
}

export default ReportLostItem;
