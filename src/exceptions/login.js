/* eslint-disable max-classes-per-file */
const { AppError } = require("@threadws/exceptions");

const isProd = process.env.NODE_ENV === "production";
class LoginValidationError extends AppError {
  constructor(details) {
    super({
      message: "Could not validate login details",
      code: 422,
      details
    });
  }
}

class LoginUserNotFoundError extends AppError {
  constructor() {
    super({
      message: isProd
        ? "Login Error"
        : "Could not find a user with this e-mail address",
      code: isProd ? 400 : 404
    });
  }
}

class LoginPasswordIncorrectError extends AppError {
  constructor(details) {
    super({
      message: isProd ? "Login Error" : "User password is not correct",
      code: isProd ? 400 : 404,
      details
    });
  }
}

module.exports = {
  LoginValidationError,
  LoginUserNotFoundError,
  LoginPasswordIncorrectError
};
