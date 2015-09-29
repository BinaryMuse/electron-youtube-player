import React from "react";
import { autobind } from "core-decorators";

import { secondsDisplay } from "../utils";


export default class PlaybackControlBar extends React.Component {
  constructor() {
    super();
    this.state = {
      draggingSeekSlider: false,
      localCurrentTime: 0,
    };
  }

  render() {
    const seekSliderValue = this.state.draggingSeekSlider ? this.state.localCurrentTime : this.props.currentTime;

    return (
      <div style={{flex: "0 0 50px", display: "flex", alignItems: "center"}}>
        <div style={{flex: "1 0 50px"}}>
          <button onClick={this.props.onPlay}>Play</button>
        </div>
        <div style={{flex: "1 0 50px"}}>
          <button onClick={this.props.onPause}>Pause</button>
        </div>
        <div style={{flexBasis: "100%", padding: "0px 10px"}}>
          <input type="range" className="slider" style={{width: "100%"}}
                 min={0} max={this.props.videoDuration}
                 value={seekSliderValue}
                 onMouseDown={this.handleMouseDown}
                 onMouseUp={this.handleMouseUp}
                 onChange={this.handleSeekVideo} />
        </div>
        <div style={{flex: "1 0 100px"}}>
          <input type="range" className="slider" />
        </div>
      </div>
    );
  }

  @autobind
  handleMouseDown() {
    this.setState({ draggingSeekSlider: true });
  }

  @autobind
  handleMouseUp() {
    this.setState({ draggingSeekSlider: false });
  }

  @autobind
  handleSeekVideo(evt) {
    const time = parseInt(evt.target.value, 10);
    this.setState({ localCurrentTime: time });
    this.props.onSeek(time, this.state.draggingSeekSlider);
  }
}

PlaybackControlBar.propTypes = {
  videoDuration: React.PropTypes.number,
  currentTime: React.PropTypes.number,
  playing: React.PropTypes.bool.isRequired,
  onSeek: React.PropTypes.func,
  onPlay: React.PropTypes.func,
  onPause: React.PropTypes.func,
};

PlaybackControlBar.defaultProps = {
  videoDuration: 0,
  currentTime: 0,
  playing: false,
  onSeek: () => null,
  onPlay: () => null,
  onPause: () => null,
};
