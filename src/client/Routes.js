import React from "react";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";

// Importing the pages
import Home from './website_pages/Home';

// Importing dashboard pages
import Login from './dashboard_pages/Login';

function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/*/" component={Login} />
      </Switch>
    </Router>
  );
}

export default Routes;
