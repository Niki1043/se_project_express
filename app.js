const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");

const { PORT = 3001 } = process.env;

const app = express();

// connect to MongoDB server
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));

app.use(express.json());

// Add Middleware
app.use((req, res, next) => {
  req.user = {
    _id: "643f18dd19131b26d4ffbf42", // paste the _id of the test user created in the previous step
  };
  next();
});

app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
