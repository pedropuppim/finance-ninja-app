import React from 'react';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';

import { isAuthenticated } from "./services/auth";

import Invoices from './pages/Invoices';
import Login from './pages/Login';
import Accounts from './pages/Accounts';
import Customers from './pages/Customers';
import Providers from './pages/Providers';
import Logoff from './pages/Logoff';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
      )
    }
  />
);



const Routes = () => (

	<BrowserRouter>
		<Switch>
            <PrivateRoute path="/customers" component={Customers} />
            <PrivateRoute path="/providers" component={Providers} />
            <PrivateRoute path="/accounts" component={Accounts} />
			      <PrivateRoute path="/invoices" component={Invoices} />
            <Route path="/login" component={Login} />
            <PrivateRoute exact path="/" component={Invoices} />
            <PrivateRoute exact path="/logoff" component={Logoff} />
		</Switch>
	</BrowserRouter>
);

export default Routes;



