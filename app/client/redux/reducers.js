const initialState = {
  playlist: [
    // "VJdi9SDlVhU",
    // "h_aKALHPRmU",
    "AVpvIBLEhMg"
  ],
  currentVideoId: "AVpvIBLEhMg",
  playbackStatus: "PAUSED",
  videoDurations: {}, // id => duration
};

export function playlistReducer(state = initialState, action) {
  switch (action.type) {
    case "SELECT_VIDEO":
      return {
        ...state,
        currentVideoId: action.videoId
      };
    case "SELECT_NEXT_VIDEO":
      const thisVideoId = state.currentVideoId;
      const index = state.playlist.indexOf(thisVideoId);
      let nextVideoIndex = index + 1;
      const numVideos = state.playlist.length;
      if (nextVideoIndex > numVideos - 1) {
        nextVideoIndex = 0;
      }
      const nextVideoId = state.playlist[nextVideoIndex];

      return {
        ...state,
        currentVideoId: nextVideoId
      };
    case "ADD_VIDEO":
      {
        if (state.playlist.includes(action.videoId)) {
          return state;
        }

        const newVideoId = state.currentVideoId || action.videoId;

        return {
          ...state,
          playlist: state.playlist.concat([action.videoId]),
          currentVideoId: newVideoId
        };
      }
    case "REMOVE_VIDEO":
      const newPlaylist = state.playlist.filter(id => id !== action.videoId)
      let newVideoId = state.currentVideoId;
      if (state.currentVideoId === action.videoId) {
        // Current video is being removed.
        newVideoId = newPlaylist[0];
      }
      return {
        ...state,
        playlist: newPlaylist,
        currentVideoId: newVideoId
      };
    default:
      return state;
  }
}

export function playbackStateReducer(state = initialState, action) {
  switch (action.type) {
    case "UPDATE_PLAYBACK_STATUS":
      return {
        ...state,
        playbackStatus: action.status
      };
    case "UPDATE_VIDEO_DURATION":
      return {
        ...state,
        videoDurations: {
          ...state.videoDurations,
          [action.videoId]: action.duration
        }
      };
    default:
      return state;
  }
}
