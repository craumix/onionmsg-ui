import React from "react";
import { fetchRoomList } from "./api/api";

export const ConversationsContext = React.createContext({
  conversations: undefined,
  hardReload: () => {
    return;
  },
  append: (conv: ConversationInfo) => {
    return;
  },
});

interface ConversationsProviderState {
  conversations: ConversationInfo[];
}

export class ConversationsProvider extends React.Component<
  any,
  ConversationsProviderState
> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount(): void {
    this.loadConversations();
  }

  loadConversations(): void {
    fetchRoomList()
      .then((resp) => resp.json())
      .then((res) => {
        this.setState({
          conversations: res,
        });
      });
  }

  render(): JSX.Element {
    return (
      <ConversationsContext.Provider
        value={{
          conversations: this.state.conversations,
          hardReload: () => {
            this.loadConversations();
          },
          append: (conv: ConversationInfo) => {
            const newConvs = this.state.conversations;
            newConvs.push(conv);
            this.setState({
              conversations: newConvs,
            });
          },
        }}
      >
        {this.props.children}
      </ConversationsContext.Provider>
    );
  }
}
