import React from "react";
import { ConversationList } from "./conversation-list";
import styles from "./app-sidebar.sass";
import { FaPlus, FaServer } from "react-icons/fa";
import { ContactMenu } from "./contact-menu";
import { BackendInfo } from "./backend-info";

interface AppSidebarState {
  conversationListRef: React.RefObject<ConversationList>
  contactMenuRef: React.RefObject<ContactMenu>
  backendInfoRef: React.RefObject<BackendInfo>
}

export class AppSidebar extends React.Component<unknown, AppSidebarState> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      conversationListRef: React.createRef(),
      contactMenuRef: React.createRef(),
      backendInfoRef: React.createRef()
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
        <BackendInfo ref={this.state.backendInfoRef} />
        <button
          className={styles.sidebarButton}
          onClick={() => {
            this.state.contactMenuRef.current.show();
          }}
        >
          <FaPlus size="18" />
        </button>
        <button
          className={styles.sidebarButton}
          onClick={() => {
            this.state.backendInfoRef.current.show();
          }}
        >
          <FaServer size="18" />
        </button>
        <ConversationList ref={this.state.conversationListRef}/>
      </div>
    );
  }
}
