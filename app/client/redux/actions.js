export const updateCurrentTime = (newTime) => {
  return {
    type: "UPDATE_CURRENT_TIME",
    time: newTime
  };
}

export const updatePlaybackStatus = (status) => {
  return {
    type: "UPDATE_PLAYBACK_STATUS",
    status: status
  };
}

export const updateVideoDuration = (videoId, duration) => {
  return {
    type: "UPDATE_VIDEO_DURATION",
    videoId, duration
  };
};

export const addVideoToPlaylist = (videoId) => {
  return {
    type: "ADD_VIDEO",
    videoId: videoId
  };
};

export const removeVideoFromPlaylist = (videoId) => {
  return {
    type: "REMOVE_VIDEO",
    videoId: videoId
  };
};
