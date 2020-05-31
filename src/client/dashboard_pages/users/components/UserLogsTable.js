import React, { Component } from "react";
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

class UserLogsTable extends Component {
  company_subdir = this.props.company_subdir;
  state = {
    logs: {},
    prevPageURL: null,
    nextPageURL: null,
  };

  componentDidMount() {
    const getUserLogs = Endpoints.get("api", "getUserLogs", {
      company_subdir: this.company_subdir,
      id: this.props.user_id,
    });
    const headers = getBaseHeaders();
    axios
      .get(getUserLogs, headers)
      .then((res) => {
        this.setState({
          logs: res.data.data,
          nextPageURL: res.data.next_page_url,
          prevPageURL: res.data.prev_page_url,
        });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            const pageErrors = [
              ...this.props.pageErrors,
              "Unauthorized to read user logs. Please contact your admin for this permission.",
            ];
            this.props.setPageErrors(pageErrors);
          }
        }
      });
  }

  loadNewLogs = (direction) => {
    let headers = getBaseHeaders();
    let endpoint = this.state.nextPageURL;
    if (direction === "previous") {
      endpoint = this.state.prevPageURL;
    }
    axios
      .get(endpoint, headers)
      .then((res) => {
        this.setState({
          logs: res.data.data,
          nextPageURL: res.data.next_page_url,
          prevPageURL: res.data.prev_page_url,
        });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            const pageErrors = [
              ...this.props.pageErrors,
              "Unauthorized to view user logs. Please contact your admin for this permission.",
            ];
            this.props.setPageErrors(pageErrors);
          }
        }
      });
  };

  render() {
    const { logs, prevPageURL, nextPageURL } = { ...this.state };
    return (
      <div>
        <TableContainer component={Paper} className="standard-margin-bottom">
          <Table aria-label="table containing the users">
            <TableHead>
              <TableRow>
                <TableCell align="right">Time</TableCell>
                <TableCell align="right">Action</TableCell>
                <TableCell align="right">Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(logs).map((key) => {
                let log = logs[key];
                return (
                  <TableRow key={log.id}>
                    <TableCell component="th" scope="row">
                      {log.created_at}
                    </TableCell>
                    <TableCell align="right">{log.log_action.name}</TableCell>
                    <TableCell align="right">{log.details}</TableCell>
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
            onClick={this.loadNewLogs.bind(this, "previous")}
            disabled={prevPageURL === null ? true : false}
          >
            Previous Page
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={this.loadNewLogs.bind(this, "next")}
            disabled={nextPageURL === null ? true : false}
          >
            Next Page
          </Button>
        </Box>
      </div>
    );
  }
}

export default UserLogsTable;
