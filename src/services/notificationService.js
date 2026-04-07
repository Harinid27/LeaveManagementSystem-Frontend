import api from "./api.js";

const isValidId = (id) => /^[a-f\d]{24}$/i.test(id);

export const notificationService = {
  getMine: () => api.get("/notifications"),
  markRead: (notificationId) => {
    if (!isValidId(notificationId)) throw new Error("Invalid notification ID");
    return api.put(`/notifications/${notificationId}/read`, {});
  }
};
