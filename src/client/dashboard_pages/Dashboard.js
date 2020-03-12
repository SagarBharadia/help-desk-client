import React, { Component } from "react";
import DashboardAppBar from "./layout/DashboardAppBar";
import { Box } from "@material-ui/core";

class Dashboard extends Component {
  render() {
    return (
      <Box>
        <DashboardAppBar {...this.props} />
      </Box>
    );
  }
}

export default Dashboard;
