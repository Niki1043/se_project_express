const jwt = require("jsonwebtoken");
require("dotenv").config();

const { JWT_SECRET = "dev-secret" } = process.env;
const UnauthorizedError = require("../errors/UnauthorizedError");
// const JWT_SECRET = require("../utils/config");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authorization required"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError("Authorization required"));
  }

  req.user = payload;
  return next();
};
