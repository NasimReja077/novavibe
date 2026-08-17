import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { bookmarkApi } from "../service/bookmarkApi.js";

export const fetchBookmarks = createAsyncThunk(
  "bookmarks/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await bookmarkApi.getMine();
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load bookmarks"
      );
    }
  }
);

export const addBookmark = createAsyncThunk(
  "bookmarks/add",
  async (songId, { rejectWithValue }) => {
    try {
      const { data } = await bookmarkApi.add(songId);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to bookmark song"
      );
    }
  }
);

export const removeBookmark = createAsyncThunk(
  "bookmarks/remove",
  async (songId, { rejectWithValue }) => {
    try {
      await bookmarkApi.remove(songId);
      return songId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove bookmark"
      );
    }
  }
);

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const bookmarkSlice = createSlice({
  name: "bookmarks",
  initialState,
  reducers: {
    clearBookmarkError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookmarks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchBookmarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(addBookmark.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(addBookmark.rejected, (state, action) => {
        state.error = action.payload;
      });

    builder
      .addCase(removeBookmark.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (b) => (b.songId?._id || b.songId) !== action.payload
        );
      })
      .addCase(removeBookmark.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearBookmarkError } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;