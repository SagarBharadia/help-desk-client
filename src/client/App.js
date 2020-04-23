import React, { Component } from "react";
import Routes from "./routes/Routes";
import Cookies from "js-cookie";

import "../css/normalize.css";
import "../css/index.css";
import Endpoints from "./Endpoints";
import Axios from "axios";

import { getBaseHeaders } from "./Helpers";

class App extends Component {
  state = {
    authenticated: false,
    loaded: false,
  };

  setAppState = (key, value) => {
    this.setState({ [key]: value });
  };

  componentDidMount() {
    if (
      Cookies.get("token") &&
      Cookies.get("token-type") &&
      Cookies.get("auth-company-subdir")
    ) {
      const checkTokenEndpoint = Endpoints.get("api", "checkToken", {
        company_subdir: Cookies.get("auth-company-subdir"),
      });
      const options = getBaseHeaders();
      Axios.get(checkTokenEndpoint, options)
        .then((res) => {
          if (res.status === 200) {
            this.setState({ authenticated: true, loaded: true });
          }
        })
        .catch((error) => {
          Cookies.remove("token");
          Cookies.remove("token-type");
          Cookies.remove("auth-company-subdir");
          this.setState({ loaded: true });
        });
    } else {
      this.setState({ loaded: true });
    }
  }

  render() {
    return (
      <div>
        {this.state.loaded ? (
          <Routes
            setAppState={this.setAppState}
            authenticated={this.state.authenticated}
          />
        ) : (
          "Loading"
        )}
      </div>
    );
  }
}

export default App;
