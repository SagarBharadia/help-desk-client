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
  Select,
  MenuItem,
  Divider,
} from "@material-ui/core";

class CallsTable extends Component {
  company_subdir = this.props.company_subdir;
  state = {
    calls: {},
    prevPageURL: null,
    nextPageURL: null,
    handledBy: "self",
    createdAt: "asc",
    resolved: "no",
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  getCalls = (e) => {
    const getAllCallsEndpoint = Endpoints.get("api", "getAllCalls", {
      company_subdir: this.company_subdir,
    });
    let headers = getBaseHeaders();
    headers.params = {
      handled_by: this.state.handledBy,
      created_at: this.state.createdAt,
      resolved: this.state.resolved,
    };
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
  };

  componentDidMount() {
    this.getCalls();
  }

  loadNewCalls = (direction) => {
    let headers = getBaseHeaders();
    headers.params = {
      handled_by: this.state.handledBy,
      created_at: this.state.createdAt,
      resolved: this.state.resolved,
    };
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

  submitFilters = (e) => {
    e.preventDefault();
    this.getCalls();
  };

  resetFilters = () => {
    this.setState({
      resolved: "",
      createdAt: "",
      handledBy: "",
    });
  };

  render() {
    const { company_subdir } = { ...this.props };
    const {
      calls,
      handledBy,
      createdAt,
      resolved,
      prevPageURL,
      nextPageURL,
    } = {
      ...this.state,
    };
    return (
      <div>
        <Box
          component="form"
          onSubmit={this.submitFilters}
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="space-between"
          className="xs-full-width"
        >
          <Select
            name="handledBy"
            value={handledBy}
            className="xs-full-width md-fifth-width standard-margin-bottom"
            onChange={this.onChange}
            displayEmpty
          >
            <MenuItem key={0} value="">
              Handled By
            </MenuItem>
            <Divider />
            <MenuItem key={1} value="self">
              Your Calls
            </MenuItem>
            <MenuItem key={2} value="all">
              All Calls
            </MenuItem>
          </Select>
          <Select
            name="resolved"
            value={resolved}
            className="xs-full-width md-fifth-width standard-margin-bottom"
            onChange={this.onChange}
            displayEmpty
          >
            <MenuItem key={0} value="">
              Resolved
            </MenuItem>
            <Divider />
            <MenuItem key={1} value="yes">
              Resolved
            </MenuItem>
            <MenuItem key={2} value="no">
              Not Resolved
            </MenuItem>
          </Select>
          <Select
            name="createdAt"
            value={createdAt}
            className="xs-full-width md-fifth-width standard-margin-bottom"
            onChange={this.onChange}
            displayEmpty
          >
            <MenuItem key={0} value="">
              Created At
            </MenuItem>
            <Divider />
            <MenuItem key={1} value="asc">
              Oldest
            </MenuItem>
            <MenuItem key={2} value="desc">
              Latest
            </MenuItem>
          </Select>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            className="xs-full-width md-fifth-width standard-margin-bottom"
          >
            Filter
          </Button>
          <Button
            type="button"
            variant="contained"
            color="primary"
            className="xs-full-width md-fifth-width standard-margin-bottom"
            onClick={this.resetFilters}
          >
            Reset
          </Button>
        </Box>
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
