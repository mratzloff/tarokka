import React from 'react';
import Select, {GroupBase, OnChangeValue, StylesConfig} from 'react-select';

/**
 * React props for {@link ArtworkChanger}.
 *
 * @interface ArtworkChangerProps
 */
interface ArtworkChangerProps {
    artwork: Artwork[],
    artworkKey: string,
    className?: string,
    onChange?: (option: OnChangeValue<Option, boolean>) => void,
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
        container: (base: Partial<StylesConfig<Option, boolean, GroupBase<Option>>>) => ({
            ...base,
            flex: 1,
        }),
    } as any;

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
