import React, { Component } from "react";
import DashboardWrapper from "./layout/DashboardWrapper";

import Cookies from "js-cookie";

class Dashboard extends Component {
  render() {
    const companyName = Cookies.get("auth-company-name");
    return (
      <DashboardWrapper {...this.props}>
        <main>
          <p>Welcome to the Help Desk Application for {companyName}.</p>
        </main>
      </DashboardWrapper>
    );
  }
}

export default Dashboard;
