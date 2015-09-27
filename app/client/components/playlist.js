import url from "url";
import qs from "querystring";

import React from "react";
import { autobind } from "core-decorators";

import YoutubeThumbnail from "./youtube_thumbnail";

const closeButtonStyle = {
  position: "absolute",
  top: 5,
  right: 5,
  color: "white",
  backgroundColor: "black",
  fontSize: 25,
  padding: "5px 10px",
  cursor: "pointer",
};

const ClickableThumbnail = ({videoId, onClick, onClose}) =>
  <div style={{position: "relative"}}>
    <YoutubeThumbnail videoId={videoId}
      style={{maxWidth: 200, maxHeight: 150, cursor: "pointer"}}
      onClick={() => onClick(videoId)} />
    <span style={closeButtonStyle} onClick={(evt) => onClose(evt, videoId)}>×</span>
  </div>

export default class Playlist extends React.Component {
  render() {
    return (
      <div style={{flex: "1 0 100%"}}>
        {this.props.videoIds.map(this.renderVideoId)}
        <button onClick={this.handleAddVideoClicked}>Add Video</button>
        {/*cheating*/}
        <input type="text" ref="videoId" />
      </div>
    );
  }

  @autobind
  renderVideoId(videoId) {
    return <ClickableThumbnail key={videoId} videoId={videoId}
            onClick={this.handleVideoClicked}
            onClose={this.handleVideoCloseClicked} />
  }

  @autobind
  handleVideoClicked(videoId) {
    this.props.onSelectVideo(videoId);
  }

  @autobind
  handleVideoCloseClicked(evt, videoId) {
    evt.stopPropagation();
    this.props.onRemoveVideo(videoId);
  }

  @autobind
  handleAddVideoClicked() {
    // TODO: get this into a managed input,
    // or a modal, etc.
    const videoUrl = this.refs.videoId.value;
    const parsed = url.parse(videoUrl);
    const queryParsed = qs.parse(parsed.query);
    if (queryParsed.v) {
      this.props.onAddVideo(queryParsed.v);
      this.refs.videoId.value = "";
    }
  }

  @autobind
  handleRemoveVideo(videoId) {
    this.props.onRemoveVideo(videoId);
  }
}

Playlist.propTypes = {
  videoIds: React.PropTypes.arrayOf(
    React.PropTypes.string
  ).isRequired,
  onSelectVideo: React.PropTypes.func.isRequired, // fn(videoId)
  onAddVideo: React.PropTypes.func.isRequired, // fn(videoId)
  onRemoveVideo: React.PropTypes.func.isRequired, // fn(videoId)
};
