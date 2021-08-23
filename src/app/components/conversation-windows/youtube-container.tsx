import React from "react";
import { FaPlay } from "react-icons/fa";
import YouTube from "react-youtube";
import {
  constructYoutbeLink,
  getYoutubeVideoMeta,
  YoutubeVideoMeta,
} from "../../utils/youtube";
import styles from "./youtube-container.sass";

interface YoutubeContainerProps {
  id: string;
}

interface YoutubeContainerState {
  showVideo: boolean;
  videoMeta: YoutubeVideoMeta;
}

export class YoutubeContainer extends React.Component<
  YoutubeContainerProps,
  YoutubeContainerState
> {
  constructor(props: YoutubeContainerProps) {
    super(props);

    this.state = {
      showVideo: false,
      videoMeta: undefined,
    };
  }

  componentDidMount(): void {
    getYoutubeVideoMeta(this.props.id).then((meta) =>
      this.setState({ videoMeta: meta })
    );
  }

  render(): JSX.Element {
    return (
      <div className={styles.youtubeContainer}>
        <p
          style={{
            fontSize: "12px",
            color: "#888",
          }}
        >
          YouTube
        </p>
        <p
          style={{
            fontWeight: "bold",
          }}
        >
          {this.state.videoMeta?.author_name}
        </p>
        <a
          style={{
            textDecoration: "none",
            fontWeight: "bold",
          }}
          href={constructYoutbeLink(this.props.id)}
        >
          {this.state.videoMeta?.title}
        </a>
        <div className={styles.videoContainer}>
          {this.state.showVideo ? (
            <YouTube
              videoId={this.props.id}
              className={styles.videoFrame}
              opts={{
                width: "100%",
                height: "100%",
                playerVars: {
                  autoplay: 1,
                  modestbranding: 1,
                },
              }}
            />
          ) : (
            <div style={{
                position: "relative"
            }}>
              <img
                src={this.state.videoMeta?.thumbnail_url}
                style={{
                  position: "relative",
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
              />
              <button
                className={styles.playButton}
                onClick={() =>
                  this.setState({
                    showVideo: true,
                  })
                }
              >
                <FaPlay size="24"/>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
