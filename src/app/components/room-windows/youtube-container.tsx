import React from "react";
import { FaPlay } from "react-icons/fa";
import YouTube from "react-youtube";
import {
  constructYoutubeLink,
  getYoutubeVideoMeta,
  YoutubeVideoMeta,
} from "../../utils/youtube";
import styles from "./youtube-container.sass";

interface YoutubeContainerProps {
  id: string;
  start?: number;
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
          href={constructYoutubeLink(this.props.id)}
        >
          {this.state.videoMeta?.title}
        </a>
        <div className={styles.videoContainer}>
          {this.state.showVideo ? (
            <YouTube
              videoId={this.props.id}
              className={styles.videoFrame}
              opts={{
                playerVars: {
                  enablejsapi: 0,
                  autoplay: 1,
                  modestbranding: 1,
                  start: this.props.start ?? 0,
                },
              }}
            />
          ) : (
            <div
              style={{
                position: "relative",
                cursor: "pointer",
              }}
              onClick={() =>
                this.setState({
                  showVideo: true,
                })
              }
            >
              <img
                src={this.state.videoMeta?.thumbnail_url}
                style={{
                  position: "relative",
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
              />
              <div className={styles.playButton}>
                <FaPlay size="24" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
