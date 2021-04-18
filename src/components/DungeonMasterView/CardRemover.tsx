import React from 'react';
import Select, {GroupedOptionsType, GroupType, Styles, ValueType} from 'react-select';

/**
 * React props for {@link CardRemover}.
 *
 * @interface CardRemoverProps
 */
interface CardRemoverProps {
    deck: Deck,
    className?: string,
    onChange?: (keys: string[]) => void,
};

/**
 * The card remover, which removes cards from the deck.
 *
 * @param {CardRemoverProps} props
 * @returns {JSX.Element}
 */
class CardRemover extends React.Component<CardRemoverProps> {
    /**
     * Called by React to render the component.
     *
     * @memberof CardRemover
     */
    public render = (): JSX.Element => {
        const id = 'card-remover';

        const selectStyles = {
            container: (provided: Partial<Styles<Option[], boolean>>) => ({
                ...provided,
                flex: 1,
            }),
        } as Styles<Option[], boolean>;

        return (
            <div className={this.props.className}>
                <label htmlFor={id}>Removed cards</label>
                <Select
                    defaultValue={this.getDefaultOptions()}
                    id={id}
                    isMulti
                    onChange={this.handleChange}
                    options={this.getOptionGroups()}
                    styles={selectStyles}
                />
            </div>
        );
    };

    /**
     * Returns default (i.e., previously selected) options for the Select object.
     *
     * @private
     * @memberof CardRemover
     */
    private getDefaultOptions = (): ValueType<Option[], boolean> => {
        const storedValue = localStorage.getItem('removed-cards');
        if (!storedValue) {
            return [];
        }

        const keys = storedValue.split(',');
        const options: Option[] = [];

        for (let key of keys) {
            const highCard = this.props.deck.high.find(each => each.key === key);
            if (highCard) {
                options.push(this.getOption(highCard));
                continue;
            }

            const lowCard = this.props.deck.low.find(each => each.key === key);
            if (lowCard) {
                options.push(this.getOption(lowCard));
                continue;
            }
        }

        return options;
    };

    /**
     * Returns a card option.
     *
     * @private
     * @memberof CardRemover
     */
    private getOption = (card: HighCard | LowCard): Option => {
        return {label: `The ${card.name}`, value: card.key};
    };

    /**
     * Returns high options as part of a High group.
     *
     * @private
     * @memberof CardRemover
     */
    private getHighOptionGroups = (): GroupedOptionsType<Option> => {
        const options = this.props.deck.high.map(each => this.getOption(each));

        options.sort((a: Option, b: Option): number => {
            return a.label.localeCompare(b.label);
        });

        return [{label: 'High', options}];
    };

    /**
     * Returns low options grouped by Low: <Location>.
     *
     * @private
     * @memberof CardRemover
     */
    private getLowOptionGroups = (): GroupedOptionsType<Option> => {
        const result: GroupType<Option>[] = [];
        const options: Dictionary<Option[]> = {};

        this.props.deck.low.forEach(each => {
            if (!options[each.location]) {
                options[each.location] = [];
            }
            options[each.location].push(this.getOption(each));
        });

        for (let [location, opts] of Object.entries(options)) {
            opts.sort((a: Option, b: Option): number => {
                return a.label.localeCompare(b.label);
            });

            result.push({label: `Low: ${location}`, options: opts});
        }

        result.sort((a: GroupType<Option>, b: GroupType<Option>): number => {
            return a.label.localeCompare(b.label);
        });

        return result;
    };

    /**
     * Returns options grouped by High and Low: <Location>.
     *
     * @private
     * @memberof CardRemover
     */
    private getOptionGroups = (): any => {
        // react-select's options prop type seems broken for multi types
        return this.getHighOptionGroups().concat(this.getLowOptionGroups());
    };

    /**
     * Handles a change event for the Select object.
     *
     * @private
     * @memberof CardRemover
     */
    private handleChange = (options: ValueType<Option[], boolean>): void => {
        if (!options) { // Occurs when ActionMeta<Option[]>.action === 'remove-value'
            options = [];
        }

        const keys = (options as Option[]).map(each => each.value);

        if (keys.length > 0) {
            localStorage.setItem('removed-cards', keys.join(','));
        } else {
            localStorage.removeItem('removed-cards');
        }

        if (this.props.onChange) {
            this.props.onChange(keys);
        }
    };
};

export default CardRemover;
