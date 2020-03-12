import React, { Component } from "react";
import { Link } from "react-router-dom";

import DashboardAppBar from "../layout/DashboardAppBar";
import UsersTable from "./components/UsersTable";
import {
  Typography,
  Container,
  Breadcrumbs,
  Link as MuiLink,
  Box,
  Button
} from "@material-ui/core";

class Home extends Component {
  company_subdir = this.props.match.params.company_subdir;
  render() {
    return (
      <Box>
        <DashboardAppBar {...this.props} />
        <Container>
          <Breadcrumbs
            aria-label="breadcrumb"
            className="standard-margin-bottom"
          >
            <MuiLink
              component={Link}
              to={"/" + this.company_subdir + "/dashboard"}
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
              to={"/" + this.company_subdir + "/users/create"}
            >
              Create User
            </Button>
          </Box>
          <UsersTable company_subdir={this.company_subdir} />
        </Container>
      </Box>
    );
  }
}

export default Home;
