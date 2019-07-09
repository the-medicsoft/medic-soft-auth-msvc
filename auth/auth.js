let jwt = require("jsonwebtoken");

const { SECRET } = require("../config/config");
const { clients } = require("../config/medicSoftDbMicroserviceURLs");
const axios = require("axios");
var isSuccess;

async function extractToken(req) {
  let tokenHeaders = ["x-access-token", "authorization"];

  let token = "";

  for (let tokenHeader of tokenHeaders) {
    if (tokenHeader in req.headers) {
      token = req.headers[tokenHeader];
    }
  }

  return token;
}

async function checkUser(email) {
  try {
    let resultdata = await axios.get(clients.GET.clientByEmail + `/${email}`);
    return resultdata;
  } catch (err) {
    console.error(err);
  }
}

async function generateToken(email, clientdata) {
  tokendata = {
    email: email,
    isDoctor: clientdata.isDoctor,
    isActive: clientdata.isActive
  };
  return jwt.sign({ tokendata }, SECRET, {
    expiresIn: "24h" /* expires in 24 hours */
  });
}

async function generateUser(userDetails) {
  let resultdata = axios.post(clients.POST.clients, userDetails);
  return resultdata;
}

exports.testAuth = async (req, res, next) => {
  try {
    let token = await extractToken(req);

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
    let resultdata = await generateUser(req.body);

    if (resultdata.data.success) {
      res.send({
        success: true,
        statusCode: 200,
        message: "User created"
      });
    } else {
      res.send({
        success: false,
        statusCode: 409,
        message: "User already exists"
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

exports.loginAuth = async (req, res) => {
  try {
    let { email, password } = req.body;

    let resultdata = await axios.get(`${clients.GET.clientByEmail}/${email}`);

    // For the given email fetch user from DB
    if (resultdata.data.success) {
      if (password == resultdata.data.data.client.password) {
        let token = await generateToken(email, resultdata.data.data.client);

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
