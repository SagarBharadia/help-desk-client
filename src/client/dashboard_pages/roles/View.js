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
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";

import { Alert } from "@material-ui/lab";
import Messages from "../layout/Messages";

class View extends Component {
  company_subdir = this.props.match.params.company_subdir;
  role_id = this.props.match.params.id;
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
    redirectToDashboard: false,
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  componentDidMount() {
    this.getAllPermissionActions();
    this.getRole();
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
              "Unauthorized to get all permission actions. Please contact your admin for this permission.",
            ];
            this.setState({
              pageErrors: pageErrors,
            });
          }
        }
      });
  }

  getRole() {
    const headers = getBaseHeaders();
    const getRoleEndpoint = Endpoints.get("api", "getSingleRole", {
      company_subdir: this.company_subdir,
      id: this.role_id,
    });
    axios
      .get(getRoleEndpoint, headers)
      .then((res) => {
        this.setState({
          name: res.data.role.name,
          display_name: res.data.role.display_name,
          appliedPermissions: res.data.role.permissions,
        });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            const pageErrors = [
              ...this.state.pageErrors,
              "Unauthorized to view role. Please contact your admin for this permission.",
            ];
            this.setState({
              pageErrors: pageErrors,
            });
          } else if (error.response.status === 404) {
            const pageErrors = [
              ...this.state.pageErrors,
              "This role doesn't exist.",
            ];
            this.setState({
              pageErrors: pageErrors,
            });
          }
        }
      });
  }

  roleCan = (permission) => {
    return this.state.appliedPermissions.some((applPerm) => {
      return applPerm === permission;
    });
  };

  deleteRole = (e) => {
    const headers = getBaseHeaders();
    const deleteRoleEndpoint = Endpoints.get("api", "deleteRole", {
      company_subdir: this.company_subdir,
    });
    const data = {
      role_id: this.role_id,
    };
    axios
      .post(deleteRoleEndpoint, data, headers)
      .then((res) => {
        this.setState({
          pageMessages: [
            {
              text: res.data.message,
              severity: "success",
            },
          ],
          redirectToDashboard: true,
        });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            const pageErrors = [
              ...this.state.pageErrors,
              "Unauthorized to delete role. Please contact your admin for this permission.",
            ];
            this.setState({
              pageErrors: pageErrors,
            });
          } else if (error.response.status === 403) {
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

  updateRole = (e) => {
    e.preventDefault();
    const headers = getBaseHeaders();
    const updateRoleEndpoint = Endpoints.get("api", "updateRole", {
      company_subdir: this.company_subdir,
    });
    const data = {
      role_id: this.role_id,
      name: this.state.name,
      display_name: this.state.display_name,
      appliedPermissions: this.state.appliedPermissions,
    };
    axios
      .post(updateRoleEndpoint, data, headers)
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
            if (errorData.name) newErrorsState.name = errorData.name;
            if (errorData.display_name)
              newErrorsState.display_name = errorData.display_name;
            this.setState({
              errors: newErrorsState,
            });
          } else if (error.response.status === 401) {
            const pageErrors = [
              ...this.state.pageErrors,
              "Unauthorized to update role. Please contact your admin for this permission.",
            ];
            this.setState({
              pageErrors: pageErrors,
            });
          }
        }
      });
  };

  onPermissionActionChange = (e) => {
    let updatedAppliedPermissions = this.state.appliedPermissions;
    if (!e.target.checked) {
      updatedAppliedPermissions = updatedAppliedPermissions.filter(
        (perm) => perm !== e.target.name
      );
    } else {
      updatedAppliedPermissions = [...updatedAppliedPermissions, e.target.name];
    }
    this.setState({
      appliedPermissions: updatedAppliedPermissions,
    });
  };

  render() {
    const company_subdir = this.company_subdir;
    const {
      name,
      display_name,
      availablePermissionActions,
      errors,
      redirectToDashboard,
      pageMessages,
      pageErrors,
    } = {
      ...this.state,
    };
    return (
      <DashboardWrapper {...this.props}>
        <main>
          {redirectToDashboard ? (
            <Redirect
              to={
                Endpoints.get("client", "rolesArea", {
                  company_subdir: company_subdir,
                }) + "?deleted=success"
              }
            />
          ) : (
            ""
          )}
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
            <Typography color="textPrimary">{display_name}</Typography>
          </Breadcrumbs>
          <Typography
            component="h1"
            variant="h4"
            className="standard-margin-bottom"
          >
            {display_name}
          </Typography>
          <Divider className="standard-margin-bottom" />
          <Messages pageMessages={pageMessages} pageErrors={pageErrors} />
          <form className="xs-full-width" onSubmit={this.updateRole}>
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
                  {availablePermissionActions.map((permissionAction) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          name={permissionAction.action}
                          onChange={this.onPermissionActionChange}
                        />
                      }
                      label={permissionAction.name}
                      key={permissionAction.action + "-key"}
                      checked={this.roleCan(permissionAction.action)}
                    />
                  ))}
                </FormGroup>
              </Box>
            </Box>
            <Button
              className="xs-full-width standard-margin-bottom"
              type="submit"
              variant="contained"
              color="primary"
            >
              Update Role
            </Button>
            <Button
              className="xs-full-width"
              onClick={this.deleteRole}
              type="button"
              variant="contained"
              color="secondary"
            >
              Delete Role
            </Button>
          </form>
        </main>
      </DashboardWrapper>
    );
  }
}

export default View;
