import React from "react";
import { decode as decode64 } from "js-base64";
import styles from "./message-container.sass"
import { MarkdownContent } from "./markdown-content";

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
          <MarkdownContent text={decode64(this.props.message.content)} />
        </div>
      </div>
    );
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
