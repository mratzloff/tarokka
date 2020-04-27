import './Spread.scss';

import {BroadcastChannel} from 'broadcast-channel';
import React from 'react';

import GuideButton from '../GuideButton/GuideButton';
import Card from './Card';

/**
 * React props for {@link Spread}.
 *
 * @interface SpreadProps
 */
interface SpreadProps {
    data: Data,
    edition: string,
};

/**
 * React state for {@link Spread}.
 *
 * @interface SpreadState
 */
interface SpreadState {
    draws: Array<HighCard | LowCard>,
};

/**
 * The spread, or arrangement of cards, for a given tarokka reading.
 *
 * @class Spread
 * @extends {React.Component<SpreadProps, SpreadState>}
 */
class Spread extends React.Component<SpreadProps, SpreadState> {
    /**
     * Broadcast channel used to communicate with {@link Guide}.
     *
     * @private
     * @type {BroadcastChannel}
     * @memberof Spread
     * @see Guide
     */
    private channel: BroadcastChannel = new BroadcastChannel('tarokka');

    /**
     * Creates an instance of Spread.
     * 
     * @param {SpreadProps} props
     * @memberof Spread
     */
    public constructor(props: SpreadProps) {
        super(props);

        this.state = {
            draws: [],
        };
    }

    /**
     * Called by React after component is inserted into the DOM tree.
     *
     * @memberof Spread
     */
    public componentDidMount = (): void => {
        this.channel.onmessage = this.handleMessage;
        this.drawCards();
    };

    /**
     * Called by React to render the component.
     *
     * @memberof Spread
     */
    public render = (): JSX.Element => {
        const editionClass = this.props.edition[1] + this.props.edition[0];

        return (
            <React.Fragment>
                <GuideButton onClick={this.sendDataWithDelay} />
                <div id="spread">
                    <div id="cards" className={editionClass}>
                        {this.props.data.spread.map(this.getCardElement)}
                    </div>
                </div>
            </React.Fragment>
        );
    };

    /**
     * Receives requests from {@link Guide} and sends data in response.
     * 
     * For example, when {@link Guide} is refreshed and has no data available,
     * it will ask {@link Spread} to resend.
     *
     * @private
     * @memberof Spread
     */
    private handleMessage = (): void => {
        this.sendData();
    };

    /**
     * Broadcasts data to the Guide component.
     *
     * @private
     * @memberof Spread
     */
    private sendData = (): void => {
        this.channel.postMessage({
            draws: this.state.draws,
            spread: this.props.data.spread,
        });
    };

    /**
     * Broadcasts data to the Guide component after a brief delay, to allow
     * it to properly initialize after the user clicks on the GuideLink.
     *
     * @private
     * @memberof Spread
     */
    private sendDataWithDelay = (): void => {
        setTimeout(this.sendData, 100);
    };

    /**
     * Draws a card from a deck, making sure not to draw the same card twice.
     *
     * @private
     * @memberof Spread
     */
    private drawCard = (deckSize: number, draws: number[]): number => {
        let card = -1;
        do {
            card = Math.floor(Math.random() * deckSize);
        } while (draws.includes(card));

        return card;
    };

    /**
     * Draws all cards for the spread and updates the state accordingly.
     *
     * @private
     * @memberof Spread
     */
    private drawCards = (): void => {
        const draws: Array<HighCard | LowCard> = [];
        const highIndexes: number[] = [];
        const lowIndexes: number[] = [];

        for (let card of this.props.data.spread) {
            let draw: HighCard | LowCard;

            if (card.deck === 'high') {
                const index = this.drawHighCard(highIndexes);
                highIndexes.push(index);
                draw = this.props.data.deck.high[index];
            } else {
                const index = this.drawLowCard(lowIndexes);
                lowIndexes.push(index);
                draw = this.props.data.deck.low[index];
            }

            draws.push(draw);
        }

        this.setState({draws}, this.sendData);
    };

    /**
     * Draws a card from the high deck. Helper for {@link drawCards}.
     *
     * @private
     * @memberof Spread
     * @see drawCards
     */
    private drawHighCard = (indexes: number[]): number => {
        return this.drawCard(this.props.data.deck.high.length, indexes);
    };

    /**
     * Draws a card from the low deck. Helper for {@link drawCards}.
     *
     * @private
     * @memberof Spread
     * @see drawCards
     */
    private drawLowCard = (indexes: number[]): number => {
        return this.drawCard(this.props.data.deck.low.length, indexes);
    };

    /**
     * Renders a {@link Card} component. Helper for {@link render}.
     *
     * @private
     * @memberof Spread
     * @see render
     */
    private getCardElement = (card: SpreadCard, index: number): JSX.Element => {
        return (
            <Card
                key={card.key}
                card={card}
                draw={this.state.draws[index]}
                edition={this.props.edition}
            />
        );
    };
}

export default Spread;
