import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import { isAuthenticated } from "./services/auth";

import Invoices from './pages/Invoices';
import Login from './pages/Login';
import Accounts from './pages/Accounts';
import Companies from './pages/Companies';
import Logoff from './pages/Logoff';
import Categories from './pages/Categories';
import PaymentMethods from './pages/PaymentMethods';
import Users from './pages/Users';

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
      <PrivateRoute path="/companies" component={Companies} />
      <PrivateRoute path="/users" component={Users} />
      <PrivateRoute path="/accounts" component={Accounts} />
      <PrivateRoute path="/invoices" component={Invoices} />
      <PrivateRoute path="/categories" component={Categories} />
      <PrivateRoute path="/payment_methods" component={PaymentMethods} />
      <Route path="/login" component={Login} />
      <PrivateRoute exact path="/" component={Invoices} />
      <PrivateRoute exact path="/logoff" component={Logoff} />
    </Switch>
  </BrowserRouter>
);

export default Routes;



