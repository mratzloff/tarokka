import './App.scss';

import React from 'react';
import Modal from 'react-modal';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import data from '../../data.json';
import DungeonMasterView from '../DungeonMasterView/DungeonMasterView';
import PlayerView from '../PlayerView/PlayerView';

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
                <Routes>
                    <Route path="/dm" element={
                        <DungeonMasterView
                            artworkKey={artworkKey}
                            data={data}
                        />}
                    />
                    <Route path="/" element={
                        <PlayerView
                            artworkKey={artworkKey}
                            data={data}
                        />}
                    />
                </Routes>
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
