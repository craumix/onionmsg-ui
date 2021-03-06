import React from "react";
import { fetchRoomInfo, fetchRoomList } from "./api/api";

export const RoomsContext = React.createContext({
  rooms: undefined,
  hardReload: () => {
    return;
  },
  appendRoom: (conv: RoomInfo) => {
    return;
  },
  findById: (id: string): RoomInfo => {
    return undefined;
  },
  updateRoom: (conv: RoomInfo) => {
    return;
  },
  reloadRoom: (uuid: string) => {
    return;
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
    const rooms = this.state.rooms;
    rooms.push(room);
    this.setState({
      rooms: rooms,
    });
  }

  updateRoom(room: RoomInfo): void {
    const rooms = this.state.rooms.filter((r) => r.uuid !== room.uuid);
    rooms.push(room);
    this.setState({
      rooms: rooms,
    });
  }

  reloadRoom(uuid: string): void {
    fetchRoomInfo(uuid)
      .then((resp) => resp.json())
      .then((res) => {
        this.updateRoom(res);
      });
  }

  findById(uuid: string): RoomInfo {
    return this.state.rooms?.find((r) => r.uuid === uuid);
  }

  render(): JSX.Element {
    return (
      <RoomsContext.Provider
        value={{
          rooms: this.state.rooms,
          hardReload: () => {
            this.loadRooms();
          },
          appendRoom: (room: RoomInfo) => {
            this.appendRoom(room);
          },
          findById: (id: string) => {
            return this.findById(id);
          },
          updateRoom: (room: RoomInfo) => {
            this.updateRoom(room);
          },
          reloadRoom: (uuid: string) => {
            this.reloadRoom(uuid);
          },
        }}
      >
        {this.props.children}
      </RoomsContext.Provider>
    );
  }
}
