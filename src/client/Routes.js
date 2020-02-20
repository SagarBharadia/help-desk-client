import React from "react";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";

// Importing the pages
import Home from "./website_pages/Home";

// Importing dashboard pages
import Login from "./dashboard_pages/Login";
import Dashboard from "./dashboard_pages/Dashboard";
import Protected from "./Protected";
import Guest from "./Guest";

class Routes extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route
            exact
            path="/:company_subdir/"
            render={props => Guest(Login, props)}
          />
          <Route
            exact
            path="/:company_subdir/dashboard"
            render={props => Protected(Dashboard, props)}
          />
        </Switch>
      </Router>
    );
  }
}

export default Routes;
