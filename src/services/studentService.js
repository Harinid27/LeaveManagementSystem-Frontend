import api from "./api";

const studentService = {
  getDashboardData: async () => {
    return await api.get("/student/dashboard");
  }
};

export default studentService;
