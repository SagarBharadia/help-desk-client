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

import { Link } from "react-router-dom";

import Endpoints from "../../Endpoints";

class DashboardAppBar extends Component {
  company_subdir = this.props.company_subdir;
  state = {
    drawerOpen: false,
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
    { name: "Clients", link: "/clients" },
    { name: "Calls", link: "/calls" },
    { name: "Reports", link: "/reports" },
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

  render() {
    return (
      <AppBar position="sticky" style={{ marginBottom: "40px" }}>
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
              {this.props.company_subdir}
            </Typography>
            <Typography variant="h6" component="span" color="inherit">
              John Doe
            </Typography>
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
