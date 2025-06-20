// src/config.js or wherever you define constants
export const BASE_URL =
  import.meta.env.MODE === "production"
    ? "https://dev-tinder-server.onrender.com"
    : "https://localhost:7777";
