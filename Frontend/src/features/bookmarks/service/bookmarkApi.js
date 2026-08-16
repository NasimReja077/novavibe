import api from "../../Shared/services/api.js";

export const bookmarkApi = {
  getMine: () => api.get("/bookmarks"),
  add: (songId) => api.post("/bookmarks", { songId }),
  remove: (songId) => api.delete(`/bookmarks/${songId}`),
};