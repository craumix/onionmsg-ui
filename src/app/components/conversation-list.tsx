import React from "react";
import { Link } from "react-router-dom";
import { deleteRoom, fetchRoomList } from "../api/api";
import styles from "./conversation-list.sass";
import { BsThreeDots } from "react-icons/bs";
import { FaCog, FaDoorOpen } from "react-icons/fa";
import { Dropdown } from "./dropdown";
import { Avatar } from "./avatar";
import { ConversationSettings } from "./overlay/conversation-settings";
import { ConfirmDialog } from "./overlay/confirm-dialog";

interface ConversationListProps {
  match?: any;
}

interface ConversationListState {
  elementFilter: string;
  elements: ConversationInfo[];
}

export class ConversationList extends React.Component<
  ConversationListProps,
  ConversationListState
> {
  constructor(props: ConversationListProps) {
    super(props);
    this.state = {
      elementFilter: "",
      elements: [],
    };
  }

  componentDidMount(): void {
    fetchRoomList()
      .then((res) => res.json())
      .then((result) => {
        this.setState({
          elements: result,
        });
      });
  }

  render(): JSX.Element {
    return (
      <ul
        style={{
          listStyle: "none",
          padding: "0px 4px",
          width: "100%",
          boxSizing: "border-box",
          margin: "4px 0px",
        }}
      >
        {this.state.elements.map((element) => {
          if (this.matchesFilter(element)) {
            return (
              <ConversationListElement
                info={element}
                key={element.uuid}
                selected={this.props.match.params.uuid == element.uuid}
              />
            );
          }
        })}
      </ul>
    );
  }

  setFilter(filter: string): void {
    this.setState({
      elementFilter: filter.toLocaleLowerCase(),
    });
  }

  pushConversations(...infos: ConversationInfo[]): void {
    let newElements = this.state.elements;
    infos.forEach((e) => {
      newElements.push(e);
    });

    this.setState({
      elements: newElements,
    });
  }

  matchesFilter(info: ConversationInfo): boolean {
    if (this.state.elementFilter === "") return true;

    if (info.uuid.toLocaleLowerCase().includes(this.state.elementFilter))
      return true;

    if (info.name?.toLocaleLowerCase().includes(this.state.elementFilter))
      return true;

    return false;
  }
}

interface ConversationListElementProps {
  info: ConversationInfo;
  selected?: boolean;
}

class ConversationListElement extends React.Component<ConversationListElementProps> {
  dropdownRef: React.RefObject<Dropdown>;
  convSettingsRef: React.RefObject<ConversationSettings>;
  dialogRef: React.RefObject<ConfirmDialog>;

  constructor(props: ConversationListElementProps) {
    super(props);

    this.dropdownRef = React.createRef();
    this.convSettingsRef = React.createRef();
    this.dialogRef = React.createRef();
  }

  render(): JSX.Element {
    return (
      <li
        className={`
      ${styles.listEntry} 
      ${this.props.selected ? styles.selectedEntry : ""}
      `}
      >
        <ConversationSettings
          ref={this.convSettingsRef}
          uuid={this.props.info.uuid}
        />
        <ConfirmDialog
          ref={this.dialogRef}
          title="Leave Room"
          onConfirm={() => {
            deleteRoom(this.props.info.uuid)
              .then((res) => res.text())
              .then((msg) => {
                console.log("Delete Room: " + msg);
              });
          }}
        >
          <p>
            {"Do you really want to leave room " + this.props.info.uuid + "?"}
          </p>
        </ConfirmDialog>
        <Link
          className={styles.entryLinkContainer}
          to={"/c/" + this.props.info.uuid}
        >
          <Avatar
            style={{
              width: "fit-content",
              height: "fit-content",
            }}
            size={32}
            seed={this.props.info.uuid}
            variant="marble"
          />
          <p
            style={{
              margin: "0px",
              marginLeft: "8px",
            }}
          >
            {this.props.info.name ?? this.props.info.uuid?.split("-")[0]}
          </p>
          <button
            style={{
              height: "20px",
              background: "none",
              marginLeft: "auto",
              marginRight: "10px",
            }}
            onClick={(event: React.MouseEvent<HTMLElement>) => {
              event.nativeEvent.preventDefault();
              event.stopPropagation();
              this.dropdownRef.current.show();
            }}
          >
            <BsThreeDots />
          </button>
        </Link>
        <div style={{ position: "relative" }}>
          <Dropdown
            top="-15px"
            right="10px"
            ref={this.dropdownRef}
            entries={[
              {
                onClick: () => {
                  this.convSettingsRef.current.show();
                },
                element: (
                  <div>
                    <FaCog style={{ float: "left" }} />
                    <p>Settings</p>
                  </div>
                ),
                spacer: true,
              },
              {
                onClick: () => {
                  this.dialogRef.current.show();
                },
                element: (
                  <div style={{ color: "#F00" }}>
                    <FaDoorOpen style={{ float: "left" }} />
                    <p>Leave Room</p>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </li>
    );
  }
}
