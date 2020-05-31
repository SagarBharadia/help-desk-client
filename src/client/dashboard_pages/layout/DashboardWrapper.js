import React, { Component } from "react";
import DashboardAppBar from "./DashboardAppBar";
import PropTypes from "prop-types";
import { Container, Button } from "@material-ui/core";

import SearchIcon from "@material-ui/icons/Search";
import KnowledgeBasedSearch from "./KnowledgeBasedSearch";

class DashboardWrapper extends Component {
  company_subdir = this.props.match.params.company_subdir;
  state = {
    searchModalVisible: false,
  };

  toggleSearchModal = () => {
    const newVal = !this.state.searchModalVisible;
    this.setState({
      searchModalVisible: newVal,
    });
  };

  render() {
    const { company_subdir } = { ...this.props.match.params };
    const { location } = { ...this.props };
    const { searchModalVisible } = { ...this.state };
    return (
      <div>
        <KnowledgeBasedSearch
          company_subdir={this.company_subdir}
          toggleSearchModal={this.toggleSearchModal}
          searchModalVisible={searchModalVisible}
        />
        <DashboardAppBar company_subdir={company_subdir} location={location} />
        <Container>{this.props.children}</Container>
        <Button
          onClick={this.toggleSearchModal}
          color="secondary"
          aria-label="search modal"
          variant="contained"
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
          }}
        >
          <SearchIcon /> Search Calls
        </Button>
      </div>
    );
  }
}

DashboardWrapper.propTypes = {
  children: PropTypes.element.isRequired,
};

export default DashboardWrapper;
