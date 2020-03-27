import React, { Component } from "react";
import DashboardWrapper from "./layout/DashboardWrapper";

class Dashboard extends Component {
  render() {
    return (
      <DashboardWrapper {...this.props}>
        <h1>Children test</h1>
      </DashboardWrapper>
    );
  }
}

export default Dashboard;
