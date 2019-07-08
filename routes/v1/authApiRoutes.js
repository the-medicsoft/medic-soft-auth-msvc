const { auth } = require("../../auth");

exports.authApiRoutes = [
  {
    method: "GET",
    url: "/api/v1/test",
    handler: auth.testAuth
  },
  {
    method: "POST",
    url: "/api/v1/login",
    handler: auth.loginAuth
  },
  {
    method: "POST",
    url: "/api/v1/signup",
    handler: auth.signupAuth
  }
];
