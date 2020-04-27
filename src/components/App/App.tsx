import './App.scss';

import React from 'react';
import Modal from 'react-modal';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import data from '../../data.json';
import Guide from '../Guide/Guide';
import Spread from '../Spread/Spread';

const edition = '2e';

Modal.setAppElement('#root');

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/guide">
                    <Guide />
                </Route>
                <Route path="/">
                    <Spread data={data} edition={edition} />
                </Route>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
