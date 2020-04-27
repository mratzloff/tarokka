import './GuideButton.scss';

import React from 'react';
import Modal from 'react-modal';

/**
 * React props for {@link GuideLink}.
 *
 * @interface GuideLinkProps
 */
interface GuideLinkProps {
    onClick: () => void,
};

/**
 * React state for {@link GuideLink}.
 *
 * @interface GuideLinkState
 */
interface GuideLinkState {
    modalOpen: boolean,
    warningAcknowledged: boolean,
}

/**
 * Called by React to render the link that opens {@link Guide}.
 *
 * @param {GuideLinkProps} props
 * @returns {JSX.Element}
 */
class GuideLink extends React.Component<GuideLinkProps, GuideLinkState> {
    /**
     * Creates an instance of GuideLink.
     * 
     * @param {GuideLinkProps} props
     * @memberof GuideLink
     */
    constructor(props: GuideLinkProps) {
        super(props);

        this.state = {
            modalOpen: false,
            warningAcknowledged: false,
        };
    }

    /**
     * Called by React to render the component.
     *
     * @returns {JSX.Element}
     */
    public render = (): JSX.Element => {
        return (
            <React.Fragment>
                <div id="guide-link">
                    <button onClick={this.handleClick}>•••</button>
                </div>
                <Modal
                    className="warning-modal"
                    contentLabel="Warning"
                    isOpen={this.state.modalOpen}
                    onRequestClose={this.closeModal}
                    overlayClassName="warning-modal-overlay"
                >
                    <div className="warning-content">
                        <div className="warning-heading">Warning</div>
                        <div className="warning-body">
                            <p>This button opens the Dungeon Master's guide to
                            the tarokka reading, which contains <em>massive
                            spoilers</em> for players of <i>Curse of
                            Strahd</i>. Be careful not to ruin the game for
                            yourself or others!</p>

                            <p>Are you a Dungeon Master running <i>Curse of
                            Strahd</i>?</p>
                        </div>
                    </div>
                    <div className="warning-buttons">
                        <button onClick={this.acknowledgeWarningAndOpenGuide}>Yes</button>
                        <button onClick={this.closeModal}>No</button>
                    </div>
                </Modal>
            </React.Fragment>
        );
    };

    /**
     * Sets the warning modal as acknowledged and opens the guide.
     * The acknowledgment lasts until the page is reloaded.
     *
     * @private
     * @memberof GuideLink
     */
    private acknowledgeWarningAndOpenGuide = (): void => {
        this.setState({
            modalOpen: false,
            warningAcknowledged: true,
        });

        window.open('/guide', 'tarokka');
    };

    /**
     * Closes the warning modal.
     *
     * @private
     * @memberof GuideLink
     */
    private closeModal = (): void => {
        this.setState({modalOpen: false});
    };

    /**
     * Handles the Dungeon Master's guide button click.
     *
     * @private
     * @memberof GuideLink
     */
    private handleClick = (): void => {
        if (this.state.warningAcknowledged) {
            this.openGuide();
        } else {
            this.openModal();
        }
    };

    /**
     * Opens the Dungeon Master's guide.
     *
     * @private
     * @memberof GuideLink
     */
    private openGuide = (): void => {
        window.open('/guide', 'tarokka');
    };

    /**
     * Opens the warning modal.
     *
     * @private
     * @memberof GuideLink
     */
    private openModal = (): void => {
        this.setState({modalOpen: true});
    };
}

export default GuideLink;
