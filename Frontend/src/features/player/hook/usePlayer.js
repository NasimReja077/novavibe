import { useDispatch, useSelector } from "react-redux";
import {
  playSong as playSongAction,
  togglePlay,
  play as playAction,
  pause as pauseAction,
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
} from "../state/player.slice.js";
import { addRecentlyPlayed } from "../../recentlyPlayed/state/recentlyPlayed.slice.js";

export const usePlayer = () => {
  const dispatch = useDispatch();
  const player = useSelector((state) => state.player);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Starts playback and (for signed-in users) records the play in Recently Played
  const playSong = (song, queue) => {
    dispatch(playSongAction({ song, queue }));
    if (isAuthenticated && song?._id) {
      dispatch(addRecentlyPlayed(song._id));
    }
  };

  return {
    ...player,

    playSong,
    togglePlay: () => dispatch(togglePlay()),
    play: () => dispatch(playAction()),
    pause: () => dispatch(pauseAction()),
    playNext: () => dispatch(playNext()),
    playPrevious: () => dispatch(playPrevious()),
    setProgress: (seconds) => dispatch(setProgress(seconds)),
    setDuration: (seconds) => dispatch(setDuration(seconds)),
    setVolume: (level) => dispatch(setVolume(level)),
    toggleMute: () => dispatch(toggleMute()),
    toggleShuffle: () => dispatch(toggleShuffle()),
    cycleRepeat: () => dispatch(cycleRepeat()),
    setQueue: (queue) => dispatch(setQueue(queue)),
    clearQueue: () => dispatch(clearQueue()),
  };
};