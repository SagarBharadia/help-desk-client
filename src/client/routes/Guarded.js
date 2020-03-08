import React, { Component } from "react";
import Cookies from "js-cookie";

import Error401 from "../website_pages/error_pages/Error401";

class Guarded extends Component {
  state = {
    allowed: false
  };

  componentDidMount() {
    const storedSubdir = Cookies.get("auth-company-subdir");
    if (this.props.match.params.company_subdir === storedSubdir) {
      this.setState({
        allowed: true
      });
    }
  }
  render() {
    return (
      <div>
        {this.state.allowed && this.props.authenticated ? (
          <this.props.page {...this.props} />
        ) : (
          <Error401 />
        )}
      </div>
    );
  }
}

export default Guarded;
