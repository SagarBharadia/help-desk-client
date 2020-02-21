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
    error: {
      status: null,
      statusText: ""
    },
    authed: false
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
        this.setState({
          error: {
            status: res.status,
            statusText: res.statusText
          },
          authed: true
        });
      })
      .catch(error => {
        if (error.response) {
          this.setState({
            error: {
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
      <div className="w-100vw h-100vh d-flex flex-column justify-center align-center">
        <div className={this.state.error.statusText ? "d-block" : "d-none"}>
          <p>{this.state.error.statusText}</p>
        </div>
        <form
          className="d-flex flex-column justify-flex-start align-center"
          onSubmit={this.onSubmit}
        >
          <div className="pb-16 d-flex flex-column">
            <label className="align-self-start" htmlFor="email_address">
              Email Address
            </label>
            <input
              type="email"
              name="email_address"
              onChange={this.onChange}
              value={this.state.email_address}
              required
            />
          </div>
          <div className="pb-16 d-flex flex-column">
            <label className="align-self-start" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              onChange={this.onChange}
              value={this.state.password}
              required
            />
          </div>
          <button className="align-self-start" type="submit">Login</button>
        </form>
        {this.state.authed ? (
          <Redirect to={this.loginRedirectIfSuccessful} />
        ) : null}
      </div>
    );
  }
}

export default Login;
