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

import download from "downloadjs";

class ReportsTable extends Component {
  company_subdir = this.props.company_subdir;
  state = {
    reports: {},
    prevPageURL: null,
    nextPageURL: null,
  };

  componentDidMount() {
    const getAllReportsEndpoint = Endpoints.get("api", "getAllReports", {
      company_subdir: this.company_subdir,
    });
    const headers = getBaseHeaders();
    axios
      .get(getAllReportsEndpoint, headers)
      .then((res) => {
        this.setState({
          reports: res.data.data,
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

  loadNewReports = (direction) => {
    let headers = getBaseHeaders();
    let endpoint = this.state.nextPageURL;
    if (direction === "previous") {
      endpoint = this.state.prevPageURL;
    }
    axios
      .get(endpoint, headers)
      .then((res) => {
        this.setState({
          reports: res.data.data,
          nextPageURL: res.data.next_page_url,
          prevPageURL: res.data.prev_page_url,
        });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            const pageErrors = [
              ...this.props.pageErrors,
              "Unauthorized to view reports. Please contact your admin for this permission.",
            ];
            this.props.setPageErrors(pageErrors);
          }
        }
      });
  };

  downloadReport = (reportId, reportName) => {
    let headers = getBaseHeaders();
    headers.responseType = "blob";
    let downloadReportEndpoint = Endpoints.get("api", "downloadReport", {
      company_subdir: this.company_subdir,
      id: reportId,
    });
    axios.get(downloadReportEndpoint, headers).then((blob) => {
      const url = window.URL.createObjectURL(blob.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", reportName + ".pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    });
  };

  render() {
    const { reports, prevPageURL, nextPageURL } = { ...this.state };
    return (
      <div>
        <TableContainer component={Paper} className="standard-margin-bottom">
          <Table aria-label="table containing the users">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Description</TableCell>
                <TableCell align="right">Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(reports).map((key) => {
                let report = reports[key];
                return (
                  <TableRow key={report.id}>
                    <TableCell component="th" scope="row">
                      {report.id}
                    </TableCell>
                    <TableCell align="right">{report.name}</TableCell>
                    <TableCell align="right">{report.description}</TableCell>
                    <TableCell align="right">{report.created_at}</TableCell>
                    <TableCell align="right">
                      <Button
                        onClick={this.downloadReport.bind(
                          null,
                          report.id,
                          report.name
                        )}
                        variant="contained"
                        color="secondary"
                      >
                        Download
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
            onClick={this.loadNewReports("previous")}
            disabled={prevPageURL === null ? true : false}
          >
            Previous Page
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={this.loadNewReports("next")}
            disabled={nextPageURL === null ? true : false}
          >
            Next Page
          </Button>
        </Box>
      </div>
    );
  }
}

export default ReportsTable;
