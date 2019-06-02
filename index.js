require('dotenv').config();
const bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
let middleware = require('./middleware');

// Require the framework and instantiate it
const fastify = require('fastify')({
  logger: true
})

class HandlerGenerator {
  login (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    // For the given username fetch user from DB
    let mockedUsername = 'admin';
    let mockedPassword = 'password';

    if (username && password) {
      if (username === mockedUsername && password === mockedPassword) {
        let token = jwt.sign({username: username},
          config.secret,
          { expiresIn: '24h' // expires in 24 hours
          }
        );
        // return the JWT token for the future API calls
        reply.send({
          success: true,
          message: 'Authentication successful!',
          token: token
        });
      } else {
        res.send(403).json({
          success: false,
          message: 'Incorrect username or password'
        });
      }
    } else {
      res.send(400).json({
        success: false,
        message: 'Authentication failed! Please check the request'
      });
    }
  }
  index (req, reply) {
    reply.send({
      success: true,
      message: 'Index page'
    });
  }
}

// Starting point of the server
function main () {
  let handlers = new HandlerGenerator();
  const PORT = process.env.PORT || 5000;
  fastify.use(bodyParser.urlencoded({ // Middleware
    extended: true
  }));
  fastify.use(bodyParser.json());
  // Routes & Handlers
  fastify.post('/login', handlers.login);
  fastify.get('/', (middleware.checkToken, handlers.index));
  // Run the server!
  fastify.listen(PORT, (err, address) => {
    if (err) throw err
    fastify.log.info(`server listening on ${address}`);
  })
}

main();

// // Declare a route
// fastify.get('/', (request, reply) => {
//   reply.send({ hello: 'world' });
// })
//
//
//
// // Run the server!
// fastify.listen(PORT, (err, address) => {
//   if (err) throw err
//   fastify.log.info(`server listening on ${address}`);
// })
