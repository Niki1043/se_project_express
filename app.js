const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const routes = require("./routes");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15mins
  max: 100, // Limit each IP to 100 requests per 15min window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const { PORT = 3001 } = process.env;

const app = express();

// connect to MongoDB server
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use(limiter);
app.use(helmet());

app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
