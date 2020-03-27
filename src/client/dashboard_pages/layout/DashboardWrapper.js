import React, { Component } from "react";
import DashboardAppBar from "./DashboardAppBar";
import { Box } from "@material-ui/core";
import PropTypes from "prop-types";

class DashboardWrapper extends Component {
  render() {
    const { company_subdir } = { ...this.props.match.params };
    const { location } = { ...this.props };
    return (
      <Box>
        <DashboardAppBar company_subdir={company_subdir} location={location} />
        {this.props.children}
      </Box>
    );
  }
}

DashboardWrapper.propTypes = {
  children: PropTypes.element.isRequired
};

export default DashboardWrapper;
