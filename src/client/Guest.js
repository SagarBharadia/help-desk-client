import React from "react";
import Cookie from "js-cookie";
import { Redirect } from "react-router-dom";

function Guest(GuestComponent, props) {
  // Currently only checks if token is present, need to make it authenticate to make sure if there is a token present
  // then it checks that it is relevant to the company_subdir, if not then return guest component

  if (Cookie.get("token")) {
    return (
      <Redirect
        to={`/${props.match.params.company_subdir}/dashboard`}
        {...props}
      />
    );
  } else {
    return <GuestComponent {...props} />;
  }
}

export default Guest;
