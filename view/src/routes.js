import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import Login from './pages/Login'
import Home from './pages/Home'
import SignUp from './pages/SignUp'

const Routes = () => {
    return (
        <BrowserRouter>
            <Route exact component={Home} path="/" />
            <Route component={Login} path="/login" />
            <Route component={SignUp} path="/signup" />
        </BrowserRouter>
    );
}

export default Routes;