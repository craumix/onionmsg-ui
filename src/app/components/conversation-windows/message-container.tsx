import React from "react";
import { decode as decode64 } from "js-base64";
import styles from "./message-container.sass";
import { MarkdownContent } from "./markdown-content";
import { FaPaperclip } from "react-icons/fa";
import { constructAPIUrl } from "../../api/api";

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
        <div className={styles.markdownContainer}>
          {this.displayComponent()}
        </div>
      </div>
    );
  }

  displayComponent(): JSX.Element {
    let msgContent = this.props.message.content;

    switch (msgContent.type) {
      case "mtype.text":
        return <MarkdownContent text={decode64(msgContent.data)} />;
      case "mtype.cmd":
        return (
          <p
            style={{
              fontFamily: "monospace",
              color: "grey",
            }}
          >
            {"Command: " + decode64(msgContent.data)}
          </p>
        );
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
            Download {msgContent.meta.filename}
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
              <div className={styles.attachmentIconBox}>
                <FaPaperclip style={{ color: "#AAA" }} />
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
