const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { readdirSync } = require("fs");
const errorHandler = require("./middlewares/errorHandler");
require("dotenv").config({ path: "./config/config.env" });

const connectDB = require("./config/db");

// create express app
const app = express();

// apply middlewares
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === "developement") {
  app.use(morgan("dev"));
}

// Auto register routes
readdirSync("./routes").map((file) =>
  app.use("/api", require(`./routes/${file}`))
);
app.use(errorHandler);

// port
const port = process.env.PORT || 8000;

(async () => {
  await connectDB();
  app.listen(port, console.log(`server is running on ${port}`));
})();
