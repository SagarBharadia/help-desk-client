import React, { Component } from "react";

import DashboardAppBar from "../layout/DashboardAppBar";

class Home extends Component {
  render() {
    return (
      <div>
        <DashboardAppBar {...this.props} />
      </div>
    );
  }
}

export default Home;
