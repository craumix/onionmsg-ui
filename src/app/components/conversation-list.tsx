import React from "react";
import { Link } from "react-router-dom";
import { fetchRoomList } from "../api/api";
import styles from "./conversation-list.sass";
import { BsThreeDots } from "react-icons/bs";
import { FaCog, FaDoorOpen } from "react-icons/fa";

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
          padding: "0px",
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
  dialogOpened: boolean;
}

class ConversationListElement extends React.Component<
  ConversationListElementProps,
  ConversationListElementState
> {
  constructor(props: ConversationListElementProps) {
    super(props);
    this.state = {
      selected: false,
      dialogOpened: false,
    };
  }

  render(): JSX.Element {
    return (
      <li
        className={`
      ${styles.listEntry} 
      ${this.state.selected ? styles.selectedEntry : ""}
      `}
        style={{ position: "relative" }}
      >
        <Link
          style={{
            textDecoration: "none",
            color: "black",
          }}
          to={"/c/" + this.props.info.uuid}
        >
          <p
            style={{
              marginTop: "4px",
              marginBottom: "4px",
            }}
            onClick={() => {
              this.props.parent.setSelectedElement(this);
            }}
          >
            {this.props.info.name ?? this.props.info.uuid?.split("-")[0]}
          </p>
        </Link>
        <button
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            height: "20px",
            background: "none",
          }}
          onClick={(event: React.MouseEvent<HTMLElement>) => {
            event.nativeEvent.preventDefault();
            this.setState({
              dialogOpened: true,
            });
          }}
        >
          <BsThreeDots />
        </button>
        {this.state.dialogOpened && (
          <div>
            <div
              style={{
                position: "fixed",
                width: "100%",
                height: "100%",
                top: "0px",
                left: "0px",
                zIndex: 1,
              }}
              onClick={(event) => {
                event.nativeEvent.preventDefault();
                this.setState({
                  dialogOpened: false,
                });
              }}
            />
            {
              //TODO make this into a dedicated component
            }
            <div
              style={{
                position: "absolute",
                top: "30px",
                right: "10px",
                backgroundColor: "white",
                borderRadius: "4px",
                filter: "drop-shadow(0 0 0.25rem grey)",
                zIndex: 2,
              }}
            >
              <button className={styles.dialogMenuEntry}>
                <p>
                  <FaCog /> Settings
                </p>
              </button>
              <hr
                style={{ margin: "0px", borderRadius: "0px", color: "#EEE" }}
              />
              <button className={styles.dialogMenuEntry}>
                <p style={{ color: "#F44" }}>
                  <FaDoorOpen /> Leave Room
                </p>
              </button>
            </div>
          </div>
        )}
      </li>
    );
  }
}
