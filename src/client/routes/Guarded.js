import React, { Component } from "react";
import Cookies from "js-cookie";

import { Redirect } from "react-router-dom";

import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
} from "@material-ui/core";

class Guarded extends Component {
  state = {
    allowed: false,
    redirectToThisHelpDesk: false,
  };

  yourHelpDeskHref = "/" + Cookies.get("auth-company-subdir") + "/dashboard";
  loginToThisHelpDeskHref = "/" + this.props.match.params.company_subdir + "/";

  loginToThisHelpDesk = () => {
    Cookies.remove("token");
    Cookies.remove("token-type");
    Cookies.remove("auth-company-subdir");
    Cookies.remove("auth-company-name");
    Cookies.remove("user-name");
    this.setState({
      redirectToThisHelpDesk: true,
    });
    this.props.setAppState("authenticated", false);
  };

  componentDidMount() {
    const storedSubdir = Cookies.get("auth-company-subdir");
    if (this.props.match.params.company_subdir === storedSubdir) {
      this.setState({
        allowed: true,
      });
    }
  }
  render() {
    return (
      <div>
        {this.state.allowed && this.props.authenticated ? (
          <this.props.page {...this.props} />
        ) : this.props.authenticated ? (
          <Card
            style={{
              position: "absolute",
              top: "35%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              outline: 0,
              padding: "20px",
              width: "75vw",
              minWidth: "320px",
              maxWidth: "800px",
            }}
            variant="outlined"
          >
            <CardContent>
              <Typography variant="h4" component="h1" gutterBottom>
                Uh oh.
              </Typography>
              <Typography component="p">
                Looks like you got lost while trying to find your help desk.
                Buuut just in case this was intentional, feel free to choose
                from the options below.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                href={this.yourHelpDeskHref}
                variant="contained"
                color="primary"
                size="small"
                style={{ textAlign: "center" }}
              >
                Go To Your Help Desk
              </Button>
              <Button
                onClick={this.loginToThisHelpDesk}
                variant="contained"
                size="small"
              >
                Log In To This Help Desk
              </Button>
            </CardActions>
          </Card>
        ) : this.state.redirectToThisHelpDesk ? (
          <Redirect to={this.loginToThisHelpDeskHref} />
        ) : (
          <Redirect to={this.loginToThisHelpDeskHref} />
        )}
      </div>
    );
  }
}

export default Guarded;
