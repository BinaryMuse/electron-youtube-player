let apiPromise;

const api = () => {
  if (apiPromise) {
    return apiPromise;
  }

  apiPromise = new Promise(resolve => {
    window.onYouTubeIframeAPIReady = () => {
      console.log("YouTube API loaded");
      resolve();
    }

    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  });

  return apiPromise;
};

export default api;
