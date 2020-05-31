import React, { Component } from "react";
import DashboardWrapper from "../layout/DashboardWrapper";
import axios from "axios";
import { getBaseHeaders } from "../../Helpers";

import Endpoints from "../../Endpoints";

import { Link } from "react-router-dom";

import {
  Box,
  Breadcrumbs,
  Link as MuiLink,
  Typography,
  TextField,
  Divider,
  Button,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";

import { Alert } from "@material-ui/lab";

import Messages from "../layout/Messages";

import download from "downloadjs";

class Create extends Component {
  company_subdir = this.props.match.params.company_subdir;
  state = {
    name: "",
    description: "",
    callTurnaroundTimes: false,
    staffTurnaroundTimes: false,
    callsOpenPast24Hours: false,
    startDateCallTurnaroundTimes: "",
    endDateCallTurnaroundTimes: "",
    startDateStaffTurnaroundTimes: "",
    endDateStaffTurnaroundTimes: "",
    startDateCallsOpenPast24Hours: "",
    endDateCallsOpenPast24Hours: "",
    errors: {
      name: [],
      description: [],
      call_turnaround_times: [],
      calls_open_past_24_hours: [],
      staff_turnaround_times: [],
    },
    pageMessages: [],
    pageErrors: [],
  };

  resetErrors = () => {
    this.setState({
      pageErrors: [],
      pageMessages: [],
      errors: {
        name: [],
        description: [],
        call_turnaround_times: [],
        calls_open_past_24_hours: [],
        staff_turnaround_times: [],
      },
    });
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  toggleDetail = (e) => {
    const toggledDetailValue = !this.state[e.target.name];
    this.setState({
      [e.target.name]: toggledDetailValue,
    });
  };

  createReport = (e) => {
    e.preventDefault();
    let headers = getBaseHeaders();
    headers.responseType = "blob";
    const createReportEndpoint = Endpoints.get("api", "createReport", {
      company_subdir: this.company_subdir,
    });
    let options = {};
    if (this.state.staffTurnaroundTimes) {
      options["staff_turnaround_times"] = {
        start_date: this.state.startDateStaffTurnaroundTimes,
        end_date: this.state.endDateStaffTurnaroundTimes,
      };
    }
    if (this.state.callTurnaroundTimes) {
      options["call_turnaround_times"] = {
        start_date: this.state.startDateCallTurnaroundTimes,
        end_date: this.state.endDateCallTurnaroundTimes,
      };
    }
    if (this.state.callsOpenPast24Hours) {
      options["calls_open_past_24_hours"] = {
        start_date: this.state.startDateCallsOpenPast24Hours,
        end_date: this.state.endDateCallsOpenPast24Hours,
      };
    }
    let data = {
      name: this.state.name,
      description: this.state.description,
      options: options,
    };
    this.resetErrors();
    axios
      .post(createReportEndpoint, data, headers)
      .then((res) => {
        const todaysDate = new Date().toJSON().slice(0, 10).replace(/-/g, "-");
        download(
          res.data,
          this.state.name + " " + todaysDate + ".pdf",
          "application/pdf"
        );
        this.setState({
          name: "",
          description: "",
          callTurnaroundTimes: false,
          staffTurnaroundTimes: false,
          callsOpenPast24Hours: false,
          startDateCallTurnaroundTimes: "",
          endDateCallTurnaroundTimes: "",
          startDateStaffTurnaroundTimes: "",
          endDateStaffTurnaroundTimes: "",
          startDateCallsOpenPast24Hours: "",
          endDateCallsOpenPast24Hours: "",
          pageMessages: [
            {
              text: "Report created successfully.",
              severity: "success",
            },
          ],
        });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 422) {
            const blobErrorData = error.response.data;
            blobErrorData
              .text()
              .then((errors) => JSON.parse(errors))
              .then((errorData) => {
                var newErrorsState = { ...this.state.errors };
                if (errorData.name) newErrorsState.name = errorData.name;
                if (errorData.description)
                  newErrorsState.description = errorData.description;
                if (errorData.call_turnaround_times)
                  newErrorsState.call_turnaround_times =
                    errorData.call_turnaround_times;
                if (errorData.calls_open_past_24_hours)
                  newErrorsState.calls_open_past_24_hours =
                    errorData.calls_open_past_24_hours;
                if (errorData.staff_turnaround_times)
                  newErrorsState.staff_turnaround_times =
                    errorData.staff_turnaround_times;
                this.setState({
                  errors: newErrorsState,
                });
              });
          } else if (error.response.status === 401) {
            const pageErrors = [
              ...this.state.pageErrors,
              "Unauthorized to create reports. Please contact your admin for this permission.",
            ];
            this.setState({ pageErrors: pageErrors });
          }
        }
      });
  };

  render() {
    const company_subdir = this.company_subdir;
    const {
      pageMessages,
      pageErrors,
      errors,
      name,
      description,
      callTurnaroundTimes,
      staffTurnaroundTimes,
      callsOpenPast24Hours,
      startDateCallTurnaroundTimes,
      endDateCallTurnaroundTimes,
      startDateStaffTurnaroundTimes,
      endDateStaffTurnaroundTimes,
      startDateCallsOpenPast24Hours,
      endDateCallsOpenPast24Hours,
    } = {
      ...this.state,
    };
    return (
      <DashboardWrapper {...this.props}>
        <main>
          <Breadcrumbs
            aria-label="breadcrumb"
            className="standard-margin-bottom"
          >
            <MuiLink
              component={Link}
              to={Endpoints.get("client", "dashboard", {
                company_subdir: company_subdir,
              })}
              color="inherit"
            >
              Home
            </MuiLink>
            <MuiLink
              component={Link}
              to={Endpoints.get("client", "reportsArea", {
                company_subdir: company_subdir,
              })}
              color="inherit"
            >
              Reports
            </MuiLink>
            <Typography color="textPrimary">Create Report</Typography>
          </Breadcrumbs>
          <Typography
            component="h1"
            variant="h4"
            className="standard-margin-bottom"
          >
            Create Report
          </Typography>
          <Divider className="standard-margin-bottom" />
          <Messages pageErrors={pageErrors} pageMessages={pageMessages} />
          <form className="xs-full-width" onSubmit={this.createReport}>
            <Box
              display="flex"
              flexDirection="row"
              flexWrap="wrap"
              justifyContent="space-between"
            >
              <Box
                display="flex"
                flexDirection="column"
                className="xs-full-width md-half-width standard-margin-bottom"
              >
                <Typography
                  className="standard-margin-bottom"
                  component="h3"
                  variant="h5"
                >
                  Report Details
                </Typography>
                {errors.name.map((error, index) => (
                  <Alert
                    variant="filled"
                    severity="error"
                    className="standard-margin-bottom"
                    key={"name-" + index}
                  >
                    {error}
                  </Alert>
                ))}
                <TextField
                  name="name"
                  type="string"
                  label="Name"
                  onChange={this.onChange}
                  value={name}
                  className="xs-full-width standard-margin-bottom"
                  error={errors.name.length > 0 ? true : false}
                  required
                />
                {errors.description.map((error, index) => (
                  <Alert
                    variant="filled"
                    severity="error"
                    className="standard-margin-bottom"
                    key={"description-" + index}
                  >
                    {error}
                  </Alert>
                ))}
                <TextField
                  name="description"
                  type="string"
                  label="Description"
                  onChange={this.onChange}
                  value={description}
                  className="xs-full-width standard-margin-bottom"
                  error={errors.description.length > 0 ? true : false}
                  required
                />
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                className="xs-full-width md-half-width standard-margin-bottom"
              >
                <Typography
                  component="h3"
                  variant="h5"
                  className="standard-margin-bottom"
                >
                  Report Details
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="callTurnaroundTimes"
                      onChange={this.toggleDetail}
                      checked={callTurnaroundTimes ? true : false}
                    />
                  }
                  label="Call Turnaround Times"
                />
                {callTurnaroundTimes ? (
                  <Box
                    display="flex"
                    flexDirection="column"
                    className="xs-full-width standard-margin-bottom"
                  >
                    {errors.call_turnaround_times.map((error, index) => (
                      <Alert
                        variant="filled"
                        severity="error"
                        key={"callTurnaroundTimes-" + index}
                      >
                        {error}
                      </Alert>
                    ))}
                    <Box
                      display="flex"
                      flexDirection="row"
                      className="xs-full-width"
                    >
                      <Box className="xs-full-width md-half-width">
                        <Typography variant="h6">Start Date</Typography>
                        <TextField
                          id="start-date-callTurnaroundTimes"
                          type="date"
                          name="startDateCallTurnaroundTimes"
                          value={startDateCallTurnaroundTimes}
                          onChange={this.onChange}
                          required
                        />
                      </Box>
                      <Box className="xs-full-width md-half-width">
                        <Typography variant="h6">End Date</Typography>
                        <TextField
                          id="end-date-callTurnaroundTimes"
                          type="date"
                          name="endDateCallTurnaroundTimes"
                          value={endDateCallTurnaroundTimes}
                          onChange={this.onChange}
                          required
                        />
                      </Box>
                    </Box>
                  </Box>
                ) : null}
                <FormControlLabel
                  control={
                    <Checkbox
                      name="staffTurnaroundTimes"
                      onChange={this.toggleDetail}
                      checked={staffTurnaroundTimes ? true : false}
                    />
                  }
                  label="Staff Turnaround Times"
                />
                {staffTurnaroundTimes ? (
                  <Box
                    display="flex"
                    flexDirection="column"
                    className="xs-full-width standard-margin-bottom"
                  >
                    {errors.staff_turnaround_times.map((error, index) => (
                      <Alert
                        variant="filled"
                        severity="error"
                        className="standard-margin-bottom"
                        key={"staffTurnaroundtimes-" + index}
                      >
                        {error}
                      </Alert>
                    ))}
                    <Box
                      display="flex"
                      flexDirection="row"
                      className="xs-full-width"
                    >
                      <Box className="xs-full-width md-half-width">
                        <Typography variant="h6">Start Date</Typography>
                        <TextField
                          id="start-date-staffTurnaroundTimes"
                          type="date"
                          name="startDateStaffTurnaroundTimes"
                          value={startDateStaffTurnaroundTimes}
                          onChange={this.onChange}
                          required
                        />
                      </Box>
                      <Box className="xs-full-width md-half-width">
                        <Typography variant="h6">End Date</Typography>
                        <TextField
                          id="end-date-staffTurnaroundTimes"
                          type="date"
                          name="endDateStaffTurnaroundTimes"
                          value={endDateStaffTurnaroundTimes}
                          onChange={this.onChange}
                          required
                        />
                      </Box>
                    </Box>
                  </Box>
                ) : null}
                <FormControlLabel
                  control={
                    <Checkbox
                      name="callsOpenPast24Hours"
                      onChange={this.toggleDetail}
                      checked={callsOpenPast24Hours ? true : false}
                    />
                  }
                  label="Calls Open Over 24 Hours"
                />
                {callsOpenPast24Hours ? (
                  <Box
                    display="flex"
                    flexDirection="column"
                    className="xs-full-width standard-margin-bottom"
                  >
                    {errors.calls_open_past_24_hours.map((error, index) => (
                      <Alert
                        variant="filled"
                        severity="error"
                        className="standard-margin-bottom"
                        key={"callsOpenPast24Hours-" + index}
                      >
                        {error}
                      </Alert>
                    ))}
                    <Box
                      display="flex"
                      flexDirection="row"
                      className="xs-full-width"
                    >
                      <Box className="xs-full-width md-half-width">
                        <Typography variant="h6">Start Date</Typography>
                        <TextField
                          id="start-date-callsOpenPast24Hours"
                          type="date"
                          name="startDateCallsOpenPast24Hours"
                          value={startDateCallsOpenPast24Hours}
                          onChange={this.onChange}
                          required
                        />
                      </Box>
                      <Box className="xs-full-width md-half-width">
                        <Typography variant="h6">End Date</Typography>
                        <TextField
                          id="end-date-callsOpenPast24Hours"
                          type="date"
                          name="endDateCallsOpenPast24Hours"
                          value={endDateCallsOpenPast24Hours}
                          onChange={this.onChange}
                          required
                        />
                      </Box>
                    </Box>
                  </Box>
                ) : null}
              </Box>
            </Box>
            <Button
              className="xs-full-width"
              type="submit"
              variant="contained"
              color="primary"
            >
              Create Report
            </Button>
          </form>
        </main>
      </DashboardWrapper>
    );
  }
}

export default Create;
