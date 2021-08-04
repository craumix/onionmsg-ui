import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import { ConversationList } from './components/conversation-list';
import { ConversationWindow } from './components/conversation-window';
import { w3cwebsocket as WebSocket } from "websocket";
import { AppSidebar } from './components/app-sidebar';

interface DaemonNotification {
  type: string
  data: any
}

let AppSidebarRef: React.RefObject<AppSidebar>
let ConversationWindowRef: React.RefObject<ConversationWindow>

function render() {
  const client = new WebSocket('ws://localhost:10052/v1/ws')
  client.onopen = () => {
    console.log('WebSocket Client Connected');
  };
  client.onmessage = (message: any) => {
    console.log(message);
    const notification: DaemonNotification = JSON.parse(message.data)
    console.log(notification)

    if (notification.type === 'NewMessage') {
      //Do notifications
      if (ConversationWindowRef.current && ConversationWindowRef.current.props.match.params.uuid === notification.data.uuid) {
        console.log("callback")
        ConversationWindowRef.current.loadNextMessage()
      }
    }

  };

  ReactDOM.render(
    <div>
      <Router>
        <AppSidebar ref={AppSidebarRef}/>
        <Route path="/c/:uuid" render={(props) =>
          <div>
            <ConversationWindow ref={ConversationWindowRef} {...props}/>
          </div>
        } />
      </Router>
    </div>,
    document.getElementById("app"));
}

render();