import React from "react";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";

// Importing the pages
import Home from './website_pages/Home';

function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
      </Switch>
    </Router>
  );
}

export default Routes;
