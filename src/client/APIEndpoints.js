import AppConfig from "./AppConfig";

const APIEndpoints = {
  endpoints: {
    login: "/api/login",
    checkToken: "/api/check-token",

    createUser: "/api/users/create",
    updateUser: "/api/users/update",
    toggleActiveUser: "/api/users/toggleActive",
    getAllUsers: "/api/users/get/all",
    getSingleUser: "/api/users/get/",

    createRole: "/api/roles/create",
    updateRole: "/api/roles/update",
    deleteRole: "/api/roles/delete",
    getAllRoles: "/api/roles/get/all",
    getSingleRole: "/api/roles/get/",

    createClient: "/api/clients/create",
    updateClient: "/api/clients/up date",
    deleteClient: "/api/clients/delete",
    getAllClients: "/api/clients/get/all",
    getSingleClient: "/api/clients/get/",

    createCall: "/api/calls/create",
    updateCall: "/api/calls/update",
    deleteCall: "/api/calls/delete",
    getAllCall: "/api/calls/get/all",
    getSingleCall: "/api/calls/get/"
  },

  get: function(endpointName, companySubdir) {
    return AppConfig.API_URL + companySubdir + this.endpoints[endpointName];
  }
};

export default APIEndpoints;
