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
        let fileFooter = (
          <a
            href={constructAPIUrl(
              "/blob",
              new Map([
                ["uuid", msgContent.meta.blobUUID],
                ["filename", msgContent.meta.filename],
              ])
            )}
            download={msgContent.meta.filename}
            style={{
              textDecoration: "none",
            }}
          >
            Download {msgContent.meta.filename}
          </a>
        );

        switch (msgContent.meta.mimetype) {
          default:
            return (
              <div>
                <div className={styles.attachmentIconBox}>
                  <FaPaperclip style={{ color: "#AAA" }} />
                </div>
                {fileFooter}
              </div>
            );
        }
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
