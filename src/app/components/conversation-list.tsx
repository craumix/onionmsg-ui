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
  listElements: JSX.Element[];
  listElementRefs: React.RefObject<ConversationListElement>[];
}

export class ConversationList extends React.Component<
  unknown,
  ConversationListState
> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      listElements: [],
      listElementRefs: [],
    };
  }

  componentDidMount(): void {
    fetchRoomList()
      .then((res) => res.json())
      .then((result) => {
        if (result != null) {
          this.setState({
            listElements: [],
            listElementRefs: [],
          });

          result.forEach((element: ConversationInfo) => {
            this.appendRoom(element);
          });
        }
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
        {this.state.listElements}
      </ul>
    );
  }

  setSelectedElement(select: ConversationListElement): void {
    this.state.listElementRefs.forEach(
      (element: React.RefObject<ConversationListElement>) => {
        element.current.setState({
          selected: select == element.current,
        });
      }
    );
  }

  appendRoom(info: ConversationInfo): void {
    let refs = this.state.listElementRefs;
    let list = this.state.listElements;

    refs.push(React.createRef());
    list.push(
      <ConversationListElement
        info={info}
        parent={this}
        key={info.uuid}
        ref={refs[refs.length - 1]}
      />
    );

    this.setState({
      listElementRefs: refs,
      listElements: list,
    });
  }
}

interface ConversationListElementProps {
  info: ConversationInfo;
  parent: ConversationList;
}

interface ConversationListElementState {
  selected: boolean;
}

class ConversationListElement extends React.Component<
  ConversationListElementProps,
  ConversationListElementState
> {
  dropdownRef: React.RefObject<Dropdown>;
  constructor(props: ConversationListElementProps) {
    super(props);
    this.state = {
      selected: false,
    };

    this.dropdownRef = React.createRef();
  }

  render(): JSX.Element {
    return (
      //FIXME
      <li
        className={`
      ${styles.listEntry} 
      ${this.state.selected ? styles.selectedEntry : ""}
      `}
      >
        <Link
          className={styles.entryLinkContainer}
          to={"/c/" + this.props.info.uuid}
          onClick={() => {
            this.props.parent.setSelectedElement(this);
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
              marginRight: "10px"
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
