import React from "react";
import ReactDOM from "react-dom";

import { compose, createStore, applyMiddleware } from "redux";
import { devTools, persistState } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import { Provider, connect } from "react-redux";
import { autobind } from "core-decorators";

import reducer from "./redux/reducer";
import * as actions from "./redux/actions";

import YoutubeThumbnail from "./components/youtube_thumbnail";

const finalCreateStore = compose(
  devTools()
)(createStore);

const initialState = {
  playlist: [
    "VJdi9SDlVhU",
    "h_aKALHPRmU",
    "AVpvIBLEhMg"
  ],
  currentVideoId: "AVpvIBLEhMg",
  playbackStatus: "PAUSED",
  // id => duration
  videoDurations: {}
};

const store = finalCreateStore(reducer, initialState);

class YoutubePlayer extends React.Component {
  // gross
  componentDidMount() {
    window.onYouTubeIframeAPIReady = () => {
      console.log("The YouTube API loaded.");
      const node = ReactDOM.findDOMNode(this);
      const player = new YT.Player(node, {
        height: '100%',
        width: '100%',
        videoId: this.props.videoId,
        events: {
          'onReady': (event) => {
            // event.target.playVideo();
            this.props.onUpdateVideoDuration(this.props.videoId, player.getDuration());
            setInterval(() => {
              this.props.onUpdateCurrentTime(player.getCurrentTime());
            }, 200);
          },
          'onStateChange': (event) => {
            const state = player.getPlayerState();
            const stateName = state === 1 ? "PLAYING" : "PAUSED";
            this.props.onUpdatePlaybackStatus(stateName);
          }
        }
      });
    }

    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  render() {
    return (
      <div style={{flex: "1 0 100%"}}>video</div>
    );
  }
}

YoutubePlayer.propTypes = {
  videoId: React.PropTypes.string.isRequired,
  onUpdateCurrentTime: React.PropTypes.func.isRequired,
  onUpdatePlaybackStatus: React.PropTypes.func.isRequired,
  onUpdateVideoDuration: React.PropTypes.func.isRequired,
};

class Playlist extends React.Component {
  render() {
    return (
      <div style={{flex: "1 0 100%"}}>
        {this.props.videoIds.map(this.renderVideoId)}
      </div>
    );
  }

  renderVideoId(videoId) {
    return (
      <div key={videoId}>
        <YoutubeThumbnail videoId={videoId}
         style={{maxWidth: 200, maxHeight: 150}} />
      </div>
    );
  }
}

Playlist.propTypes = {
  videoIds: React.PropTypes.arrayOf(
    React.PropTypes.string
  ).isRequired,
};

class CurrentlyPlaying extends React.Component {
  render() {
    return (
      <div style={{flex: "0 0 150px"}}>
        {this.props.videoId && this.renderThumbnail(this.props.videoId)}
      </div>
    );
  }

  renderThumbnail(videoId) {
    return <YoutubeThumbnail videoId={videoId}
            style={{maxWidth: 200, maxHeight: 150}} />;
  }
}

CurrentlyPlaying.propTypes = {
  videoId: React.PropTypes.string,
};

@connect(state => ({
  ...state,
  currentVideoDuration: state.videoDurations[state.currentVideoId] || 0
}), actions)
class Application extends React.Component {
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
          <Playlist videoIds={this.props.playlist} />
          <CurrentlyPlaying videoId={this.props.currentVideoId} />
        </div>
        <div style={{flexBasis: "100%", display: "flex", flexDirection: "column"}}>
          <YoutubePlayer videoId={this.props.currentVideoId}
                         onUpdatePlaybackStatus={this.props.updatePlaybackStatus}
                         onUpdateVideoDuration={this.props.updateVideoDuration}
                         onUpdateCurrentTime={this.updateCurrentTime} />
          <div style={{flex: "0 0 50px"}}>
            <input type="range" min={0} max={this.props.currentVideoDuration}
                   value={this.state.currentTime} />
            <div>
              {this.state.currentTime} / {this.props.currentVideoDuration}
            </div>
          </div>
        </div>
      </div>
    );
  }

  @autobind
  updateCurrentTime(time) {
    this.setState({ currentTime: time });
  }
}

const app = (
  <div>
    <Provider store={store}>
      <Application />
    </Provider>
    <DebugPanel top right bottom>
      <DevTools store={store} monitor={LogMonitor} />
    </DebugPanel>
  </div>
);

ReactDOM.render(app, document.getElementById("app"));
