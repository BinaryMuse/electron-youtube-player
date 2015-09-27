import React from "react";

import YoutubeThumbnail from "./youtube_thumbnail";

export default class CurrentlyPlaying extends React.Component {
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
