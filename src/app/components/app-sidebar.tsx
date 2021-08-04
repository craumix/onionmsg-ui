import React from "react";
import { ConversationList } from "./conversation-list";

export class AppSidebar extends React.Component {
    render (): JSX.Element {
        return (
            <div style={{
                position: 'absolute',
                top: '0px',
                left: '0px',
                height: '100%',
                width: '250px',
                margin: '0px',
                padding: '0px',
                backgroundColor: '#EEE',
            }}>
                <ConversationList />
            </div>
        )
    }
}