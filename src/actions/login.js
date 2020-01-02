const { isValid } = require("@threadws/validator");
const { sql, q } = require("@threadws/puresql");
const bcrypt = require("bcrypt");
const userLoginModel = require("../model/userLogin");
const {
  LoginValidationError,
  LoginUserNotFoundError,
  LoginPasswordIncorrectError
} = require("../exceptions/login");

const qAuth = q.authUser;

module.exports = async userDetails => {
  const userValidation = isValid(userLoginModel, userDetails);
  if (!userValidation.isValid) {
    throw new LoginValidationError(userValidation);
  }
  const user = await sql.getFirst(qAuth.getByEmail, {
    email: userDetails.email
  });
  if (!user) {
    throw new LoginUserNotFoundError();
  }
  const valid = await bcrypt.compare(userDetails.password, user.password);
  const login = await sql.execute(qAuth.registerLogin, {
    userId: user.id,
    success: valid
  });
  if (!valid) {
    throw new LoginPasswordIncorrectError({ loginId: login.insertId });
  }
  return user.id;
};
