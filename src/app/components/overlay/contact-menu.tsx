import React from "react";
import { AppOverlayMenu } from "./app-overlay";
import { WithContext as ReactTags } from "react-tag-input";
import styles from "./contact-menu.sass";
import {
  createContactID,
  createNewRoom,
  deleteContactID,
  fetchContactIDs,
} from "../../api/api";
import {
  FaCopy,
  FaSyncAlt,
  FaTrash,
  FaUserPlus,
} from "react-icons/fa";

const ContactIDLength = 43;

export class ContactMenu extends React.Component<unknown> {
  overlayRef: React.RefObject<AppOverlayMenu>;

  constructor(props: unknown) {
    super(props);

    this.overlayRef = React.createRef();
  }

  render(): JSX.Element {
    return (
      <AppOverlayMenu ref={this.overlayRef}>
        <h1>Create Rooms & Manage ContactID's</h1>
        <RoomCreationContainer overlayRef={this.overlayRef} />
        <hr />
        <ContactIDContainer />
      </AppOverlayMenu>
    );
  }

  show(): void {
    this.overlayRef.current.setState({
      visible: true,
    });
  }
}

interface TagElement {
  id: string;
  text: string;
}

interface RoomCreationContainerProps {
  overlayRef: React.RefObject<AppOverlayMenu>;
}

interface RoomCreationContainerState {
  tags: Array<TagElement>;
  awaitingRoomCreationResponse: boolean;
}

class RoomCreationContainer extends React.Component<
  RoomCreationContainerProps,
  RoomCreationContainerState
> {
  constructor(props: any) {
    super(props);

    this.state = {
      tags: [],
      awaitingRoomCreationResponse: false,
    };
  }
  render(): JSX.Element {
    return (
      <div>
        <ReactTags
          tags={this.state.tags}
          delimiters={[
            9, //TAB
            32, //SPACE
            188, //COMMA
            ...[10, 13], //ENTER
          ]}
          allowDragDrop={false}
          maxLength={ContactIDLength}
          placeholder="Enter a ContactID..."
          handleAddition={(tag: TagElement) => {
            if (tag.text.length == ContactIDLength) {
              this.setState((state) => ({ tags: [...state.tags, tag] }));
            } else {
              console.log(tag.text + " is not a valid ContactID");
            }
          }}
          handleDelete={(i: number) => {
            this.setState({
              tags: this.state.tags.filter((tag, index) => index !== i),
            });
          }}
          classNames={{
            selected: styles.tagContainer,
            tag: styles.tag,
            remove: styles.tagRemove,
            tagInputField: styles.tagInputField,
          }}
        />
        <button
          className={`
          ${styles.createRoomButton} 
          ${
            this.state.tags.length == 0 ||
            this.state.awaitingRoomCreationResponse
              ? styles.createRoomButtonDisabled
              : ""
          }
            `}
          onClick={() => {
            this.createRoom();
          }}
        >
          {this.state.awaitingRoomCreationResponse
            ? "Please wait..."
            : "Create Room"}
        </button>
      </div>
    );
  }

  createRoom(): void {
    let ids: Array<string> = [];

    this.state.tags.forEach((element: TagElement) => {
      ids.push(element.text);
    });

    this.setState({
      awaitingRoomCreationResponse: true,
    });
    createNewRoom(ids)
      .then((res) => {
        console.log("Room creation " + (res.status == 200 ? "ok" : "failed"));
        if (res.status == 200) {
          this.setState({
            tags: [],
          });
          this.props.overlayRef.current.setState({
            visible: false,
          });
        }
      })
      .then(() => {
        this.setState({
          awaitingRoomCreationResponse: false,
        });
      });
  }
}

interface ContactIDContainerState {
  ids: Array<string>;
}

class ContactIDContainer extends React.Component<
  unknown,
  ContactIDContainerState
> {
  constructor(props: unknown) {
    super(props);

    this.state = {
      ids: [],
    };
  }

  componentDidMount(): void {
    this.reloadContactIDs();
  }

  reloadContactIDs(): void {
    fetchContactIDs()
      .then((res) => res.json())
      .then((result) => {
        this.setState({
          ids: result != null ? result : [],
        });
      });
  }

  render(): JSX.Element {
    return (
      <div>
        <button
          className={styles.addContactIDButton}
          onClick={() => {
            createContactID()
              .then((res) => res.json())
              .then((result) => {
                if (result != null) {
                  this.setState({
                    ids: [...this.state.ids, result.id],
                  });
                }
              });
          }}
        >
          <FaUserPlus />
          Add Contact ID
        </button>
        <button
          className={styles.syncContactIDButton}
          onClick={() => {
            this.reloadContactIDs();
          }}
        >
          <FaSyncAlt />
        </button>
        <div className={styles.contactIDListContainer}>
          <li className={styles.contactIDList}>
            {this.state.ids.map((id: string) => {
              return (
                <ul key={id}>
                  {id}
                  <button
                    className={styles.contactIDListIcon}
                    onClick={() => {
                      deleteContactID(id).then((res) => {
                        if (res.status == 200) {
                          this.setState({
                            ids: this.state.ids.filter((item) => item !== id),
                          });
                        }
                        return res.text();
                      });
                    }}
                  >
                    <FaTrash
                      size="18"
                      style={{
                        color: "#F44",
                      }}
                    />
                  </button>
                  <button
                    className={styles.contactIDListIcon}
                    onClick={() => {
                      navigator.clipboard.writeText(id);
                    }}
                  >
                    <FaCopy
                      size="18"
                      style={{
                        color: "#AAA",
                      }}
                    />
                  </button>
                </ul>
              );
            })}
          </li>
        </div>
      </div>
    );
  }
}
