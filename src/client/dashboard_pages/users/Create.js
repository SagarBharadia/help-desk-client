import React, { Component } from "react";
import DashboardAppBar from "../layout/DashboardAppBar";
import axios from "axios";
import Cookies from "js-cookie";

import APIEndpoints from "../../APIEndpoints";

import { Link } from "react-router-dom";

import {
  Box,
  Breadcrumbs,
  Container,
  Link as MuiLink,
  Typography,
  TextField,
  Divider,
  Select,
  MenuItem,
  Button
} from "@material-ui/core";

class Create extends Component {
  company_subdir = this.props.match.params.company_subdir;
  state = {
    downloadedRoles: [],
    first_name: "",
    second_name: "",
    email_address: "",
    password: "",
    password_confirmation: "",
    role: ""
  };

  styles = {
    textfield: {
      width: "calc(33% - 20px)"
    }
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  populateRoles() {
    let getRolesEndpoint = APIEndpoints.get("getAllRoles", this.company_subdir);
    let options = {
      headers: {
        Authorization: "Bearer " + Cookies.get("token")
      }
    };
    axios.get(getRolesEndpoint, options).then(res => {
      this.setState({ downloadedRoles: res.data.data });
    });
  }

  componentDidMount() {
    this.populateRoles();
  }

  render() {
    return (
      <Box>
        <DashboardAppBar {...this.props} />
        <Container>
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
          <Box
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="space-between"
          >
            <Box
              display="flex"
              flexDirection="column"
              className="sm-full-width md-half-width standard-margin-bottom"
            >
              <Typography component="h3" variant="h5">
                User Details
              </Typography>
              <TextField
                name="first_name"
                type="string"
                label="First Name"
                onChange={this.onChange}
                value={this.state.first_name}
                required
              />
              <br />
              <TextField
                name="second_name"
                type="string"
                label="Second Name"
                onChange={this.onChange}
                value={this.state.second_name}
                required
              />
              <br />
              <TextField
                name="email_address"
                type="email"
                label="Email Address"
                onChange={this.onChange}
                value={this.state.email_address}
                required
              />
              <br />
              <TextField
                name="password"
                type="password"
                label="Password"
                onChange={this.onChange}
                value={this.state.password}
                required
              />
              <br />
              <TextField
                name="password_confirmation"
                type="password"
                label="Password Confirmation"
                onChange={this.onChange}
                value={this.state.password_confirmation}
                required
              />
              <br />
              <Select
                name="role"
                onChange={this.onChange}
                value={this.state.role}
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
              <br />
              <Button variant="contained" color="primary">
                Create User
              </Button>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              className="sm-full-width md-half-width standard-margin-bottom"
            >
              <Typography component="h3" variant="h5">
                Applied Permissions
              </Typography>
              DOWNLOAD THE PERMISSIONS FROM THE CHOSEN ROUTES HERE AND DISPLAY
              THEM
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }
}

export default Create;
