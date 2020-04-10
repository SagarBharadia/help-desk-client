import React, { Component } from "react";
import { Link } from "react-router-dom";
import Endpoints from "../../../Endpoints";
import axios from "axios";
import Cookies from "js-cookie";
import ErrorIcon from "@material-ui/icons/Error";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

import {
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@material-ui/core";

class UsersTable extends Component {
  company_subdir = this.props.company_subdir;
  state = {
    users: {},
  };

  componentDidMount() {
    const getAllUsersEndpoint = Endpoints.get("api", "getAllUsers", {
      company_subdir: this.company_subdir,
    });
    const options = {
      headers: {
        Authorization: "Bearer " + Cookies.get("token"),
      },
    };
    axios
      .get(getAllUsersEndpoint, options)
      .then((res) => res.data)
      .then((data) => {
        this.setState({
          users: data.data,
        });
      });
  }

  render() {
    const { company_subdir } = { ...this.props };
    return (
      <TableContainer component={Paper}>
        <Table aria-label="table containing the users">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Email Address</TableCell>
              <TableCell align="right">Active</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(this.state.users).map((key) => {
              let user = this.state.users[key];
              return (
                <TableRow key={user.id}>
                  <TableCell component="th" scope="row">
                    {user.id}
                  </TableCell>
                  <TableCell align="right">
                    {user.first_name + " " + user.second_name}
                  </TableCell>
                  <TableCell align="right">{user.email_address}</TableCell>
                  <TableCell align="right">
                    {user.active === 1 ? (
                      <CheckCircleIcon style={{ color: "#2ecc71" }} />
                    ) : (
                      <ErrorIcon style={{ color: "#e74c3c" }} />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      component={Link}
                      variant="contained"
                      color="primary"
                      to={Endpoints.get("client", "viewUser", {
                        company_subdir: company_subdir,
                        id: user.id,
                      })}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default UsersTable;
