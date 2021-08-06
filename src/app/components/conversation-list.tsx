import React from "react";
import { Link } from "react-router-dom";
import { fetchRoomList } from "../api/api";
import styles from "./conversation-list.sass";

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
}

class ConversationListElement extends React.Component<
  ConversationListElementProps,
  ConversationListElementState
> {
  constructor(props: ConversationListElementProps) {
    super(props);
    this.state = {
      selected: false,
    };
  }

  render(): JSX.Element {
    return (
      <li>
        <Link
          style={{
            textDecoration: "none",
            color: "black",
          }}
          to={"/c/" + this.props.info.uuid}
        >
          <div
            className={`
                        ${styles.listEntry} 
                        ${this.state.selected ? styles.selectedEntry : ""}
                        `}
            onClick={() => {
              this.props.parent.setSelectedElement(this);
            }}
          >
            {this.props.info.name ?? this.props.info.uuid.split("-")[0]}
          </div>
        </Link>
      </li>
    );
  }
}
