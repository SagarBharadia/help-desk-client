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
  Select,
  MenuItem,
  Chip,
} from "@material-ui/core";

import { Alert } from "@material-ui/lab";

import Messages from "../layout/Messages";

class Create extends Component {
  company_subdir = this.props.match.params.company_subdir;
  state = {
    name: "",
    caller_name: "",
    details: "",
    tags: [],
    tagInput: "",
    client: "",
    errors: {
      details: [],
      tags: [],
    },
    pageMessages: [],
    pageErrors: [],
    downloadedClients: [],
  };

  resetErrors = () => {
    this.setState({
      pageErrors: [],
      pageMessages: [],
      errors: {
        name: [],
        caller_name: [],
        details: [],
        tags: [],
        client: [],
      },
    });
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  removeTag = (tagToDelete) => {
    const newTags = this.state.tags.filter((tag) => tagToDelete !== tag);
    this.setState({
      tags: newTags,
    });
  };

  createCall = (e) => {
    e.preventDefault();
    const headers = getBaseHeaders();
    const createCallEndpoint = Endpoints.get("api", "createCall", {
      company_subdir: this.company_subdir,
    });
    let data = {
      client_id: this.state.client,
      caller_name: this.state.caller_name,
      details: this.state.details,
      tags: this.state.tags,
      name: this.state.name,
    };
    this.resetErrors();
    axios
      .post(createCallEndpoint, data, headers)
      .then((res) => {
        this.setState({
          client: "",
          caller_name: "",
          details: "",
          tags: [],
          name: "",
          pageMessages: [
            {
              text: res.data.message,
              severity: "success",
            },
          ],
        });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 422) {
            var newErrorsState = { ...this.state.errors };
            const errorData = error.response.data;
            if (errorData.name) newErrorsState.name = errorData.name;
            if (errorData.caller_name)
              newErrorsState.caller_name = errorData.caller_name;
            if (errorData.details) newErrorsState.details = errorData.details;
            if (errorData.client_id)
              newErrorsState.client = errorData.client_id;
            if (errorData.tags) newErrorsState.tags = errorData.tags;
            this.setState({
              errors: newErrorsState,
            });
          } else if (error.response.status === 401) {
            const pageErrors = [
              ...this.state.pageErrors,
              "Unauthorized to create calls. Please contact your admin for this permission.",
            ];
            this.setState({ pageErrors: pageErrors });
          }
        }
      });
  };

  downloadClients = () => {
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
          downloadedClients: res.data,
        });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            const pageErrors = [
              ...this.state.pageErrors,
              "Unauthorized to read clients. Please contact your admin for this permission",
            ];
            this.setState({
              pageErrors: pageErrors,
            });
          }
        }
      });
  };

  addTag = () => {
    if (this.state.tagInput) {
      const trimmedInput = this.state.tagInput.trim().toLowerCase();
      if (!this.state.tags.includes(trimmedInput)) {
        const tags = [...this.state.tags, trimmedInput];
        let newErrorsState = this.state.errors;
        newErrorsState.tags = [];
        this.setState({
          tags: tags,
          tagInput: "",
          errors: newErrorsState,
        });
      } else {
        let errorsState = this.state.errors;
        errorsState.tags = ["Tag already exists!"];
        this.setState({
          errors: errorsState,
        });
      }
    }
  };

  addTagEnter = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.addTag();
    }
  };

  componentDidMount() {
    this.downloadClients();
  }

  render() {
    const company_subdir = this.company_subdir;
    const {
      pageMessages,
      pageErrors,
      errors,
      client,
      name,
      caller_name,
      details,
      tags,
      downloadedClients,
      tagInput,
    } = { ...this.state };
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
              to={Endpoints.get("client", "callsArea", {
                company_subdir: company_subdir,
              })}
              color="inherit"
            >
              Call
            </MuiLink>
            <Typography color="textPrimary">Create Call</Typography>
          </Breadcrumbs>
          <Typography
            component="h1"
            variant="h4"
            className="standard-margin-bottom"
          >
            Create Call
          </Typography>
          <Divider className="standard-margin-bottom" />
          <Messages pageErrors={pageErrors} pageMessages={pageMessages} />
          <form className="xs-full-width" onSubmit={this.createCall}>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              flexWrap="wrap"
              className="standard-margin-bottom"
            >
              <Box
                display="flex"
                flexDirection="column"
                className="xs-full-width md-half-width"
              >
                <Typography
                  className="standard-margin-bottom"
                  component="h3"
                  variant="h5"
                >
                  Call Details
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
                {errors.caller_name.map((error, index) => (
                  <Alert
                    variant="filled"
                    severity="error"
                    className="standard-margin-bottom"
                    key={"callerName-" + index}
                  >
                    {error}
                  </Alert>
                ))}
                <TextField
                  name="caller_name"
                  type="string"
                  label="Caller Name"
                  onChange={this.onChange}
                  value={caller_name}
                  className="xs-full-width standard-margin-bottom"
                  error={errors.caller_name.length > 0 ? true : false}
                  required
                />
                <Select
                  name="client"
                  onChange={this.onChange}
                  value={client}
                  className="xs-full-width standard-margin-bottom"
                  displayEmpty
                  required
                >
                  <MenuItem value="">Select Client</MenuItem>
                  <Divider />
                  {downloadedClients.map((client) => {
                    return (
                      <MenuItem key={"client-" + client.id} value={client.id}>
                        {client.name}
                      </MenuItem>
                    );
                  })}
                </Select>
                {errors.details.map((error, index) => (
                  <Alert
                    variant="filled"
                    severity="error"
                    className="standard-margin-bottom"
                    key={"details-" + index}
                  >
                    {error}
                  </Alert>
                ))}
                <TextField
                  name="details"
                  type="string"
                  multiline
                  label="Details"
                  onChange={this.onChange}
                  value={details}
                  className="xs-full-width standard-margin-bottom"
                  error={errors.details.length > 0 ? true : false}
                  rowsMax={Infinity}
                  required
                />
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                className="xs-full-width md-half-width"
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  className="xs-full-width standard-margin-bottom"
                >
                  <Typography
                    className="standard-margin-bottom"
                    component="h3"
                    variant="h5"
                  >
                    Tags
                  </Typography>
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    <TextField
                      type="string"
                      label="Type a tag and press enter!"
                      className="xs-full-width md-three-quarter-width standard-margin-bottom"
                      name="tagInput"
                      value={tagInput}
                      onChange={this.onChange}
                      onKeyDown={this.addTagEnter}
                    />
                    <Button
                      type="button"
                      className="xs-full-width md-quarter-width"
                      variant="contained"
                      color="secondary"
                      onClick={this.addTag}
                    >
                      Add Tag
                    </Button>
                  </Box>
                </Box>
                {errors.tags.map((error, index) => (
                  <Alert
                    variant="filled"
                    severity="error"
                    className="standard-margin-bottom"
                    key={"name-" + index}
                  >
                    {error}
                  </Alert>
                ))}
                <ul
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    listStyle: "none",
                    paddingLeft: 0,
                    maxHeight: "325px",
                    overflowY: "auto",
                  }}
                >
                  {this.state.tags.length === 0 ? (
                    <Typography component="p" style={{ opacity: 0.5 }}>
                      You're tags will appear here.
                    </Typography>
                  ) : (
                    ""
                  )}
                  {tags.map((tag, index) => (
                    <li style={{ margin: "5px" }} key={"tag-" + index}>
                      <Chip
                        label={tag}
                        value={tag}
                        onDelete={this.removeTag.bind(this, tag)}
                      />
                    </li>
                  ))}
                </ul>
              </Box>
            </Box>

            <Button
              className="xs-full-width"
              type="submit"
              variant="contained"
              color="primary"
            >
              Create Call
            </Button>
          </form>
        </main>
      </DashboardWrapper>
    );
  }
}

export default Create;
