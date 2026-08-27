export const filterSongs = (songs, { mood, genre, search } = {}) => {
  const query = search?.trim().toLowerCase();
  const normalizedMood = mood?.toLowerCase();
  const normalizedGenre = genre?.toLowerCase();
 
  return songs.filter((song) => {
    if (normalizedMood && song.mood?.toLowerCase() !== normalizedMood) return false;
    if (normalizedGenre && !song.genre?.some((item) => item.toLowerCase() === normalizedGenre)) return false;
    if (query) {
      const haystack = [song.title, song.songArtist, song.mood, ...(song.genre || [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
};
 