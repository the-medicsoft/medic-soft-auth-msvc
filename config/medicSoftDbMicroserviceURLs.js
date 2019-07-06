const config = require("./config");

const { medicSoftHost } = process.env || config;

const versions = {
  v1: 'v1'
}

exports.clients = {
  GET: {
    clients: `${medicSoftHost}/api/${versions.v1}/clients`,
    clientByEmail: `${medicSoftHost}/api/${versions.v1}/clients`
  },
  POST: `${medicSoftHost}/${versions.v1}/clients`,
  PUT: `${medicSoftHost}/${versions.v1}/clients/`,
  DELETE: `${medicSoftHost}/${versions.v1}/clients/`
}