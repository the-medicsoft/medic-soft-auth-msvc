let jwt = require("jsonwebtoken");

const { SECRET } = require("../config/config");
// const { SALT } = require("../config/config");
// const { clients } = require("../config/medicSoftDbMicroserviceURLs");
// const axios = require("axios");
// const bcrypt = require("bcryptjs");
const utils = require("../utils/index");

// async function extractToken(req) {
//   let tokenHeaders = ["x-access-token", "authorization"];

//   let token = "";

//   for (let tokenHeader of tokenHeaders) {
//     if (tokenHeader in req.headers) {
//       token = req.headers[tokenHeader];
//     }
//   }

//   return token;
// }

// async function generateToken(email, clientdata) {
//   tokendata = {
//     email: email,
//     isDoctor: clientdata.isDoctor,
//     isActive: clientdata.isActive
//   };
//   return jwt.sign({ tokendata }, SECRET, {
//     expiresIn: "24h" /* expires in 24 hours */
//   });
// }

// async function generateUser(userDetails) {
//   if (validatePassword(userDetails)) {
//     userDetails.password = bcrypt.hashSync(userDetails.password, SALT);
//     let resultdata = await axios.post(clients.POST.clients, userDetails);
//     return resultdata;
//   }

//   function validatePassword(userDetails) {
//     if ("password" in userDetails) {
//       if (userDetails.password.length !== 0) {
//         return true;
//       } else {
//         throw new Error("Illegal arguments: password cannot be empty");
//       }
//     } else {
//       throw new Error("Illegal arguments: password is missing");
//     }
//   }
// }

// async function checkPassword(enteredPassword, storedPassword) {
//   let result = bcrypt.compareSync(enteredPassword, storedPassword);
//   return result;
// }

exports.testAuth = async (req, res, next) => {
  try {
    let token = await utils.token.extractToken(req);

    if (token) {
      jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
          res.send({
            success: false,
            message: "Token is not valid"
          });
        } else {
          res.send({ decoded });
          next();
        }
      });
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
