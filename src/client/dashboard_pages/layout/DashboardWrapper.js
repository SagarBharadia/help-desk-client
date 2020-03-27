import React, { Component } from "react";
import DashboardAppBar from "./DashboardAppBar";
import { Box } from "@material-ui/core";
import PropTypes from "prop-types";
import { Container } from "@material-ui/core";

class DashboardWrapper extends Component {
  render() {
    const { company_subdir } = { ...this.props.match.params };
    const { location } = { ...this.props };
    return (
      <Box>
        <DashboardAppBar company_subdir={company_subdir} location={location} />
        <Container>{this.props.children}</Container>
      </Box>
    );
  }
}

DashboardWrapper.propTypes = {
  children: PropTypes.element.isRequired
};

export default DashboardWrapper;
