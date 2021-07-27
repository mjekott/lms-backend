const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { readdirSync } = require("fs");
const csurf = require("csurf");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/errorHandler");
require("dotenv").config({ path: "./config/config.env" });

const connectDB = require("./config/db");
const csrfProtection = csurf({ cookie: true });

// create express app
const app = express();

// apply middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());
if (process.env.NODE_ENV === "developement") {
  app.use(morgan("dev"));
}

// Auto register routes
readdirSync("./routes").map((file) =>
  app.use("/api", require(`./routes/${file}`))
);

app.use(csrfProtection);
app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use(errorHandler);

// port
const port = process.env.PORT || 8000;

(async () => {
  await connectDB();
  app.listen(port, console.log(`server is running on ${port}`));
})();
