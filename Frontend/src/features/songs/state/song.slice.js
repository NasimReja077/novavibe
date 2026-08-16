import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { songApi } from "../service/songApi.js";

export const fetchAllSongs = createAsyncThunk(
  "songs/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await songApi.getAll(params);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load songs"
      );
    }
  }
);

export const fetchSongById = createAsyncThunk(
  "songs/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await songApi.getById(id);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load song"
      );
    }
  }
);


export const fetchMySongs = createAsyncThunk(
  "songs/fetchMine",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await songApi.getByUser(userId);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load your songs"
      );
    }
  }
);


export const uploadSong = createAsyncThunk(
  "songs/upload",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await songApi.create(formData);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload song"
      );
    }
  }
);
 
const initialState = {
  list: [],
  current: null,
  mySongs: [],
  loading: false,
  uploading: false,
  error: null,
};
 
const songSlice = createSlice({
  name: "songs",
  initialState,
  reducers: {
    clearSongError: (state) => {
      state.error = null;
    },
    clearCurrentSong: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSongs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSongs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAllSongs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
 
    builder
      .addCase(fetchSongById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSongById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchSongById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
 
    builder
      .addCase(fetchMySongs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMySongs.fulfilled, (state, action) => {
        state.loading = false;
        state.mySongs = action.payload;
      })
      .addCase(fetchMySongs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
 
    builder
      .addCase(uploadSong.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadSong.fulfilled, (state, action) => {
        state.uploading = false;
        state.mySongs.unshift(action.payload);
        state.list.unshift(action.payload);
      })
      .addCase(uploadSong.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      });
  },
});
 
export const { clearSongError, clearCurrentSong } = songSlice.actions;
export default songSlice.reducer;