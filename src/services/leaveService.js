import api from "./api.js";

const isValidId = (id) => /^[a-f\d]{24}$/i.test(id);

const buildLeaveFormData = (payload) => {
  const formData = new FormData();
  formData.append("leaveType", payload.leaveType);
  formData.append("fromDate", payload.fromDate);
  formData.append("toDate", payload.toDate);
  formData.append("reason", payload.reason);
  if (payload.proofFile) formData.append("proofFile", payload.proofFile);
  return formData;
};

const safeLeaveId = (id) => {
  if (!isValidId(id)) throw new Error("Invalid leave ID");
  return id;
};

export const leaveService = {
  apply: (payload) => api.post("/leaves/apply", buildLeaveFormData(payload)),
  myLeaves: () => api.get("/leaves/my"),
  getPendingLeaves: () => api.get("/leaves/pending"), // Added for Professor/HOD
  analytics: () => api.get("/leaves/analytics"),
  approveLeave: (leaveId, remarks) => api.put(`/leaves/${safeLeaveId(leaveId)}/approve`, { remarks }),
  rejectLeave: (leaveId, remarks) => api.put(`/leaves/${safeLeaveId(leaveId)}/reject`, { remarks }),
  
  // Keep older names for compatibility if any
  pendingLeaves: () => api.get("/leaves/pending"),
  approve: (leaveId, payload) => api.put(`/leaves/${safeLeaveId(leaveId)}/approve`, payload),
  reject: (leaveId, payload) => api.put(`/leaves/${safeLeaveId(leaveId)}/reject`, payload)
};
