import './PlayerView.scss';

import {BroadcastChannel} from 'broadcast-channel';
import React from 'react';

import Modal from '../Modal/Modal';
import Card from './Card';
import DungeonMasterViewButton from './DungeonMasterViewButton';

/**
 * Message from {@link DungeonMasterView} requesting the component change the artwork.
 *
 * @interface ChangeArtworkMessage
 */
interface ChangeArtworkMessage {
    key: string,
    type: string,
};

/**
 * Message from {@link DungeonMasterView} requesting the component remove cards from
 * the deck.
 *
 * @interface RemoveCardsMessage
 */
interface RemoveCardsMessage {
    keys: string[],
    type: string,
};

/**
 * Message from {@link DungeonMasterView} requesting the component send the latest data.
 *
 * @interface SendDataMessage
 */
interface SendDataMessage {
    type: string,
};

/**
 * React props for {@link PlayerView}.
 *
 * @interface PlayerViewProps
 */
interface PlayerViewProps {
    artworkKey: string,
    data: Data,
};

/**
 * React state for {@link PlayerView}.
 *
 * @interface PlayerViewState
 */
interface PlayerViewState {
    artworkKey: string,
    deck: Deck,
    draws: Array<HighCard | LowCard>,
    error: string,
    minHighCards: number,
    minLowCards: number,
};

/**
 * Expected broadcast message from {@link DungeonMasterView}.
 *
 * @type Message
 */
type Message = ChangeArtworkMessage | RemoveCardsMessage | SendDataMessage;

/**
 * The spread, or arrangement of cards, for a given tarokka reading.
 *
 * @class PlayerView
 * @extends {React.Component<PlayerViewProps, PlayerViewState>}
 */
class PlayerView extends React.Component<PlayerViewProps, PlayerViewState> {
    readonly deckTooSmallError =
        `The deck is too small, and there aren't enough cards for a reading. ` +
        `Please re-add some high or low cards that were previously removed in ` +
        `the Dungeon Master's view.`;

    /**
     * Broadcast channel used to communicate with {@link DungeonMasterView}.
     *
     * @private
     * @type {BroadcastChannel}
     * @memberof PlayerView
     * @see DungeonMasterView
     */
    private channel: BroadcastChannel = new BroadcastChannel('tarokka');

    /**
     * Creates an instance of PlayerView.
     * 
     * @param {PlayerViewProps} props
     * @memberof PlayerView
     */
    public constructor(props: PlayerViewProps) {
        super(props);

        this.state = {
            artworkKey: '',
            deck: {high: [], low: []},
            draws: [],
            error: '',
            minHighCards: 0,
            minLowCards: 0,
        };
    }

    /**
     * Called by React after component is inserted into the DOM tree.
     *
     * @memberof PlayerView
     */
    public componentDidMount = (): void => {
        const spread = this.props.data.spread;

        this.channel.onmessage = this.handleMessage;

        this.setState(
            {
                deck: this.getDeck(),
                minHighCards: spread.filter(each => each.deck === 'high').length,
                minLowCards: spread.filter(each => each.deck === 'low').length,
            },
            this.drawCards,
        );
    };

    /**
     * Called by React to render the component.
     *
     * @memberof PlayerView
     */
    public render = (): JSX.Element => {
        document.title = `Tarokka`;

        return (
            <React.Fragment>
                <Modal heading="Warning" isOpen={!!this.state.error}>
                    <p>{this.state.error}</p>
                    <p>This message will close automatically.</p>
                </Modal>

                <DungeonMasterViewButton onClick={this.sendDataWithDelay} />

                <div id="player-view">
                    <div id="cards" className={this.getArtworkKey()}>
                        {this.props.data.spread.map(this.getCardElement)}
                    </div>
                </div>
            </React.Fragment>
        );
    };

    /**
     * Changes the artwork for the deck.
     *
     * @private
     * @memberof PlayerView
     */
    private changeArtwork = (key: string): void => {
        localStorage.setItem('artwork', key);
        this.setState({artworkKey: key});
    };

    /**
     * Draws a card from a deck, making sure not to draw the same card twice.
     *
     * @private
     * @memberof PlayerView
     */
    private drawCard = (deckSize: number, draws: number[]): number => {
        let card = -1;

        if (deckSize > 0) {
            do {
                card = Math.floor(Math.random() * deckSize);
            } while (draws.includes(card));
        }

        return card;
    };

