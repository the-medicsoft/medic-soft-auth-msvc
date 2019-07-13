module.exports = {
  SECRET: process.env.SECRET_KEY || "testingjwt",
  HOST: process.env.HOST || "0.0.0.0",
  PORT: process.env.PORT || 3000,
  LOGGER: true,
  NODE_ENV: process.env.NODE_ENV || "development",
  medicSoftHost: process.env.medicSoftHost || "http://localhost:4000/",
  SALT : process.env.SALT || "$2a$10$O9CyYQ6xChqIXV32NGqApe"
};
