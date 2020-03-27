import React, { Component } from "react";
import DashboardWrapper from "../layout/DashboardWrapper";
import axios from "axios";
import Cookies from "js-cookie";

import APIEndpoints from "../../APIEndpoints";

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
  ExpansionPanelDetails
} from "@material-ui/core";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { Alert } from "@material-ui/lab";

class View extends Component {
  company_subdir = this.props.match.params.company_subdir;
  user_id = this.props.match.params.user_id;
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
      protected_role: 0
    },
    errors: {
      first_name: [],
      second_name: [],
      email_address: [],
      role_id: [],
      password: [],
      password_confirmation: []
    },
    messages: []
  };

  styles = {
    textfield: {
      width: "calc(33% - 20px)"
    }
  };

  displayRole() {
    let options = {
      headers: {
        Authorization: "Bearer " + Cookies.get("token")
      }
    };
    let getSingleRoleEndpoint = APIEndpoints.get("getSingleRole", {
      company_subdir: this.company_subdir,
      id: this.state.role
    });
    axios
      .get(getSingleRoleEndpoint, options)
      .then(res => {
        if (res.data.role) this.setState({ roleOnShow: res.data.role });
      })
      .catch(reason => {
        console.log(reason);
      });
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    if (e.target.name === "role") {
      if (
        this.state.downloadedRoles.findIndex(
          role => role.id === e.target.value
        ) !== -1
      ) {
        this.setState({
          roleOnShow: this.state.downloadedRoles.find(
            role => role.id === e.target.value
          )
        });
      } else {
        this.setState({
          roleOnShow: {
            display_name: "",
            permissions: [],
            protected_role: 0
          }
        });
      }
    }
  };

  populateRoles() {
    let options = {
      headers: {
        Authorization: "Bearer " + Cookies.get("token")
      },
      params: {
        forForm: "true"
      }
    };
    let getRolesEndpoint = APIEndpoints.get("getAllRoles", {
      company_subdir: this.company_subdir
    });
    axios
      .get(getRolesEndpoint, options)
      .then(res => {
        this.setState({ downloadedRoles: res.data });
      })
      .catch(error => {
        console.log(error);
      });
  }

  componentDidMount() {
    this.populateRoles();
    this.downloadUser();
  }

  downloadUser() {
    let getUserEndpoint = APIEndpoints.get("getSingleUser", {
      company_subdir: this.company_subdir,
      id: this.user_id
    });
    let headers = {
      headers: {
        Authorization: "Bearer " + Cookies.get("token")
      }
    };
    axios
      .get(getUserEndpoint, headers)
      .then(res => {
        if (res.data.user) {
          let user = res.data.user;
          this.setState({
            user_id: user.id,
            first_name: user.first_name,
            second_name: user.second_name,
            email_address: user.email_address,
            role: user.role_id,
            active: user.active
          });
        }
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 422) {
            var newErrorsState = { ...this.state.errors };
            let errorData = error.response.data;
            if (errorData.first_name)
              newErrorsState.first_name = errorData.first_name;
            if (errorData.second_name)
              newErrorsState.second_name = errorData.second_name;
            if (errorData.email_address)
              newErrorsState.email_address = errorData.email_address;
            if (errorData.role_id) newErrorsState.role_id = errorData.role_id;
            if (errorData.password)
              newErrorsState.password = errorData.password;
            this.setState({
              errors: newErrorsState
            });
          }
        }
      });
  }

  toggleActive = () => {
    let headers = {
      headers: {
        Authorization: "Bearer " + Cookies.get("token")
      }
    };
    let toggleActiveUserEndpoint = APIEndpoints.get("toggleActiveUser", {
      company_subdir: this.company_subdir
    });
    let data = {
      user_id: this.state.user_id
    };
    axios
      .post(toggleActiveUserEndpoint, data, headers)
      .then(res => {
        if (res.status === 204) {
          let newActiveState = !this.state.active;
          this.setState({
            active: newActiveState,
            messages: [
              {
                text: "User active toggled",
                severity: "success"
              }
            ]
          });
        }
      })
      .catch(error => console.log(error.response));
  };

  updateUser = e => {
    e.preventDefault();
    let headers = {
      headers: {
        Authorization: "Bearer " + Cookies.get("token")
      }
    };
    let updateUserEndpoint = APIEndpoints.get("updateUser", {
      company_subdir: this.company_subdir
    });
    let data = {
      user_id: this.state.user_id,
      first_name: this.state.first_name,
      second_name: this.state.second_name,
      email_address: this.state.email_address,
      role_id: this.state.role,
      password: this.state.password,
      password_confirmation: this.state.password_confirmation
    };
    axios
      .post(updateUserEndpoint, data, headers)
      .then(res => {
        var severity = "info";
        if (res.status === 204) severity = "success";
        this.setState({
          messages: [
            {
              text: "User Updated",
              severity: severity
            }
          ]
        });
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 422) {
            var newErrorsState = { ...this.state.errors };
            let errorData = error.response.data;
            if (errorData.first_name)
              newErrorsState.first_name = errorData.first_name;
            if (errorData.second_name)
              newErrorsState.second_name = errorData.second_name;
            if (errorData.email_address)
              newErrorsState.email_address = errorData.email_address;
            if (errorData.role_id) newErrorsState.role_id = errorData.role_id;
            if (errorData.password)
              newErrorsState.password = errorData.password;
            this.setState({
              errors: newErrorsState
            });
          }
        }
      });
  };

  render() {
    return (
      <DashboardWrapper {...this.props}>
        <main>
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
            <MuiLink
              component={Link}
              to={"/" + this.company_subdir + "/users"}
              color="inherit"
            >
              Users
            </MuiLink>
            <Typography color="textPrimary">{this.state.first_name}</Typography>
          </Breadcrumbs>
          <Typography
            component="h1"
            variant="h4"
            className="standard-margin-bottom"
          >
            {this.state.first_name}&nbsp;
            {this.state.second_name}&nbsp;
            {this.state.active ? (
              <CheckCircleIcon style={{ color: "#2ecc71" }} />
            ) : (
              <ErrorIcon style={{ color: "#e74c3c" }} />
            )}
          </Typography>
          <Divider className="standard-margin-bottom" />
          {this.state.messages.map((message, index) => (
            <Alert
              key={"message-" + index}
              variant="filled"
              severity={message.severity}
              className="standard-margin-bottom"
            >
              {message.text}
            </Alert>
          ))}
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
                {this.state.errors.first_name.map((error, index) => (
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
                  value={this.state.first_name}
                  className="xs-full-width standard-margin-bottom"
                  error={this.state.errors.first_name.length > 0 ? true : false}
                  required
                />
                {this.state.errors.second_name.map((error, index) => (
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
                  value={this.state.second_name}
                  className="xs-full-width standard-margin-bottom"
                  error={
                    this.state.errors.second_name.length > 0 ? true : false
                  }
                  required
                />
                {this.state.errors.email_address.map((error, index) => (
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
                  value={this.state.email_address}
                  className="xs-full-width standard-margin-bottom"
                  error={
                    this.state.errors.email_address.length > 0 ? true : false
                  }
                  required
                />
                {this.state.errors.password.map((error, index) => (
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
                  value={this.state.password}
                  className="xs-full-width standard-margin-bottom"
                  error={this.state.errors.password.length > 0 ? true : false}
                />
                <TextField
                  name="password_confirmation"
                  type="password"
                  label="New Password Confirmation"
                  onChange={this.onChange}
                  value={this.state.password_confirmation}
                  className="xs-full-width standard-margin-bottom"
                  error={this.state.errors.password.length > 0 ? true : false}
                />
                <Select
                  name="role"
                  onChange={this.onChange}
                  value={this.state.role}
                  className="xs-full-width standard-margin-bottom"
                  displayEmpty
                  required
                >
                  <MenuItem value="">Select Role</MenuItem>
                  <Divider />
                  {Object.keys(this.state.downloadedRoles).map(key => {
                    let role = this.state.downloadedRoles[key];
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
                  Update {this.state.first_name}
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
                to={
                  "/" +
                  this.company_subdir +
                  "/users/" +
                  this.state.user_id +
                  "/action-logs"
                }
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
                    {this.state.roleOnShow.permissions.map(permission => (
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
