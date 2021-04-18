import './DungeonMasterView.scss';

import {BroadcastChannel} from 'broadcast-channel';
import React from 'react';
import nl2br from 'react-nl2br';
import {ValueType} from 'react-select';

import Modal from '../Modal/Modal';
import ArtworkChanger from './ArtworkChanger';
import CardRemover from './CardRemover';
import LockButton from './LockButton';

/**
 * React props for {@link DungeonMasterView}.
 *
 * @interface DungeonMasterViewProps
 */
interface DungeonMasterViewProps {
    artworkKey: string,
    data: Data,
};

/**
 * React state for {@link DungeonMasterView}.
 *
 * @interface DungeonMasterViewState
 */
interface DungeonMasterViewState {
    artworkKey: string,
    draws: Array<HighCard | LowCard>,
    error: string,
    lockedDrawKeys: (string | null)[],
    modalOpen: boolean,
    spread: SpreadCard[],
};

/**
 * Expected broadcast message from {@link Spread}.
 *
 * @interface DataMessage
 */
interface DataMessage {
    draws: Array<HighCard | LowCard>,
    error: string,
    spread: SpreadCard[],
    type: string,
};

/**
 * The Dungeon Master view for a given tarokka reading, containing the
 * reading script as well as various configuration options.
 *
 * @class DungeonMasterView
 * @extends {React.Component<DungeonMasterViewProps, DungeonMasterViewState>}
 */
class DungeonMasterView extends React.Component<DungeonMasterViewProps, DungeonMasterViewState> {
    /**
     * Broadcast channel used to communicate with {@link Spread}.
     *
     * @private
     * @type {BroadcastChannel}
     * @memberof DungeonMasterView
     * @see Spread
     */
    private channel: BroadcastChannel = new BroadcastChannel('tarokka');

    /**
     * Reference to the timeout function for requesting data from {@link Spread}.
     *
     * @private
     * @type {(ReturnType<typeof setTimeout> | undefined)}
     * @memberof DungeonMasterView
     */
    private timeout: ReturnType<typeof setTimeout> | undefined;

    /**
     * Creates an instance of DungeonMasterView.
     * 
     * @param {DungeonMasterViewProps} props
     * @memberof DungeonMasterView
     */
    constructor(props: DungeonMasterViewProps) {
        super(props);

        this.state = {
            artworkKey: '',
            draws: [],
            error: '',
            lockedDrawKeys: [],
            modalOpen: false,
            spread: [],
        };
    }

    /**
     * Called by React after component is inserted into the DOM tree.
     *
     * @memberof DungeonMasterView
     */
    public componentDidMount = (): void => {
        this.channel.onmessage = this.handleMessage;

        if (this.state.draws.length === 0 || this.state.spread.length === 0) {
            this.timeout = setTimeout(this.sendDataRequest, 100);
        }
    };

    /**
     * Called by React to render the component.
     *
     * @memberof DungeonMasterView
     */
    public render = (): JSX.Element => {
        document.title = `Tarokka - Dungeon Master's View`;

        return (
            <React.Fragment>
                <Modal
                    cancelButtonLabel="OK"
                    heading="Warning"
                    isOpen={this.state.modalOpen}
                    onRequestClose={this.closeModal}
                    showCancelButton={true}
                >
                    <p>{this.state.error}</p>
                </Modal>

                <div id="dungeon-master-view">
                    <div id="form">
                        <ArtworkChanger
                            artwork={this.props.data.artwork}
                            artworkKey={this.getArtworkKey()}
                            className="form-field"
                            onChange={this.handleArtworkChange}
                        />
                        <CardRemover
                            className="form-field"
                            deck={this.props.data.deck}
                            onChange={this.handleRemovedCards}
                        />
                    </div>
                    {!this.state.error &&
                        <article>
                            {this.state.spread.map(this.renderCard)}
                        </article>
                    }
                </div>
            </React.Fragment>
        );
    };

    /**
     * Closes the warning modal.
     *
     * @private
     * @memberof DungeonMasterView
     */
    private closeModal = (): void => {
        this.setState({modalOpen: false});
    };

    /**
     * Returns the key for the card artwork.
     *
     * @private
     * @memberof DungeonMasterView
     */
    private getArtworkKey = (): string => {
        return this.state.artworkKey || this.props.artworkKey;
    };

    /**
     * Returns a CSS `url` data type ready for setting as a background image.
     *
     * @private
     * @memberof DungeonMasterView
     */
    private getCardImage = (key: string): string => {
        return `/images/${this.getArtworkKey()}/${key}.png`;
    };

    /**
     * Returns an array of keys for locked cards from local storage.
     *
     * @private
     * @memberof DungeonMasterView
     */
    private getLockedCardKeys = (spread: SpreadCard[]): (string | null)[] => {
        return (spread || []).map(each => localStorage.getItem(each.key));
    };

    /**
     * Sends artwork change message to {@link Spread}.
     *
     * @private
     * @memberof DungeonMasterView
     */
    private handleArtworkChange = (option: ValueType<Option, boolean>): void => {
        const key = (option as Option).value;
        this.setState({artworkKey: key});
        this.channel.postMessage({key, type: 'change-artwork'});
    };

    /**
     * Sets appropriate state in response to a lock button click.
     *
     * @private
     * @memberof DungeonMasterView
     */
    private handleLockButtonClick = (card: SpreadCard, locked: boolean): void => {
        const index = this.state.spread.findIndex(each => each.key === card.key);
        const lockedDrawKeys = this.state.lockedDrawKeys.slice();
        const draw = this.state.draws[index];

        if (locked && draw) {
            lockedDrawKeys[index] = draw.key;
            localStorage.setItem(card.key, draw.key);
        } else {
            lockedDrawKeys[index] = null;
            localStorage.removeItem(card.key);
        }

        this.setState({lockedDrawKeys});
    };

