const config = require("./config/config");
const cors = require("cors");

const { NODE_ENV = config.NODE_ENV } = process.env;

if (NODE_ENV !== "production") {
  require("dotenv").config();
}

const v1ApiRoutes = require("./routes/v1/");

const { HOST = config.HOST, PORT = config.PORT } = process.env;

const fastify = require("fastify")({
  logger: NODE_ENV !== "production" ? process.env.LOGGER : false
});

fastify.use(cors());

// register API routes
for (let apiRoute of v1ApiRoutes) {
  for (let route of apiRoute) {
    fastify.route(route);
  }
}

fastify.get("/", (req, res) =>
  res.send("Welcome to The MedicSoft Auth Service")
);

// Run the server!
fastify.listen(PORT, HOST, err => {
  try {
    if (err) throw err;

    if (!HOST || !PORT) {
      throw new Error("either HOST or, PORT is undefined");
    }

    console.log(`App Running on, http://${HOST}:${PORT}/`);
  } catch (err) {
    console.error(err.message);
  }
});

exports.fastify = fastify;
