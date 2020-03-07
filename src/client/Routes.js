import React from "react";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";

// Importing the pages
import Home from "./website_pages/Home";

// Importing dashboard pages
import Login from "./dashboard_pages/Login";
import Dashboard from "./dashboard_pages/Dashboard";

// Importing error pages
import Error404 from "./website_pages/error_pages/Error404";

class Routes extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route
            exact
            path="/:company_subdir/"
            render={props => <Login {...this.props} {...props} />}
          />
          <Route
            exact
            path="/:company_subdir/dashboard"
            render={props => <Dashboard {...this.props} {...props} />}
          />
          <Route render={props => <Error404 {...props} />} />
        </Switch>
      </Router>
    );
  }
}

export default Routes;
