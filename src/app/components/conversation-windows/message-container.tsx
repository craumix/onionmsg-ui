import React from "react";
import { decode as decode64 } from "js-base64";
import styles from "./message-container.sass";
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
          {this.displayComponent()}
        </div>
      </div>
    );
  }

  messageDate(): Date {
    return new Date(this.props.message.meta.time);
  }

  displayComponent(): JSX.Element {
    switch (this.props.message.content.type) {
      case "mtype.text":
        return (
          <MarkdownContent text={decode64(this.props.message.content.data)} />
        );
      case "mtype.cmd":
        return (
          <p style={{
            fontFamily: "monospace",
            color: "grey"
          }}>{"Command: " + decode64(this.props.message.content.data)}</p>
        )
      default:
        return <p>{JSON.stringify(this.props.message)}</p>;
    }
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
