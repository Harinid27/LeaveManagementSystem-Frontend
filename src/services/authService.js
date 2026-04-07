import api from "./api.js";

export const authService = {
  register: (payload) => api.post("/auth/register", payload),
  login: (credentials) => api.post("/auth/login", credentials),
  me: () => api.get("/auth/me")
};
