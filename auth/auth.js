let jwt = require('jsonwebtoken');
const config = require("../config/config");

secret = config.SECRET;

console.log(secret);

const auth = {};

auth.getAuth = async function (req, res) {
    try {

      let checkToken = (req, res, next) => {
        let token = req.headers['x-access-token'] || req.headers['authorization'];
        if (token.startsWith('Bearer ')) {
          token = token.slice(7, token.length);
        }

        if (token) {
          jwt.verify(token, secret, (err, decoded) => {
            if (err) {
              return {
                success: false,
                message: 'Token is not valid'
              };
            } else {
              return {
                decoded: decoded
              };
              next();
            }
          });
        } else {
          return {
            success: false,
            message: 'Auth token is not supplied'
          };
        }
      };
    } catch (err) {
        return {
            success: false,
            statusCode: 500,
            statusText: "Internal Server Error",
            message: err.message
        };
    }
}

auth.postAuth = async function(req, res){
  try {
        let username = req.body.username;
        let password = req.body.password;
        // For the given username fetch user from DB
        let mockedUsername = 'admin';
        let mockedPassword = 'password';

        if (username && password) {
          if (username === mockedUsername && password === mockedPassword) {
            let token = jwt.sign({username: username},
              secret,
              { expiresIn: '24h' // expires in 24 hours
              }
            );
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
      // index (req, reply) {
      //   return{
      //     success: true,
      //     message: 'Index page'
      //   };
      // }
    // }
   catch (err) {
    return {
        success: false,
        statusCode: 500,
        statusText: "Internal Server Error",
        message: err.message
    };
  }
}

module.exports = {auth};
