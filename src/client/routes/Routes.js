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
import { default as RolesCreate } from "../dashboard_pages/roles/Create";
import { default as RolesView } from "../dashboard_pages/roles/View";

// Importing Client Pages
import { default as ClientsHome } from "../dashboard_pages/clients/Home";
import { default as ClientsCreate } from "../dashboard_pages/clients/Create";

// Importing error pages
import Error404 from "../website_pages/error_pages/Error404";
import Endpoints from "../Endpoints";

class Routes extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route
            exact
            path={Endpoints.getRaw("client", "login")}
            render={(props) => <Login {...this.props} {...props} />}
          />
          <Route
            exact
            path={Endpoints.getRaw("client", "dashboard")}
            render={(props) => (
              <Guarded page={Dashboard} {...this.props} {...props} />
            )}
          />
          <Route
            exact
            path={Endpoints.getRaw("client", "usersArea")}
            render={(props) => (
              <Guarded page={UsersHome} {...this.props} {...props} />
            )}
          />
          <Route
            exact
            path={Endpoints.getRaw("client", "createUser")}
            render={(props) => (
              <Guarded page={UsersCreate} {...this.props} {...props} />
            )}
          />
          <Route
            exact
            path={Endpoints.getRaw("client", "viewUser")}
            render={(props) => (
              <Guarded page={UsersView} {...this.props} {...props} />
            )}
          />
          <Route
            exact
            path={Endpoints.getRaw("client", "rolesArea")}
            render={(props) => (
              <Guarded page={RolesHome} {...this.props} {...props} />
            )}
          />
          <Route
            exact
            path={Endpoints.getRaw("client", "createRole")}
            render={(props) => (
              <Guarded page={RolesCreate} {...this.props} {...props} />
            )}
          />
          <Route
            exact
            path={Endpoints.getRaw("client", "viewRole")}
            render={(props) => (
              <Guarded page={RolesView} {...this.props} {...props} />
            )}
          />
          <Route
            exact
            path={Endpoints.getRaw("client", "clientsArea")}
            render={(props) => (
              <Guarded page={ClientsHome} {...this.props} {...props} />
            )}
          />
          <Route
            exact
            path={Endpoints.getRaw("client", "createClient")}
            render={(props) => (
              <Guarded page={ClientsCreate} {...this.props} {...props} />
            )}
          />
          <Route render={(props) => <Error404 {...props} />} />
        </Switch>
      </Router>
    );
  }
}

export default Routes;
