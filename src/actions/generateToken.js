const { sign } = require("jsonwebtoken");
const config = require("../config")();

module.exports = id => {
  return sign({ uid: id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
    issuer: config.jwt.issuer
  });
};
