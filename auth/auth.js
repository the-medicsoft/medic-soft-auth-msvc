let jwt = require('jsonwebtoken');

const { SECRET } = require("../config/config");
const { clients } = require("../config/medicSoftDbMicroserviceURLs");
const axios = require('axios');

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
 axios.get(clients.GET.clients + `${email}`)
    .then((response) => {
     
       const isSuccess=JSON.stringify(response.data.success);
    
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
            console.log('Error',error.message);
        }
    });
}


exports.loginAuth = async (req, res) => {
  try {
    let { email, password } = req.body;
    console.log("I WAS HERE!!!!!!!!!");
    console.log(clients.GET.clientByEmail +`/${email}`);

    // For the given email fetch user from DB
    axios.get(clients.GET.clientByEmail +`/${email}`)
      .then((response) => {
        const isSuccess = JSON.stringify(response.data.success);

        debugger;
        console.log("I WAS HERE too!!!!!!!!!");
        if(isSuccess){
          console.log("USER FOUND!!!!");
          res.send({
            success: true
          })
        }
      }
      )

    if (email && password) {
      if (email === mockedUsername && password === mockedPassword) {
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