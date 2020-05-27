import React from 'react';

/**
 * React props for {@link Card}.
 *
 * @interface CardProps
 */
interface CardProps {
    artworkKey: string,
    card: SpreadCard,
    draw: HighCard | LowCard,
};

/**
 * A tarokka card from either the high or low decks.
 *
 * @class Card
 * @extends {React.Component<CardProps>}
 */
class Card extends React.Component<CardProps> {
    /**
     * Called by React to render the component.
     *
     * @memberof Card
     */
    public render = (): JSX.Element => {
        let backgroundImage = '';

        if (this.props.draw) {
            backgroundImage = this.getCardImage(this.props.draw.image);
        }

        return (
            <div
                className="card-container"
                id={this.props.card.key}
                onClick={this.handleClick}
            >
                <div className="card">
                    <div className="back"></div>
                    <div className="front" style={{backgroundImage}}></div>
                </div>
            </div>
        );
    };

    /**
     * Returns a CSS `url` data type ready for setting as a background image.
     *
     * @private
     * @memberof Card
     */
    private getCardImage = (image: string): string => {
        return `url(images/${this.props.artworkKey}/${image})`;
    };

    /**
     * Handles a card click to turn the card over.
     *
     * @private
     * @memberof Card
     */
    private handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        if (!event || !event.target) {
            return;
        }

        const target = event.target as HTMLDivElement;
        if (!target.parentElement ||
            !target.parentElement.parentElement) {
            return;
        }

        const grandparent = target.parentElement.parentElement;
        grandparent.classList.toggle('flipped');
    };
}

export default Card;
