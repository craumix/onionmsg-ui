import React from "react";
import { AppOverlayMenu } from "./app-overlay";
import styles from "./confirm-dialog.sass";

interface ConfirmDialogProps {
  title: string;
  text?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export class ConfirmDialog extends React.Component<ConfirmDialogProps> {
  overlayRef: React.RefObject<AppOverlayMenu>;

  constructor(props: ConfirmDialogProps) {
    super(props);

    this.overlayRef = React.createRef();
  }

  render(): JSX.Element {
    return (
      <AppOverlayMenu ref={this.overlayRef}>
        <div>
          <h1>{this.props.title}</h1>
          <p>{this.props.text}</p>
          <div className={styles.buttonContainer}>
            <button
              className={styles.cancelButton}
              onClick={() => {
                this.hide();
                if (this.props.onCancel) this.props.onCancel();
              }}
            >
              Cancel
            </button>
            <button
              className={styles.confirmButton}
              onClick={() => {
                this.hide();
                if (this.props.onConfirm) this.props.onConfirm();
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </AppOverlayMenu>
    );
  }

  show(): void {
    this.overlayRef.current.setState({
      visible: true,
    });
  }

  hide(): void {
    this.overlayRef.current.setState({
      visible: false,
    });
  }
}
