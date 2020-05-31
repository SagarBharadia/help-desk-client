import React, { Component } from "react";
import {
  Button,
  Modal,
  Paper,
  Typography,
  Divider,
  TextField,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";

import { getBaseHeaders } from "../../Helpers";
import Endpoints from "../../Endpoints";
import { Link } from "react-router-dom";
import axios from "axios";

class KnowledgeBasedSearch extends Component {
  state = {
    query: "",
    searchResults: [],
    nextPageURL: "",
    prevPageURL: "",
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  searchCalls = (e) => {
    e.preventDefault();
    let headers = getBaseHeaders();
    headers.params = {
      query: this.state.query,
    };
    const searchCallsEndpoint = Endpoints.get("api", "searchCalls", {
      company_subdir: this.props.company_subdir,
    });
    axios.get(searchCallsEndpoint, headers).then((res) => {
      this.setState({
        searchResults: res.data.data,
        prevPageURL: res.data.prev_page_url,
        nextPageURL: res.data.next_page_url,
      });
    });
  };

  handleSearchCallClick = (e) => {
    e.preventDefault();
    this.props.toggleSearchModal();
  };

  render() {
    const { query, searchResults } = {
      ...this.state,
    };
    return (
      <Modal
        open={this.props.searchModalVisible}
        onClose={this.props.toggleSearchModal}
      >
        <Paper
          style={{
            position: "absolute",
            top: "25%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            outline: 0,
            padding: "20px",
            width: "75vw",
            minWidth: "320px",
            maxWidth: "800px",
          }}
        >
          <Typography component="h1" variant="h6" align="center">
            Knowledge Based Search System
          </Typography>
          <Divider />
          <br />
          <form onSubmit={this.searchCalls} className="standard-margin-bottom">
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              className="xs-full-width"
            >
              <TextField
                label="Search query"
                className="xs-full-width md-three-quarter-width"
                name="query"
                onChange={this.onChange}
                value={query}
                required
              />
              <Button
                className="xs-full-width md-quarter-width"
                variant="contained"
                color="primary"
                type="submit"
              >
                Search
              </Button>
            </Box>
          </form>
          <Table aria-label="table containing the calls">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(searchResults).map((key) => {
                let call = searchResults[key];
                return (
                  <TableRow key={call.id}>
                    <TableCell component="th" scope="row">
                      {call.name}
                    </TableCell>
                    <TableCell>{call.client.name}</TableCell>
                    <TableCell>
                      <Button
                        component={Link}
                        variant="contained"
                        color="primary"
                        to={Endpoints.get("client", "viewCall", {
                          company_subdir: this.props.company_subdir,
                          id: call.id,
                        })}
                        onClick={this.props.toggleSearchModal}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </Modal>
    );
  }
}

export default KnowledgeBasedSearch;
