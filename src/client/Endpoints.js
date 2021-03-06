import AppConfig from "./AppConfig";
import { generatePath } from "react-router-dom";

const Endpoints = {
  allowedTypes: ["api", "client"],
  api: {
    login: ":company_subdir/api/login",
    checkToken: ":company_subdir/api/check-token",

    createUser: ":company_subdir/api/users/create",
    updateUser: ":company_subdir/api/users/update",
    toggleActiveUser: ":company_subdir/api/users/toggleActive",
    getAllUsers: ":company_subdir/api/users/get/all",
    getSingleUser: ":company_subdir/api/users/get/:id",
    getUserLogs: ":company_subdir/api/users/:id/logs",

    createRole: ":company_subdir/api/roles/create",
    updateRole: ":company_subdir/api/roles/update",
    deleteRole: ":company_subdir/api/roles/delete",
    getAllRoles: ":company_subdir/api/roles/get/all",
    getSingleRole: ":company_subdir/api/roles/get/:id",

    getAllPermissionActions: ":company_subdir/api/permissions/get/all",

    createClient: ":company_subdir/api/clients/create",
    updateClient: ":company_subdir/api/clients/update",
    deleteClient: ":company_subdir/api/clients/delete",
    getAllClients: ":company_subdir/api/clients/get/all",
    getSingleClient: ":company_subdir/api/clients/get/:id",
    getClientCalls: ":company_subdir/api/clients/get/:client_id/calls",

    createCall: ":company_subdir/api/calls/create",
    updateCall: ":company_subdir/api/calls/update",
    deleteCall: ":company_subdir/api/calls/delete",
    getAllCalls: ":company_subdir/api/calls/get/all",
    getSingleCall: ":company_subdir/api/calls/get/:id",
    searchCalls: ":company_subdir/api/calls/search",
    markCallAsUnsolved: ":company_subdir/api/calls/:id/unsolved",

    getAllReports: ":company_subdir/api/reports/get/all",
    createReport: ":company_subdir/api/reports/create",
    downloadReport: ":company_subdir/api/reports/download/:id",
  },

  client: {
    home: "/",
    login: "/:company_subdir/",
    dashboard: "/:company_subdir/dashboard",

    usersArea: "/:company_subdir/users",
    createUser: "/:company_subdir/users/create",
    viewUser: "/:company_subdir/users/:id",
    userLogs: "/:company_subdir/users/:id/logs",

    rolesArea: "/:company_subdir/roles",
    createRole: "/:company_subdir/roles/create",
    viewRole: "/:company_subdir/roles/:id",

    clientsArea: "/:company_subdir/clients",
    createClient: "/:company_subdir/clients/create",
    viewClient: "/:company_subdir/clients/:id",

    callsArea: "/:company_subdir/calls",
    createCall: "/:company_subdir/calls/create",
    viewCall: "/:company_subdir/calls/:id",

    reportsArea: "/:company_subdir/reports",
    createReport: "/:company_subdir/reports/create",
  },

  get: function (type, endpointName, data) {
    type = type.toLowerCase();
    if (typeof data !== "object")
      throw new Error("Data is a non-object when object is required.");
    if (typeof type !== "string") throw new Error("Type must be string");
    if (!this.allowedTypes.includes(type))
      throw new Error("Type must be in " + this.allowedTypes.toString());
    if (type === "api") {
      if (typeof this.api[endpointName] === undefined)
        throw new Error(endpointName + " endpoint not found in API.");
      return AppConfig.API_URL + generatePath(this.api[endpointName], data);
    } else if (type === "client") {
      if (typeof this.client[endpointName] === undefined)
        throw new Error(endpointName + " endpoint not found in client.");
      return generatePath(this.client[endpointName], data);
    }
  },

  getRaw: function (type, endpointName) {
    type = type.toLowerCase();
    if (typeof type !== "string") throw new Error("Type must be string.");
    if (!this.allowedTypes.includes(type))
      throw new Error("Type must be in " + this.allowedTypes.toString());
    if (type === "api") {
      if (typeof this.api[endpointName] === undefined)
        throw new Error(endpointName + " endpoint not found in API.");
      return AppConfig.API_URL + this.api[endpointName];
    } else if (type === "client") {
      if (typeof this.client[endpointName] === undefined)
        throw new Error(endpointName + " endpoint not found in client.");
      return this.client[endpointName];
    }
  },
};

export default Endpoints;
