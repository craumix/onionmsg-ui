import React from "react";
import { fetchTorinfo } from "../api/api";
import { AppOverlayMenu } from "./app-overlay";
import styles from "./backend-info.sass";
import { SiTor } from "react-icons/si"

interface TorInfo {
  log: string;
  version: string;
  pid: number;
  path: string;
}

interface BackendInfoProps {
  tor: TorInfo;
}

export class BackendInfo extends React.Component<unknown, BackendInfoProps> {
  overlayRef: React.RefObject<AppOverlayMenu>;

  constructor(props: unknown) {
    super(props);

    this.state = {
      tor: {
        log: "",
        version: "",
        pid: -1,
        path: "",
      },
    };

    this.overlayRef = React.createRef();
  }

  render(): JSX.Element {
    return (
      <AppOverlayMenu ref={this.overlayRef}>
        <h1>Backend Info</h1>
        <h2><SiTor /> Tor</h2>
        <p>Version: {this.state.tor.version}</p>
        <p>PID: {this.state.tor.pid}</p>
        <p>Path: {this.state.tor.path}</p>
        <p className={styles.logContainer}>{this.state.tor.log}</p>
      </AppOverlayMenu>
    );
  }

  componentDidMount(): void {
    fetchTorinfo()
      .then((res) => res.json())
      .then((response) => {
        this.setState({
          tor: response,
        });
      });
  }

  show(): void {
    this.overlayRef.current.setState({
      visible: true,
    });
  }
}
