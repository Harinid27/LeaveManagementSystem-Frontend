export const getApiBaseUrl = () =>
  (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api$/, "");

export const toAbsoluteFileUrl = (fileUrl) => {
  if (!fileUrl) {
    return "";
  }

  if (/^https?:\/\//i.test(fileUrl)) {
    return fileUrl;
  }

  return `${getApiBaseUrl()}${fileUrl}`;
};
