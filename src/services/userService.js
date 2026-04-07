import api from "./api.js";

export const userService = {
  getUsers: (params) => api.get("/users", { params }),
  createUser: (payload) => api.post("/users/create", payload),
  updateUser: (id, payload) => api.put(`/users/${id}`, payload),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getSummary: () => api.get("/users/summary"),
  getHierarchy: () => api.get("/users/hierarchy"),
  getActivities: () => api.get("/users/activities"),
  updateProfile: (payload) => api.put("/users/profile", payload),
  getProfile: () => api.get("/users/profile"),
  getAllUsers: (params) => api.get("/users/all", { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  bulkImportUsers: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/users/bulk-import", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }
};
