import React, { Component } from "react";
import DashboardWrapper from "../layout/DashboardWrapper";
import axios from "axios";
import { getBaseHeaders } from "../../Helpers";

import Endpoints from "../../Endpoints";
import { Link, Redirect } from "react-router-dom";

import {
  Box,
  Breadcrumbs,
  Link as MuiLink,
  Typography,
  TextField,
  Divider,
  Button,
  TableBody,
  Table,
  TableRow,
  TableCell,
  TableHead,
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
    clientCalls: [],
    nextPageURL: "",
    prevPageURL: "",
    redirectToHome: false,
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

  getClientCalls() {
    const headers = getBaseHeaders();
    const getClientCalls = Endpoints.get("api", "getClientCalls", {
      company_subdir: this.company_subdir,
      client_id: this.client_id,
    });
    axios
      .get(getClientCalls, headers)
      .then((res) => {
        this.setState({
          clientCalls: res.data.data,
          nextPageURL: res.data.next_page_url,
          prevPageURL: res.data.prev_page_url,
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
          }
        }
      });
  }

  loadNewCalls = (direction) => {
    let headers = getBaseHeaders();
    headers.params = {
      handled_by: this.state.handledBy,
      created_at: this.state.createdAt,
      resolved: this.state.resolved,
    };
    let endpoint = this.state.nextPageURL;
    if (direction === "previous") {
      endpoint = this.state.prevPageURL;
    }
    axios
      .get(endpoint, headers)
      .then((res) => {
        this.setState({
          calls: res.data.data,
          nextPageURL: res.data.next_page_url,
          prevPageURL: res.data.prev_page_url,
        });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            const pageErrors = [
              ...this.props.pageErrors,
              "Unauthorized to view client. Please contact your admin for this permission.",
            ];
            this.props.setPageErrors(pageErrors);
          }
        }
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

  deleteClient = () => {
    const headers = getBaseHeaders();
    const deleteClient = Endpoints.get("api", "deleteClient", {
      company_subdir: this.company_subdir,
    });
    let data = {
      client_id: this.client_id,
    };
    this.resetErrors();
    axios
      .post(deleteClient, data, headers)
      .then((res) => {
        this.setState({
          redirectToHome: true,
        });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            const pageErrors = [
              ...this.state.pageErrors,
              "Unauthorized to update clients. Please contact your admin for this permission.",
            ];
            this.setState({ pageErrors: pageErrors });
          } else {
            const pageErrors = [
              ...this.state.pageErrors,
              error.response.data.message,
            ];
            this.setState({ pageErrors: pageErrors });
          }
        }
      });
  };

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
    this.resetErrors();
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
    this.getClientCalls();
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
      clientCalls,
      nextPageURL,
      prevPageURL,
      redirectToHome,
    } = {
      ...this.state,
    };
    let dateRightNow = new Date();
    const timeRightNowUnix = dateRightNow.getTime() / 1000;
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
          <form
            className="xs-full-width standard-margin-bottom"
            onSubmit={this.updateClient}
          >
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
              className="xs-full-width standard-margin-bottom"
              type="submit"
              variant="contained"
              color="primary"
            >
              Update Client
            </Button>
            <Button
              className="xs-full-width"
              type="button"
              variant="contained"
              color="secondary"
              onClick={this.deleteClient}
            >
              Delete Client
            </Button>
          </form>
          <br />
          <Typography variant="h5" component="h3">
            Clients Calls
          </Typography>
          <Table
            className="standard-margin-bottom"
            aria-label="table containing this clients calls"
          >
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(clientCalls).map((key) => {
                let call = clientCalls[key];
                let callWasCreatedAt =
                  new Date(call.created_at).getTime() / 1000;
                const diffTime = Math.abs(timeRightNowUnix - callWasCreatedAt);
                const diffHours = Math.ceil(diffTime / 60 / 60);
                return (
                  <TableRow
                    className={
                      diffHours > 24 && call.resolved === 0
                        ? "red-table-row"
                        : ""
                    }
                    key={call.id}
                  >
                    <TableCell component="th" scope="row">
                      {call.name}
                    </TableCell>
                    <TableCell>
                      <Button
                        component={Link}
                        variant="contained"
                        color="primary"
                        to={Endpoints.get("client", "viewCall", {
                          company_subdir: company_subdir,
                          id: call.id,
                        })}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Box
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={this.loadNewCalls.bind(this, "previous")}
              disabled={prevPageURL === null ? true : false}
            >
              Previous Page
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.loadNewCalls.bind(this, "next")}
              disabled={nextPageURL === null ? true : false}
            >
              Next Page
            </Button>
          </Box>
          {redirectToHome ? (
            <Redirect
              to={
                Endpoints.get("client", "clientsArea", {
                  company_subdir: this.company_subdir,
                }) + "?deleted=success"
              }
            />
          ) : (
            ""
          )}
        </main>
      </DashboardWrapper>
    );
  }
}

export default View;
