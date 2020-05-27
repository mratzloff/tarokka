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
 * Generic dictionary type.
 *
 * @interface Dictionary
 * @template T
 */
interface Dictionary<T> {
    [key: string]: T;
}

/**
 * The tarokka high deck, meaning the trump cards without a number or suit.
 *
 * @interface HighCard
 */
interface HighCard {
    key: readonly string, // Must be unique for entire deck
    name: readonly string,
    allies: readonly string[],
    alliesSecretText: readonly string[],
    alliesText: readonly string[],
    strahdSecretText: readonly string,
    strahdText: readonly string,
};

/**
 * The tarokka low deck, meaning the cards with a number and suit.
 *
 * @interface LowCard
 */
interface LowCard {
    key: readonly string, // Must be unique for entire deck
    name: readonly string,
    location: readonly string,
    secretText: readonly string,
    suit: readonly string,
    text: readonly string,
    value: readonly number,
};

/**
 * An option group for Select.
 *
 * @interface OptionGroup
 */
interface OptionGroup {
    label: string,
    options: Option[],
};

/**
 * An option for Select. Its own OptionType is unexported.
 *
 * @interface Option
 */
interface Option {
    label: string,
    value: string,
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
