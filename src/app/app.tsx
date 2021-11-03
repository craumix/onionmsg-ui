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
import OnlineSVGFile from "./assets/undraw/online.svg";
import NotificationSoundFile from "./assets/sounds/gesture-192.mp3";
import { AppSidebar } from "./components/app-sidebar";
import { ThemeProvider } from "./themes";

const NilUUID = "00000000-0000-0000-0000-000000000000";

const AppSidebarRef: React.RefObject<AppSidebar> = React.createRef();
const ConversationWindowRef: React.RefObject<ConversationWindow> =
  React.createRef();

const NotificationSound = new Audio(NotificationSoundFile);

function render() {
  listenOnBackendNotifications((notification: DaemonNotification) => {
    console.log(notification);
    if (notification.type === "NewMessage") {
      //Do notifications
      NotificationSound.play();

      if (
        ConversationWindowRef.current?.props.match.params.uuid ===
        notification.data.uuid
      ) {
        ConversationWindowRef.current.loadNextMessage(
          notification.data.messages.length
        );
      }
    } else if (notification.type === "NewRoom") {
      AppSidebarRef.current.conversationListRef.current.pushConversations(
        notification.data
      );
      //TODO make this less hacky and not depend on the Sidebar for the history
      AppSidebarRef.current.props.history.push("/c/" + notification.data.uuid);
    } else if (notification.type === "NewRequest") {
      AppSidebarRef.current.requestListRef.current.pushRequest(
        notification.data
      );
    }
  });

  ReactDOM.render(
    <ThemeProvider>
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
                        overflow: "hidden",
                      }}
                    >
                      {
                        //TODO Fix SVGs
                      }
                      <img
                        src={OnlineSVGFile}
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
    </ThemeProvider>,
    document.getElementById("app")
  );
}

render();
