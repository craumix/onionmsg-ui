import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { RoomWindow } from "./components/room-windows/room-window";
import { DaemonNotification, listenOnBackendNotifications } from "./api/api";
import styles from "./app.sass";
import { NoBackendDialog } from "./components/overlay/no-backend";
import OnlineSVGFile from "./assets/undraw/online.svg";
import NotificationSoundFile from "./assets/sounds/gesture-192.mp3";
import { AppSidebar } from "./components/app-sidebar";
import { ThemeProvider } from "./themes";
import { RoomsContext, RoomsProvider } from "./rooms";

const NilUUID = "00000000-0000-0000-0000-000000000000";

const AppSidebarRef: React.RefObject<AppSidebar> = React.createRef();
const RoomWindowRef: React.RefObject<RoomWindow> = React.createRef();
const RoomProviderRef: React.RefObject<RoomsProvider> = React.createRef();

const NotificationSound = new Audio(NotificationSoundFile);

function processBackendNotifications(appendRoom: (arg0: RoomInfo) => {}) {}

function render() {
  listenOnBackendNotifications((notification: DaemonNotification) => {
    console.log(notification);
    if (notification.type === "NewMessage") {
      //Do notifications
      NotificationSound.play();

      if (
        RoomWindowRef.current?.props.match.params.uuid ===
        notification.data.uuid
      ) {
        RoomWindowRef.current.loadNextMessage(
          notification.data.messages.length
        );
      }
    } else if (notification.type === "NewRoom") {
      RoomProviderRef.current.appendRoom(notification.data)
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
      <RoomsProvider ref={RoomProviderRef}>
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
                        <RoomWindow
                          className={styles.main}
                          ref={RoomWindowRef}
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
      </RoomsProvider>
    </ThemeProvider>,
    document.getElementById("app")
  );
}

render();
