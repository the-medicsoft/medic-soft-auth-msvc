module.exports = {
  SECRET: process.env.SECRET_KEY || "testingjwt",
  HOST: process.env.HOST || "0.0.0.0",
  PORT: process.env.PORT || 4000,
  LOGGER: true,
  NODE_ENV: process.env.NODE_ENV || "development",
};
