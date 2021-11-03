import React from "react";
import { fetchTorinfo } from "../../api/api";
import { AppOverlayMenu } from "./app-overlay";
import styles from "./backend-info.sass";
import { SiTorproject } from "react-icons/si";

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
        <h2 style={{ marginBottom: "0px" }}>
          <SiTorproject /> Tor Version {this.state.tor.version}
        </h2>
        <p
          style={{
            marginTop: "0px",
            fontSize: "14px",
            fontFamily: "monospace",
          }}
        >
          Path: {this.state.tor.path}
          <br />
          PID: {this.state.tor.pid}
        </p>
        <pre className={styles.logContainer}>{this.state.tor.log}</pre>
      </AppOverlayMenu>
    );
  }

  show(): void {
    this.overlayRef.current.setState({
      visible: true,
    });
    fetchTorinfo()
      .then((res) => res.json())
      .then((response) => {
        this.setState({
          tor: response,
        });
      });
  }

  loadLog(): void {
    fetchTorinfo()
      .then((res) => res.json())
      .then((response) => {
        this.setState({
          tor: response,
        });
      });
  }
}
