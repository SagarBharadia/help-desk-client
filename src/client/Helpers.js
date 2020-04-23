import Cookies from "js-cookie";

// Function to return base headers
export function getBaseHeaders() {
  const headers = {
    headers: {
      Authorization: "Bearer " + Cookies.get("token"),
    },
  };
  return headers;
}
