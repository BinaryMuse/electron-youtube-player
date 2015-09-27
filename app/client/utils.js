export function youtubeIdToThumbnailUrl(videoId) {
  return `http://img.youtube.com/vi/${videoId}/0.jpg`;
}

export function secondsDisplay(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainSeconds = seconds % 60;

  let secondsStr = `${remainSeconds}`;
  if (secondsStr.length === 1) {
    secondsStr = "0" + secondsStr;
  }

  return `${minutes}:${secondsStr}`;
}
