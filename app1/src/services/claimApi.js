const BASE_URL = `${process.env.REACT_APP_API_URL}/api`;


export const createClaim = async (itemId, itemType) => {
  const res = await fetch(`${BASE_URL}/claim/create`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId, itemType }),
  });
  return res.json();
};

export const submitAnswers = async (claimId, answers) => {
  const res = await fetch(`${BASE_URL}/claim/answer`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ claimId, answers }),
  });
  return res.json();
};

export const getMessages = async (claimId) => {
  const res = await fetch(`${BASE_URL}/claim/chat/${claimId}`, {
    credentials: "include",
  });
  return res.json();
};

export const sendMessage = async (claimId, message) => {
  const res = await fetch(`${BASE_URL}/claim/chat/${claimId}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  return res.json();
};
