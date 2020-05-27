import React from 'react';
import Select, {Styles, ValueType} from 'react-select';

/**
 * React props for {@link ArtworkChanger}.
 *
 * @interface ArtworkChangerProps
 */
interface ArtworkChangerProps {
    artwork: Artwork[],
    artworkKey: string,
    className?: string,
    onChange?: (option: ValueType<Option>) => void,
};

/**
 * The artwork changer, which allows users to change the card artwork.
 *
 * @param {ArtworkChangerProps} props
 * @returns {JSX.Element}
 */
function ArtworkChanger(props: ArtworkChangerProps): JSX.Element {
    const id = 'artwork-changer';

    const options: Option[] = props.artwork.map(each => {
        return {label: each.name, value: each.key};
    });

    const defaultValue = options.find(each => {
        return each.value === props.artworkKey;
    });

    const selectStyles = {
        container: (provided: Partial<Styles>) => ({
            ...provided,
            flex: 1,
        }),
    } as Styles;

    return (
        <div className={props.className}>
            <label htmlFor={id}>Artwork</label>
            <Select
                defaultValue={defaultValue}
                id={id}
                onChange={props.onChange}
                options={options}
                styles={selectStyles}
            />
        </div>
    );
};

export default ArtworkChanger;
