import EmojiPicker from "emoji-picker-react";
import React from "react";
import { FileDrop } from "react-file-drop";
import {
  fetchRoomMessages,
  postFileToRoom,
  postMessageToRoom,
} from "../../api/api";
import { Avatar } from "../avatar";
import { MessageContainer } from "./message-container";
import styles from "./conversation-window.sass";
import { FaPaperclip, FaUpload } from "react-icons/fa";
import { BiSticker } from "react-icons/bi";
import { GrEmoji } from "react-icons/gr";
import { ConversationSettings } from "../overlay/conversation-settings";
const dialog = window.require("electron").remote.dialog;

export class ConversationWindow extends React.Component<any, any> {
  messagesEndRef: React.RefObject<HTMLDivElement>;
  convSettingsRef: React.RefObject<ConversationSettings>;

  constructor(props: any) {
    super(props);
    this.state = {
      messageInput: "",
      messagesContainers: [],
      lastMessageSenderUUID: "",
      emojiSelectorVisible: false,
    };

    this.messagesEndRef = React.createRef();
    this.convSettingsRef = React.createRef();
  }

  render(): JSX.Element {
    return (
      <div className={styles.conversationContainer}>
        <ConversationSettings ref={this.convSettingsRef} uuid={this.uuid()} />

        <FileDrop
          className={styles["file-drop"]}
          targetClassName={styles["file-drop-target"]}
          onDrop={(files, event) => {
            this.sendFiles(files);
          }}
        >
          <FaUpload size="48" style={{ color: "#888" }} />
          Upload File(s)
        </FileDrop>
        <div className={styles.conversationHeader}>
          <Avatar
            seed={this.uuid()}
            size={32}
            variant="marble"
            style={{ marginLeft: "8px" }}
          />
          <h1
            onClick={() => {
              this.convSettingsRef.current.show();
            }}
          >
            {this.uuid()}
          </h1>
        </div>
        <div
          style={{
            width: "100%",
            overflowX: "hidden",
            flexGrow: 1,
          }}
        >
          <div>{this.state.messagesContainers}</div>
          <div ref={this.messagesEndRef} />
        </div>
        <div className={styles.conversationFooter}>
          <textarea
            placeholder="Send a message here..."
            style={{
              border: "0px",
              outline: "none",
              margin: "8px",
              fontSize: "16px",
              resize: "none",
              flexGrow: 1,
            }}
            onPaste={(event) => {
              if (event.clipboardData.files.length > 0) {
                event.preventDefault();
                this.sendFiles(event.clipboardData.files);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();

                if (this.state.messageInput.length == 0) {
                  //Force-Reload
                  this.hardReloadMessages();
                  return;
                }

                postMessageToRoom(this.uuid(), this.state.messageInput).then(
                  (res) => {
                    if (res.ok) {
                      console.log("Message sent!");
                      this.setState({
                        messageInput: "",
                      });
                      this.loadNextMessage();
                    } else {
                      console.log("Error sending message!\n" + res.text);
                    }
                  }
                );
              }
            }}
            value={this.state.messageInput}
            onChange={(e) =>
              this.setState({
                messageInput: e.target.value,
              })
            }
          />
          <button
            onClick={() => {
              dialog
                .showOpenDialog(null, {
                  properties: ["openFile"],
                })
                .then((result) =>
                  result.filePaths.forEach((path) => {
                    this.sendSingleFile(path);
                  })
                );
            }}
          >
            <FaPaperclip size="20" />
          </button>
          <button
            onClick={() =>
              this.setState({
                emojiSelectorVisible: !this.state.emojiSelectorVisible,
              })
            }
          >
            <GrEmoji size="20" />
          </button>
          <button>
            <BiSticker size="20" />
          </button>
          <div
            hidden={!this.state.emojiSelectorVisible}
            style={{
              position: "absolute",
              bottom: "48px",
              right: "0px",
            }}
            onBlur={() => {
              this.setState({
                emojiSelectorVisible: false,
              });
            }}
          >
            <EmojiPicker
              native={true}
              onEmojiClick={(event, emojiObject) =>
                this.setState({
                  messageInput: this.state.messageInput + emojiObject.emoji,
                })
              }
            />
          </div>
        </div>
      </div>
    );
  }

  componentDidMount(): void {
    this.hardReloadMessages();
  }

  componentDidUpdate(prevProps: any): void {
    if (this.uuid() != prevProps.match.params.uuid) {
      this.hardReloadMessages();
    }
  }

  uuid(): string {
    return this.props.match.params.uuid;
  }

  sendFiles(files: FileList): void {
    Array.from(files).forEach((file) => {
      //TODO add some kind of dialog
      this.sendSingleFile(file);
    });
  }

  sendSingleFile(file: string | File): void {
    postFileToRoom(this.uuid(), file, (res: Response) => {
      if (res.ok) {
        console.log("File sent!");

        this.loadNextMessage();
      } else {
        console.log("Error sending file!\n" + res.text);
      }
    });
  }

  hardReloadMessages(): void {
    this.loadNewMessages(false).then(() =>
      this.scrollMessageContainerDown(true)
    );
  }

  loadNextMessage(count?: number): void {
    this.loadNewMessages(true, count ?? 1).then(() =>
      this.scrollMessageContainerDown()
    );
  }

  loadNewMessages(append: boolean, count?: number): Promise<void> {
    return fetchRoomMessages(this.uuid(), count)
      .then((res) => res.json())
      .then((result) => {
        const foo: JSX.Element[] = append ? this.state.messagesContainers : [];
        let lastSender = append ? this.state.lastMessageSenderUUID : "";
        if (result != null) {
          result.forEach((element: ChatMessage, index: number) => {
            if (lastSender != element.meta.sender) {
              foo.push(
                <AuthorDivider
                  author={element.meta.sender}
                  key={"author " + element.sig}
                />
              );
              lastSender = element.meta.sender;
            }
            foo.push(
              <MessageContainer
                convWindow={this}
                message={element}
                key={"message " + element.sig}
              />
            );
          });
        }

        this.setState({
          messagesContainers: foo,
          lastMessageSenderUUID: lastSender,
        });
      });
  }

  scrollMessageContainerDown(auto?: boolean): void {
    this.messagesEndRef.current.scrollIntoView({
      behavior: auto ? "auto" : "smooth",
    });
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
            color: "purple",
            fontWeight: "bold",
          }}
        >
          {this.props.author}
        </p>
      </div>
    );
  }
}
