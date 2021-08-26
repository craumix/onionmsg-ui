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
import { FaUpload } from "react-icons/fa";

export class ConversationWindow extends React.Component<any, any> {
  messagesEndRef: React.RefObject<HTMLDivElement>;

  constructor(props: any) {
    super(props);
    this.state = {
      messageInput: "",
      messagesContainers: [],
      lastMessageSenderUUID: "",
      emojiSelectorVisible: false,
    };

    this.messagesEndRef = React.createRef();
  }

  render(): JSX.Element {
    return (
      <div
        style={{
          background: "white",
          position: "absolute",
          top: "0px",
          left: "250px",
          height: "100%",
          width: "calc(100% - 250px)",
          margin: "0px",
          padding: "0px",
        }}
      >
        <FileDrop
          className={styles["file-drop"]}
          targetClassName={styles["file-drop-target"]}
          onDrop={(files, event) => {
            Array.from(files).forEach((file) => {
              //TODO add some kind of dialog
              postFileToRoom(this.props.match.params.uuid, file).then((res) => {
                if (res.ok) {
                  console.log("File sent!");

                  this.loadNextMessage();
                } else {
                  console.log("Error sending file!\n" + res.text);
                }
              });
            });
          }}
        >
          <FaUpload size="48" style={{ color: "#888" }} />
          Upload File(s)
        </FileDrop>
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "32px",
          }}
        >
          <h1
            style={{
              margin: "0px",
              marginLeft: "8px",
              marginTop: "8px",
              fontSize: "20px",
            }}
          >
            {this.props.match.params.uuid}
          </h1>
        </div>
        <div
          style={{
            position: "absolute",
            top: "32px",
            height: "calc(100% - 96px)",
            width: "100%",
            overflowX: "hidden",
          }}
        >
          <div>{this.state.messagesContainers}</div>
          <div ref={this.messagesEndRef} />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "0px",
            width: "100%",
            height: "64px",
          }}
        >
          <textarea
            placeholder="Send a message here..."
            style={{
              border: "0px",
              outline: "none",
              margin: "16px",
              fontSize: "16px",
              width: "80%",
              resize: "none",
              float: "left",
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();

                if (this.state.messageInput.length == 0) {
                  //Force-Reload
                  this.hardReloadMessages();
                  return;
                }

                postMessageToRoom(
                  this.props.match.params.uuid,
                  this.state.messageInput
                ).then((res) => {
                  if (res.ok) {
                    console.log("Message sent!");
                    this.setState({
                      messageInput: "",
                    });
                    this.loadNextMessage();
                  } else {
                    console.log("Error sending message!\n" + res.text);
                  }
                });
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
            style={{
              border: "0px",
              background: "white",
              fontSize: "20px",
            }}
            onClick={() =>
              this.setState({
                emojiSelectorVisible: !this.state.emojiSelectorVisible,
              })
            }
          >
            😃
          </button>
          <div
            hidden={!this.state.emojiSelectorVisible}
            style={{
              position: "absolute",
              bottom: "64px",
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
    if (this.props.match.params.uuid != prevProps.match.params.uuid) {
      this.hardReloadMessages();
    }
  }

  hardReloadMessages(): void {
    this.loadNewMessages(false).then(() =>
      this.scrollMessageContainerDown(true)
    );
  }

  loadNextMessage(): void {
    this.loadNewMessages(true, 1).then(() => this.scrollMessageContainerDown());
  }

  loadNewMessages(append: boolean, count?: number): Promise<void> {
    return fetchRoomMessages(this.props.match.params.uuid, count)
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
              <MessageContainer message={element} key={"message " + element.sig} />
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
            borderRadius: "16px",
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
