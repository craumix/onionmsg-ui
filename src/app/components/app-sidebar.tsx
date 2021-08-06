import React from "react";
import { ConversationList } from "./conversation-list";
import styles from "./app-sidebar.sass";
import { FaPlus } from "react-icons/fa";
import { ContactMenu } from "./contact-menu";

interface AppSidebarState {
  conversationListRef: React.RefObject<ConversationList>
  contactMenuRef: React.RefObject<ContactMenu>
}

export class AppSidebar extends React.Component<unknown, AppSidebarState> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      conversationListRef: React.createRef(),
      contactMenuRef: React.createRef()
    }
  }

  render(): JSX.Element {
    return (
      <div
        style={{
          position: "absolute",
          top: "0px",
          left: "0px",
          height: "100%",
          width: "250px",
          margin: "0px",
          padding: "0px",
          backgroundColor: "#EEE",
        }}
      >
        <ContactMenu ref={this.state.contactMenuRef} />
        <button
          className={styles.createRoomButton}
          onClick={() => {
            this.state.contactMenuRef.current.show();
          }}
        >
          <FaPlus />
        </button>
        <ConversationList ref={this.state.conversationListRef}/>
      </div>
    );
  }
}
