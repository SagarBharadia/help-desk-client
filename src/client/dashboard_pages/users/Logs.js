import React, { Component } from "react";
import DashboardWrapper from "../layout/DashboardWrapper";
import axios from "axios";
import { getBaseHeaders } from "../../Helpers";

import Endpoints from "../../Endpoints";

import { Link } from "react-router-dom";

import UserLogsTable from "./components/UserLogsTable";

import {
  Breadcrumbs,
  Link as MuiLink,
  Typography,
  Divider,
} from "@material-ui/core";

import Messages from "../layout/Messages";

class Logs extends Component {
  company_subdir = this.props.match.params.company_subdir;
  user_id = this.props.match.params.id;
  state = {
    first_name: "Loading...",
    second_name: "Loading...",
    active: 0,
    pageErrors: [],
    pageMessages: [],
  };

  resetErrors = () => {
    this.setState({
      pageErrors: [],
      pageMessages: [],
    });
  };

  componentDidMount() {
    this.downloadUser();
  }

  downloadUser() {
    const getUserEndpoint = Endpoints.get("api", "getSingleUser", {
      company_subdir: this.company_subdir,
      id: this.user_id,
    });
    const headers = getBaseHeaders();
    axios
      .get(getUserEndpoint, headers)
      .then((res) => {
        this.setState({
          first_name: res.data.user.first_name,
          second_name: res.data.user.second_name,
          active: res.data.user.active,
        });
      })
      .catch((error) => {
        if (error.response.status === 401) {
          const pageErrors = [
            ...this.state.pageErrors,
            "Unauthorized to view user logs. Please contact your admin for this permission.",
          ];
          this.setState({
            pageErrors: pageErrors,
          });
        }
      });
  }

  render() {
    const company_subdir = this.company_subdir;
    const { first_name, second_name, pageMessages, pageErrors } = {
      ...this.state,
    };
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
            <MuiLink
              component={Link}
              to={"/" + company_subdir + "/users"}
              color="inherit"
            >
              Users
            </MuiLink>
            <MuiLink
              component={Link}
              to={"/" + company_subdir + "/users/" + this.user_id}
              color="inherit"
            >
              {first_name + " " + second_name}
            </MuiLink>
            <Typography color="textPrimary">Logs</Typography>
          </Breadcrumbs>
          <Typography
            component="h1"
            variant="h4"
            className="standard-margin-bottom"
          >
            {first_name + " " + second_name + " Logs"}
          </Typography>
          <Divider className="standard-margin-bottom" />
          <Messages pageMessages={pageMessages} pageErrors={pageErrors} />
          <UserLogsTable
            company_subdir={company_subdir}
            user_id={this.user_id}
            pageErrors={pageErrors}
            setPageErrors={this.setPageErrors}
          />
        </main>
      </DashboardWrapper>
    );
  }
}

export default Logs;
