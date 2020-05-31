import React, { Component } from "react";
import DashboardWrapper from "../layout/DashboardWrapper";
import axios from "axios";
import { getBaseHeaders } from "../../Helpers";

import Endpoints from "../../Endpoints";

import { Link } from "react-router-dom";
import ErrorIcon from "@material-ui/icons/Error";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

import {
  Box,
  Breadcrumbs,
  Link as MuiLink,
  Typography,
  TextField,
  Divider,
  Select,
  MenuItem,
  Button,
  List,
  ListItem,
  ListItemText,
  ExpansionPanelSummary,
  ExpansionPanel,
  ExpansionPanelDetails,
} from "@material-ui/core";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { Alert } from "@material-ui/lab";
import Messages from "../layout/Messages";

class View extends Component {
  company_subdir = this.props.match.params.company_subdir;
  user_id = this.props.match.params.id;
  state = {
    downloadedRoles: [],
    user_id: 0,
    first_name: "Loading...",
    second_name: "Loading...",
    email_address: "Loading...",
    new_password: "",
    new_password_confirmation: "",
    role: "",
    active: 0,
    roleOnShow: {
      display_name: "",
      permissions: [],
      protected_role: 0,
    },
    errors: {
      first_name: [],
      second_name: [],
      email_address: [],
      password: [],
      password_confirmation: [],
    },
    pageErrors: [],
    pageMessages: [],
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
    if (e.target.name === "role" && e.target.value !== "") {
      if (
        this.state.downloadedRoles.findIndex(
          (role) => role.id === e.target.value
        ) !== -1
      ) {
        this.setState({
          roleOnShow: this.state.downloadedRoles.find(
            (role) => role.id === e.target.value
          ),
        });
      } else {
        this.setState({
          roleOnShow: {
            display_name: "",
            permissions: [],
            protected_role: 0,
          },
        });
      }
    }
  };

  resetErrors = () => {
    this.setState({
      pageErrors: [],
      pageMessages: [],
      errors: {
        first_name: [],
        second_name: [],
        email_address: [],
        password: [],
        password_confirmation: [],
      },
    });
  };

