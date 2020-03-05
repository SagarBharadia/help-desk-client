import React from "react";
import Cookie from "js-cookie";
import { Redirect } from "react-router-dom";
import Axios from "axios";
import AppConfig from "./AppConfig";

const checkTokenValid = company_subdir => {
  const checkTokenURL = AppConfig.API_URL + company_subdir + "/api/check-token";
  const headers = {
    Authorization: "Bearer " + Cookie.get("token")
  };
  const response = Axios.get(checkTokenURL, { headers }).then(res => {
    if (res.status === 200) {
      return true;
    } else {
      return false;
    }
  });
  return response;
};

const Protected = (Component, props) => {
  // Currently only checks if token is valid, need to make it so it pings API to check if token
  // is relevant to the company_subdir or not

  if (Cookie.get("token")) {
    checkTokenValid(props.match.params.company_subdir).then(isValid => {
      if (isValid) {
        return <Component {...props} />;
      } else {
        return <h1>no</h1>;
      }
    });
    // if (tokenIsValid) {
    //   return <Component {...props} />;
    // } else {
    //   return <h1>mah</h1>;
    // }
  } else {
    return <Redirect to={`/${props.match.params.company_subdir}/`} />;
  }
};

export default Protected;
