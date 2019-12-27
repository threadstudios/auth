const { verify } = require("jsonwebtoken");

module.exports = token => {
  return verify(token, process.env.JWT_SECRET);
};
