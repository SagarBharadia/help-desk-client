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

class Create extends Component {
  company_subdir = this.props.match.params.company_subdir;
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

  resetErrors = () => {
    this.setState({
      pageErrors: [],
      pageMessages: [],
      errors: {
        name: [],
        email_address: [],
        phone_number: [],
      },
    });
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  createClient = (e) => {
    e.preventDefault();
    const headers = getBaseHeaders();
    const createClientEndpoint = Endpoints.get("api", "createClient", {
      company_subdir: this.company_subdir,
    });
    let data = {
      name: this.state.name,
      email_address: this.state.email_address,
      phone_number: this.state.phone_number,
    };
    this.resetErrors();
    axios
      .post(createClientEndpoint, data, headers)
      .then((res) => {
        this.setState({
          name: "",
          email_address: "",
          phone_number: "",
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
              "Unauthorized to create clients. Please contact your admin for this permission.",
            ];
            this.setState({ pageErrors: pageErrors });
          }
        }
      });
  };

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
            <Typography color="textPrimary">Create Client</Typography>
          </Breadcrumbs>
          <Typography
            component="h1"
            variant="h4"
            className="standard-margin-bottom"
          >
            Create Client
          </Typography>
          <Divider className="standard-margin-bottom" />
          <Messages pageErrors={pageErrors} pageMessages={pageMessages} />
          <form className="xs-full-width" onSubmit={this.createClient}>
            <Box
              display="flex"
              flexDirection="column"
              className="xs-full-width standard-margin-bottom"
            >
              <Typography
                className="standard-margin-bottom"
                component="h3"
                variant="h5"
              >
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
                type="email"
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
              Create Client
            </Button>
          </form>
        </main>
      </DashboardWrapper>
    );
  }
}

export default Create;
