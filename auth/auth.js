let jwt = require('jsonwebtoken');

const { SECRET } = require("../config/config");
const medicSoftDbMsvc = require("../config/medicSoftDbMicroserviceURLs");

async function extractToken(req) {
  let tokenHeaders = ['x-access-token', 'authorization'];

  let token = '';

  for (let tokenHeader of tokenHeaders) {
    if (tokenHeader in req.headers) {
      token = req.headers[tokenHeader];
    }
  }

  return token;
}

exports.getAuth = async (req, res, next) => {
  try {
    let token = await extractToken(req);

    if (token) {
      token = token.slice(7, token.length);

      jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
          res.send({
            success: false,
            message: 'Token is not valid'
          });
        } else {
          res.send({ decoded });
          next();
        }
      });
    } else {
      res.send({
        success: false,
        message: 'Auth token is not supplied'
      });
    }
  } catch (err) {
    res.send({
      success: false,
      statusCode: 500,
      statusText: 'Internal Server Error',
      message: err.message
    });
  }
}

exports.postAuth = async (req, res) => {
  try {
    let { username, password } = req.body;
    // For the given username fetch user from DB
    let mockedUsername = 'admin';
    let mockedPassword = 'password';

    if (username && password) {
      if (username === mockedUsername && password === mockedPassword) {
        let token = jwt.sign({ username }, SECRET, { expiresIn: '24h' /* expires in 24 hours */ });

        // return the JWT token for the future API calls
        res.send({
          success: true,
          message: 'Authentication successful!',
          token: token
        });
      } else {
        res.send({
          success: false,
          statusCode: 403,
          message: 'Incorrect username or password'
        });
      }
    } else {
      res.send({
        success: false,
        statusCode: 400,
        message: 'Authentication failed! Please check the request'
      });
    }
  }
  catch (err) {
    return {
      success: false,
      statusCode: 500,
      statusText: 'Internal Server Error',
      message: err.message
    };
  }
}