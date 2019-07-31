const password = require("./password");
const hashing = require("./hashing");
const requests = require("./requests");

exports.generateUser = async userDetails => {
  try {
    if (await password.validatePassword(userDetails)) {
      userDetails.password = await hashing.makeHash(userDetails.password);
      return await requests.registerUser(userDetails);
    }
  } catch (err) {
    throw err;
  }
};
