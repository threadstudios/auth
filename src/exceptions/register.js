/* eslint-disable max-classes-per-file */
const { AppError } = require("@threadws/exceptions");

class RegistrationValidationError extends AppError {
  constructor(details) {
    super({
      message: "An error occurred whilst validating your user",
      code: 422,
      details
    });
  }
}

class RegistrationUserExistsError extends AppError {
  constructor(details) {
    super({
      message: "This user is already registered",
      code: 409,
      details
    });
  }
}

module.exports = {
  RegistrationValidationError,
  RegistrationUserExistsError
};
