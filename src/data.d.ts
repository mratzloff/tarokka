/**
 * Card artwork.
 *
 * @interface Artwork
 */
interface Artwork {
    key: readonly string,
    name: readonly string,
};

/**
 * Top-level interface for data.json.
 *
 * @interface Data
 */
interface Data {
    artwork: Artwork[],
    deck: readonly Deck,
    spread: readonly SpreadCard[],
};

/**
 * The tarokka deck.
 *
 * @interface Deck
 */
interface Deck {
    high: readonly HighCard[],
    low: readonly LowCard[],
};

/**
 * The tarokka high deck, meaning the trump cards without a number or suit.
 *
 * @interface HighCard
 */
interface HighCard {
    allies: readonly string[],
    alliesSecretText: readonly string[],
    alliesText: readonly string[],
    image: readonly string,
    key: readonly string,
    name: readonly string,
    strahdSecretText: readonly string,
    strahdText: readonly string,
};

/**
 * The tarokka low deck, meaning the cards with a number and suit.
 *
 * @interface LowCard
 */
interface LowCard {
    image: readonly string,
    key: readonly string,
    name: readonly string,
    secretText: readonly string,
    suit: readonly string,
    text: readonly string,
    value: readonly number,
};

/**
 * A card in the tarokka spread, representing the positional meaning and
 * which deck to draw from.
 *
 * @interface SpreadCard
 */
interface SpreadCard {
    deck: readonly string,
    key: readonly string,
    name: readonly string,
    secretText: readonly string,
};
