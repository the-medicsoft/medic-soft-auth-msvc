const {auth } = require("./auth");

exports.getAuth = async (req, res) => {
  try {
    let response = await auth.getAuth();

    res
      .code(response.statusCode)
      .send(response);
  } catch (err) {}
};

exports.postAuth = async (req, res) => {
  try {
    let response = await auth.postAuth(req, res);

    res
      .code(response.statusCode)
      .send(response);
  } catch (err) {}
};
