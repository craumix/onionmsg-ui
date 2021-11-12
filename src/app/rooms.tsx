import React from "react";
import { fetchRoomList } from "./api/api";

export const RoomsContext = React.createContext({
  rooms: undefined,
  hardReload: () => {
    return;
  },
  append: (conv: RoomInfo) => {
    return;
  },
});

interface RoomsProviderState {
  rooms: RoomInfo[];
}

export class RoomsProvider extends React.Component<any, RoomsProviderState> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    fetchRoomList()
      .then((resp) => resp.json())
      .then((res) => {
        this.setState({
          rooms: res,
        });
      });
  }

  render(): JSX.Element {
    return (
      <RoomsContext.Provider
        value={{
          rooms: this.state.rooms,
          hardReload: () => {
            this.loadRooms();
          },
          append: (conv: RoomInfo) => {
            const newConvs = this.state.rooms;
            newConvs.push(conv);
            this.setState({
              rooms: newConvs,
            });
          },
        }}
      >
        {this.props.children}
      </RoomsContext.Provider>
    );
  }
}
