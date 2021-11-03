import React from "react";
import { ConversationList } from "./conversation-list";
import styles from "./app-sidebar.sass";
import {
  FaBackspace,
  FaCloudSun,
  FaCog,
  FaMoon,
  FaPlus,
  FaSearch,
  FaServer,
  FaSun,
} from "react-icons/fa";
import { ContactMenu } from "./overlay/contact-menu";
import { BackendInfo } from "./overlay/backend-info";
import { RequestList } from "./request-list";
import { ThemeContext } from "../themes";

interface AppSidebarProps {
  className?: string;
  match?: any;
  history?: any;
}

interface AppSidebarState {
  filter: string;
}

export class AppSidebar extends React.Component<
  AppSidebarProps,
  AppSidebarState
> {
  conversationListRef: React.RefObject<ConversationList>;
  requestListRef: React.RefObject<RequestList>;
  contactMenuRef: React.RefObject<ContactMenu>;
  backendInfoRef: React.RefObject<BackendInfo>;

  constructor(props: any) {
    super(props);

    this.state = {
      filter: "",
    };

    this.conversationListRef = React.createRef();
    this.requestListRef = React.createRef();
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

          <ThemeContext.Consumer>
            {({ theme, cycleTheme }) => (
              <button className={styles.sidebarButton} onClick={cycleTheme}>
                {(() => {
                  switch (theme) {
                    case "light":
                      return <FaSun size="18" />;
                    case "dawn":
                      return <FaCloudSun size="18" />;
                    case "dark":
                      return <FaMoon size="18" />;
                  }
                })()}
              </button>
            )}
          </ThemeContext.Consumer>

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
          <div>
            <FaSearch
              style={{
                color: "#888",
              }}
            />
          </div>
          <input
            placeholder="Filter"
            className={styles.searchInput}
            type="text"
            value={this.state.filter}
            onChange={(event) => {
              this.setFilter(event.target.value);
            }}
          />
          {this.state.filter != "" ? (
            <button onClick={() => this.setFilter("")}>
              <FaBackspace size="18" />
            </button>
          ) : null}
        </div>
        <RequestList ref={this.requestListRef} />
        <ConversationList
          ref={this.conversationListRef}
          match={this.props.match}
        />
      </div>
    );
  }

  setFilter(filter: string) {
    this.setState({
      filter: filter,
    });
    this.conversationListRef.current.setFilter(filter);
  }
}
