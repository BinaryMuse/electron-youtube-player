import React from "react";
import { findDOMNode } from "react-dom";
import { autobind } from "core-decorators";

import loadApi from "../youtube_api";

export default class YoutubePlayer extends React.Component {
  // not as gross! yay
  componentDidMount() {
    this.setupPlayer();
    this.updateTimeInterval = setInterval(this.updateCurrentPlayerTime, 500);
  }

  componentDidUpdate(prevProps) {
    if (this.props.videoId !== prevProps.videoId) {
      this.changeVideoId(this.props.videoId);
    }
  }

  componentWillUnmount() {
    this.updateTimeInterval && clearInterval(this.updateTimeInterval);
    this.player && this.player.destroy();
  }

  async setupPlayer() {
    await loadApi();

    if (this.player) {
      this.player.destroy();
    }

    this.player = await this.createPlayer(this.props.videoId);
  }

  async changeVideoId(videoId) {
    await loadApi();

    if (this.player) {
      this.player.loadVideoById(videoId);
    }
  }

  createPlayer(videoId) {
    const node = findDOMNode(this);
    const player = new YT.Player(node, {
      height: '100%',
      width: '100%',
      videoId: videoId,
      playerVars: { 'autoplay': this.props.autoplay, 'controls': 0 },
      events: {
        onReady: (event) => {
          // tmp
          player.mute();
          this.props.onUpdateVideoDuration(this.props.videoId, player.getDuration());
        },
        onStateChange: (event) => {
          const state = player.getPlayerState();
          const stateName = state === 1 ? "PLAYING" : "PAUSED";
          this.props.onUpdatePlaybackStatus(stateName);

          if (state === 0) {
            // Video ended, go to the next one
            this.props.onVideoEnded();
          }

          if (state === 1) {
            // video just started playing, we should have metadata
            this.props.onUpdateVideoDuration(this.props.videoId, player.getDuration());
            console.log("updating");
          }
        }
      }
    });
    return player;
  }

  @autobind
  updateCurrentPlayerTime() {
    if (this.player && this.player.getCurrentTime) {
      const time = Math.floor(this.player.getCurrentTime());
      this.props.onUpdateCurrentTime(time);
    }
  }

  render() {
    return (
      <div style={{flex: "1 0 100%"}}>video</div>
    );
  }

  // imperative public API
  play() {
    this.player && this.player.playVideo();
  }

  pause() {
    this.player && this.player.pauseVideo();
    this.updateCurrentPlayerTime(); // make sure time display is correct right away
  }

  seek(time) {
    this.player && this.player.seekTo(time, true);
  }
}

YoutubePlayer.propTypes = {
  autoplay: React.PropTypes.bool,
  videoId: React.PropTypes.string.isRequired,
  onUpdateCurrentTime: React.PropTypes.func, // fn(time)
  onUpdatePlaybackStatus: React.PropTypes.func, // fn(status)
  onUpdateVideoDuration: React.PropTypes.func, // fn(videoId, duration)
  onVideoEnded: React.PropTypes.func, // fn()
};

YoutubePlayer.defaultProps = {
  autoplay: false,
  onUpdateCurrentTime: () => null,
  onUpdatePlaybackStatus: () => null,
  onUpdateVideoDuration: () => null,
  onVideoEnded: () => null,
};
