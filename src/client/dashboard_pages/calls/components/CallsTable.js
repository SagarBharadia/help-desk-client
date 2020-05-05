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

class CallsTable extends Component {
  company_subdir = this.props.company_subdir;
  state = {
    calls: {},
    prevPageURL: null,
    nextPageURL: null,
  };

  componentDidMount() {
    const getAllCallsEndpoint = Endpoints.get("api", "getAllCalls", {
      company_subdir: this.company_subdir,
    });
    const headers = getBaseHeaders();
    axios
      .get(getAllCallsEndpoint, headers)
      .then((res) => {
        this.setState({
          calls: res.data.data,
          nextPageURL: res.data.next_page_url,
          prevPageURL: res.data.prev_page_url,
        });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            const pageErrors = [
              ...this.props.pageErrors,
              "Unauthorized to read calls. Please contact your admin for this permission.",
            ];
            this.props.setPageErrors(pageErrors);
          }
        }
      });
  }

  loadNewCalls = (direction) => {
    let headers = getBaseHeaders();
    let endpoint = this.state.nextPageURL;
    if (direction === "previous") {
      endpoint = this.state.prevPageURL;
    }
    axios
      .get(endpoint, headers)
      .then((res) => {
        this.setState({
          calls: res.data.data,
          nextPageURL: res.data.next_page_url,
          prevPageURL: res.data.prev_page_url,
        });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            const pageErrors = [
              ...this.props.pageErrors,
              "Unauthorized to view calls. Please contact your admin for this permission.",
            ];
            this.props.setPageErrors(pageErrors);
          }
        }
      });
  };

  render() {
    const { company_subdir } = { ...this.props };
    const { calls, prevPageURL, nextPageURL } = { ...this.state };
    return (
      <div>
        <TableContainer component={Paper} className="standard-margin-bottom">
          <Table aria-label="table containing the calls">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Client</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(calls).map((key) => {
                let call = calls[key];
                return (
                  <TableRow key={call.id}>
                    <TableCell component="th" scope="row">
                      {call.id}
                    </TableCell>
                    <TableCell align="right">{call.name}</TableCell>
                    <TableCell align="right">{call.client.name}</TableCell>
                    <TableCell align="right">
                      {call.resolved === 1 ? (
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
                        to={Endpoints.get("client", "viewCall", {
                          company_subdir: company_subdir,
                          id: call.id,
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
            onClick={this.loadNewCalls.bind(this, "previous")}
            disabled={prevPageURL === null ? true : false}
          >
            Previous Page
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={this.loadNewCalls.bind(this, "next")}
            disabled={nextPageURL === null ? true : false}
          >
            Next Page
          </Button>
        </Box>
      </div>
    );
  }
}

export default CallsTable;
