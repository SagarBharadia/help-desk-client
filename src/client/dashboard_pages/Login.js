import React, { Component } from "react";
import AppConfig from "../AppConfig";
import axios from "axios";
import Cookies from "js-cookie";
import { Redirect } from "react-router-dom";

class Login extends Component {
  company_subdir = this.props.match.params.company_subdir;
  loginEndpoint = AppConfig.API_URL + this.company_subdir + "/api/login";
  loginRedirectIfSuccessful = `/${this.company_subdir}/dashboard`;

  state = {
    email_address: "",
    password: "",
    response: {
      status: null,
      statusText: ""
    }
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = e => {
    // Preventing default behaviour of submit
    e.preventDefault();
    // Performing post request
    axios
      .post(this.loginEndpoint, {
        email_address: this.state.email_address,
        password: this.state.password
      })
      .then(res => {
        Cookies.set("token-type", res.data.token_type, {
          expires: res.data.expires_in / 86400
        });
        Cookies.set("token", res.data.token, {
          expires: res.data.expires_in / 86400
        });
        Cookies.set("auth-company-subdir", res.data.company_subdir, {
          expires: res.data.expires_in / 86400
        });
        this.setState({
          response: {
            status: res.status,
            statusText: res.statusText
          }
        });
        this.props.setAppState("authenticated", true);
        console.log(this.props.authed);
      })
      .catch(error => {
        if (error.response) {
          this.setState({
            response: {
              status: error.response.status,
              statusText: error.response.statusText
            }
          });
        }
      });

    this.setState({
      email_address: "",
      password: ""
    });
  };

  render() {
    return (
      <div>
        <div>
          <p>{this.state.response.statusText}</p>
        </div>
        <form onSubmit={this.onSubmit}>
          <div>
            <label htmlFor="email_address">Email Address</label>
            <input
              type="email"
              name="email_address"
              onChange={this.onChange}
              value={this.state.email_address}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              onChange={this.onChange}
              value={this.state.password}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        {this.props.authenticated ? (
          <Redirect to={this.loginRedirectIfSuccessful} />
        ) : null}
      </div>
    );
  }
}

export default Login;
