import React from "react";
import { ConversationList } from "./conversation-list";
import styles from "./app-sidebar.sass";
import { FaCog, FaPlus, FaServer } from "react-icons/fa";
import { ContactMenu } from "./overlay/contact-menu";
import { BackendInfo } from "./overlay/backend-info";

interface AppSidebarState {
  conversationListRef: React.RefObject<ConversationList>;
  contactMenuRef: React.RefObject<ContactMenu>;
  backendInfoRef: React.RefObject<BackendInfo>;
}

export class AppSidebar extends React.Component<unknown, AppSidebarState> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      conversationListRef: React.createRef(),
      contactMenuRef: React.createRef(),
      backendInfoRef: React.createRef(),
    };
  }

  render(): JSX.Element {
    return (
      <div className={styles.sidebarContainer}>
        <ContactMenu ref={this.state.contactMenuRef} />
        <BackendInfo ref={this.state.backendInfoRef} />
        <div className={styles.buttonContainer}>
          <button
            className={styles.sidebarButton}
            onClick={() => {
              console.log("Show settings :)");
            }}
          >
            <FaCog size="18" />
          </button>
          <button
            className={styles.sidebarButton}
            onClick={() => {
              this.state.backendInfoRef.current.show();
            }}
          >
            <FaServer size="18" />
          </button>
          <button
            className={styles.sidebarButton}
            style={{
              marginLeft: "auto"
            }}
            onClick={() => {
              this.state.contactMenuRef.current.show();
            }}
          >
            <FaPlus size="18" />
          </button>
        </div>

        <div className={styles.searchInputContainer}>
          <input
            placeholder="Filter all conversations"
            className={styles.searchInput}
            type="text"
          />
        </div>

        <ConversationList ref={this.state.conversationListRef} />
      </div>
    );
  }
}
