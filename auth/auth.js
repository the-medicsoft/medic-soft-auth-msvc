const utils = require("../utils/index");

exports.testAuth = async (req, res, next) => {
  try {
    let token = await utils.token.extractToken(req);

    if (token) {
      let result = await utils.token.verifyToken(token);
      res.send(result.decoded);
    } else {
      res.send({
        success: false,
        message: "Auth token is not supplied"
      });
    }
  } catch (err) {
    res.send({
      success: false,
      statusCode: 500,
      statusText: "Internal Server Error",
      message: err.message
    });
  }
};

//This method still needs work.
exports.signupAuth = async (req, res) => {
  try {
    let resultData = await utils.user.generateUser(req.body);

    if (resultData.data.success) {
      res.send({
        success: true,
        statusCode: 200,
        message: "User created"
      });
    }
  } catch (err) {
    if ("response" in err) {
      return {
        success: err.response.data.success,
        statusCode: err.response.data.statusCode,
        statusText: err.response.data.statusText,
        message: err.response.data.message
      };
    }

    return {
      err: err.message
    };
  }
};

exports.loginAuth = async (req, res) => {
  try {
    let { email, password } = req.body;

    let resultdata = await utils.requests.getUserByEmail(email);

    // For the given email fetch user from DB
    if (resultdata.data.success) {
      let result = await utils.hashing.compareHash(
        password,
        resultdata.data.data.client.password
      );
      if (result) {
        let token = await utils.token.generateToken(
          email,
          resultdata.data.data.client
        );

        // return the JWT token for the future API calls
        res.send({
          success: true,
          message: "Authentication successful!",
          token: token
        });
      } else {
        res.send({
          success: false,
          statusCode: 403,
          message: "Incorrect username or password"
        });
      }
    } else {
      res.send({
        success: false,
        statusCode: 400,
        message: "Authentication failed! Please check the request"
      });
    }
  } catch (err) {
    return {
      success: err.response.data.success,
      statusCode: err.response.data.statusCode,
      statusText: err.response.data.statusText,
      message: err.response.data.message
    };
  }
};
