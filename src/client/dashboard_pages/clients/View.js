import React, { Component } from "react";
import DashboardWrapper from "../layout/DashboardWrapper";
import axios from "axios";
import { getBaseHeaders } from "../../Helpers";

import Endpoints from "../../Endpoints";
import { Link } from "react-router-dom";

import {
  Box,
  Breadcrumbs,
  Link as MuiLink,
  Typography,
  TextField,
  Divider,
  Button,
} from "@material-ui/core";

import { Alert } from "@material-ui/lab";

import Messages from "../layout/Messages";

class View extends Component {
  company_subdir = this.props.match.params.company_subdir;
  client_id = this.props.match.params.id;
  state = {
    name: "",
    email_address: "",
    phone_number: "",
    errors: {
      name: [],
      email_address: [],
      phone_number: [],
    },
    pageMessages: [],
    pageErrors: [],
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  getClient() {
    const headers = getBaseHeaders();
    const getClientEndpoint = Endpoints.get("api", "getSingleClient", {
      company_subdir: this.company_subdir,
      id: this.client_id,
    });
    axios
      .get(getClientEndpoint, headers)
      .then((res) => {
        this.setState({
          name: res.data.client.name,
          email_address: res.data.client.email_address,
          phone_number: res.data.client.phone_number,
        });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            const pageErrors = [
              ...this.state.pageErrors,
              "Unauthorized to view client. Please contact your admin for this permission.",
            ];
            this.setState({
              pageErrors: pageErrors,
            });
          } else if (error.response.status === 404) {
            const pageErrors = [
              ...this.state.pageErrors,
              "This client doesn't exist.",
            ];
            this.setState({
              pageErrors: pageErrors,
            });
          }
        }
      });
  }

  updateClient = (e) => {
    e.preventDefault();
    const headers = getBaseHeaders();
    const updateClientEndpoint = Endpoints.get("api", "updateClient", {
      company_subdir: this.company_subdir,
    });
    let data = {
      client_id: this.client_id,
      name: this.state.name,
      email_address: this.state.email_address,
      phone_number: this.state.phone_number,
    };
    this.setState({
      errors: {
        name: [],
        email_address: [],
        phone_number: [],
      },
    });
    axios
      .post(updateClientEndpoint, data, headers)
      .then((res) => {
        this.setState({
          pageMessages: [
            {
              text: res.data.message,
              severity: "success",
            },
          ],
        });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 422) {
            var newErrorsState = { ...this.state.errors };
            const errorData = error.response.data;
            if (errorData.name) newErrorsState.name = errorData.name;
            if (errorData.email_address)
              newErrorsState.email_address = errorData.email_address;
            if (errorData.phone_number)
              newErrorsState.phone_number = errorData.phone_number;
            this.setState({
              errors: newErrorsState,
            });
          } else if (error.response.status === 401) {
            const pageErrors = [
              ...this.state.pageErrors,
              "Unauthorized to update clients. Please contact your admin for this permission.",
            ];
            this.setState({ pageErrors: pageErrors });
          }
        }
      });
  };

  componentDidMount() {
    this.getClient();
  }

  render() {
    const company_subdir = this.company_subdir;
    const {
      pageMessages,
      pageErrors,
      errors,
      name,
      phone_number,
      email_address,
    } = {
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
              to={Endpoints.get("client", "dashboard", {
                company_subdir: company_subdir,
              })}
              color="inherit"
            >
              Home
            </MuiLink>
            <MuiLink
              component={Link}
              to={Endpoints.get("client", "clientsArea", {
                company_subdir: company_subdir,
              })}
              color="inherit"
            >
              Clients
            </MuiLink>
            <Typography color="textPrimary">Update Client</Typography>
          </Breadcrumbs>
          <Typography
            component="h1"
            variant="h4"
            className="standard-margin-bottom"
          >
            Update Client
          </Typography>
          <Divider className="standard-margin-bottom" />
          <Messages pageErrors={pageErrors} pageMessages={pageMessages} />
          <form className="xs-full-width" onSubmit={this.updateClient}>
            <Box
              display="flex"
              flexDirection="column"
              className="xs-full-width standard-margin-bottom"
            >
              <Typography component="h3" variant="h5">
                Client Details
              </Typography>
              {errors.name.map((error, index) => (
                <Alert
                  variant="filled"
                  severity="error"
                  className="standard-margin-bottom"
                  key={"name-" + index}
                >
                  {error}
                </Alert>
              ))}
              <TextField
                name="name"
                type="string"
                label="Name"
                onChange={this.onChange}
                value={name}
                className="xs-full-width standard-margin-bottom"
                error={errors.name.length > 0 ? true : false}
                required
              />
              {errors.email_address.map((error, index) => (
                <Alert
                  variant="filled"
                  severity="error"
                  className="standard-margin-bottom"
                  key={"emailAddress-" + index}
                >
                  {error}
                </Alert>
              ))}
              <TextField
                name="email_address"
                type="string"
                label="Email Address"
                onChange={this.onChange}
                value={email_address}
                className="xs-full-width standard-margin-bottom"
                error={errors.email_address.length > 0 ? true : false}
                required
              />
              {errors.phone_number.map((error, index) => (
                <Alert
                  variant="filled"
                  severity="error"
                  className="standard-margin-bottom"
                  key={"phoneNumber-" + index}
                >
                  {error}
                </Alert>
              ))}
              <TextField
                name="phone_number"
                type="string"
                label="Phone Number"
                onChange={this.onChange}
                value={phone_number}
                className="xs-full-width standard-margin-bottom"
                error={errors.phone_number.length > 0 ? true : false}
                required
              />
            </Box>

            <Button
              className="xs-full-width"
              type="submit"
              variant="contained"
              color="primary"
            >
              Update Client
            </Button>
          </form>
        </main>
      </DashboardWrapper>
    );
  }
}

export default View;
