import React, { Component } from "react";
import { Link } from "react-router-dom";

import RolesTable from "./components/RolesTable";
import {
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Box,
  Button,
} from "@material-ui/core";

import { Alert } from "@material-ui/lab";

import Endpoints from "../../Endpoints";

import DashboardWrapper from "../layout/DashboardWrapper";

class Home extends Component {
  render() {
    const { company_subdir } = { ...this.props.match.params };

    const getParams = new URLSearchParams(this.props.location.search);

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
            <Typography color="textPrimary">Roles</Typography>
          </Breadcrumbs>
          <Box
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            className="standard-margin-bottom"
          >
            <Typography component="h1" variant="h4">
              Roles
            </Typography>
            <Button
              component={Link}
              variant="contained"
              color="primary"
              style={{ marginLeft: "20px" }}
              to={Endpoints.get("client", "createRole", {
                company_subdir: company_subdir,
              })}
            >
              Create Role
            </Button>
          </Box>
          {getParams.get("deleted") === "success" ? (
            <Alert
              key={"deleted-alert"}
              variant="filled"
              severity="success"
              className="standard-margin-bottom"
            >
              Deleted role.
            </Alert>
          ) : (
            ""
          )}
          <RolesTable company_subdir={company_subdir} />
        </main>
      </DashboardWrapper>
    );
  }
}

export default Home;
