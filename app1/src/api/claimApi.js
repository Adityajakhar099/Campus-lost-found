const BASE = "http://localhost:5000/api/claim";

export const createClaim = (itemId) =>
  fetch(`${BASE}/create`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId }),
  }).then(res => res.json());

export const submitAnswers = (claimId, answers) =>
  fetch(`${BASE}/answer`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ claimId, answers }),
  }).then(res => res.json());

export const getMessages = (claimId) =>
  fetch(`${BASE}/chat/${claimId}`, { credentials: "include" })
    .then(res => res.json());

export const sendMessage = (claimId, message) =>
  fetch(`${BASE}/chat/${claimId}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  }).then(res => res.json());

export const approveClaim = (id) =>
  fetch(`${BASE}/approve/${id}`, {
    method: "POST",
    credentials: "include",
  }).then(res => res.json());
