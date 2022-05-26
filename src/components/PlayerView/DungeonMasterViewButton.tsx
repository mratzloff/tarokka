import './DungeonMasterViewButton.scss';

import React from 'react';

import dmScreenImage from '../../assets/images/dm-screen.svg';
import Modal from '../Modal/Modal';

/**
 * React props for {@link DungeonMasterViewButton}.
 *
 * @interface DungeonMasterViewButtonProps
 */
interface DungeonMasterViewButtonProps {
    onClick: () => void,
};

/**
 * React state for {@link DungeonMasterViewButton}.
 *
 * @interface DungeonMasterViewButtonState
 */
interface DungeonMasterViewButtonState {
    modalOpen: boolean,
    warningAcknowledged: boolean,
}

/**
 * The button that opens {@link DungeonMasterView}.
 *
 * @param {DungeonMasterViewButtonProps} props
 * @returns {JSX.Element}
 */
class DungeonMasterViewButton extends React.Component<DungeonMasterViewButtonProps, DungeonMasterViewButtonState> {
    /**
     * Creates an instance of DungeonMasterViewButton.
     * 
     * @param {DungeonMasterViewButtonProps} props
     * @memberof DungeonMasterViewButton
     */
    constructor(props: DungeonMasterViewButtonProps) {
        super(props);

        this.state = {
            modalOpen: false,
            warningAcknowledged: false,
        };
    }

    /**
     * Called by React to render the component.
     *
     * @memberof DungeonMasterViewButton
     */
    public render = (): JSX.Element => {
        return (
            <React.Fragment>
                <Modal
                    heading="Warning"
                    isOpen={this.state.modalOpen}
                    onOkButtonClick={this.acknowledgeWarningAndOpenDungeonMasterView}
                    onRequestClose={this.closeModal}
                    showCancelButton={true}
                    showOkButton={true}
                >
                    <p>This button opens the Dungeon Master's view to the tarokka
                        reading, which contains <em>massive spoilers</em> for players
                        of <i>Curse of Strahd</i>. Be careful not to ruin the game for
                        yourself or others!</p>

                    <p>Are you a Dungeon Master running <i>Curse of Strahd</i>?</p>
                </Modal>

                <img
                    alt="Dungeon Master's view"
                    id="dungeon-master-view-button"
                    onClick={this.handleClick}
                    src={dmScreenImage}
                />
            </React.Fragment>
        );
    };

    /**
     * Sets the warning modal as acknowledged and opens the guide.
     * The acknowledgment lasts until the page is reloaded.
     *
     * @private
     * @memberof DungeonMasterViewButton
     */
    private acknowledgeWarningAndOpenDungeonMasterView = (): void => {
        this.setState({
            modalOpen: false,
            warningAcknowledged: true,
        });

        window.open('/dm', 'tarokka');
    };

    /**
     * Closes the warning modal.
     *
     * @private
     * @memberof DungeonMasterViewButton
     */
    private closeModal = (): void => {
        this.setState({modalOpen: false});
    };

    /**
     * Handles the Dungeon Master's guide button click.
     *
     * @private
     * @memberof DungeonMasterViewButton
     */
    private handleClick = (): void => {
        if (this.state.warningAcknowledged) {
            this.openDungeonMasterView();
        } else {
            this.openModal();
        }
    };

    /**
     * Opens the Dungeon Master's guide.
     *
     * @private
     * @memberof DungeonMasterViewButton
     */
    private openDungeonMasterView = (): void => {
        window.open('/dm', 'tarokka');
    };

    /**
     * Opens the warning modal.
     *
     * @private
     * @memberof DungeonMasterViewButton
     */
    private openModal = (): void => {
        this.setState({modalOpen: true});
    };
}

export default DungeonMasterViewButton;
