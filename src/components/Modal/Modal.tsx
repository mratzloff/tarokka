import './Modal.scss';

import React from 'react';
import ReactModal from 'react-modal';

interface ModalProps extends ReactModal.Props {
    cancelButtonLabel?: string,
    children: React.ReactNode,
    heading: string,
    okButtonLabel?: string,
    onOkButtonClick?: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined,
    showCancelButton?: boolean,
    showOkButton?: boolean,
};

function Modal(props: ModalProps): JSX.Element {
    let cancelButtonLabel = props.cancelButtonLabel || 'Cancel';
    let okButtonLabel = props.okButtonLabel || 'OK';

    return (
        <ReactModal
            className="modal"
            contentLabel={props.heading}
            isOpen={props.isOpen}
            onRequestClose={props.onRequestClose}
            overlayClassName="modal-overlay"
        >
            <div className="modal-content">
                <div className="modal-heading">{props.heading}</div>
                <div className="modal-body">
                    {props.children}
                </div>
            </div>
            {(props.showOkButton || props.showCancelButton) &&
                <div className="modal-buttons">
                    {props.showOkButton &&
                        <button onClick={props.onOkButtonClick}>
                            {okButtonLabel}
                        </button>
                    }
                    {props.showCancelButton &&
                        <button onClick={props.onRequestClose}>
                            {cancelButtonLabel}
                        </button>
                    }
                </div>
            }
        </ReactModal>
    );
};

export default Modal;