    /**
     * Draws all cards for the spread and updates the state accordingly.
     *
     * @private
     * @memberof PlayerView
     */
    private drawCards = (): void => {
        const highIndexes: number[] = [];
        const lowIndexes: number[] = [];

        let draws: Array<HighCard | LowCard> = [];
        let error = '';

        for (let card of this.props.data.spread) {
            const drawKey = localStorage.getItem(card.key);
            let draw: HighCard | LowCard;
            let index = -1;

            if (drawKey && (card.deck === 'high' || card.deck === 'low')) {
                index = this.state.deck[card.deck].findIndex(
                    (each: HighCard | LowCard) => each.key === drawKey
                );
                if (index === -1) { // Locked card not in deck; remove it
                    localStorage.removeItem(card.key);
                }
            }

            if (card.deck === 'high') {
                if (index === -1) {
                    index = this.drawHighCard(highIndexes);
                }
                if (index === -1) {
                    draws = [];
                    error = this.deckTooSmallError;
                    break;
                }
                highIndexes.push(index);
                draw = this.state.deck.high[index];
            } else {
                if (index === -1) {
                    index = this.drawLowCard(lowIndexes);
                }
                if (index === -1) {
                    draws = [];
                    error = this.deckTooSmallError;
                    break;
                }
                lowIndexes.push(index);
                draw = this.state.deck.low[index];
            }

            draws.push(draw);
        }

        this.setState({draws, error}, this.sendData);
    };

    /**
     * Draws a card from the high deck. Helper for {@link drawCards}.
     *
     * @private
     * @memberof PlayerView
     * @see drawCards
     */
    private drawHighCard = (indexes: number[]): number => {
        const numHighCards = this.state.deck.high.length;

        if (numHighCards < this.state.minHighCards) {
            return -1;
        }

        return this.drawCard(numHighCards, indexes);
    };

    /**
     * Draws a card from the low deck. Helper for {@link drawCards}.
     *
     * @private
     * @memberof PlayerView
     * @see drawCards
     */
    private drawLowCard = (indexes: number[]): number => {
        const numLowCards = this.state.deck.low.length;

        if (numLowCards < this.state.minLowCards) {
            return -1;
        }

        return this.drawCard(numLowCards, indexes);
    };

    /**
     * Returns the key for the card artwork.
     *
     * @private
     * @memberof PlayerView
     */
    private getArtworkKey = (): string => {
        return this.state.artworkKey || this.props.artworkKey;
    };

    /**
     * Renders a {@link Card} component. Helper for {@link render}.
     *
     * @private
     * @memberof PlayerView
     * @see render
     */
    private getCardElement = (card: SpreadCard, index: number): JSX.Element => {
        return (
            <Card
                artworkKey={this.getArtworkKey()}
                card={card}
                draw={this.state.draws[index]}
                key={card.key}
            />
        );
    };

    private getDeck = (keys?: string[]): Deck => {
        const deck = {
            high: this.props.data.deck.high.slice(),
            low: this.props.data.deck.low.slice(),
        };

        if (!keys) {
            const storedValue = localStorage.getItem('removed-cards');
            if (!storedValue) {
                return deck;
            }
            keys = storedValue.split(',');
        }

        for (let key of keys) {
            const highIndex = deck.high.findIndex(each => each.key === key);
            if (highIndex !== -1) {
                deck.high.splice(highIndex, 1);
                continue;
            }

            const lowIndex = deck.low.findIndex(each => each.key === key);
            if (lowIndex !== -1) {
                deck.low.splice(lowIndex, 1);
                continue;
            }
        }

        return deck;
    };

    /**
     * Receives requests from {@link DungeonMasterView} and sends data in response.
     * 
     * For example, when {@link DungeonMasterView} is refreshed and has no data available,
     * it will ask {@link PlayerView} to resend.
     *
     * @private
     * @memberof PlayerView
     */
    private handleMessage = (message: Message): void => {
        switch (message.type) {
            case 'change-artwork':
                const key = (message as ChangeArtworkMessage).key;
                this.changeArtwork(key);
                break;
            case 'send-data':
                this.sendData();
                break;
            case 'remove-cards':
                const keys = (message as RemoveCardsMessage).keys;
                this.removeCards(keys);
                break;
        }
    };

    /**
     * Removes cards from the deck.
     *
     * @private
     * @memberof PlayerView
     */
    private removeCards = (keys: string[]): void => {
        this.setState({deck: this.getDeck(keys)}, this.drawCards);
    };

    /**
     * Broadcasts data to the DungeonMasterView component.
     *
     * @private
     * @memberof PlayerView
     */
    private sendData = (): void => {
        this.channel.postMessage({
            draws: this.state.draws,
            error: this.state.error,
            spread: this.props.data.spread,
            type: 'update-data',
        });
    };

    /**
     * Broadcasts data to the DungeonMasterView component after a brief delay, to allow
     * it to properly initialize after the user clicks on the DungeonMasterViewLink.
     *
     * @private
     * @memberof PlayerView
     */
    private sendDataWithDelay = (): void => {
        setTimeout(this.sendData, 100);
    };
}

export default PlayerView;
