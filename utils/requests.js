const axios = require("axios");
const { clients } = require("../config/medicSoftDbMicroserviceURLs");

exports.registerUser = async userDetails => {
  return await axios.post(clients.POST.clients, userDetails);
};

exports.getUserByEmail = async userEmail => {
  return await axios.get(`${clients.GET.clientByEmail}/${userEmail}`);
};