    /**
     * Receives broadcasts from {@link Spread} and updates the state
     * accordingly.
     *
     * @private
     * @memberof DungeonMasterView
     */
    private handleMessage = (message: DataMessage): void => {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.setState({
            draws: message.draws || [],
            error: message.error || '',
            lockedDrawKeys: this.getLockedCardKeys(message.spread),
            modalOpen: !!message.error,
            spread: message.spread || [],
        });
    };

    /**
     * Sends remove card message to {@link Spread}.
     *
     * @private
     * @memberof DungeonMasterView
     */
    private handleRemovedCards = (keys: string[]): void => {
        this.state.lockedDrawKeys.forEach((each, index) => {
            if (each && keys.includes(each) && this.state.spread[index]) {
                localStorage.removeItem(this.state.spread[index].key);
            }
        });

        this.channel.postMessage({keys, type: 'remove-cards'});
    };

    /**
     * Renders text for the Strahd's Enemy card (i.e., an ally against Strahd).
     *
     * @private
     * @memberof DungeonMasterView
     */
    private renderAllyText = (card: SpreadCard, draw: HighCard): JSX.Element => {
        const multiple = draw.alliesText.length > 1;

        return (
            <ol>
                <li>{this.say(card.secretText)}</li>
                <li>{this.reveal(draw.name)}</li>
                <li>
                    {!multiple && (
                        <React.Fragment>
                            {draw.alliesText.map((allyText, i) => (
                                <React.Fragment key={draw.allies[i]}>
                                    <div>{this.say(draw.alliesText[i])}</div>
                                    <div className="secret">
                                        {nl2br(draw.alliesSecretText[i])}
                                    </div>
                                </React.Fragment>
                            ))}
                        </React.Fragment>
                    )}
                    {multiple && (
                        <React.Fragment>
                            Pick one: {draw.allies.join(' or ')}:
                            <ol type="a">
                                {draw.alliesText.map((allyText, i) => (
                                    <li key={draw.allies[i]}>
                                        {multiple && (
                                            <div><em>{draw.allies[i]}.</em></div>
                                        )}
                                        <div>{this.say(draw.alliesText[i])}</div>
                                        <div className="secret">
                                            {nl2br(draw.alliesSecretText[i])}
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </React.Fragment>
                    )}
                </li>
            </ol>
        );
    };

    /**
     * Renders a card given its spread placement.
     *
     * @private
     * @memberof DungeonMasterView
     */
    private renderCard = (card: SpreadCard, index: number): JSX.Element => {
        const draw = this.state.draws[index];

        let article = '';
        let description: JSX.Element;
        let locked = false;

        switch (card.key) {
            case 'ally':
                description = this.renderAllyText(card, draw as HighCard);
                break;
            case 'strahd':
                description = this.renderStrahdText(card, draw as HighCard);
                break;
            default:
                article = 'The ';
                description = this.renderTreasureText(card, draw as LowCard);
        }

        if (draw) {
            locked = (this.state.lockedDrawKeys[index] === draw.key);
        }

        return (
            <section key={card.name}>
                <h2>
                    {article}{card.name}
                    <LockButton
                        card={card}
                        locked={locked}
                        onClick={this.handleLockButtonClick}
                    />
                </h2>
                <div className="card">
                    <img alt={card.name} src={this.getCardImage(draw.key)} />
                    <div className="script">{description}</div>
                </div>
            </section>
        );
    };

    /**
     * Renders text for the Strahd card.
     *
     * @private
     * @memberof DungeonMasterView
     */
    private renderStrahdText = (card: SpreadCard, draw: HighCard): JSX.Element => (
        <ol>
            <li>{this.say(card.secretText)}</li>
            <li>{this.reveal(draw.name)}</li>
            <li>
                <div>{this.say(draw.strahdText)}</div>
                <div className="secret">{nl2br(draw.strahdSecretText)}</div>
            </li>
        </ol>
    );

    /**
     * Renders text for the various treasure cards.
     *
     * @private
     * @memberof DungeonMasterView
     */
    private renderTreasureText = (card: SpreadCard, draw: LowCard): JSX.Element => (
        <ol>
            <li>{this.say(card.secretText)}</li>
            <li>
                {this.reveal(`
                    ${draw.value === 10 ? 'Master' : draw.value}
                    of ${draw.suit} — The ${draw.name}
                `)}
            </li>
            <li>
                <div>{this.say(draw.text)}</div>
                <div className="secret">
                    {nl2br(draw.secretText.replace('treasure', card.name))}
                </div>
            </li>
        </ol>
    );

    /**
     * Helper to indicate when to turn a card over.
     *
     * @private
     * @memberof DungeonMasterView
     */
    private reveal = (text: string): JSX.Element => {
        return <span><strong>Reveal:</strong> The {text}</span>;
    };

    /**
     * Helper to indicate when to say flavor text.
     *
     * @private
     * @memberof DungeonMasterView
     */
    private say = (text: string): JSX.Element => {
        return <span><strong>Say:</strong> "{text}"</span>;
    };

    /**
     * Send data request message to {@link Spread}.
     *
     * @private
     * @memberof DungeonMasterView
     */
    private sendDataRequest = (): void => {
        this.channel.postMessage({type: 'send-data'});
    };
}

export default DungeonMasterView;
