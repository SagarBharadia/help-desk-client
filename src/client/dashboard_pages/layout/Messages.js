import React, { Component } from "react";

import { Alert } from "@material-ui/lab";

class Messages extends Component {
  render() {
    return (
      <div>
        {this.props.pageMessages.map((message, index) => (
          <Alert
            key={"message-" + index}
            variant="filled"
            severity={message.severity}
            className="standard-margin-bottom"
          >
            {message.text}
          </Alert>
        ))}
        {this.props.pageErrors.map((message, index) => (
          <Alert
            key={"pageError" + index}
            variant="filled"
            severity="error"
            className="standard-margin-bottom"
          >
            {message}
          </Alert>
        ))}
      </div>
    );
  }
}

export default Messages;
