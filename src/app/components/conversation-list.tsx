import React from "react";
import { Link } from "react-router-dom";
import { deleteRoom, fetchRoomList } from "../api/api";
import styles from "./conversation-list.sass";
import { BsThreeDots } from "react-icons/bs";
import { FaCog, FaDoorOpen } from "react-icons/fa";
import { Dropdown } from "./dropdown";
import { Avatar } from "./avatar";

interface ConversationInfo {
  uuid: string;
  self: string;
  peers: string[];
  name: string;
  nicks: Map<string, string>;
}

interface ConversationListState {
  elementFilter: string;
  elements: ConversationInfo[];
  selectedUUID?: string;
}

export class ConversationList extends React.Component<
  unknown,
  ConversationListState
> {
  constructor(props: unknown) {
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
                parent={this}
                key={element.uuid}
                selected={this.state.selectedUUID == element.uuid}
              />
            );
          }
        })}
      </ul>
    );
  }

  setSelectedElement(select: string): void {
    this.setState({
      selectedUUID: select,
    });
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
  parent: ConversationList;
  selected?: boolean;
}

class ConversationListElement extends React.Component<ConversationListElementProps> {
  dropdownRef: React.RefObject<Dropdown>;
  constructor(props: ConversationListElementProps) {
    super(props);

    this.dropdownRef = React.createRef();
  }

  render(): JSX.Element {
    return (
      //FIXME
      <li
        className={`
      ${styles.listEntry} 
      ${this.props.selected ? styles.selectedEntry : ""}
      `}
      >
        <Link
          className={styles.entryLinkContainer}
          to={"/c/" + this.props.info.uuid}
          onClick={() => {
            this.props.parent.setSelectedElement(this.props.info.uuid);
          }}
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
                  deleteRoom(this.props.info.uuid)
                    .then((res) => res.text())
                    .then((msg) => {
                      console.log("Delete Room: " + msg);
                    });
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
