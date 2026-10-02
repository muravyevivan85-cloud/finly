const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  let data;
  try {
    data = await response.json();
  } catch {
    data = { success: false, message: "Server returned an invalid response" };
  }

  if (!response.ok) {
    throw new Error(data.message || `HTTP error ${response.status}`);
  }

  return data;
}

export const api = {
  health: () => request("/health"),
  getUsers: () => request("/users"),
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  getPsychologists: () => request("/psychologists"),
  getArticles: () => request("/articles"),
  createLead: (payload) =>
    request("/leads", {
      method: "POST",
      body: JSON.stringify(payload)
    })
};
