const { AppError } = require("@threadws/exceptions");

class VerifyTokenExpiredError extends AppError {
  constructor(details) {
    super({
      message: "The verify token has expired",
      code: 400,
      details
    });
  }
}

module.exports = {
  VerifyTokenExpiredError
};
