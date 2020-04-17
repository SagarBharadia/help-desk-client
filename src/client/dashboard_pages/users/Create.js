import React, { Component } from "react";
import DashboardWrapper from "../layout/DashboardWrapper";
import axios from "axios";
import Cookies from "js-cookie";

import Endpoints from "../../Endpoints";

import { Link } from "react-router-dom";

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
} from "@material-ui/core";

import { Alert } from "@material-ui/lab";

class Create extends Component {
  company_subdir = this.props.match.params.company_subdir;
  state = {
    downloadedRoles: [],
    first_name: "",
    second_name: "",
    email_address: "",
    password: "",
    password_confirmation: "",
    role: "",
    roleOnShow: {
      display_name: "",
      permissions: [],
      protected_role: 0,
    },
    errors: {
      first_name: [],
      second_name: [],
      email_address: [],
      role_id: [],
      password: [],
      password_confirmation: [],
    },
    pageErrors: [],
    messages: [],
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
    if (e.target.name === "role" && e.target.value !== "") {
      this.setState({
        roleOnShow: this.state.downloadedRoles.find(
          (role) => role.id === e.target.value
        ),
      });
    }
  };

  populateRoles() {
    let options = {
      headers: {
        Authorization: "Bearer " + Cookies.get("token"),
      },
      params: {
        forForm: "true",
      },
    };
    let getRolesEndpoint = Endpoints.get("api", "getAllRoles", {
      company_subdir: this.company_subdir,
    });
    axios
      .get(getRolesEndpoint, options)
      .then((res) => {
        this.setState({ downloadedRoles: res.data });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            const prevErrors = this.state.pageErrors;
            this.setState({
              pageErrors: [
                ...prevErrors,
                "Unauthorized to view roles. Please contact your admin for this permission.",
              ],
            });
          }
        }
      });
  }

  componentDidMount() {
    this.populateRoles();
  }

  createUser = (e) => {
    e.preventDefault();
    let headers = {
      headers: {
        Authorization: "Bearer " + Cookies.get("token"),
      },
    };
    let createUserEndpoint = Endpoints.get("api", "createUser", {
      company_subdir: this.company_subdir,
    });
    let data = {
      first_name: this.state.first_name,
      second_name: this.state.second_name,
      email_address: this.state.email_address,
      role_id: this.state.role,
      password: this.state.password,
      password_confirmation: this.state.password_confirmation,
    };
    axios
      .post(createUserEndpoint, data, headers)
      .then((res) => {
        var severity = "info";
        if (res.status === 201) severity = "success";
        this.setState({
          first_name: "",
          second_name: "",
          email_address: "",
          password: "",
          password_confirmation: "",
          role: "",
          messages: [
            {
              text: res.statusText,
              severity: severity,
            },
          ],
        });
      })
      .catch((error) => {
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
              errors: newErrorsState,
            });
          } else if (error.response.status === 401) {
            let prevErrors = this.state.pageErrors;
            this.setState({
              pageErrors: [
                ...prevErrors,
                "Unauthorized to create roles. Please contact your admin for this permission.",
              ],
            });
          }
        }
      });
  };

  render() {
    const company_subdir = this.company_subdir;
    const {
      messages,
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
              to={Endpoints.get("client", "dashboard", {
                company_subdir: company_subdir,
              })}
              color="inherit"
            >
              Home
            </MuiLink>
            <MuiLink
              component={Link}
              to={Endpoints.get("client", "usersArea", {
                company_subdir: company_subdir,
              })}
              color="inherit"
            >
              Users
            </MuiLink>
            <Typography color="textPrimary">Create User</Typography>
          </Breadcrumbs>
          <Typography
            component="h1"
            variant="h4"
            className="standard-margin-bottom"
          >
            Create User
          </Typography>
          <Divider className="standard-margin-bottom" />
          {messages.map((message, index) => (
            <Alert
              key={"message-" + index}
              variant="filled"
              severity={message.severity}
              className="standard-margin-bottom"
            >
              {message.text}
            </Alert>
          ))}
          {pageErrors.map((message, index) => (
            <Alert
              key={"pageError" + index}
              variant="filled"
              severity="error"
              className="standard-margin-bottom"
            >
              {message}
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
              <form className="xs-full-width" onSubmit={this.createUser}>
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
                  label="Password"
                  onChange={this.onChange}
                  value={password}
                  className="xs-full-width standard-margin-bottom"
                  error={errors.password.length > 0 ? true : false}
                  required
                />
                <TextField
                  name="password_confirmation"
                  type="password"
                  label="Password Confirmation"
                  onChange={this.onChange}
                  value={password_confirmation}
                  className="xs-full-width standard-margin-bottom"
                  error={errors.password.length > 0 ? true : false}
                  required
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
                  Create User
                </Button>
              </form>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              className="xs-full-width md-half-width standard-margin-bottom"
            >
              <Typography component="h3" variant="h5">
                Applied Permissions
              </Typography>
              <Typography component="p">
                You can't assign seperate permissions to users, only roles.
              </Typography>
              <List>
                {roleOnShow.permissions.map((permission) => (
                  <ListItem
                    disableGutters
                    key={permission.permission_action.action}
                  >
                    <ListItemText primary={permission.permission_action.name} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        </main>
      </DashboardWrapper>
    );
  }
}

export default Create;
