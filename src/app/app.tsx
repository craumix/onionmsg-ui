import * as React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter as Router, Redirect, Route } from "react-router-dom";
import { ConversationList } from "./components/conversation-list";
import { ConversationWindow } from "./components/conversation-windows/conversation-window";
import { w3cwebsocket as WebSocket } from "websocket";
import { AppSidebar } from "./components/app-sidebar";
import { DaemonNotification, listenOnBackendNotifications } from "./api/api";
import styles from "./app.sass";
import { NoBackendDialog } from "./components/overlay/no-backend";
import OnlineSVG from "./assets/undraw/online.svg";

const AppSidebarRef: React.RefObject<AppSidebar> = React.createRef();
const ConversationWindowRef: React.RefObject<ConversationWindow> =
  React.createRef();

function render() {
  listenOnBackendNotifications((notification: DaemonNotification) => {
    console.log(notification);
    if (notification.type === "NewMessage") {
      //Do notifications
      if (
        ConversationWindowRef.current &&
        ConversationWindowRef.current.props.match.params.uuid ===
          notification.data.uuid
      ) {
        console.log("callback");
        ConversationWindowRef.current.loadNextMessage(notification.data.length);
      }
    } else if (notification.type === "NewRoom") {
      AppSidebarRef.current.conversationListRef.current.pushConversations(
        notification.data
      );
    }
  });

  ReactDOM.render(
    <div>
      <NoBackendDialog />

      <div className={styles.appContainer}>
        <Router>
          <AppSidebar ref={AppSidebarRef} />

          <Route
            exact
            path="/"
            render={(props) => (
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                {
                  //TODO Fix SVGs
                }
                <OnlineSVG
                  style={{
                    transform: "scale(0.5)",
                  }}
                />
              </div>
            )}
          />

          <Route
            path="/c/:uuid"
            render={(props) => (
              <ConversationWindow ref={ConversationWindowRef} {...props} />
            )}
          />

          <Redirect to="/" />
        </Router>
      </div>
    </div>,
    document.getElementById("app")
  );
}

render();
