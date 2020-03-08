import React, { Component } from "react";

class Guarded extends Component {
  render() {
    return <this.props.page {...this.props} />;
  }
}

export default Guarded;