  populateRoles() {
    let headers = getBaseHeaders();
    headers.params = {
      forForm: true,
    };
    const getRolesEndpoint = Endpoints.get("api", "getAllRoles", {
      company_subdir: this.company_subdir,
    });
    axios
      .get(getRolesEndpoint, headers)
      .then((res) => {
        this.setState({ downloadedRoles: res.data });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            const pageErrors = [
              ...this.state.pageErrors,
              "Unauthorized to view roles. Please contact your admin for this permission.",
            ];
            this.setState({
              pageErrors: pageErrors,
            });
          }
        }
      });
  }

  componentDidMount() {
    this.populateRoles();
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
        if (res.data.user) {
          const user = res.data.user;
          this.setState({
            user_id: user.id,
            first_name: user.first_name,
            second_name: user.second_name,
            email_address: user.email_address,
            role: user.role_id,
            active: user.active,
            roleOnShow: this.state.downloadedRoles.find(
              (role) => role.id === user.role_id
            ),
          });
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 422) {
            let newErrorsState = { ...this.state.errors };
            const errorData = error.response.data;
            if (errorData.first_name)
              newErrorsState.first_name = errorData.first_name;
            if (errorData.second_name)
              newErrorsState.second_name = errorData.second_name;
            if (errorData.email_address)
              newErrorsState.email_address = errorData.email_address;
            if (errorData.password)
              newErrorsState.password = errorData.password;
            this.setState({
              errors: newErrorsState,
            });
          } else if (error.response.status === 401) {
            const pageErrors = [
              ...this.state.pageErrors,
              "Unauthorized to view user. Please contact your admin for this permission.",
            ];
            this.setState({
              pageErrors: pageErrors,
            });
          }
        }
      });
  }

  toggleActive = () => {
    const headers = getBaseHeaders();
    const toggleActiveUserEndpoint = Endpoints.get("api", "toggleActiveUser", {
      company_subdir: this.company_subdir,
    });
    const data = {
      user_id: this.state.user_id,
    };
    this.resetErrors();
    axios
      .post(toggleActiveUserEndpoint, data, headers)
      .then((res) => {
        const newActiveState = !this.state.active;
        this.setState({
          active: newActiveState,
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
          if (error.response.status === 401) {
            const pageErrors = [
              ...this.state.pageErrors,
              "Unauthorized to toggle users active state. Please contact your admin for this permission.",
            ];
            this.setState({
              pageErrors: pageErrors,
            });
          } else if (error.response.status === 422) {
            const pageErrors = [
              ...this.state.pageErrors,
              error.response.data.message,
            ];
            this.setState({
              pageErrors: pageErrors,
            });
          }
        }
      });
  };

  updateUser = (e) => {
    e.preventDefault();
    const headers = getBaseHeaders();
    const updateUserEndpoint = Endpoints.get("api", "updateUser", {
      company_subdir: this.company_subdir,
    });
    const data = {
      user_id: this.state.user_id,
      first_name: this.state.first_name,
      second_name: this.state.second_name,
      email_address: this.state.email_address,
      role_id: this.state.role,
      password: this.state.password,
      password_confirmation: this.state.password_confirmation,
    };
    this.resetErrors();
    axios
      .post(updateUserEndpoint, data, headers)
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
            let newErrorsState = { ...this.state.errors };
            const errorData = error.response.data;
            if (errorData.first_name)
              newErrorsState.first_name = errorData.first_name;
            if (errorData.second_name)
              newErrorsState.second_name = errorData.second_name;
            if (errorData.email_address)
              newErrorsState.email_address = errorData.email_address;
            if (errorData.password)
              newErrorsState.password = errorData.password;
            this.setState({
              errors: newErrorsState,
            });
          } else if (error.response.status === 401) {
            const pageErrors = [
              ...this.state.pageErrors,
              "Unauthorized to update user. Please contact your admin for this permission.",
            ];
            this.setState({
              pageErrors: pageErrors,
            });
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
      first_name,
      second_name,
      password,
      password_confirmation,
      email_address,
      role,
      downloadedRoles,
      roleOnShow,
      active,
    } = this.state;
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
            <Typography color="textPrimary">{first_name}</Typography>
          </Breadcrumbs>
          <Typography
            component="h1"
            variant="h4"
            className="standard-margin-bottom"
          >
            {first_name}&nbsp;
            {second_name}&nbsp;
            {active ? (
              <CheckCircleIcon style={{ color: "#2ecc71" }} />
            ) : (
              <ErrorIcon style={{ color: "#e74c3c" }} />
            )}
          </Typography>
          <Divider className="standard-margin-bottom" />
          <Messages pageMessages={pageMessages} pageErrors={pageErrors} />
          <Box
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="space-between"
          >
            <Box
              display="flex"
              flexDirection="column"
              className="xs-full-width md-half-width standard-margin-bottom"
            >
              <form
                className="xs-full-width standard-margin-bottom"
                onSubmit={this.updateUser}
              >
                <Typography component="h3" variant="h5">
                  User Details
                </Typography>
                {errors.first_name.map((error, index) => (
                  <Alert
                    variant="filled"
                    severity="error"
                    className="standard-margin-bottom"
                    key={"firstNameError-" + index}
                  >
                    {error}
                  </Alert>
                ))}
                <TextField
                  name="first_name"
                  type="string"
                  label="First Name"
                  onChange={this.onChange}
                  value={first_name}
                  className="xs-full-width standard-margin-bottom"
                  error={errors.first_name.length > 0 ? true : false}
                  required
                />
                {errors.second_name.map((error, index) => (
                  <Alert
                    variant="filled"
                    severity="error"
                    className="standard-margin-bottom"
                    key={"secondNameError-" + index}
                  >
                    {error}
                  </Alert>
                ))}
                <TextField
                  name="second_name"
                  type="string"
                  label="Second Name"
                  onChange={this.onChange}
                  value={second_name}
                  className="xs-full-width standard-margin-bottom"
                  error={errors.second_name.length > 0 ? true : false}
                  required
                />
                {errors.email_address.map((error, index) => (
                  <Alert
                    varient="filled"
                    severity="error"
                    className="standard-margin-bottom"
                    key={"emailAddressError-" + index}
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
                {errors.password.map((error, index) => (
                  <Alert
                    varient="filled"
                    severity="error"
                    className="standard-margin-bottom"
                    key={"passwordError-" + index}
                  >
                    {error}
                  </Alert>
                ))}
                <TextField
                  name="password"
                  type="password"
                  label="New Password"
                  onChange={this.onChange}
                  value={password}
                  className="xs-full-width standard-margin-bottom"
                  error={errors.password.length > 0 ? true : false}
                />
                <TextField
                  name="password_confirmation"
                  type="password"
                  label="New Password Confirmation"
                  onChange={this.onChange}
                  value={password_confirmation}
                  className="xs-full-width standard-margin-bottom"
                  error={errors.password.length > 0 ? true : false}
                />
                <Select
                  name="role"
                  onChange={this.onChange}
                  value={role}
                  className="xs-full-width standard-margin-bottom"
                  displayEmpty
                  required
                >
                  <MenuItem value="">Select Role</MenuItem>
                  <Divider />
                  {Object.keys(downloadedRoles).map((key) => {
                    let role = downloadedRoles[key];
                    return (
                      <MenuItem key={role.name} value={role.id}>
                        {role.display_name}
                      </MenuItem>
                    );
                  })}
                </Select>
                <Button
                  className="xs-full-width"
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Update {first_name}
                </Button>
              </form>
              <Button
                className="standard-margin-bottom"
                onClick={this.toggleActive}
                type="button"
                variant="contained"
                color="secondary"
              >
                Toggle Active
              </Button>
              <Button
                component={Link}
                variant="contained"
                color="default"
                to={Endpoints.get("client", "userLogs", {
                  company_subdir: this.company_subdir,
                  id: this.user_id,
                })}
              >
                View Action Logs
              </Button>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              className="xs-full-width md-half-width standard-margin-bottom"
            >
              <ExpansionPanel>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="applied-permissions-panel-content"
                  id="panel1a-header"
                >
                  <Typography component="h4" variant="h6">
                    Applied Permissions
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{ display: "block" }}>
                  <List>
                    {roleOnShow.permissions.map((permission) => (
                      <ListItem
                        disableGutters
                        key={permission.permission_action.action}
                      >
                        <ListItemText
                          primary={permission.permission_action.name}
                        />
                      </ListItem>
                    ))}
                  </List>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Box>
          </Box>
        </main>
      </DashboardWrapper>
    );
  }
}

export default View;
