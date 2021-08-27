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

interface MessageContainerProps {
  message: ChatMessage;
  convWindow: ConversationWindow;
}

interface MessageContainerState {
  optionsDropdownVisible: boolean;
}

export class MessageContainer extends React.Component<
  MessageContainerProps,
  MessageContainerState
> {
  optionsDropdownRef: React.RefObject<Dropdown>;

  constructor(props: MessageContainerProps) {
    super(props);

    this.state = {
      optionsDropdownVisible: false,
    };

    this.optionsDropdownRef = React.createRef();
  }

  render(): JSX.Element {
    let dropdownEntries: DropdownEntry[] = [
      {
        element: (
          <div>
            <FaCode style={{ float: "left" }} />
            <p>Message Source</p>
          </div>
        ),
      },
    ];

    if (this.props.message.content.type === "mtype.text") {
      dropdownEntries.push({
        onClick: () => {
          let newText =
            this.decodedMessageText().replace(/^/gm, "> ") +
            "\n\n" +
            this.props.convWindow.state.messageInput;

          this.props.convWindow.setState({
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
      <div
        className={`${styles.messageContainer} ${
          this.state?.optionsDropdownVisible ? styles.dropdownVisible : ""
        }`}
      >
        <div className={styles.messageOptionsMenu}>
          <button title="Reply">
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
        <p title={this.longTimestamp()} className={styles.messageTimestamp}>
          {this.shortTimestamp()}
        </p>
        <div className={styles.contentContainer}>{this.displayComponent()}</div>
      </div>
    );
  }

  decodedMessageText(): string {
    return decode64(this.props.message.content.data ?? "");
  }

  displayComponent(): JSX.Element {
    let msgContent = this.props.message.content;

    switch (msgContent.type) {
      case "mtype.text":
        //TODO prevent loading ressources from urls
        return (
          <div>
            <div className={styles.markdownContainer}>
              <MarkdownContent text={this.decodedMessageText()} />
            </div>
            {findYoutubeIDs(this.decodedMessageText()).map((id: string) => (
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
            {"Command: " + this.decodedMessageText()}
          </p>
        );
      case "mtype.file":
        return <FileMessageContainer msgContent={this.props.message.content} />;
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
        ["uuid", this.props.msgContent.meta.blobUUID],
        ["filename", this.props.msgContent.meta.filename],
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
          download={this.props.msgContent.meta.filename}
          style={{
            textDecoration: "none",
          }}
        >
          Download{" "}
          {this.props.msgContent.meta.filename +
            " (" +
            prettyBytes(this.props.msgContent.meta.filesize ?? 0) +
            ")"}
        </a>
      </div>
    );
  }

  filePreview(): JSX.Element {
    switch (this.props.msgContent.meta.mimetype?.split("/")[0]) {
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
            <source
              src={this.blobUrl}
              type={this.props.msgContent.meta.mimetype}
            />
            The format {this.props.msgContent.meta.mimetype} is not supported!
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
            <source
              src={this.blobUrl}
              type={this.props.msgContent.meta.mimetype}
            />
            The format {this.props.msgContent.meta.mimetype} is not supported!
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
            {this.props.msgContent.meta.filename}
          </div>
        );
    }
  }
}
