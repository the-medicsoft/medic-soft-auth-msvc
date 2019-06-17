const config = require("./config");

const { medicSoftHost } = process.env || config;

const versions = {
  v1: 'v1'
}

exports.clients = {
  GET: {
    clients: `${medicSoftHost}/${versions.v1}/api/clients`,
    clientByEmail: `${medicSoftHost}/${versions.v1}/api/clients/`
  },
  POST: `${medicSoftHost}/${versions.v1}/clients`,
  PUT: `${medicSoftHost}/${versions.v1}/clients/`,
  DELETE: `${medicSoftHost}/${versions.v1}/clients/`
}