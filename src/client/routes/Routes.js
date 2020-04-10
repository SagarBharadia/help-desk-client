import React from "react";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";

// Importing The Website Pages
import Home from "../website_pages/Home";

// Importing Guards
import Guarded from "./Guarded";

// Importing Dashboard Pages
import Login from "../dashboard_pages/Login";
import Dashboard from "../dashboard_pages/Dashboard";

// Importing User Pages
import { default as UsersHome } from "../dashboard_pages/users/Home";
import { default as UsersCreate } from "../dashboard_pages/users/Create";
import { default as UsersView } from "../dashboard_pages/users/View";

// Importing Role Pages
import { default as RolesHome } from "../dashboard_pages/roles/Home";

// Importing error pages
import Error404 from "../website_pages/error_pages/Error404";

class Routes extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route
            exact
            path="/:company_subdir/"
            render={(props) => <Login {...this.props} {...props} />}
          />
          <Route
            exact
            path="/:company_subdir/dashboard"
            render={(props) => (
              <Guarded page={Dashboard} {...this.props} {...props} />
            )}
          />
          <Route
            exact
            path="/:company_subdir/users"
            render={(props) => (
              <Guarded page={UsersHome} {...this.props} {...props} />
            )}
          />
          <Route
            exact
            path="/:company_subdir/users/create"
            render={(props) => (
              <Guarded page={UsersCreate} {...this.props} {...props} />
            )}
          />
          <Route
            exact
            path="/:company_subdir/users/:user_id"
            render={(props) => (
              <Guarded page={UsersView} {...this.props} {...props} />
            )}
          />
          <Route
            exact
            path="/:company_subdir/roles"
            render={(props) => (
              <Guarded page={RolesHome} {...this.props} {...props} />
            )}
          />
          <Route render={(props) => <Error404 {...props} />} />
        </Switch>
      </Router>
    );
  }
}

export default Routes;
