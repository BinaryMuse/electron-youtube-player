import React from "react":

class YoutubeThumbnail extends React.Component {
  render() {
    const { videoId, ...props } = this.props;

    return <img src={youtubeIdToThumbnailUrl(videoId)} {...props} />;
  }
}

YoutubeThumbnail.propTypes = {
  videoId: React.PropTypes.string.isRequired,
};
