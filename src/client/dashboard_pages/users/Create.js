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
  Select,
  MenuItem,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";

import { Alert } from "@material-ui/lab";
import Messages from "../layout/Messages";

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
      password: [],
      password_confirmation: [],
    },
    pageErrors: [],
    pageMessages: [],
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
  }

  createUser = (e) => {
    e.preventDefault();
    const headers = getBaseHeaders();
    const createUserEndpoint = Endpoints.get("api", "createUser", {
      company_subdir: this.company_subdir,
    });
    const data = {
      first_name: this.state.first_name,
      second_name: this.state.second_name,
      email_address: this.state.email_address,
      role_id: this.state.role,
      password: this.state.password,
      password_confirmation: this.state.password_confirmation,
    };
    this.resetErrors();
    axios
      .post(createUserEndpoint, data, headers)
      .then((res) => {
        this.setState({
          first_name: "",
          second_name: "",
          email_address: "",
          password: "",
          password_confirmation: "",
          role: "",
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
              "Unauthorized to create roles. Please contact your admin for this permission.",
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
