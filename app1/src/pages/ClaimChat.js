import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMessages, sendMessage, approveClaim } from "../api/claimApi";
import '../styles/Claim.css';

function ClaimChat() {
  const { claimId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    const data = await getMessages(claimId);
    setMessages(data);
  };

  const handleSend = async () => {
    if (!text.trim()) return;
    await sendMessage(claimId, text);
    setText("");
    loadMessages();
  };

  const handleApprove = async () => {
    await approveClaim(claimId);
    alert("Claim approved successfully");
  };

  return (
    <div className="chat-container">
      <h2>Claim Chat</h2>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-msg ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type message..."
      />

      <button onClick={handleSend}>Send</button>
      <button onClick={handleApprove}>Approve Claim</button>
    </div>
  );
}

export default ClaimChat;
