import React from "react";
import { ConversationList } from "./conversation-list";
import styles from "./app-sidebar.sass";
import { FaCog, FaPlus, FaServer } from "react-icons/fa";
import { ContactMenu } from "./overlay/contact-menu";
import { BackendInfo } from "./overlay/backend-info";

interface AppSidebarProps {
  className?: string;
  match?: any;
}

export class AppSidebar extends React.Component<AppSidebarProps> {
  conversationListRef: React.RefObject<ConversationList>;
  contactMenuRef: React.RefObject<ContactMenu>;
  backendInfoRef: React.RefObject<BackendInfo>;

  constructor(props: any) {
    super(props);

    this.conversationListRef = React.createRef();
    this.contactMenuRef = React.createRef();
    this.backendInfoRef = React.createRef();
  }

  render(): JSX.Element {
    return (
      <div className={`${styles.sidebarContainer} ${this.props.className}`}>
        <ContactMenu ref={this.contactMenuRef} />
        <BackendInfo ref={this.backendInfoRef} />

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
              this.backendInfoRef.current.show();
            }}
          >
            <FaServer size="18" />
          </button>
          <button
            className={styles.sidebarButton}
            style={{
              marginLeft: "auto",
            }}
            onClick={() => {
              this.contactMenuRef.current.show();
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
            onChange={(event) => {
              this.conversationListRef.current.setFilter(event.target.value);
            }}
          />
        </div>

        <ConversationList ref={this.conversationListRef} match={this.props.match} />
      </div>
    );
  }
}
