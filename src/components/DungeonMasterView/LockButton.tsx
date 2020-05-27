import './LockButton.scss';

import React from 'react';

/**
 * React props for {@link LockButton}.
 *
 * @interface LockButtonProps
 */
interface LockButtonProps {
    card: SpreadCard,
    locked?: boolean,
    onClick?: (card: SpreadCard, locked: boolean) => void,
};

class LockButton extends React.Component<LockButtonProps> {
    /**
     * Called by React to render the component.
     *
     * @memberof LockButton
     */
    public render = (): JSX.Element => {
        const classes = ['lock'];
        if (this.props.locked) {
            classes.push('locked');
        }

        return (
            <button
                className={classes.join(' ')}
                onClick={this.handleClick}
                type="button"
            >
                {this.props.locked ? 'Unlock' : 'Lock'}
            </button>
        );
    };

    /**
     * Sets appropriate state in response to a lock button click.
     *
     * @private
     * @memberof LockButton
     */
    private handleClick = (): void => {
        if (this.props.onClick) {
            this.props.onClick(this.props.card, !this.props.locked);
        }
    };
}

export default LockButton;
