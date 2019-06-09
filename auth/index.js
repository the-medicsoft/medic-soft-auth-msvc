const { Auth } = require("./auth");

exports.getAuth = async (req, res) => {
  try {
    let response = await Auth.getAuth();

    res
      .code(response.statusCode)
      .send(response);
  } catch (err) {}
};

exports.postAuth = async (req, res) => {
  try {
    let response = await Auth.postAuth();

    res
      .code(response.statusCode)
      .send(response);
  } catch (err) {}
};
