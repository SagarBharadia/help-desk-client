import AppConfig from "./AppConfig";
import { generatePath } from "react-router-dom";

const APIEndpoints = {
  endpoints: {
    login: ":company_subdir/api/login",
    checkToken: ":company_subdir/api/check-token",

    createUser: ":company_subdir/api/users/create",
    updateUser: ":company_subdir/api/users/update",
    toggleActiveUser: ":company_subdir/api/users/toggleActive",
    getAllUsers: ":company_subdir/api/users/get/all",
    getSingleUser: ":company_subdir/api/users/get/:id",

    createRole: ":company_subdir/api/roles/create",
    updateRole: ":company_subdir/api/roles/update",
    deleteRole: ":company_subdir/api/roles/delete",
    getAllRoles: ":company_subdir/api/roles/get/all",
    getSingleRole: ":company_subdir/api/roles/get/:id",

    createClient: ":company_subdir/api/clients/create",
    updateClient: ":company_subdir/api/clients/up date",
    deleteClient: ":company_subdir/api/clients/delete",
    getAllClients: ":company_subdir/api/clients/get/all",
    getSingleClient: ":company_subdir/api/clients/get/:id",

    createCall: ":company_subdir/api/calls/create",
    updateCall: ":company_subdir/api/calls/update",
    deleteCall: ":company_subdir/api/calls/delete",
    getAllCall: ":company_subdir/api/calls/get/all",
    getSingleCall: ":company_subdir/api/calls/get/:id"
  },

  get: function(endpointName, data) {
    if (typeof data !== "object")
      throw new Error("Data is a non-object when object is required.");
    if (typeof data.company_subdir === "undefined")
      throw new Error("company_subdir was not defined in data.");
    generatePath(AppConfig.API_URL + this.endpoints[endpointName], data);
  }
};

export default APIEndpoints;
