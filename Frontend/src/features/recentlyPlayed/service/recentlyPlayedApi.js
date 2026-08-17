import api from "../../Shared/services/api.js";

export const recentlyPlayedApi = {
  getAll: () => api.get("/recently-played"),
  add: (songId) => api.post("/recently-played", { songId }),
  clear: () => api.delete("/recently-played/clear"),
};