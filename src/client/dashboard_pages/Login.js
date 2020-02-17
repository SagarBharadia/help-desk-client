import React, { Component } from "react";
import AppConfig from "../AppConfig";
import axios from "axios";

class Login extends Component {
  loginEndpoint = AppConfig.API_URL + this.props.match.params[0] + "api/login";

  state = {
    email_address: "",
    password: "",
    error: {
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
        console.log(res.data);
      })
      .catch(error => {
        if (error.response) {
          this.setState({
            error: {
              status: error.response.status,
              statusText: error.response.statusText
            }
          })
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
        {this.state.error.statusText}
        <form onSubmit={this.onSubmit}>
          <label>Email Address</label>
          <input
            type="email"
            name="email_address"
            onChange={this.onChange}
            value={this.state.email_address}
            required
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            onChange={this.onChange}
            value={this.state.password}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
}

export default Login;
