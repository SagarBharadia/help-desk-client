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
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";

import { Alert } from "@material-ui/lab";

class Create extends Component {
  company_subdir = this.props.match.params.company_subdir;
  state = {
    name: "",
    display_name: "",
    appliedPermissions: [],
    availablePermissionActions: [],
    errors: {
      name: [],
      display_name: [],
    },
    messages: [],
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  componentDidMount() {
    this.getAllPermissionActions();
  }

  getAllPermissionActions() {
    let headers = {
      headers: {
        Authorization: "Bearer " + Cookies.get("token"),
      },
    };
    let getAllPermissionsEndpoint = Endpoints.get(
      "api",
      "getAllPermissionActions",
      {
        company_subdir: this.company_subdir,
      }
    );
    axios.get(getAllPermissionsEndpoint, headers).then((res) => {
      this.setState({
        availablePermissionActions: res.data,
      });
    });
  }

  createRole = (e) => {
    e.preventDefault();
    let headers = {
      headers: {
        Authorization: "Bearer " + Cookies.get("token"),
      },
    };
    let createRoleEndpoint = Endpoints.get("api", "createRole", {
      company_subdir: this.company_subdir,
    });
    let data = {
      name: this.state.name,
      display_name: this.state.display_name,
      appliedPermissions: this.state.appliedPermissions,
    };
    axios
      .post(createRoleEndpoint, data, headers)
      .then((res) => {
        var severity = "info";
        if (res.status === 201) severity = "success";
        this.setState({
          name: "",
          display_name: "",
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
            if (errorData.name) newErrorsState.name = errorData.name;
            if (errorData.display_name)
              newErrorsState.display_name = errorData.display_name;
            this.setState({
              errors: newErrorsState,
            });
          }
        }
      });
  };

  onPermissionActionChange = (e) => {
    let updatedAppliedPermissions = this.state.appliedPermissions;
    if (!e.target.checked) {
      updatedAppliedPermissions.filter((perm) => perm !== e.target.name);
    } else {
      updatedAppliedPermissions = [...updatedAppliedPermissions, e.target.name];
    }
    this.setState({
      appliedPermissions: updatedAppliedPermissions,
    });
  };

  render() {
    const company_subdir = this.company_subdir;
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
              to={Endpoints.get("client", "rolesArea", {
                company_subdir: company_subdir,
              })}
              color="inherit"
            >
              Roles
            </MuiLink>
            <Typography color="textPrimary">Create Role</Typography>
          </Breadcrumbs>
          <Typography
            component="h1"
            variant="h4"
            className="standard-margin-bottom"
          >
            Create Role
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
          <form className="xs-full-width" onSubmit={this.createRole}>
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
                <Typography component="h3" variant="h5">
                  Role Details
                </Typography>
                {this.state.errors.name.map((error, index) => (
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
                  value={this.state.name}
                  className="xs-full-width standard-margin-bottom"
                  error={this.state.errors.name.length > 0 ? true : false}
                  required
                />
                {this.state.errors.display_name.map((error, index) => (
                  <Alert
                    variant="filled"
                    severity="error"
                    className="standard-margin-bottom"
                    key={"displayName-" + index}
                  >
                    {error}
                  </Alert>
                ))}
                <TextField
                  name="display_name"
                  type="string"
                  label="Display Name"
                  onChange={this.onChange}
                  value={this.state.display_name}
                  className="xs-full-width standard-margin-bottom"
                  error={
                    this.state.errors.display_name.length > 0 ? true : false
                  }
                  required
                />
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                className="xs-full-width md-half-width standard-margin-bottom"
              >
                <Typography component="h3" variant="h5">
                  Role Permissions
                </Typography>
                <Typography component="p">
                  Select which permissions this role should have.
                </Typography>
                <FormGroup row>
                  {this.state.availablePermissionActions.map(
                    (permissionAction) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            name={permissionAction.action}
                            onChange={this.onPermissionActionChange}
                          />
                        }
                        label={permissionAction.name}
                        key={permissionAction.action + "-key"}
                      />
                    )
                  )}
                </FormGroup>
              </Box>
            </Box>
            <Button
              className="xs-full-width"
              type="submit"
              variant="contained"
              color="primary"
            >
              Create Role
            </Button>
          </form>
        </main>
      </DashboardWrapper>
    );
  }
}

export default Create;
