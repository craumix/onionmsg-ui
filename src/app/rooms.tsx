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
  findById: (id: string): RoomInfo => {
    return undefined;
  },
});

interface RoomsProviderState {
  rooms: RoomInfo[];
}

export class RoomsProvider extends React.Component<any, RoomsProviderState> {
  constructor(props: any) {
    super(props);

    this.state = {
      rooms: undefined,
    };
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

  appendRoom(room: RoomInfo): void {
    const newConvs = this.state.rooms;
    newConvs.push(room);
    this.setState({
      rooms: newConvs,
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
          append: (room: RoomInfo) => {
            this.appendRoom(room);
          },
          findById: (id: string) => {
            return this.state.rooms?.find((r) => r.uuid === id);
          },
        }}
      >
        {this.props.children}
      </RoomsContext.Provider>
    );
  }
}
