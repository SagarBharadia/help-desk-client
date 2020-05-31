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
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";

import { Alert } from "@material-ui/lab";

import Messages from "../layout/Messages";

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
    pageMessages: [],
    pageErrors: [],
  };

  resetErrors = () => {
    this.setState({
      pageErrors: [],
      pageMessages: [],
      errors: {
        name: [],
        display_name: [],
      },
    });
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
    const headers = getBaseHeaders();
    const getAllPermissionsEndpoint = Endpoints.get(
      "api",
      "getAllPermissionActions",
      {
        company_subdir: this.company_subdir,
      }
    );
    axios
      .get(getAllPermissionsEndpoint, headers)
      .then((res) => {
        this.setState({
          availablePermissionActions: res.data,
        });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            const pageErrors = [
              ...this.state.pageErrors,
              "Unauthorized to get permissions. Please contact your admin for this permission.",
            ];
            this.setState({ pageErrors: pageErrors });
          }
        }
      });
  }

  createRole = (e) => {
    e.preventDefault();
    const headers = getBaseHeaders();
    const createRoleEndpoint = Endpoints.get("api", "createRole", {
      company_subdir: this.company_subdir,
    });
    let data = {
      name: this.state.name,
      display_name: this.state.display_name,
      appliedPermissions: this.state.appliedPermissions,
    };
    this.resetErrors();
    axios
      .post(createRoleEndpoint, data, headers)
      .then((res) => {
        this.setState({
          name: "",
          display_name: "",
          appliedPermissions: [],
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
            if (errorData.display_name)
              newErrorsState.display_name = errorData.display_name;
            this.setState({
              errors: newErrorsState,
            });
          } else if (error.response.status === 401) {
            const pageErrors = [
              ...this.state.pageErrors,
              "Unauthorized to create roles. Please contact your admin for this permission.",
            ];
            this.setState({ pageErrors: pageErrors });
          }
        }
      });
  };

  onPermissionActionChange = (e) => {
    let updatedAppliedPermissions = this.state.appliedPermissions;
    if (!e.target.checked) {
      updatedAppliedPermissions = updatedAppliedPermissions.filter(
        (perm) => perm !== e.target.value
      );
    } else {
      updatedAppliedPermissions = [
        ...updatedAppliedPermissions,
        e.target.value,
      ];
    }
    this.setState({
      appliedPermissions: updatedAppliedPermissions,
    });
  };

  render() {
    const company_subdir = this.company_subdir;
    const {
      pageMessages,
      pageErrors,
      errors,
      name,
      display_name,
      appliedPermissions,
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
          <Messages pageErrors={pageErrors} pageMessages={pageMessages} />
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
                <Typography
                  className="standard-margin-bottom"
                  component="h3"
                  variant="h5"
                >
                  Role Details
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
                {errors.display_name.map((error, index) => (
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
                  value={display_name}
                  className="xs-full-width standard-margin-bottom"
                  error={errors.display_name.length > 0 ? true : false}
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
                            onChange={this.onPermissionActionChange}
                            value={permissionAction.action}
                            checked={appliedPermissions.includes(
                              permissionAction.action
                            )}
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
