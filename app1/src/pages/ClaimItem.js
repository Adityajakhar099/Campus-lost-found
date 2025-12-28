import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import { createClaim, submitAnswers } from "../api/claimApi";
import API from "../api/config";

const ClaimItem = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const type = searchParams.get("type"); // ✅ FIXED

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [claimId, setClaimId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ======================
     CREATE CLAIM
  ====================== */
  useEffect(() => {
    const createClaim = async () => {
      try {
        if (!type) {
          setError("Invalid claim type.");
          return;
        }

        console.log("📦 Creating claim:", { id, type });

        const res = await axios.post(
  `${API}/api/claim/create`,
  {
    itemId: id,
    itemType: type,
  },
  { withCredentials: true }
);

        console.log("✅ Claim created:", res.data);

        setQuestions(res.data.questions || []);
        setClaimId(res.data.claimId);
      } catch (err) {
        console.error("❌ Claim creation failed:", err.response?.data || err);
        setError("Unable to create claim. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    createClaim();
  }, [id, type]);

  /* ======================
     HANDLE ANSWERS
  ====================== */
  const handleChange = (index, value) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const submitAnswers = async () => {
  try {
    await axios.post(
      `${API}/api/claim/answer`,
      { claimId, answers },
      { withCredentials: true }
    );

    alert("✅ Answers submitted successfully!");
  } catch (err) {
    console.error("❌ Answer submit failed:", err);
    alert("Failed to submit answers.");
  }
};
  /* ======================
     RENDER
  ====================== */
  if (loading) return <p>Loading claim verification...</p>;

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="claim-container">
      <h2>Verify Ownership</h2>

      {questions.length === 0 ? (
        <p>No verification questions generated.</p>
      ) : (
        questions.map((q, i) => (
          <div key={i} className="question-box">
            <p>{q}</p>
            <input
              type="text"
              placeholder="Your answer"
              onChange={(e) => handleChange(i, e.target.value)}
            />
          </div>
        ))
      )}

      {questions.length > 0 && (
        <button onClick={submitAnswers}>Submit Answers</button>
      )}
    </div>
  );
};

export default ClaimItem;
