import React from "react";
import { autobind } from "core-decorators";
import { connect } from "react-redux";

import * as actions from "../redux/actions";

import CurrentlyPlaying from "./currently_playing";
import PlaybackControlBar from "./playback_control_bar";
import Playlist from "./playlist";
import YoutubePlayer from "./youtube_player";
import YoutubeThumbnail from "./youtube_thumbnail";


@connect(state => ({
  ...state,
  isPlaying: state.playbackStatus === "PLAYING",
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
          <PlaybackControlBar videoDuration={this.props.currentVideoDuration}
                              currentTime={this.state.currentTime}
                              playing={this.props.isPlaying} onSeek={this.seekVideo}
                              onPlay={this.playVideo} onPause={this.pauseVideo} />
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
  seekVideo(time) {
    this.refs.player.seek(time);
  }

  @autobind
  updateCurrentTime(time) {
    this.setState({ currentTime: time });
  }
}
