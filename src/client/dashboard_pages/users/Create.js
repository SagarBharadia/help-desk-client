import React, { Component } from "react";
import DashboardWrapper from "../layout/DashboardWrapper";
import axios from "axios";
import Cookies from "js-cookie";

import APIEndpoints from "../../APIEndpoints";

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
  ListItemText
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
      this.setState({
        roleOnShow: this.state.downloadedRoles.find(
          role => role.id === e.target.value
        )
      });
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
  }

  createUser = e => {
    e.preventDefault();
    let headers = {
      headers: {
        Authorization: "Bearer " + Cookies.get("token")
      }
    };
    let createUserEndpoint = APIEndpoints.get("createUser", {
      company_subdir: this.company_subdir
    });
    let data = {
      first_name: this.state.first_name,
      second_name: this.state.second_name,
      email_address: this.state.email_address,
      role_id: this.state.role,
      password: this.state.password,
      password_confirmation: this.state.password_confirmation
    };
    axios
      .post(createUserEndpoint, data, headers)
      .then(res => {
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
              <form className="xs-full-width" onSubmit={this.createUser}>
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
                  label="Password"
                  onChange={this.onChange}
                  value={this.state.password}
                  className="xs-full-width standard-margin-bottom"
                  error={this.state.errors.password.length > 0 ? true : false}
                  required
                />
                <TextField
                  name="password_confirmation"
                  type="password"
                  label="Password Confirmation"
                  onChange={this.onChange}
                  value={this.state.password_confirmation}
                  className="xs-full-width standard-margin-bottom"
                  error={this.state.errors.password.length > 0 ? true : false}
                  required
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
                {this.state.roleOnShow.permissions.map(permission => (
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
