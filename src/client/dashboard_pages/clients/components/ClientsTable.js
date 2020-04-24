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
} from "@material-ui/core";

class ClientsTable extends Component {
  company_subdir = this.props.company_subdir;
  state = {
    clients: {},
  };

  componentDidMount() {
    let headers = getBaseHeaders();
    headers.params = {
      forForm: "true",
    };
    const getClientsEndpoint = Endpoints.get("api", "getAllClients", {
      company_subdir: this.company_subdir,
    });
    axios
      .get(getClientsEndpoint, headers)
      .then((res) => {
        this.setState({
          clients: res.data.data,
        });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            const pageErrors = [
              ...this.props.pageErrors,
              "Unauthorized to view clients. Please contact your admin for this permission.",
            ];
            this.props.setPageErrors(pageErrors);
          }
        }
      });
  }

  render() {
    const { company_subdir } = { ...this.props };
    const { clients } = { ...this.state };
    return (
      <TableContainer component={Paper}>
        <Table aria-label="table containing the users">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Phone Number</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(clients).map((key) => {
              let client = clients[key];
              return (
                <TableRow key={client.id}>
                  <TableCell component="th" scope="row">
                    {client.id}
                  </TableCell>
                  <TableCell align="right">{client.name}</TableCell>
                  <TableCell align="right">{client.phone_number}</TableCell>
                  <TableCell align="right">
                    <Button
                      component={Link}
                      variant="contained"
                      color="primary"
                      to={Endpoints.get("client", "viewClient", {
                        company_subdir: company_subdir,
                        id: client.id,
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

export default ClientsTable;
