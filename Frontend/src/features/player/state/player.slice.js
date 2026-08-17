import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  queue: [],
  currentIndex: -1,
  currentSong: null,
  isPlaying: false,
  progress: 0, // seconds
  duration: 0, // seconds
  volume: 1, // 0..1
  isMuted: false,
  shuffle: false,
  repeat: "off", // "off" | "all" | "one"
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    // payload: { song, queue? } — if queue is given, currentIndex is set to song's position in it
    playSong: (state, action) => {
      const { song, queue } = action.payload;

      if (queue?.length) {
        state.queue = queue;
        const idx = queue.findIndex((s) => s._id === song._id);
        state.currentIndex = idx === -1 ? 0 : idx;
      } else {
        state.queue = [song];
        state.currentIndex = 0;
      }

      state.currentSong = song;
      state.isPlaying = true;
      state.progress = 0;
    },
    togglePlay: (state) => {
      if (state.currentSong) state.isPlaying = !state.isPlaying;
    },
    play: (state) => {
      if (state.currentSong) state.isPlaying = true;
    },
    pause: (state) => {
      state.isPlaying = false;
    },
    playNext: (state) => {
      if (!state.queue.length) return;

      if (state.repeat === "one") {
        state.progress = 0;
        state.isPlaying = true;
        return;
      }

      let nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.queue.length) {
        if (state.repeat === "all") {
          nextIndex = 0;
        } else {
          state.isPlaying = false;
          return;
        }
      }

      state.currentIndex = nextIndex;
      state.currentSong = state.queue[nextIndex];
      state.progress = 0;
      state.isPlaying = true;
    },
    playPrevious: (state) => {
      if (!state.queue.length) return;

      let prevIndex = state.currentIndex - 1;
      if (prevIndex < 0) {
        prevIndex = state.repeat === "all" ? state.queue.length - 1 : 0;
      }

      state.currentIndex = prevIndex;
      state.currentSong = state.queue[prevIndex];
      state.progress = 0;
      state.isPlaying = true;
    },
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
      state.isMuted = action.payload === 0;
    },
    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
    },
    toggleShuffle: (state) => {
      state.shuffle = !state.shuffle;
    },
    cycleRepeat: (state) => {
      state.repeat =
        state.repeat === "off" ? "all" : state.repeat === "all" ? "one" : "off";
    },
    setQueue: (state, action) => {
      state.queue = action.payload;
    },
    clearQueue: () => initialState,
  },
});

export const {
  playSong,
  togglePlay,
  play,
  pause,
  playNext,
  playPrevious,
  setProgress,
  setDuration,
  setVolume,
  toggleMute,
  toggleShuffle,
  cycleRepeat,
  setQueue,
  clearQueue,
} = playerSlice.actions;

export default playerSlice.reducer;