import React from "react";
import { fetchRoomInfo, setNicknameCommand } from "../../api/api";
import { AppOverlayMenu } from "./app-overlay";

interface ConversationSettingsProps {
  uuid: string;
}

interface ConversationSettingsState {
  info: ConversationInfo;
}

export class ConversationSettings extends React.Component<
  ConversationSettingsProps,
  ConversationSettingsState
> {
  overlayRef: React.RefObject<AppOverlayMenu>;
  nickInputRef: React.RefObject<HTMLInputElement>;
  constructor(props: ConversationSettingsProps) {
    super(props);

    this.state = {
      info: null,
    };

    this.overlayRef = React.createRef();
    this.nickInputRef = React.createRef();
  }

  render(): JSX.Element {
    const roomInfo = this.state.info
    return (
      <AppOverlayMenu ref={this.overlayRef}>
        <h1>{"Room Settings - " + this.props.uuid}</h1>
        <input
          type="text"
          placeholder={this.getNickname(roomInfo?.self, "Nickname")}
          ref={this.nickInputRef}
        />
        <button
          onClick={() => {
            const nick = this.nickInputRef.current.value
            setNicknameCommand(
              roomInfo.uuid,
              nick
            ).then((resp) => {
              if (resp.ok) {
                const newInfo = roomInfo;
                newInfo.nicks[roomInfo.self] = nick;
                this.setState({
                  info: newInfo
                })
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
            {this.getNickname(roomInfo?.self)}{" "}
            <span style={{ fontStyle: "italic" }}>(You)</span>
          </li>
          {roomInfo?.peers.map((peer) => (
            <li key={peer}>{this.getNickname(peer)}</li>
          ))}
        </ul>
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

  getNickname(id: string, alt?: string): string {
    return this.state.info?.nicks[id] || (alt ? alt : id);
  }
}
