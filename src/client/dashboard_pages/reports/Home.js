import React, { Component } from "react";
import { Link } from "react-router-dom";

import ReportsTable from "./components/ReportsTable";
import {
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Box,
  Button,
} from "@material-ui/core";

import Endpoints from "../../Endpoints";

import DashboardWrapper from "../layout/DashboardWrapper";

import Messages from "../layout/Messages";

class Home extends Component {
  state = {
    pageErrors: [],
    pageMessages: [],
  };

  setPageErrors = (pageErrors) => {
    this.setState({
      pageErrors: pageErrors,
    });
  };

  render() {
    const { company_subdir } = { ...this.props.match.params };
    const { pageErrors, pageMessages } = { ...this.state };
    return (
      <DashboardWrapper {...this.props}>
        <main>
          <Breadcrumbs
            aria-label="breadcrumb"
            className="standard-margin-bottom"
          >
            <MuiLink
              component={Link}
              to={Endpoints.get("client", "dashboard", {
                company_subdir: company_subdir,
              })}
              color="inherit"
            >
              Home
            </MuiLink>
            <Typography color="textPrimary">Reports</Typography>
          </Breadcrumbs>
          <Box
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            className="standard-margin-bottom"
          >
            <Typography component="h1" variant="h4">
              Reports
            </Typography>
            <Button
              component={Link}
              variant="contained"
              color="primary"
              style={{ marginLeft: "20px" }}
              to={Endpoints.get("client", "createReport", {
                company_subdir: company_subdir,
              })}
            >
              Create Report
            </Button>
          </Box>
          <Messages pageErrors={pageErrors} pageMessages={pageMessages} />
          <ReportsTable
            company_subdir={company_subdir}
            pageErrors={pageErrors}
            setPageErrors={this.setPageErrors}
          />
        </main>
      </DashboardWrapper>
    );
  }
}

export default Home;
