export default function reduce(state = null, action) {
  switch (action.type) {
    case "UPDATE_PLAYBACK_STATUS":
      return {
        ...state,
        playbackStatus: action.status
      };
    case "ADD_VIDEO":
      if (state.playlist.includes(action.videoId)) {
        return state;
      }
      return {
        ...state,
        playlist: state.playlist.concat([action.videoId])
      };
    case "REMOVE_VIDEO":
      return {
        ...state,
        playlist: state.playlist.filter(id => id !== action.videoId)
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
