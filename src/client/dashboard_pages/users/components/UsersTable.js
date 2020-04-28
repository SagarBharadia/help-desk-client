import React, { Component } from "react";
import { Link } from "react-router-dom";
import Endpoints from "../../../Endpoints";
import axios from "axios";
import { getBaseHeaders } from "../../../Helpers";
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
  Box,
} from "@material-ui/core";

class UsersTable extends Component {
  company_subdir = this.props.company_subdir;
  state = {
    users: {},
    prevPageURL: null,
    nextPageURL: null,
  };

  componentDidMount() {
    const getAllUsersEndpoint = Endpoints.get("api", "getAllUsers", {
      company_subdir: this.company_subdir,
    });
    const headers = getBaseHeaders();
    axios
      .get(getAllUsersEndpoint, headers)
      .then((res) => {
        this.setState({
          users: res.data.data,
          nextPageURL: res.data.next_page_url,
          prevPageURL: res.data.prev_page_url,
        });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            const pageErrors = [
              ...this.props.pageErrors,
              "Unauthorized to read users. Please contact your admin for this permission.",
            ];
            this.props.setPageErrors(pageErrors);
          }
        }
      });
  }

  loadNewUsers = (direction) => {
    let headers = getBaseHeaders();
    let endpoint = this.state.nextPageURL;
    if (direction === "previous") {
      endpoint = this.state.prevPageURL;
    }
    axios
      .get(endpoint, headers)
      .then((res) => {
        this.setState({
          clients: res.data.data,
          nextPageURL: res.data.next_page_url,
          prevPageURL: res.data.prev_page_url,
        });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            const pageErrors = [
              ...this.props.pageErrors,
              "Unauthorized to view users. Please contact your admin for this permission.",
            ];
            this.props.setPageErrors(pageErrors);
          }
        }
      });
  };

  render() {
    const { company_subdir } = { ...this.props };
    const { users, prevPageURL, nextPageURL } = { ...this.state };
    return (
      <div>
        <TableContainer component={Paper} className="standard-margin-bottom">
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
              {Object.keys(users).map((key) => {
                let user = users[key];
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
        <Box
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={this.loadNewUsers("previous")}
            disabled={prevPageURL === null ? true : false}
          >
            Previous Page
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={this.loadNewUsers("next")}
            disabled={nextPageURL === null ? true : false}
          >
            Next Page
          </Button>
        </Box>
      </div>
    );
  }
}

export default UsersTable;
