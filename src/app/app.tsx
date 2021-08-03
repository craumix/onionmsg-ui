import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import { ConversationList } from './components/conversation-list';
import { ConversationWindow, ConvWin } from './components/conversation-window';
import { w3cwebsocket as WebSocket } from "websocket";

interface DaemonNotification {
  type: string
  data: any
}

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
      if (ConvWin && ConvWin.props.match.params.uuid === notification.data.uuid) {
        console.log("callback")
        ConvWin.loadNextMessage()
      }
    }

  };

  ReactDOM.render(
    <div>
      <Router>
        <div id="sidebar">
          <ConversationList />
        </div>
        <div id="stage" style={{
          background: 'white'
        }}>
          <Route path="/c/:uuid" component={ConversationWindow} />
        </div>

      </Router>
    </div>,
    document.getElementById("app"));
}

render();