import React, { Component } from "react";
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";

import { Link, Redirect } from "react-router-dom";

import Endpoints from "../../Endpoints";

import Cookies from "js-cookie";

class DashboardAppBar extends Component {
  company_subdir = this.props.company_subdir;
  state = {
    drawerOpen: false,
    redirectLogOff: false,
  };

  drawerNavListItems = [
    {
      name: "Home",
      link: Endpoints.get("client", "dashboard", {
        company_subdir: this.company_subdir,
      }),
    },
    {
      name: "Users",
      link: Endpoints.get("client", "usersArea", {
        company_subdir: this.company_subdir,
      }),
    },
    {
      name: "Roles",
      link: Endpoints.get("client", "rolesArea", {
        company_subdir: this.company_subdir,
      }),
    },
    {
      name: "Clients",
      link: Endpoints.get("client", "clientsArea", {
        company_subdir: this.company_subdir,
      }),
    },
    {
      name: "Calls",
      link: Endpoints.get("client", "callsArea", {
        company_subdir: this.company_subdir,
      }),
    },
    {
      name: "Reports",
      link: Endpoints.get("client", "reportsArea", {
        company_subdir: this.company_subdir,
      }),
    },
  ];

  toggleDrawer = () => {
    const drawerState = !this.state.drawerOpen;
    this.setState({
      drawerOpen: drawerState,
    });
  };

  drawerNavList = () => {
    return (
      <div
        role="presentation"
        onClick={this.toggleDrawer}
        style={{ width: "250px" }}
        onKeyDown={this.toggleDrawer}
      >
        <List>
          {this.drawerNavListItems.map((item) => (
            <ListItem
              selected={
                this.props.location.pathname === item.link ? true : false
              }
              component={Link}
              to={item.link}
              button
              key={item.name}
            >
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
        </List>
      </div>
    );
  };

  logOff = () => {
    Cookies.remove("token");
    Cookies.remove("token-type");
    Cookies.remove("auth-company-subdir");
    Cookies.remove("auth-company-name");
    Cookies.remove("user-name");
    this.setState({
      redirectLogOff: true,
    });
  };

  render() {
    const { redirectLogOff } = { ...this.state };
    const user_name = Cookies.get("user-name");
    const company_name = Cookies.get("auth-company-name");
    return (
      <AppBar position="sticky" style={{ marginBottom: "40px" }}>
        {redirectLogOff ? (
          <Redirect to={Endpoints.get("client", "home", {})} />
        ) : null}
        <Container>
          <Toolbar disableGutters>
            <IconButton
              onClick={this.toggleDrawer}
              edge="start"
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="span"
              color="inherit"
              style={{ flex: 1 }}
            >
              {company_name}
            </Typography>
            <Typography variant="h6" component="span" color="inherit">
              {user_name}
            </Typography>
            <IconButton
              onClick={this.logOff}
              edge="start"
              color="inherit"
              aria-label="menu"
              style={{ marginLeft: "0px" }}
            >
              <PowerSettingsNewIcon />
            </IconButton>
          </Toolbar>
        </Container>
        <Drawer
          anchor="left"
          open={this.state.drawerOpen}
          onClose={this.toggleDrawer}
          style={{ width: "200px" }}
        >
          {this.drawerNavList()}
        </Drawer>
      </AppBar>
    );
  }
}

export default DashboardAppBar;
