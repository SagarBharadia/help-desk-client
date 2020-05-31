import React, { Component } from "react";
import DashboardWrapper from "../layout/DashboardWrapper";
import axios from "axios";
import { getBaseHeaders } from "../../Helpers";

import Endpoints from "../../Endpoints";
import { Link, Redirect } from "react-router-dom";

import ErrorIcon from "@material-ui/icons/Error";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

import {
  Box,
  Breadcrumbs,
  Link as MuiLink,
  Typography,
  TextField,
  Divider,
  Button,
  Chip,
  Modal,
  Paper,
  Tabs,
  FormControlLabel,
  Tab,
  Checkbox,
  FormLabel,
  Select,
  MenuItem,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from "@material-ui/core";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { Alert } from "@material-ui/lab";

import Messages from "../layout/Messages";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

class View extends Component {
  company_subdir = this.props.match.params.company_subdir;
  call_id = this.props.match.params.id;
  state = {
    name: "Loading...",
    caller_name: "Loading",
    details: "Loading...",
    updateDetails: "",
    tags: [],
    tagInput: "",
    client: {
      name: "",
    },
    downloadedAnalysts: [],
    resolved: false,
    updates: [],
    currentAnalyst: {
      first_name: "",
      second_name: "",
      id: 0,
    },
    receiver: {
      first_name: "Loading...",
      second_name: "Loading...",
      id: 0,
    },
    updateModalOpen: false,
    updateModalTabIndex: 0,
    errors: {
      updateDetails: [],
      tags: [],
      reOpenCallReason: [],
    },
    pageMessages: [],
    pageErrors: [],
    created_at: "",
    updated_at: "",
    redirectToHome: false,
    reOpenCallModalOpen: false,
    reOpenCallReason: "",
  };

  resetErrors = () => {
    this.setState({
      pageErrors: [],
      pageMessages: [],
      errors: {
        updateDetails: [],
        tags: [],
        reOpenCallReason: [],
      },
    });
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  changeCurrentAnalyst = (e) => {
    if (e.target.value !== "") {
      const newCurrentAnalyst = this.state.downloadedAnalysts.find(
        (analyst) => analyst.id === e.target.value
      );
      if (typeof newCurrentAnalyst !== undefined) {
        this.setState({
          currentAnalyst: newCurrentAnalyst,
        });
      }
    }
  };

  removeTag = (tagToDelete) => {
    const newTags = this.state.tags.filter((tag) => tagToDelete !== tag);
    this.setState({
      tags: newTags,
    });
  };

  getCall = () => {
    const headers = getBaseHeaders();
    const getCallEndpoint = Endpoints.get("api", "getSingleCall", {
      company_subdir: this.company_subdir,
      id: this.call_id,
    });
    axios
      .get(getCallEndpoint, headers)
      .then((res) => {
        const prevCurrentAnalyst = this.state.currentAnalyst;
        const prevDownloadedAnalysts = this.state.downloadedAnalysts;
        let newStateData = {
          name: res.data.call.name,
          caller_name: res.data.call.caller_name,
          details: res.data.call.details,
          client: res.data.call.client,
          tags: res.data.call.tags,
          receiver: res.data.call.receiver,
          updates: res.data.call.updates.sort((update1, update2) => {
            const update1CreatedTime = new Date(update1.created_at);
            const update2CreatedTime = new Date(update2.created_at);

            return update2CreatedTime.getTime() - update1CreatedTime.getTime();
          }),
          resolved: res.data.call.resolved === 0 ? false : true,
          created_at: res.data.call.created_at,
          updated_at: res.data.call.updated_at,
          currentAnalyst:
            res.data.call.current_analyst !== null
              ? res.data.call.current_analyst
              : prevCurrentAnalyst,
          downloadedAnalysts: !prevDownloadedAnalysts.length
            ? [res.data.call.current_analyst]
            : prevDownloadedAnalysts,
        };
        return newStateData;
      })
      .then((newStateData) => this.setState(newStateData))
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            const pageErrors = [
              ...this.state.pageErrors,
              "Unauthorized to read calls. Please contact your admin for this permission.",
            ];
            this.setState({ pageErrors: pageErrors });
          } else if (error.response.status === 404) {
            const pageErrors = [
              ...this.state.pageErrors,
              error.response.data.message,
            ];
            this.setState({ pageErrors: pageErrors });
          }
        }
      });
  };

  updateCall = (e) => {
    e.preventDefault();
    const headers = getBaseHeaders();
    const updateCallEndpoint = Endpoints.get("api", "updateCall", {
      company_subdir: this.company_subdir,
    });
    let data = {
      call_id: this.call_id,
      details: this.state.updateDetails,
      tags: this.state.tags,
      current_analyst_id: this.state.currentAnalyst.id,
      resolved: this.state.resolved,
    };
    this.resetErrors();
    axios
      .post(updateCallEndpoint, data, headers)
      .then((res) => {
        this.setState({
          updateDetails: "",
          updateModalOpen: false,
          pageMessages: [
            {
              text: res.data.message,
              severity: "success",
            },
          ],
        });
      })
      .then(() => {
        this.getCall();
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 422) {
            var newErrorsState = { ...this.state.errors };
            const errorData = error.response.data;
            if (errorData.details)
              newErrorsState.updateDetails = errorData.details;
            if (errorData.tags) newErrorsState.tags = errorData.tags;
            this.setState({
              errors: newErrorsState,
            });
          } else if (error.response.status === 401) {
            const pageErrors = [
              ...this.state.pageErrors,
              "Unauthorized to update calls. Please contact your admin for this permission.",
            ];
            this.setState({ pageErrors: pageErrors });
          } else if (error.response.status === 403) {
            const pageErrors = [
              ...this.state.pageErrors,
              error.response.data.message,
            ];
            this.setState({ pageErrors: pageErrors, updateModalOpen: false });
          }
        }
      });
  };

  reOpenCall = (e) => {
    e.preventDefault();
    const headers = getBaseHeaders();
    const reopenCallEndpoint = Endpoints.get("api", "markCallAsUnsolved", {
      company_subdir: this.company_subdir,
      id: this.call_id,
    });
    const data = {
      reason: this.state.reOpenCallReason,
    };
    this.resetErrors();
    axios
      .post(reopenCallEndpoint, data, headers)
      .then((res) => {
        this.setState({
          reOpenCallReason: "",
          reOpenCallModalOpen: false,
        });
      })
      .then(() => {
        this.getCall();
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 422) {
            var newErrorsState = { ...this.state.errors };
            const errorData = error.response.data;
            if (errorData.reason)
              newErrorsState.reOpenCallReason = errorData.reason;
            this.setState({
              errors: newErrorsState,
            });
          } else if (error.response.status === 401) {
            const pageErrors = [
              ...this.state.pageErrors,
              "Unauthorized to update calls. Please contact your admin for this permission.",
            ];
            this.setState({ pageErrors: pageErrors });
          } else if (error.response.status === 403) {
            const pageErrors = [
              ...this.state.pageErrors,
              error.response.data.message,
            ];
            this.setState({
              pageErrors: pageErrors,
              reOpenCallModalOpen: false,
            });
          }
        }
      });
  };

  toggleUpdateModal = () => {
    const newState = !this.state.updateModalOpen;
    this.setState({
      updateModalOpen: newState,
    });
  };

  handleUpdateModalTabSwitch = (e, newValue) => {
    this.setState({
      updateModalTabIndex: newValue,
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

  downloadUsers = () => {
    let headers = getBaseHeaders();
    headers.params = {
      forForm: "true",
      filterPerm: "update-call",
    };
    const getUsersEndpoint = Endpoints.get("api", "getAllUsers", {
      company_subdir: this.company_subdir,
    });
    axios
      .get(getUsersEndpoint, headers)
      .then((res) => {
        this.setState({
          downloadedAnalysts: res.data,
        });
      })
      .catch((error) => null);
  };

  componentDidMount() {
    this.downloadUsers();
    this.getCall();
  }

  toggleResolved = (e) => {
    this.setState({
      resolved: e.target.checked,
    });
  };

  generateCallHistory = (update, key) => {
    return (
      <Box
        className="xs-full-width standard-margin-bottom"
        key={"callHistory-" + key}
      >
        <Typography component="p" variant="subtitle1" style={{ color: "#555" }}>
          Update Posted: {update.created_at}
        </Typography>
        <Typography component="p" variant="h6">
          {update.details}
        </Typography>
      </Box>
    );
  };

  getTabBackground = (tabKey) => {
    let bgColor = "inherit";
    const errorColor = "#ff7979";
    switch (tabKey) {
      case "details":
        if (this.state.errors.updateDetails.length > 0) bgColor = errorColor;
        break;
      case "tags":
        if (this.state.errors.tags.length > 0) bgColor = errorColor;
        break;
      default:
        break;
    }
    return bgColor;
  };

  deleteCall = () => {
    let headers = getBaseHeaders();
    const deletePostEndpoint = Endpoints.get("api", "deleteCall", {
      company_subdir: this.company_subdir,
    });
    const data = {
      call_id: this.call_id,
    };
    axios
      .post(deletePostEndpoint, data, headers)
      .then((res) => {
        this.setState({
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
          if (error.response.status === 401) {
            const pageErrors = [
              ...this.state.pageErrors,
              error.response.data.message,
            ];
            this.setState({
              pageErrors: pageErrors,
            });
          } else if (error.response.status === 500) {
            const pageErrors = [
              ...this.state.pageErrors,
              error.response.data.message,
            ];
            this.setState({
              pageErrors: pageErrors,
            });
          }
        }
      });
  };

  toggleReOpenCallModal = () => {
    const newState = !this.state.reOpenCallModalOpen;
    this.setState({
      reOpenCallModalOpen: newState,
    });
  };

  render() {
    const company_subdir = this.company_subdir;
    const {
      pageMessages,
      pageErrors,
      client,
      name,
      caller_name,
      details,
      tags,
      receiver,
      currentAnalyst,
      updateModalOpen,
      errors,
      updateDetails,
      updateModalTabIndex,
      tagInput,
      resolved,
      downloadedAnalysts,
      updates,
      created_at,
      updated_at,
      redirectToHome,
      reOpenCallModalOpen,
      reOpenCallReason,
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
              Calls
            </MuiLink>
            <Typography color="textPrimary">
              {name.length > 20 ? name.substr(0, 20) + "..." : name}
            </Typography>
          </Breadcrumbs>
          <Modal
            open={reOpenCallModalOpen}
            onClose={this.toggleReOpenCallModal}
          >
            <Paper
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                outline: 0,
                padding: "20px",
                width: "50vw",
                minWidth: "360px",
                maxWidth: "600px",
              }}
            >
              <Typography component="h3" variant="h5">
                Reopen Call
              </Typography>
              <Divider className="standard-margin-bottom" />
              <form onSubmit={this.reOpenCall}>
                {errors.reOpenCallReason.map((error, index) => (
                  <Alert
                    variant="filled"
                    severity="error"
                    className="standard-margin-bottom"
                    key={"reOpenCallReason-" + index}
                  >
                    {error}
                  </Alert>
                ))}
                <TextField
                  name="reOpenCallReason"
                  type="string"
                  multiline
                  label="Reason for reopening"
                  onChange={this.onChange}
                  value={reOpenCallReason}
                  className="xs-full-width standard-margin-bottom"
                  error={errors.reOpenCallReason.length > 0 ? true : false}
                  rowsMax={Infinity}
                  required
                />
                <Button type="submit" variant="contained" color="secondary">
                  reopen call
                </Button>
              </form>
            </Paper>
          </Modal>
          <Modal open={updateModalOpen} onClose={this.toggleUpdateModal}>
            <Paper
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                outline: 0,
                padding: "20px",
                width: "50vw",
                minWidth: "360px",
                maxWidth: "600px",
              }}
            >
              <Typography component="h3" variant="h5">
                Update Call
              </Typography>
              <Divider />
              <Tabs
                value={updateModalTabIndex}
                onChange={this.handleUpdateModalTabSwitch}
                centered
              >
                <Tab
                  style={{ backgroundColor: this.getTabBackground("details") }}
                  value={0}
                  label="Details"
                />
                <Tab
                  style={{ backgroundColor: this.getTabBackground("tags") }}
                  value={1}
                  label="Tags"
                />
                <Tab value={2} label="Settings" />
              </Tabs>
              <form onSubmit={this.updateCall}>
                <TabPanel value={updateModalTabIndex} index={0}>
                  <TextField
                    name="updateDetails"
                    type="string"
                    multiline
                    label="Details of update"
                    onChange={this.onChange}
                    value={updateDetails}
                    className="xs-full-width standard-margin-bottom"
                    error={errors.updateDetails.length > 0 ? true : false}
                    rowsMax={Infinity}
                    required
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={resolved}
                        onChange={this.toggleResolved}
                        name="resolved"
                      />
                    }
                    label="Resolved"
                  />
                </TabPanel>
                <TabPanel value={updateModalTabIndex} index={1}>
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    className="standard-margin-bottom"
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
                      maxHeight: "3250px",
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
                </TabPanel>
                <TabPanel value={updateModalTabIndex} index={2}>
                  <FormLabel>Current Analyst</FormLabel>
                  <Select
                    name="currentAnalyst"
                    onChange={this.changeCurrentAnalyst}
                    value={currentAnalyst.id}
                    className="xs-full-width standard-margin-bottom"
                    displayEmpty
                    required
                  >
                    <MenuItem value="">None Assigned</MenuItem>
                    <Divider />
                    {downloadedAnalysts.map((analyst) => {
                      return (
                        <MenuItem key={"user-" + analyst.id} value={analyst.id}>
                          {analyst.first_name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </TabPanel>
                <Button type="submit" variant="contained" color="primary">
                  Update
                </Button>
              </form>
            </Paper>
          </Modal>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            flexWrap="wrap"
            alignItems="center"
          >
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              className="xs-full-width md-half-width standard-margin-bottom"
            >
              <Typography component="h1" variant="h5">
                {name}
              </Typography>
              &emsp;
              {resolved === true ? (
                <CheckCircleIcon style={{ color: "#2ecc71" }} />
              ) : (
                <ErrorIcon style={{ color: "#e74c3c" }} />
              )}
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              flexWrap="wrap"
              className="md-half-width xs-full-width"
            >
              {resolved === true ? (
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  className="xs-full-width md-half-width standard-margin-bottom"
                  onClick={this.toggleReOpenCallModal}
                >
                  Reopen Call
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  className="xs-full-width md-half-width standard-margin-bottom"
                  onClick={this.toggleUpdateModal}
                >
                  Update
                </Button>
              )}

              <Button
                type="button"
                variant="contained"
                color="secondary"
                className="xs-full-width md-third-width standard-margin-bottom"
                onClick={this.deleteCall}
              >
                Delete
              </Button>
            </Box>
          </Box>
          <Messages pageErrors={pageErrors} pageMessages={pageMessages} />
          <Box
            display="flex"
            flexDirection="column"
            flexWrap="wrap"
            justifyContent="space-between"
            className="xs-full-width standard-margin-bottom"
          >
            <Box
              className="="
              display="flex"
              flexDirection="row"
              flexWrap="wrap"
              justifyContent="space-between"
            >
              <Box className="xs-full-width sm-half-width standard-margin-bottom">
                <Typography component="h3" variant="h6">
                  Client
                </Typography>
                <Divider />
                <Typography component="p">{client.name}</Typography>
              </Box>
              <Box className="xs-full-width sm-half-width standard-margin-bottom">
                <Typography component="h3" variant="h6">
                  Reported by
                </Typography>
                <Divider />
                <Typography component="p">{caller_name}</Typography>
              </Box>
              <Box className="xs-full-width sm-half-width standard-margin-bottom">
                <Typography component="h3" variant="h6">
                  Received By
                </Typography>
                <Divider />
                <Typography component="p">
                  {receiver.first_name + " " + receiver.second_name}
                </Typography>
              </Box>
              <Box className="xs-full-width sm-half-width standard-margin-bottom">
                <Typography component="h3" variant="h6">
                  Current Analyst
                </Typography>
                <Divider />
                {currentAnalyst.id === 0 ? (
                  <Alert variant="filled" severity="error" icon={false}>
                    No analyst is currently assigned to this call.
                  </Alert>
                ) : (
                  <Typography component="p">
                    {currentAnalyst.first_name +
                      " " +
                      currentAnalyst.second_name}
                  </Typography>
                )}
              </Box>
              <Box className="xs-full-width sm-half-width standard-margin-bottom">
                <Typography component="h3" variant="h6">
                  Created At
                </Typography>
                <Divider />
                <Typography component="p">{created_at}</Typography>
              </Box>
              <Box className="xs-full-width sm-half-width standard-margin-bottom">
                <Typography component="h3" variant="h6">
                  Updated At
                </Typography>
                <Divider />
                <Typography component="p">{updated_at}</Typography>
              </Box>
            </Box>
            <Box className="xs-full-width standard-margin-bottom">
              <Typography component="h3" variant="h6">
                Details
              </Typography>
              <Divider />
              <Typography component="p">{details}</Typography>
            </Box>
          </Box>
          <Box display="block" className="standard-margin-bottom">
            <Box className="xs-full-width md-half-width standard-margin-bottom float-left">
              <Typography component="h3" variant="h6">
                Latest Update
              </Typography>
              <Divider />
              {updates.length === 0 ? (
                <Alert variant="filled" severity="info">
                  There are no updates to report.
                </Alert>
              ) : (
                <div>
                  <Typography>{updates[0].details}</Typography>
                  <Typography style={{ color: "#555" }}>
                    Update At: {updates[0].created_at}
                  </Typography>
                </div>
              )}
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              className="xs-full-width md-half-width standard-margin-bottom float-right"
            >
              <div className="xs-full-width">
                <Typography component="h3" variant="h6">
                  Tags
                </Typography>
                <Divider />
              </div>
              <ul
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  listStyle: "none",
                  paddingLeft: 0,
                }}
                className="xs-full-width"
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
                    <Chip label={tag} value={tag} />
                  </li>
                ))}
              </ul>
            </Box>
            <div className="clearfix"></div>
          </Box>
          <ExpansionPanel disabled={updates.length <= 1}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="call-history-header"
            >
              <Typography variant="h6" component="h3">
                Call History
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              {updates.map((update, index) => {
                if (index === 0) return "";
                return this.generateCallHistory(update, index);
              })}
            </ExpansionPanelDetails>
          </ExpansionPanel>
          {redirectToHome ? (
            <Redirect
              to={
                Endpoints.get("client", "callsArea", {
                  company_subdir: this.company_subdir,
                }) + "?delete=success"
              }
            />
          ) : (
            ""
          )}
        </main>
      </DashboardWrapper>
    );
  }
}

export default View;
