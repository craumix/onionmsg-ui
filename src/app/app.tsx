import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import { ConversationList } from './components/conversation-list';
import { ConversationWindow } from './components/conversation-window';


function render() {
  ReactDOM.render(
    <div>
      <Router>
        <div id="sidebar">
          <ConversationList />
        </div>
        <div id="stage">
          <Route path="/c/:uuid" component={ConversationWindow} />
        </div>
        
      </Router>
    </div>, 
    document.getElementById("app"));
}

render();