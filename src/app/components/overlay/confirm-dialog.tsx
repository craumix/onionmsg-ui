import React from "react";
import { AppOverlayMenu } from "./app-overlay";
import styles from "./confirm-dialog.sass";

interface ConfirmDialogProps {
  title: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export class ConfirmDialog extends React.Component<ConfirmDialogProps> {
  overlayRef: React.RefObject<AppOverlayMenu>;
  topDivRef: React.RefObject<HTMLDivElement>;

  constructor(props: ConfirmDialogProps) {
    super(props);

    this.overlayRef = React.createRef();
    this.topDivRef = React.createRef();
  }

  render(): JSX.Element {
    return (
      <AppOverlayMenu ref={this.overlayRef}>
        <div
          style={{ minWidth: "250px", maxWidth: "500px" }}
          ref={this.topDivRef}
          onKeyDown={(event) => {
            //TODO find out why these sometimes work when manually clicking the menu
            if (event.key === "Enter") this.confirm();
            if (event.key === "Escape") this.cancel();
          }}
          tabIndex={0}
        >
          <h1>{this.props.title}</h1>
          {this.props.children}
          <div className={styles.buttonContainer}>
            <button
              className={styles.cancelButton}
              onClick={() => {
                this.cancel();
              }}
            >
              Cancel
            </button>
            <button
              className={styles.confirmButton}
              onClick={() => {
                this.confirm();
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </AppOverlayMenu>
    );
  }

  confirm(): void {
    this.hide();
    if (this.props.onConfirm) this.props.onConfirm();
  }

  cancel(): void {
    this.hide();
    if (this.props.onCancel) this.props.onCancel();
  }

  show(): void {
    this.overlayRef.current.setState({
      visible: true,
    });
    this.topDivRef.current.focus();
  }

  hide(): void {
    this.overlayRef.current.setState({
      visible: false,
    });
  }
}
