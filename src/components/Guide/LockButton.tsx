import './LockButton.scss';

import React from 'react';

/**
 * React props for {@link LockButton}.
 *
 * @interface LockButtonProps
 */
interface LockButtonProps {
    card: SpreadCard,
    draw: HighCard | LowCard,
};

/**
 * React state for {@link LockButton}.
 *
 * @interface LockButtonState
 */
interface LockButtonState {
    locked: boolean,
};

class LockButton extends React.Component<LockButtonProps, LockButtonState> {
    /**
     * Creates an instance of LockButton.
     * 
     * @param {LockButtonProps} props
     * @memberof LockButton
     */
    constructor(props: LockButtonProps) {
        super(props);

        this.state = {
            locked: false,
        };
    }

    /**
     * Called by React after component is inserted into the DOM tree.
     *
     * @memberof LockButton
     */
    public componentDidMount = (): void => {
        const drawKey = localStorage.getItem(this.props.card.key);

        if (drawKey === this.props.draw.key) {
            this.setState({locked: true});
        }
    };

    /**
     * Called by React to render the component.
     *
     * @memberof LockButton
     */
    public render = (): JSX.Element => {
        const classes = ['lock'];
        if (this.state.locked) {
            classes.push('locked');
        }

        return (
            <button
                className={classes.join(' ')}
                onClick={this.handleClick}
                type="button"
            >
                {this.state.locked ? 'Unlock' : 'Lock'}
            </button>
        );
    };

    /**
     * Sets appropriate state in response to a lock button click.
     *
     * @private
     * @memberof LockButton
     */
    private handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        const locked = !this.state.locked;

        this.setState({locked});

        if (locked) {
            localStorage.setItem(this.props.card.key, this.props.draw.key);
        } else {
            localStorage.removeItem(this.props.card.key);
        }
    };
}

export default LockButton;
