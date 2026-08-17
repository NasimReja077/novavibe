import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { recentlyPlayedApi } from "../service/recentlyPlayedApi.js";

export const fetchRecentlyPlayed = createAsyncThunk(
  "recentlyPlayed/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await recentlyPlayedApi.getAll();
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load recently played songs"
      );
    }
  }
);

// Backend upserts + returns the full recent-history list (most recent 20) as `data`
export const addRecentlyPlayed = createAsyncThunk(
  "recentlyPlayed/add",
  async (songId, { rejectWithValue }) => {
    try {
      const { data } = await recentlyPlayedApi.add(songId);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update recently played"
      );
    }
  }
);

export const clearRecentlyPlayed = createAsyncThunk(
  "recentlyPlayed/clear",
  async (_, { rejectWithValue }) => {
    try {
      await recentlyPlayedApi.clear();
      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear recently played"
      );
    }
  }
);

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const recentlyPlayedSlice = createSlice({
  name: "recentlyPlayed",
  initialState,
  reducers: {
    clearRecentlyPlayedError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecentlyPlayed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentlyPlayed.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchRecentlyPlayed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(addRecentlyPlayed.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(addRecentlyPlayed.rejected, (state, action) => {
        state.error = action.payload;
      });

    builder
      .addCase(clearRecentlyPlayed.fulfilled, (state) => {
        state.list = [];
      })
      .addCase(clearRecentlyPlayed.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearRecentlyPlayedError } = recentlyPlayedSlice.actions;
export default recentlyPlayedSlice.reducer;