import React from "react";
import { Link } from "react-router-dom";
import { deleteRoom, fetchRoomList } from "../api/api";
import styles from "./room-list.sass";
import { BsThreeDots } from "react-icons/bs";
import { FaCog, FaDoorOpen } from "react-icons/fa";
import { Dropdown } from "./dropdown";
import { Avatar } from "./avatar";
import { RoomSettings } from "./overlay/room-settings";
import { ConfirmDialog } from "./overlay/confirm-dialog";

interface RoomListProps {
  match?: any;
}

interface RoomListState {
  elementFilter: string;
  elements: RoomInfo[];
}

export class RoomList extends React.Component<RoomListProps, RoomListState> {
  constructor(props: RoomListProps) {
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
        if (result != null)
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
              <RoomListElement
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

  pushRooms(...infos: RoomInfo[]): void {
    const newElements = this.state.elements;
    infos.forEach((e) => {
      newElements.push(e);
    });

    this.setState({
      elements: newElements,
    });
  }

  matchesFilter(info: RoomInfo): boolean {
    if (this.state.elementFilter === "") return true;

    if (info.uuid.toLocaleLowerCase().includes(this.state.elementFilter))
      return true;

    if (info.name?.toLocaleLowerCase().includes(this.state.elementFilter))
      return true;

    return false;
  }
}

interface RoomListElementProps {
  info: RoomInfo;
  selected?: boolean;
}

class RoomListElement extends React.Component<RoomListElementProps> {
  dropdownRef: React.RefObject<Dropdown>;
  convSettingsRef: React.RefObject<RoomSettings>;
  dialogRef: React.RefObject<ConfirmDialog>;

  constructor(props: RoomListElementProps) {
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
        <RoomSettings ref={this.convSettingsRef} uuid={this.props.info.uuid} />
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
            className={styles.entryOptions}
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
