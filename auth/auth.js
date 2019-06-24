let jwt = require('jsonwebtoken');

const { SECRET } = require("../config/config");
const { clients } = require("../config/medicSoftDbMicroserviceURLs");
const {axios} =require('axios');

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

exports.signAuth=async(req,res)=>
{

let email=req.body.email;
 axios.get(`http://localhost:4000/api/v1/clients/${email}`)
    .then((response) => {
     
       const isSuccess=JSON.stringify(response.data.success);
      //  console.log(isSuccess);
    
        if(isSuccess)
        {
            console.log('User already Exist');
        }
    })
    .catch(error => 
        {
        if(error.response.data.statusCode===404)
        {
            console.log(JSON.stringify(error.response.data));
           // console.log('here at 1')
           
            axios.post(client.POST,{
              
              firstName:req.body.firstName,
              lastName: req.body.lastName,
              password: req.body.password,
              address: {
                  line1:req.body.address.line1,
                  line2:req.body.address.line1,
                  city: req.body.address.city,
                  zipCode: req.body.address.zipCode,
                  state: req.body.address.state,
                  country: req.body.address.country
                
              },
              contacts: {
                  
                  phones:req.body.contacts.phones,
                  email: req.body.contacts.email
                
              },
              gender: req.body.gender
                  
               
            }).then((res) => {
                console.log(`statusCode: ${res.statusCode}`)
                console.log(res)
              })
              .catch((error) => {
                console.error(error)
              })
        }
    
        else
        {
            // console.log('here at 3');
            console.log('Error',error.message);
        }
    });
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