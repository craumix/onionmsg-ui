import React from "react";
import { fetchTorinfo } from "../api/api";
import { AppOverlayMenu } from "./app-overlay";
import styles from "./backend-info.sass";

interface BackendInfoProps {
  log: string;
}

export class BackendInfo extends React.Component<unknown, BackendInfoProps> {
  overlayRef: React.RefObject<AppOverlayMenu>;

  constructor(props: unknown) {
    super(props);

    this.state = {
      log: "",
    };

    this.overlayRef = React.createRef();
  }

  render(): JSX.Element {
    return (
      <AppOverlayMenu ref={this.overlayRef}>
        <h1>Backend Info</h1>
        <p className={styles.logContainer}>{this.state.log}</p>
      </AppOverlayMenu>
    );
  }

  componentDidMount(): void {
    fetchTorinfo()
      .then((res) => res.json())
      .then((response) => {
        this.setState({
          log: response.log,
        });
      });
  }

  show(): void {
    this.overlayRef.current.setState({
      visible: true,
    });
  }
}
