const hashing = require("./hashing");
const token = require("./token");
const password = require("./password");
const user = require("./user");
const requests = require("./requests");

let utils = {
  hashing: hashing,
  token: token,
  password: password,
  user: user,
  requests: requests
};

module.exports = utils;
