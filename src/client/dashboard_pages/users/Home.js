import React, { Component } from "react";
import { Link } from "react-router-dom";

import DashboardAppBar from "../layout/DashboardAppBar";
import UsersTable from "./components/UsersTable";
import {
  Typography,
  Container,
  Breadcrumbs,
  Link as MuiLink
} from "@material-ui/core";

class Home extends Component {
  company_subdir = this.props.match.params.company_subdir;
  render() {
    return (
      <div>
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
          <Typography
            component="h1"
            variant="h4"
            className="standard-margin-bottom"
          >
            Users
          </Typography>
          <UsersTable company_subdir={this.company_subdir} />
        </Container>
      </div>
    );
  }
}

export default Home;
