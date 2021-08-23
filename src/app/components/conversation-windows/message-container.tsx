import React from "react";
import { decode as decode64 } from "js-base64";
import styles from "./message-container.sass";
import { MarkdownContent } from "./markdown-content";
import { FaPaperclip } from "react-icons/fa";
import { constructAPIUrl } from "../../api/api";
import prettyBytes from "pretty-bytes";
import { findYoutubeIDs } from "../../utils/youtube";
import { YoutubeContainer } from "./youtube-container";

interface MessageContainerProps {
  message: ChatMessage;
}

export class MessageContainer extends React.Component<MessageContainerProps> {
  render(): JSX.Element {
    return (
      <div className={styles.messageContainer}>
        <p title={this.longTimestamp()} className={styles.messageTimestamp}>
          {this.shortTimestamp()}
        </p>
        <div className={styles.contentContainer}>{this.displayComponent()}</div>
      </div>
    );
  }

  displayComponent(): JSX.Element {
    let msgContent = this.props.message.content;
    let msgText = decode64(msgContent.data ?? "");

    switch (msgContent.type) {
      case "mtype.text":
        //TODO prevent loading ressources from urls
        return (
          <div>
            <div className={styles.markdownContainer}>
              <MarkdownContent text={msgText} />
            </div>

            {findYoutubeIDs(msgText).map((id: string) => (
              <YoutubeContainer id={id} key={id} />
            ))}
          </div>
        );
      case "mtype.cmd":
        return (
          <p
            style={{
              fontFamily: "monospace",
              color: "grey",
            }}
          >
            {"Command: " + msgText}
          </p>
        );

      //TODO move this to a component
      case "mtype.file":
        let blobUrl = constructAPIUrl(
          "/blob",
          new Map([
            ["uuid", msgContent.meta.blobUUID],
            ["filename", msgContent.meta.filename],
          ])
        );

        let fileFooter = (
          <a
            href={blobUrl}
            download={msgContent.meta.filename}
            style={{
              textDecoration: "none",
            }}
          >
            Download{" "}
            {msgContent.meta.filename +
              " (" +
              prettyBytes(msgContent.meta.filesize ?? 0) +
              ")"}
          </a>
        );

        let mainFileElement: JSX.Element;
        switch (msgContent.meta.mimetype?.split("/")[0]) {
          case "image":
            mainFileElement = <img src={blobUrl} />;
            break;
          case "video":
            mainFileElement = (
              <video
                controls
                controlsList="nodownload noremoteplayback"
                disablePictureInPicture
                preload="metadata"
              >
                <source src={blobUrl} type={msgContent.meta.mimetype} />
                The format {msgContent.meta.mimetype} is not supported!
              </video>
            );
            break;
          case "audio":
            mainFileElement = (
              <audio
                controls
                controlsList="nodownload"
                style={{
                  height: "48px",
                  width: "384px",
                }}
                preload="metadata"
              >
                <source src={blobUrl} type={msgContent.meta.mimetype} />
                The format {msgContent.meta.mimetype} is not supported!
              </audio>
            );
            break;
          default:
            mainFileElement = (
              <div
                style={{
                  width: "fit-content",
                  height: "32px",
                  lineHeight: "32px",
                  backgroundColor: "#DDD",
                  color: "#444",
                  borderRadius: "8px",
                  padding: "4px",
                }}
              >
                <div className={styles.attachmentIconBox}>
                  <FaPaperclip style={{ color: "#AAA" }} />
                </div>
                {msgContent.meta.filename}
              </div>
            );
        }

        return (
          <div>
            {mainFileElement}
            <br />
            {fileFooter}
          </div>
        );
      default:
        return <p>{JSON.stringify(this.props.message)}</p>;
    }
  }

  messageDate(): Date {
    return new Date(this.props.message.meta.time);
  }

  shortTimestamp(): string {
    return this.messageDate().toLocaleTimeString(navigator.language, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  longTimestamp(): string {
    return this.messageDate().toLocaleString();
  }
}
