export default function reduce(state = null, action) {
  switch (action.type) {
    case "UPDATE_PLAYBACK_STATUS":
      return {
        ...state,
        playbackStatus: action.status
      };
    case "ADD_VIDEO":
      return {
        ...state,
        playlist: state.playlist.concat([action.videoId])
      };
    case "REMOVE_VIDEO":
      return {
        ...state,
        playlist: state.playlist.filter(id => id !== action.videoId)
      };
    default:
      return state;
  }
}
