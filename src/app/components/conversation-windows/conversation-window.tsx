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
import { FaBackspace, FaFile, FaPaperclip, FaUpload } from "react-icons/fa";
import { BiSticker } from "react-icons/bi";
import { GrEmoji } from "react-icons/gr";
import { ConversationSettings } from "../overlay/conversation-settings";
import { ConfirmDialog } from "../overlay/confirm-dialog";
import {
  filesizeFromPath,
  filenameFromPath,
  readFileBytes,
} from "../../utils/file";
import prettyBytes from "pretty-bytes";
import mime from "mime";
import { rndColorFromString } from "../../utils/color";
const dialog = window.require("electron").remote.dialog;

interface ConversationWindowState {
  messageInput: string;
  messageContainers: JSX.Element[];
  lastMessageSenderUUID: string;
  emojiSelectorVisible: boolean;
  fileUploadPreview: JSX.Element;
  onUploadConfirm: () => void;
  replyTo: ChatMessage;
}

export class ConversationWindow extends React.Component<
  any,
  ConversationWindowState
> {
  messagesEndRef: React.RefObject<HTMLDivElement>;
  convSettingsRef: React.RefObject<ConversationSettings>;
  uploadConfirmDialog: React.RefObject<ConfirmDialog>;

  constructor(props: any) {
    super(props);
    this.state = {
      messageInput: "",
      messageContainers: [],
      lastMessageSenderUUID: "",
      emojiSelectorVisible: false,
      fileUploadPreview: null,
      onUploadConfirm: () => {},
      replyTo: undefined,
    };

    this.messagesEndRef = React.createRef();
    this.convSettingsRef = React.createRef();
    this.uploadConfirmDialog = React.createRef();
  }

  render(): JSX.Element {
    return (
      <div
        className={`${styles.conversationContainer} ${this.props.className}`}
      >
        <ConversationSettings ref={this.convSettingsRef} uuid={this.uuid()} />
        <ConfirmDialog
          ref={this.uploadConfirmDialog}
          title="Upload file"
          onConfirm={this.state.onUploadConfirm}
        >
          {this.state.fileUploadPreview}
        </ConfirmDialog>

        <FileDrop
          className={styles["file-drop"]}
          targetClassName={styles["file-drop-target"]}
          onDrop={(files, event) => {
            this.sendFiles(Array.from(files));
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
            style={{
              whiteSpace: "nowrap",
            }}
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
          <div>{this.state.messageContainers}</div>
          <div ref={this.messagesEndRef} />
        </div>
        {this.state.replyTo ? (
          <div
            style={{
              //TODO fix height to use scroll
              maxHeight: "33%",
              //overflowY: "scroll",
              backgroundColor: "#FFF",
              width: "100%",
              boxShadow: "10px -10px 5px -3px #CCC",
              borderRadius: "0px",
              display: "flex",
              flexDirection: "column",
              zIndex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "8px",
                flexShrink: 0,
                color: "#AAA",
              }}
            >
              <p style={{ margin: "4px 0px" }}>Replying</p>
              <button
                style={{ backgroundColor: "#FFF" }}
                onClick={() => this.clearToReply()}
              >
                <FaBackspace
                  style={{
                    color: "#AAA",
                  }}
                  size="20"
                />
              </button>
            </div>
            <div style={{ overflowY: "scroll" }}>
              <MessageContainer
                authorHeader={true}
                message={this.state.replyTo}
                autoHideTimestamp={false}
              />
            </div>
          </div>
        ) : null}
        <div className={styles.conversationFooter}>
          <textarea
            placeholder="Send a message here..."
            className={styles.inputField}
            onPaste={(event) => {
              if (event.clipboardData.files.length > 0) {
                event.preventDefault();
                this.sendFiles(Array.from(event.clipboardData.files));
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

                postMessageToRoom(
                  this.uuid(),
                  this.state.messageInput,
                  this.state.replyTo
                ).then((res) => {
                  if (res.ok) {
                    console.log("Message sent!");
                    this.setState({
                      messageInput: "",
                    });

                    this.clearToReply();

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
            onClick={() => {
              dialog
                .showOpenDialog(null, {
                  properties: ["openFile", "multiSelections"],
                })
                .then((result) => this.sendFiles(result.filePaths));
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
              zIndex: 1
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
      this.clearToReply();
    }
  }

  uuid(): string {
    return this.props.match.params.uuid;
  }

  sendFiles(files: File[] | string[], index = 0): void {
    if (index < files.length) {
      this.sendSingleFile(files[index], () => {
        this.sendFiles(files, index + 1);
      });
    }
  }

  //TODO freeze hell
  sendSingleFile(file: string | File, onSuccess?: () => void): void {
    //8 MiB
    const uploadPreviewMaxSize = 8388608;

    const showDialog = (
      filename: string,
      filesize: number,
      imgURL?: string
    ) => {
      this.setState({
        fileUploadPreview: (
          <div>
            {
              //TODO add alternative for non images
            }
            {imgURL && (
              <img
                style={{ maxWidth: "100%", maxHeight: "100%" }}
                src={imgURL}
              />
            )}
            <p style={{ margin: "2px" }}>
              {filename + " (" + prettyBytes(filesize) + ")"}
            </p>
          </div>
        ),
        onUploadConfirm: () => {
          postFileToRoom(
            this.uuid(),
            file,
            (res: Response) => {
              if (res.ok) {
                this.clearToReply();

                this.loadNextMessage();

                if (onSuccess) {
                  onSuccess();
                }
              } else {
                console.log("Error sending file!\n" + res.text);
              }
            },
            this.state.replyTo
          );
        },
      });
      this.uploadConfirmDialog.current.show();
    };

    if (typeof file === "string") {
      const filename = filenameFromPath(file);
      const filesize = filesizeFromPath(file);

      if (
        mime.getType(filename).startsWith("image") &&
        filesize <= uploadPreviewMaxSize
      ) {
        //TODO handle error properly
        readFileBytes(file, (err, data) => {
          if (err) console.log(err);
          showDialog(
            filename,
            filesize,
            URL.createObjectURL(new Blob([new Uint8Array(data)]))
          );
        });
      } else {
        showDialog(filename, filesize);
      }
    } else {
      showDialog(
        file.name,
        file.size,
        file.type.startsWith("image") ? URL.createObjectURL(file) : undefined
      );
    }
  }

  hardReloadMessages(): void {
    this.loadNewMessages(false).then(() =>
      this.scrollMessageContainerDown(true)
    );
  }

  loadNextMessage(count = 1): void {
    this.loadNewMessages(true, count).then(() =>
      this.scrollMessageContainerDown()
    );
  }

  loadNewMessages(append: boolean, count?: number): Promise<void> {
    return fetchRoomMessages(this.uuid(), count)
      .then((res) => res.json())
      .then((result) => {
        const foo: JSX.Element[] = append ? this.state.messageContainers : [];
        let lastSender = append ? this.state.lastMessageSenderUUID : "";

        if (result != null) {
          result.forEach((element: ChatMessage, index: number) => {
            const showHeader = lastSender != element.meta.sender;
            if (showHeader) {
              lastSender = element.meta.sender;
            }

            foo.push(
              <MessageContainer
                message={element}
                key={element.sig}
                authorHeader={showHeader}
                parentContainer={this}
              />
            );
          });
        }

        this.setState({
          messageContainers: foo,
          lastMessageSenderUUID: lastSender,
        });
      });
  }

  scrollMessageContainerDown(auto?: boolean): void {
    this.messagesEndRef.current.scrollIntoView({
      behavior: auto ? "auto" : "smooth",
    });
  }

  setMessageToReply(msg: ChatMessage): void {
    this.setState({
      replyTo: msg,
    });
  }

  clearToReply(): void {
    this.setState({
      replyTo: undefined,
    });
  }
}
