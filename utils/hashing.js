const bcrypt = require("bcryptjs");
const { SALT } = require("../config/config");

exports.makeHash = async password => {
  try {
    return bcrypt.hashSync(password, SALT);
  } catch (err) {
    console.log(err);
  }
};

exports.compareHash = async (enteredPassword, storedPassword) => {
  try {
    return bcrypt.compareSync(enteredPassword, storedPassword);
  } catch (err) {
    console.log(err);
  }
};
