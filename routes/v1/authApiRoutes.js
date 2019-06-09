const { auth } = require("../../auth/");

exports.authApiRoutes = [
  {
    method: "GET",
    url: "/api/v1/login",
    handler: auth.getAuth
  },
  {
    method: "POST",
    url: "/api/v1/signup",
    handler: auth.postAuth
  }
];
