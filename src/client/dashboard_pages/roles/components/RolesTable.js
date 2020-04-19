import React, { Component } from "react";
import { Link } from "react-router-dom";
import Endpoints from "../../../Endpoints";
import axios from "axios";
import Cookies from "js-cookie";

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

class RolesTable extends Component {
  company_subdir = this.props.company_subdir;
  state = {
    roles: {},
  };

  componentDidMount() {
    let options = {
      headers: {
        Authorization: "Bearer " + Cookies.get("token"),
      },
      params: {
        forForm: "true",
      },
    };
    let getRolesEndpoint = Endpoints.get("api", "getAllRoles", {
      company_subdir: this.company_subdir,
    });
    axios
      .get(getRolesEndpoint, options)
      .then((res) => {
        this.setState({
          roles: res.data,
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

  render() {
    const { company_subdir } = { ...this.props };
    const { roles } = { ...this.state };
    return (
      <TableContainer component={Paper}>
        <Table aria-label="table containing the users">
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
    );
  }
}

export default RolesTable;
