exports.validatePassword = async userDetails => {
  try {
    if ("password" in userDetails) {
      if (userDetails.password.length !== 0) {
        return true;
      } else {
        throw new Error("Illegal arguments: password cannot be empty");
      }
    } else {
      throw new Error("Illegal arguments: password is missing");
    }
  } catch (err) {
    throw err;
  }
};
