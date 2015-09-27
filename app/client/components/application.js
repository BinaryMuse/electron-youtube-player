import React from "react";
import { autobind } from "core-decorators";
import { connect } from "react-redux";

import * as actions from "../redux/actions";

import CurrentlyPlaying from "./currently_playing";
import Playlist from "./playlist";
import YoutubePlayer from "./youtube_player";
import YoutubeThumbnail from "./youtube_thumbnail";



function secondsDisplay(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainSeconds = seconds % 60;

  let secondsStr = `${remainSeconds}`;
  if (secondsStr.length === 1) {
    secondsStr = "0" + secondsStr;
  }

  return `${minutes}:${secondsStr}`;
}

@connect(state => ({
  ...state,
  currentVideoDuration: state.videoDurations[state.currentVideoId] || 0
}), actions)
export default class Application extends React.Component {
  constructor(props) {
    super(props);
    window.props = props;
    this.state = {
      currentTime: 0
    };
  }

  render() {
    return (
      <div style={{height: "100%", display: "flex", flexDirection: "row"}}>
        <div style={{flex: "1 0 200px", display: "flex", flexDirection: "column"}}>
          <Playlist videoIds={this.props.playlist}
                    onAddVideo={this.props.addVideoToPlaylist}
                    onRemoveVideo={this.props.removeVideoFromPlaylist}
                    onSelectVideo={this.props.selectVideo} />
          <CurrentlyPlaying videoId={this.props.currentVideoId} />
        </div>
        <div style={{flexBasis: "100%", display: "flex", flexDirection: "column"}}>
          <YoutubePlayer ref="player"
                         videoId={this.props.currentVideoId} autoplay={true}
                         onUpdatePlaybackStatus={this.props.updatePlaybackStatus}
                         onUpdateVideoDuration={this.props.updateVideoDuration}
                         onUpdateCurrentTime={this.updateCurrentTime}
                         onVideoEnded={this.props.selectNextVideo} />
          <div style={{flex: "0 0 50px"}}>
            <input type="range" min={0} max={this.props.currentVideoDuration}
                   value={this.state.currentTime} onChange={this.seekVideo} />
            <div>
              {secondsDisplay(this.state.currentTime)} / {secondsDisplay(this.props.currentVideoDuration)}
              <button onClick={this.playVideo}>Play</button>
              <button onClick={this.pauseVideo}>Pause</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  @autobind
  playVideo() {
    this.refs.player.play();
  }

  @autobind
  pauseVideo() {
    this.refs.player.pause();
  }

  @autobind
  seekVideo(evt) {
    const time = parseInt(evt.target.value, 10);
    this.refs.player.seek(time);
  }

  @autobind
  updateCurrentTime(time) {
    this.setState({ currentTime: time });
  }
}
