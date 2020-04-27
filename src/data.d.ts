/**
 * A card in the tarokka spread, representing the positional meaning and
 * which deck to draw from.
 *
 * @interface SpreadCard
 */
interface SpreadCard {
    key: readonly string,
    name: readonly string,
    secretText: readonly string,
    deck: readonly string,
};

/**
 * The tarokka low deck, meaning the cards with a number and suit.
 *
 * @interface LowCard
 */
interface LowCard {
    name: readonly string,
    value: readonly number,
    suit: readonly string,
    image: readonly string,
    text: readonly string,
    secretText: readonly string,
};

/**
 * The tarokka high deck, meaning the trump cards without a number or suit.
 *
 * @interface HighCard
 */
interface HighCard {
    name: readonly string,
    image: readonly string,
    allies: readonly string[],
    alliesText: readonly string[],
    alliesSecretText: readonly string[],
    strahdText: readonly string,
    strahdSecretText: readonly string,
};

/**
 * The tarokka deck.
 *
 * @interface Deck
 */
interface Deck {
    low: readonly LowCard[],
    high: readonly HighCard[],
};

/**
 * Top-level interface for data.json.
 *
 * @interface Data
 */
interface Data {
    spread: readonly SpreadCard[],
    deck: readonly Deck,
};
