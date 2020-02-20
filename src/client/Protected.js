import React from "react";
import Cookie from "js-cookie";
import { Redirect } from "react-router-dom";

const Protected = (Component, props) => {
  // Currently only checks if token is valid, need to make it so it pings API to check if token
  // is relevant to the company_subdir or not

  if (Cookie.get("token")) {
    return <Component {...props} />;
  } else {
    return <Redirect to={`/${props.match.params.company_subdir}/`} />;
  }
};

export default Protected;
