import React from "react";
import { autobind } from "core-decorators";

import { secondsDisplay } from "../utils";


// TODO: this should probably just be <input type="range" />
class PrettySlider extends React.Component {
  render() {
    const { value, max, min, onChange, step, style, ...props } = this.props;

    const handleOffsetPercent = value / (max - min) * 100;

    const containerStyle = Object.assign({}, style, {
      position: "relative",
      width: "100%",
      height: 20,
    });

    const trackStyle = {
      position: "absolute",
      top: 5,
      left: 5,
      right: 5,
      bottom: 5,
      backgroundColor: "#525252",
      height: 10,
      borderRadius: 5,
    };

    const handleStyle = {
      position: "absolute",
      top: -5,
      left: `${handleOffsetPercent}%`,
      backgroundColor: "white",
      width: 20,
      height: 20,
      borderRadius: 10,
    };

    return (
      <div style={containerStyle}>
        <div style={trackStyle} onClick={this.handleTrackClick}>
          <div style={handleStyle} />
        </div>
      </div>
    );
  }

  @autobind
  handleTrackClick(e) {
    e.persist();
    const node = e.target;
    const box = node.getBoundingClientRect();

    // TODO: reinvestigate :)
    const clickOffset = e.pageX - box.left; // pixels from left of box
    const maxClick = box.left + box.width; // rightmost pixel
    const clickRange = maxClick - box.left;
    const percent = clickOffset / clickRange;
    const newValue = (this.props.max - this.props.min) * percent;
    const newValueClamped = Math.round(newValue);

    if (newValueClamped !== this.props.value) {
      this.props.onChange(newValueClamped);
    }
  }
};

PrettySlider.propTypes = {
  value: React.PropTypes.number,
  min: React.PropTypes.number,
  max: React.PropTypes.number,
  step: React.PropTypes.number,
  onChange: React.PropTypes.func, // fn(evt or value??)
};

PrettySlider.defaultProps = {
  value: 0,
  min: 0,
  max: 0,
  step: 1,
  onChange: () => null,
};

export default class PlaybackControlBar extends React.Component {
  constructor() {
    super();
    this.state = {
      testValue: 5,
    };
  }

  @autobind
  updateTestValue(val) {
    console.log(val);
    this.setState({ testValue: val });
  }

  render() {
    // time to struggle with flexbox
    return (
      <div style={{flex: "0 0 50px", display: "flex", alignItems: "center"}}>
        <div style={{flex: "1 0 50px"}} onClick={this.props.onPlay}>
          p
        </div>
        <div style={{flex: "1 0 50px"}} onClick={this.props.onPause}>
          r
        </div>
        <div style={{flexBasis: "100%"}}>
          <PrettySlider min={0} max={this.props.videoDuration} value={this.props.currentTime} onChange={this.props.onSeek} />
        </div>
        <div style={{flex: "1 0 100px"}}>
          <PrettySlider />
        </div>
      </div>
    );
  }

  @autobind
  handleSeekVideo(evt) {
    const time = parseInt(evt.target.value, 10);
    this.props.onSeek(time);
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
