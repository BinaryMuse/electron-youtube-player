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



class Modal extends React.Component {
  render() {
    const style = {
      color: "black",
      width: 400,
      backgroundColor: "white",
      position: "absolute",
      top: "30%",
      left: "50%",
      marginLeft: -200,
      border: "1px solid black",
      borderRadius: 10,
      padding: 15,
    };

    const backdropStyle = {
      display: this.props.isOpen ? "block" : "none",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(50,50,50,0.8)",
    };

    let title;
    if (this.props.title) {
      const style = {
        marginTop: 0,
        borderBottom: "1px solid #ccc",
        marginBottom: 10,
        paddingBottom: 5,
      };
      title = <h2 style={style}>{this.props.title}</h2>;
    }

    const closeButton = (
      <div style={{
        position: "absolute",
        right: 5,
        top: 5,
        fontSize: 20,
        padding: "3px 5px",
        cursor: "pointer",
      }} onClick={this.props.onRequestClose}>
        ×
      </div>
    );

    return (
      <div style={backdropStyle} onClick={this.props.onRequestClose}>
        <div style={style} onClick={this.eatClick}>
          {title}
          {closeButton}
          {this.props.children}
        </div>
      </div>
    );
  }

  eatClick(e) {
    e.stopPropagation();
  }
}


export default class Playlist extends React.Component {
  constructor() {
    super();
    this.state = {
      showingAddModal: false,
    };
  }

  render() {
    return (
      <div style={{flex: "1", overflowY: "scroll"}}>
        {this.props.videoIds.map(this.renderVideoId)}
        <button onClick={this.handleShowAddVideoModalClicked}>Add Video</button>
        <div>
          <button onClick={this.handleSavePlaylist}>Save</button>
          <button onClick={this.handleLoadPlaylist}>Load</button>
        </div>
        <Modal isOpen={this.state.showingAddModal}
               onRequestClose={this.handleCloseModal}
               title="Add Video to Playlist">
          <button onClick={this.handleAddVideoClicked}>Add Video</button>
          {/*cheating*/}
          <input type="text" ref="videoId" />
        </Modal>
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
  handleShowAddVideoModalClicked() {
    this.setState({ showingAddModal: true });
  }

  @autobind
  handleCloseModal() {
    this.setState({ showingAddModal: false });
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

  @autobind
  handleSavePlaylist() {
    require("remote").require("./browser/playlist").savePlaylist(
      this.props.videoIds
    );
  }

  @autobind
  handleLoadPlaylist() {
    require("remote").require("./browser/playlist").loadPlaylist(videoIds => {
      console.log("got video IDs", videoIds);
      this.props.setPlaylistVideos(videoIds);
    });
  }
}

Playlist.propTypes = {
  videoIds: React.PropTypes.arrayOf(
    React.PropTypes.string
  ).isRequired,
  onSelectVideo: React.PropTypes.func.isRequired, // fn(videoId)
  onAddVideo: React.PropTypes.func.isRequired, // fn(videoId)
  onRemoveVideo: React.PropTypes.func.isRequired, // fn(videoId)
  setPlaylistVideos: React.PropTypes.func.isRequired, // fn([videoId])
};
