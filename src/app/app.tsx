import * as React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter as Router, Route } from "react-router-dom";
import { ConversationList } from "./components/conversation-list";
import { ConversationWindow } from "./components/conversation-windows/conversation-window";
import { w3cwebsocket as WebSocket } from "websocket";
import { AppSidebar } from "./components/app-sidebar";
import { DaemonNotification, listenOnBackendNotifications } from "./api/api";
import "./app.sass"

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
          notification.data[0].uuid
      ) {
        console.log("callback");
        ConversationWindowRef.current.loadNextMessage(notification.data.length);
      }
    } else if (notification.type === "NewRoom") {
      AppSidebarRef.current.state.conversationListRef.current.appendRoom(notification.data)
    }
  });

  ReactDOM.render(
    <div>
      <Router>
        <AppSidebar ref={AppSidebarRef} />
        <Route
          path="/c/:uuid"
          render={(props) => (
            <div>
              <ConversationWindow ref={ConversationWindowRef} {...props} />
            </div>
          )}
        />
      </Router>
    </div>,
    document.getElementById("app")
  );
}

render();
