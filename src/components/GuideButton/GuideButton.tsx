import './GuideButton.scss';

import React from 'react';

import Modal from '../Modal/Modal';

/**
 * React props for {@link GuideButton}.
 *
 * @interface GuideButtonProps
 */
interface GuideButtonProps {
    onClick: () => void,
};

/**
 * React state for {@link GuideButton}.
 *
 * @interface GuideButtonState
 */
interface GuideButtonState {
    modalOpen: boolean,
    warningAcknowledged: boolean,
}

/**
 * The button that opens {@link Guide}.
 *
 * @param {GuideButtonProps} props
 * @returns {JSX.Element}
 */
class GuideButton extends React.Component<GuideButtonProps, GuideButtonState> {
    /**
     * Creates an instance of GuideButton.
     * 
     * @param {GuideButtonProps} props
     * @memberof GuideButton
     */
    constructor(props: GuideButtonProps) {
        super(props);

        this.state = {
            modalOpen: false,
            warningAcknowledged: false,
        };
    }

    /**
     * Called by React to render the component.
     *
     * @memberof GuideButton
     */
    public render = (): JSX.Element => {
        return (
            <React.Fragment>
                <div id="guide-link">
                    <button onClick={this.handleClick}>•••</button>
                </div>
                <Modal
                    heading="Warning"
                    isOpen={this.state.modalOpen}
                    onOkButtonClick={this.acknowledgeWarningAndOpenGuide}
                    onRequestClose={this.closeModal}
                    showCancelButton={true}
                    showOkButton={true}
                >
                    <p>This button opens the Dungeon Master's guide to the tarokka
                    reading, which contains <em>massive spoilers</em> for players
                    of <i>Curse of Strahd</i>. Be careful not to ruin the game for
                    yourself or others!</p>

                    <p>Are you a Dungeon Master running <i>Curse of Strahd</i>?</p>
                </Modal>
            </React.Fragment>
        );
    };

    /**
     * Sets the warning modal as acknowledged and opens the guide.
     * The acknowledgment lasts until the page is reloaded.
     *
     * @private
     * @memberof GuideButton
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
     * @memberof GuideButton
     */
    private closeModal = (): void => {
        this.setState({modalOpen: false});
    };

    /**
     * Handles the Dungeon Master's guide button click.
     *
     * @private
     * @memberof GuideButton
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
     * @memberof GuideButton
     */
    private openGuide = (): void => {
        window.open('/guide', 'tarokka');
    };

    /**
     * Opens the warning modal.
     *
     * @private
     * @memberof GuideButton
     */
    private openModal = (): void => {
        this.setState({modalOpen: true});
    };
}

export default GuideButton;
