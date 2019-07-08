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
  let resultdata = axios.get(clients.GET.clientByEmail + `/${email}`);
  return resultdata;
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
  let resultdata = axios
    .post(clients.POST.clients, userDetails)
    .then(response => {
      return response;
    });
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
    let resultdata = await checkUser(req.body.contacts.email);

    if (resultdata.data.success) {
      res.send({
        success: false,
        statusCode: 409,
        message: "User already exists"
      });
    } else {
      console.log("DID YOU REACH");

      let resultdata = await generateUser(req.body);
      console.log(resultdata);
      res.send({
        success: true,
        statusCode: 200,
        message: "User created"
      });
    }
  } catch (err) {
    return {
      success: false,
      statusCode: 500,
      statusText: "Internal Server Error",
      message: err.message
    };
  }

  // axios.post(client.POST,{

  //   firstName:req.body.firstName,
  //   lastName: req.body.lastName,
  //   password: req.body.password,
  //   address: {
  //       line1:req.body.address.line1,
  //       line2:req.body.address.line1,
  //       city: req.body.address.city,
  //       zipCode: req.body.address.zipCode,
  //       state: req.body.address.state,
  //       country: req.body.address.country

  //   },
  //   contacts: {

  //       phones:req.body.contacts.phones,
  //       email: req.body.contacts.email

  //   },
};
//The above method still needs work.


exports.loginAuth = async (req, res) => {
  try {
    let { email, password } = req.body;

    let resultdata = await checkUser(email);

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
      success: false,
      statusCode: 500,
      statusText: "Internal Server Error",
      message: err.message
    };
  }
};
