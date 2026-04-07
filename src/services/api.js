import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

let unauthorizedHandler = null;

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";

    if (status === 401 && unauthorizedHandler) {
      unauthorizedHandler();
    }

    error.displayMessage = message;
    return Promise.reject(error);
  }
);

const api = {
  setToken(token) {
    if (token) {
      client.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete client.defaults.headers.common.Authorization;
    }
  },
  async get(url, config) {
    const response = await client.get(url, config);
    return response.data;
  },
  async post(url, body, config) {
    const response = await client.post(url, body, config);
    return response.data;
  },
  async put(url, body, config) {
    const response = await client.put(url, body, config);
    return response.data;
  },
  async delete(url, config) {
    const response = await client.delete(url, config);
    return response.data;
  },
  onUnauthorized(handler) {
    unauthorizedHandler = handler;
  }
};

export default api;
