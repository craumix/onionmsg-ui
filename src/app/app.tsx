import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { ConversationWindow } from "./components/conversation-windows/conversation-window";
import { DaemonNotification, listenOnBackendNotifications } from "./api/api";
import styles from "./app.sass";
import { NoBackendDialog } from "./components/overlay/no-backend";
import OnlineSVG from "./assets/undraw/online.svg";
import { AppSidebar } from "./components/app-sidebar";

const NilUUID = "00000000-0000-0000-0000-000000000000";

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

      <Router>
        <Switch>
          <Route
            path="/c/:uuid"
            render={(props) => (
              <div className={styles.appContainer}>
                <AppSidebar
                  className={styles.sidebar}
                  ref={AppSidebarRef}
                  {...props}
                />
                <Switch>
                  <Route exact path={"/c/" + NilUUID}>
                    <div
                      className={styles.main}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        overflow: "hidden"
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
                  </Route>
                  <Route
                    path="/c/:uuid"
                    render={(props) => (
                      <ConversationWindow
                        className={styles.main}
                        ref={ConversationWindowRef}
                        {...props}
                      />
                    )}
                  />
                </Switch>
              </div>
            )}
          ></Route>

          <Redirect to={"/c/" + NilUUID} />
        </Switch>
      </Router>
    </div>,
    document.getElementById("app")
  );
}

render();
