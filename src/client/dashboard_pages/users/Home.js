import React, { Component } from "react";
import { Link } from "react-router-dom";

import UsersTable from "./components/UsersTable";
import {
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Box,
  Button
} from "@material-ui/core";

import DashboardWrapper from "../layout/DashboardWrapper";

class Home extends Component {
  render() {
    const { company_subdir } = { ...this.props.match.params };
    return (
      <DashboardWrapper {...this.props}>
        <main>
          <Breadcrumbs
            aria-label="breadcrumb"
            className="standard-margin-bottom"
          >
            <MuiLink
              component={Link}
              to={"/" + company_subdir + "/dashboard"}
              color="inherit"
            >
              Home
            </MuiLink>
            <Typography color="textPrimary">Users</Typography>
          </Breadcrumbs>
          <Box
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            className="standard-margin-bottom"
          >
            <Typography component="h1" variant="h4">
              Users
            </Typography>
            <Button
              component={Link}
              variant="contained"
              color="primary"
              style={{ marginLeft: "20px" }}
              to={"/" + company_subdir + "/users/create"}
            >
              Create User
            </Button>
          </Box>
          <UsersTable company_subdir={company_subdir} />
        </main>
      </DashboardWrapper>
    );
  }
}

export default Home;
