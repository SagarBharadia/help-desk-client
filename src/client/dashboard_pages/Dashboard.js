import React, { Component } from "react";
import DashboardWrapper from "./layout/DashboardWrapper";

class Dashboard extends Component {
  render() {
    return (
      <DashboardWrapper {...this.props}>
        <main></main>
      </DashboardWrapper>
    );
  }
}

export default Dashboard;
