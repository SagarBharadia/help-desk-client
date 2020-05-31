import React, { Component } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Redirect } from "react-router-dom";
import Endpoints from "../Endpoints";
import Messages from "./layout/Messages";

import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
} from "@material-ui/core";

class Login extends Component {
  company_subdir = this.props.match.params.company_subdir;
  loginRedirectIfSuccessful = `/${this.company_subdir}/dashboard`;

  state = {
    email_address: "",
    password: "",
    response: {
      status: null,
      statusText: "",
    },
    pageErrors: [],
    pageMessages: [],
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmit = (e) => {
    // Preventing default behaviour of submit
    e.preventDefault();
    // Getting login endpoint
    const loginEndpoint = Endpoints.get("api", "login", {
      company_subdir: this.company_subdir,
    });
    // Performing post request
    axios
      .post(loginEndpoint, {
        email_address: this.state.email_address,
        password: this.state.password,
      })
      .then((res) => {
        Cookies.set("token-type", res.data.token_type, {
          expires: res.data.expires_in / 1440,
        });
        Cookies.set("token", res.data.token, {
          expires: res.data.expires_in / 1440,
        });
        Cookies.set("auth-company-subdir", res.data.company_subdir, {
          expires: res.data.expires_in / 1440,
        });
        Cookies.set("auth-company-name", res.data.company_name, {
          expires: res.data.expires_in / 1440,
        });
        Cookies.set("user-name", res.data.user_name, {
          expires: res.data.expires_in / 1440,
        });
        this.setState({
          pageMessages: [
            {
              text: "Successful.",
              severity: "success",
            },
          ],
        });
        this.props.setAppState("authenticated", true);
      })
      .catch((error) => {
        if (error.response) {
          const newPageErrors = [
            ...this.state.pageErrors,
            error.response.statusText,
          ];
          this.setState({
            pageErrors: newPageErrors,
          });
        }
      });

    this.setState({
      email_address: "",
      password: "",
    });
  };

  render() {
    const loginRedirectIfSuccessful = Endpoints.get("client", "dashboard", {
      company_subdir: this.company_subdir,
    });
    return (
      <div>
        <Paper
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            outline: 0,
            padding: "20px",
            width: "30vw",
            minWidth: "360px",
            maxWidth: "600px",
          }}
        >
          <Typography variant="h4" component="h1" align="center">
            Login
          </Typography>
          <br />
          <Typography
            component="p"
            align="center"
            className="standard-margin-bottom"
          >
            Attempting to log in to: {this.company_subdir}
          </Typography>
          <Divider />
          <Messages
            pageErrors={this.state.pageErrors}
            pageMessages={this.state.pageMessages}
          />
          <form onSubmit={this.onSubmit}>
            <Box display="flex" flexDirection="column">
              <TextField
                type="email"
                name="email_address"
                onChange={this.onChange}
                value={this.state.email_address}
                label="Email Address"
                className="standard-margin-bottom"
                required
              />
              <TextField
                type="password"
                name="password"
                onChange={this.onChange}
                value={this.state.password}
                label="Password"
                className="standard-margin-bottom"
                required
              />
              <Button type="submit" color="primary" variant="contained">
                Login
              </Button>
            </Box>
          </form>
        </Paper>

        {this.props.authenticated ? (
          <Redirect to={loginRedirectIfSuccessful} />
        ) : null}
      </div>
    );
  }
}

export default Login;
