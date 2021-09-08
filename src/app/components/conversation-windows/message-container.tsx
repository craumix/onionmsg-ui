import React from "react";
import { decode as decode64 } from "js-base64";
import styles from "./message-container.sass";
import { MarkdownContent } from "./markdown-content";
import { FaCode, FaPaperclip, FaQuoteLeft, FaReply } from "react-icons/fa";
import { constructAPIUrl } from "../../api/api";
import prettyBytes from "pretty-bytes";
import { findYoutubeIDs } from "../../utils/youtube";
import { YoutubeContainer } from "./youtube-container";
import { BsThreeDots } from "react-icons/bs";
import { Dropdown, DropdownEntry } from "../dropdown";
import { ConversationWindow } from "./conversation-window";
import { MessageSource } from "../overlay/message-source";
import { rndColorFromString } from "../../utils/color";
import { Avatar } from "../avatar";

interface MessageContainerProps {
  message: ChatMessage;
  authorHeader?: boolean;
  parentContainer?: ConversationWindow;
  autoHideTimestamp?: boolean;
}

interface MessageContainerState {
  optionsDropdownVisible: boolean;
}

export class MessageContainer extends React.Component<
  MessageContainerProps,
  MessageContainerState
> {
  optionsDropdownRef: React.RefObject<Dropdown>;
  messageSourceRef: React.RefObject<MessageSource>;

  public static defaultProps = {
    autoHideTimestamp: true,
  };

  constructor(props: MessageContainerProps) {
    super(props);

    this.state = {
      optionsDropdownVisible: false,
    };

    this.optionsDropdownRef = React.createRef();
    this.messageSourceRef = React.createRef();
  }

  render(): JSX.Element {
    const dropdownEntries: DropdownEntry[] = [
      {
        element: (
          <div>
            <FaCode style={{ float: "left" }} />
            <p>Message Source</p>
          </div>
        ),
        onClick: () => {
          this.messageSourceRef.current.show();
        },
      },
    ];

    if (this.props.message.content.type === "mtype.text") {
      dropdownEntries.push({
        onClick: () => {
          const newText =
            this.decodedMessageText().replace(/^/gm, "> ") +
            "\n\n" +
            this.props.parentContainer.state.messageInput;

          this.props.parentContainer.setState({
            messageInput: newText,
          });
        },
        element: (
          <div>
            <FaQuoteLeft style={{ float: "left" }} />
            <p>Quote</p>
          </div>
        ),
      });
    }

    return (
      <div>
        {this.props.authorHeader ? (
          <AuthorDivider author={this.props.message.meta.sender} />
        ) : null}

        <div
          className={`${styles.messageContainer} ${
            this.state?.optionsDropdownVisible ? styles.dropdownVisible : ""
          } ${this.isTopLevel() ? styles.topLevelMessageContainer : ""}`}
        >
          <p
            title={this.longTimestamp()}
            className={`${styles.messageTimestamp} ${
              this.props.autoHideTimestamp ? "" : styles.showTimestamp
            }`}
          >
            {this.shortTimestamp()}
          </p>

          {this.props.message.content.replyto ? (
            <blockquote style={{ marginLeft: "64px", padding: "0px" }}>
              <MessageContainer
                message={this.props.message.content.replyto}
                authorHeader={true}
                autoHideTimestamp={this.props.autoHideTimestamp}
              />
            </blockquote>
          ) : null}

          {this.isTopLevel() ? (
            <div>
              <div className={styles.messageOptionsMenu}>
                <button
                  onClick={() => {
                    this.props.parentContainer.setMessageToReply(
                      this.props.message
                    );
                  }}
                  title="Reply"
                >
                  <FaReply />
                </button>
                <button
                  onClick={() => {
                    this.optionsDropdownRef.current.show();
                  }}
                  title="Options"
                >
                  <BsThreeDots />
                </button>
              </div>
              <Dropdown
                top="4px"
                right="8px"
                onShow={() => {
                  this.setState({
                    optionsDropdownVisible: true,
                  });
                }}
                onHide={() => {
                  this.setState({
                    optionsDropdownVisible: false,
                  });
                }}
                ref={this.optionsDropdownRef}
                entries={dropdownEntries}
              />
              <MessageSource
                ref={this.messageSourceRef}
                message={this.props.message}
              />
            </div>
          ) : null}

          <div className={styles.contentContainer}>
            {this.displayComponent()}
          </div>
        </div>
      </div>
    );
  }

  decodedMessageText(): string {
    return decode64(this.props.message.content.data ?? "");
  }

  displayComponent(): JSX.Element {
    const msgContent = this.props.message.content;

    switch (msgContent.type) {
      case "mtype.text":
        //TODO prevent loading ressources from urls
        return (
          <div>
            <div className={styles.markdownContainer}>
              <MarkdownContent text={this.decodedMessageText()} />
            </div>
            {findYoutubeIDs(this.decodedMessageText()).map(
              (video: [string, number]) => (
                <YoutubeContainer
                  id={video[0]}
                  start={video[1]}
                  key={video[0]}
                />
              )
            )}
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
            {"Command: " + this.decodedMessageText()}
          </p>
        );
      case "mtype.file":
        return <FileMessageContainer msgContent={this.props.message.content} />;
      default:
        return <pre>{JSON.stringify(this.props.message, null, 2)}</pre>;
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

  isTopLevel(): boolean {
    //TODO
    return this.props.parentContainer ? true : false;
  }
}

interface FileMessageContainerProps {
  msgContent: MessageContent;
}

class FileMessageContainer extends React.Component<FileMessageContainerProps> {
  blobUrl: string;

  constructor(props: FileMessageContainerProps) {
    super(props);

    this.blobUrl = constructAPIUrl(
      "/blob",
      new Map([
        ["uuid", this.props.msgContent.blob.uuid],
        ["filename", this.props.msgContent.blob.name],
      ])
    );
  }

  render(): JSX.Element {
    return (
      <div>
        {this.filePreview()}
        <br />
        <a
          href={this.blobUrl}
          download={this.props.msgContent.blob.name}
          style={{
            textDecoration: "none",
            color: "blueviolet",
          }}
        >
          Download{" "}
          {this.props.msgContent.blob.name +
            " (" +
            prettyBytes(this.props.msgContent.blob.size ?? 0) +
            ")"}
        </a>
      </div>
    );
  }

  filePreview(): JSX.Element {
    switch (this.props.msgContent.blob.type?.split("/")[0]) {
      case "image":
        return <img src={this.blobUrl} />;
      case "video":
        return (
          <video
            controls
            controlsList="nodownload noremoteplayback"
            disablePictureInPicture
            preload="metadata"
          >
            <source src={this.blobUrl} type={this.props.msgContent.blob.type} />
            The format {this.props.msgContent.blob.type} is not supported!
          </video>
        );
      case "audio":
        return (
          <audio
            controls
            controlsList="nodownload"
            style={{
              height: "48px",
              width: "384px",
            }}
            preload="metadata"
          >
            <source src={this.blobUrl} type={this.props.msgContent.blob.type} />
            The format {this.props.msgContent.blob.type} is not supported!
          </audio>
        );
      default:
        return (
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
            {this.props.msgContent.blob.name}
          </div>
        );
    }
  }
}

class AuthorDivider extends React.Component<any> {
  render(): JSX.Element {
    return (
      <div
        style={{
          width: "calc(100% - 16px)",
          height: "fit-content",
          marginTop: "16px",
          marginLeft: "8px",
          marginRight: "8px",
          marginBottom: "16px",
        }}
      >
        <Avatar
          style={{
            marginLeft: "16px",
            marginBottom: "-8px",
            float: "left",
            userSelect: "none",
          }}
          seed={this.props.author}
          size={32}
        />
        <p
          style={{
            margin: "0px",
            marginTop: "8px",
            marginLeft: "64px",
            fontSize: "14px",
            color: rndColorFromString(this.props.author),
            fontWeight: "bold",
          }}
        >
          {this.props.author}
        </p>
      </div>
    );
  }
}
