import api from "../../Shared/services/api.js";

export const songApi = {
     getAll: (params) => api.get("/songs", { params }),
     getById: (id) => api.get(`/songs/${id}`),
     getByUser: (userId) => api.get(`/songs/user/${userId}`),
     remove: (id) => api.delete(`/songs/${id}`),

     create: (formData) => api.post("/songs", formData, {
          headers: { "Content-Type": "multipart/form-data" },
     }),
};