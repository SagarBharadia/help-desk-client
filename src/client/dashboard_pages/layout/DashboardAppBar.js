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
  ListItemText
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

import { Link } from "react-router-dom";

class DashboardAppBar extends Component {
  baselink = "/" + this.props.match.params.company_subdir;
  state = {
    drawerOpen: false
  };

  drawerNavListItems = [
    { name: "Home", link: this.baselink + "/dashboard" },
    { name: "Users", link: this.baselink + "/users" },
    { name: "Clients", link: this.baselink + "/clients" },
    { name: "Calls", link: this.baselink + "/calls" },
    { name: "Reports", link: this.baselink + "/reports" }
  ];

  toggleDrawer = () => {
    let drawerState = !this.state.drawerOpen;
    this.setState({
      drawerOpen: drawerState
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
          {this.drawerNavListItems.map(item => (
            <ListItem component={Link} to={item.link} button key={item.name}>
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
        </List>
      </div>
    );
  };

  render() {
    return (
      <AppBar position="fixed">
        <Container>
          <Toolbar>
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
              {this.props.match.params.company_subdir}
            </Typography>
            <Typography variant="h6" component="span" color="inherit">
              John Doe
            </Typography>
          </Toolbar>
          <Drawer
            anchor="left"
            open={this.state.drawerOpen}
            onClose={this.toggleDrawer}
            style={{ width: "auto" }}
          >
            {this.drawerNavList()}
          </Drawer>
        </Container>
      </AppBar>
    );
  }
}

export default DashboardAppBar;
