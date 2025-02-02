import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import { isAuthenticated, isAuthenticatedAndAdmin } from "./services/auth";

import Invoices from './pages/Invoices';
import Login from './pages/Login';
import Accounts from './pages/Accounts';
import Companies from './pages/Companies';
import Logoff from './pages/Logoff';
import Categories from './pages/Categories';
import PaymentMethods from './pages/PaymentMethods';
import Users from './pages/Users';
import Dashboard from './pages/Dashboard';
import NewUser from './pages/Login/new';


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

const AdminRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticatedAndAdmin() ? (
        <Component {...props} />
      ) : (
          <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
        )
    }
  />
);



export default function Routes() {


  // const [user, setUser] = useState('');

  // useEffect(() => {
  //     setUser(getUser());
  // }, []);

  return (

    <BrowserRouter>
      <Switch>
        <PrivateRoute path="/companies" component={Companies} />
        <AdminRoute path="/users" component={Users} />
        <AdminRoute path="/dashboard" component={Dashboard} />
        <AdminRoute path="/accounts" component={Accounts} />
        <PrivateRoute path="/invoices" component={Invoices} />
        <AdminRoute path="/categories" component={Categories} />
        <AdminRoute path="/payment_methods" component={PaymentMethods} />
        <Route path="/login" component={Login} />
        <Route path="/new_user" component={NewUser} />
        <PrivateRoute exact path="/" component={Invoices} />
        <PrivateRoute exact path="/logoff" component={Logoff} />
      </Switch>
    </BrowserRouter>
  )
};
