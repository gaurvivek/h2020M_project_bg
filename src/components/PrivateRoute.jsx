import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import baseRoutes from "base-routes";

export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        <Component {...props} />
    )} />
)