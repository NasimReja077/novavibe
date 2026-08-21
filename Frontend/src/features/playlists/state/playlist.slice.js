import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { playlistApi } from "../service/playlistApi.js";

export const fetchAllPlaylists = createAsyncThunk(
  "playlists/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await playlistApi.getAll();
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load playlists"
      );
    }
  }
);

export const fetchPlaylistById = createAsyncThunk(
  "playlists/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await playlistApi.getById(id);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load playlist"
      );
    }
  }
);

export const createPlaylist = createAsyncThunk(
  "playlists/create",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await playlistApi.create(formData);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create playlist"
      );
    }
  }
);

export const deletePlaylist = createAsyncThunk(
  "playlists/delete",
  async (id, { rejectWithValue }) => {
    try {
      await playlistApi.remove(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete playlist"
      );
    }
  }
);

const initialState = {
  list: [],
  current: null,
  loading: false,
  creating: false,
  error: null,
};

const playlistSlice = createSlice({
  name: "playlists",
  initialState,
  reducers: {
    clearPlaylistError: (state) => {
      state.error = null;
    },
    clearCurrentPlaylist: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPlaylists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPlaylists.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAllPlaylists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchPlaylistById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaylistById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchPlaylistById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(createPlaylist.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createPlaylist.fulfilled, (state, action) => {
        state.creating = false;
        state.list.unshift(action.payload);
      })
      .addCase(createPlaylist.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })
      .addCase(deletePlaylist.fulfilled, (state, action) => {
        state.list = state.list.filter((playlist) => playlist._id !== action.payload);
        if (state.current?._id === action.payload) state.current = null;
      })
      .addCase(deletePlaylist.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearPlaylistError, clearCurrentPlaylist } =
  playlistSlice.actions;
export default playlistSlice.reducer;