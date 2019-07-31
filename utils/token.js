let jwt = require("jsonwebtoken");
const { SECRET } = require("../config/config");

exports.generateToken = async (email, data) => {
  try {
    tokendata = {
      email: email,
      isDoctor: data.isDoctor,
      isActive: data.isActive
    };
    return jwt.sign({ tokendata }, SECRET, {
      expiresIn: "24h" /* expires in 24 hours */
    });
  } catch (err) {
    throw err;
  }
};

exports.extractToken = async req => {
  try {
    let tokenHeaders = ["x-access-token", "authorization"];

    let token = "";

    for (let tokenHeader of tokenHeaders) {
      if (tokenHeader in req.headers) {
        token = req.headers[tokenHeader];
      }
    }

    return token;
  } catch (err) {
    throw err;
  }
};
