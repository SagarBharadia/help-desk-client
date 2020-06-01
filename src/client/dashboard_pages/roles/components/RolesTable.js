import React, { Component } from "react";
import { Link } from "react-router-dom";
import Endpoints from "../../../Endpoints";
import axios from "axios";
import { getBaseHeaders } from "../../../Helpers";

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

class RolesTable extends Component {
  company_subdir = this.props.company_subdir;
  state = {
    roles: {},
    prevPageURL: null,
    nextPageURL: null,
  };

  componentDidMount() {
    let headers = getBaseHeaders();
    const getRolesEndpoint = Endpoints.get("api", "getAllRoles", {
      company_subdir: this.company_subdir,
    });
    axios
      .get(getRolesEndpoint, headers)
      .then((res) => {
        this.setState({
          roles: res.data.data,
          nextPageURL: res.data.next_page_url,
          prevPageURL: res.data.prev_page_url,
        });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            const pageErrors = [
              ...this.props.pageErrors,
              "Unauthorized to view roles. Please contact your admin for this permission.",
            ];
            this.props.setPageErrors(pageErrors);
          }
        }
      });
  }

  loadNewRoles = (direction) => {
    let headers = getBaseHeaders();
    let endpoint = this.state.nextPageURL;
    if (direction === "previous") {
      endpoint = this.state.prevPageURL;
    }
    axios
      .get(endpoint, headers)
      .then((res) => {
        this.setState({
          roles: res.data.data,
          nextPageURL: res.data.next_page_url,
          prevPageURL: res.data.prev_page_url,
        });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            const pageErrors = [
              ...this.props.pageErrors,
              "Unauthorized to view roles. Please contact your admin for this permission.",
            ];
            this.props.setPageErrors(pageErrors);
          }
        }
      });
  };

  render() {
    const { company_subdir } = { ...this.props };
    const { roles, prevPageURL, nextPageURL } = { ...this.state };
    return (
      <div>
        <TableContainer component={Paper} className="standard-margin-bottom">
          <Table aria-label="table containing the roles">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Display Name</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(roles).map((key) => {
                let role = roles[key];
                return (
                  <TableRow key={role.id}>
                    <TableCell component="th" scope="row">
                      {role.id}
                    </TableCell>
                    <TableCell align="right">{role.name}</TableCell>
                    <TableCell align="right">{role.display_name}</TableCell>
                    <TableCell align="right">
                      <Button
                        component={Link}
                        variant="contained"
                        color="primary"
                        to={Endpoints.get("client", "viewRole", {
                          company_subdir: company_subdir,
                          id: role.id,
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
            onClick={this.loadNewRoles.bind(this, "previous")}
            disabled={prevPageURL === null ? true : false}
          >
            Previous Page
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={this.loadNewRoles.bind(this, "next")}
            disabled={nextPageURL === null ? true : false}
          >
            Next Page
          </Button>
        </Box>
      </div>
    );
  }
}

export default RolesTable;
