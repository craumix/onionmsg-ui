import React from "react";
import { RoomsContext } from "../../rooms";
import { fetchRoomInfo, setNicknameCommand } from "../../api/api";
import { AppOverlayMenu } from "./app-overlay";

interface RoomSettingsProps {
  uuid: string;
}
export class RoomSettings extends React.Component<RoomSettingsProps> {
  overlayRef: React.RefObject<AppOverlayMenu>;
  nickInputRef: React.RefObject<HTMLInputElement>;
  constructor(props: RoomSettingsProps) {
    super(props);

    this.overlayRef = React.createRef();
    this.nickInputRef = React.createRef();
  }

  render(): JSX.Element {
    return (
      <AppOverlayMenu ref={this.overlayRef}>
        <RoomsContext.Consumer>
          {({ findById, updateRoom }) => {
            const info = findById(this.props.uuid);
            console.log(info);
            return info ? (
              <div>
                <h1>{"Room Settings - " + (info.name || info.uuid)}</h1>
                <input
                  type="text"
                  placeholder={this.getNickname(info, info.self, "Nickname")}
                  ref={this.nickInputRef}
                />
                <button
                  onClick={() => {
                    const nick = this.nickInputRef.current.value;
                    setNicknameCommand(info.uuid, nick).then((resp) => {
                      if (resp.ok) {
                        info.nicks[info.self] = nick;
                        updateRoom(info);
                      }
                    });
                  }}
                >
                  Change
                </button>
                <br />
                Members:
                <ul style={{ listStyle: "none", padding: "0px" }}>
                  <li>
                    {this.getNickname(info, info.self)}{" "}
                    <span style={{ fontStyle: "italic" }}>(You)</span>
                  </li>
                  {info.peers.map((peer) => (
                    <li key={peer}>{this.getNickname(info, peer)}</li>
                  ))}
                </ul>
              </div>
            ) : null;
          }}
        </RoomsContext.Consumer>
      </AppOverlayMenu>
    );
  }

  show(): void {
    this.overlayRef.current.setState({
      visible: true,
    });

    fetchRoomInfo(this.props.uuid)
      .then((res) => res.json())
      .then((result) => {
        this.setState({
          info: result,
        });
      });
  }

  getNickname(room: RoomInfo, id: string, alt?: string): string {
    return room?.nicks[id] || (alt ? alt : id);
  }
}
