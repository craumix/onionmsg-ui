import React from "react";
import { constructAPIUrl, fetchStatus } from "../../api/api";
import { AppOverlayMenu } from "./app-overlay";

interface NoBackendDialogState {
  cause: string;
}

export class NoBackendDialog extends React.Component<
  any,
  NoBackendDialogState
> {
  overlayRef: React.RefObject<AppOverlayMenu>;

  constructor(props: any) {
    super(props);

    this.state = {
      cause: "",
    };

    this.overlayRef = React.createRef();
  }

  render(): JSX.Element {
    return (
      <AppOverlayMenu dontHide={true} ref={this.overlayRef}>
        <h1>:(</h1>
        <p>
          An error was encountered while trying to access:{" "}
          {constructAPIUrl("/status")}
        </p>
        <pre>{this.state.cause}</pre>
      </AppOverlayMenu>
    );
  }

  setError(err: string): void {
    this.setState({
      cause: err,
    });
    this.overlayRef.current.setState({
      visible: true,
    });
  }

  componentDidMount(): void {
    fetchStatus()
      .then((res) => res.json())
      .then((result) => {
        if (result.status !== "ok") {
          this.setError("Unexpected status from API: " + result.status);
        }
      })
      .catch((error) => {
        this.setError(error.message);
      });
  }
}
