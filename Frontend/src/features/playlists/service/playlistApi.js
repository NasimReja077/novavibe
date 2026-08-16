import api from "../../Shared/services/api.js";

export const playlistApi = {
  getAll: () => api.get("/playlists"),
  getById: (id) => api.get(`/playlists/${id}`),
  create: (formData) =>
    api.post("/playlists", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};