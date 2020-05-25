import './App.scss';

import React from 'react';
import Modal from 'react-modal';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import data from '../../data.json';
import Guide from '../Guide/Guide';
import Spread from '../Spread/Spread';

const defaultArtworkKey = 'forbidden-lore';

Modal.setAppElement('#root');

/**
 * The top-level application.
 *
 * @class App
 * @extends {React.Component}
 */
class App extends React.Component {
    /**
     * Called by React to render the component.
     *
     * @memberof App
     */
    public render = (): JSX.Element => {
        const artworkKey = this.getArtworkKey();

        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/guide">
                        <Guide
                            artworkKey={artworkKey}
                            data={data}
                        />
                    </Route>
                    <Route path="/">
                        <Spread
                            artworkKey={artworkKey}
                            data={data}
                        />
                    </Route>
                </Switch>
            </BrowserRouter>
        );
    };

    /**
     * Returns a valid saved artwork key from local storage, or the default
     * if none exists.
     *
     * @private
     * @memberof App
     */
    private getArtworkKey = (): string => {
        const storedValue = localStorage.getItem('artwork');
        if (!storedValue) {
            return defaultArtworkKey;
        }

        const index = data.artwork.findIndex(each => {
            return each.key === storedValue;
        });

        return (index !== -1) ? storedValue : defaultArtworkKey;
    };
}

export default App;
