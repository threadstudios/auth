/* eslint-disable max-classes-per-file */
const { AppError } = require("@threadws/exceptions");

const isProd = process.env.NODE_ENV === "production";

class ResetValidationError extends AppError {
  constructor(details) {
    super({
      message: "Could not validate password reset details",
      code: 422,
      details
    });
  }
}

class ResetUserNotFoundError extends AppError {
  constructor() {
    super({
      message: isProd
        ? "Reset Error"
        : "Could not find a user with this e-mail address",
      code: isProd ? 400 : 404
    });
  }
}

class ResetAlreadyCompleteError extends AppError {
  constructor() {
    super({
      message: isProd
        ? "Reset Error"
        : "This Password Reset has already been completed",
      code: 400
    });
  }
}

class ResetTokenExpiredError extends AppError {
  constructor() {
    super({
      message: isProd ? "Reset Error" : "This Reset token has expired",
      code: 400
    });
  }
}

class ResetNotFoundError extends AppError {
  constructor() {
    super({
      message: isProd ? "Reset Error" : "Reset token not found",
      code: isProd ? 400 : 404
    });
  }
}

module.exports = {
  ResetValidationError,
  ResetUserNotFoundError,
  ResetAlreadyCompleteError,
  ResetTokenExpiredError,
  ResetNotFoundError
};
