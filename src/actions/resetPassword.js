const v4 = require("uuid/v4");
const { isValid } = require("@threadws/validator");
const { sql, q } = require("@threadws/puresql");
const { toMySQL, addDays } = require("@threadws/date");
const config = require("../config")();
const userReset = require("../model/userReset");
const { sendPasswordReset } = require("../email");

const {
  ResetValidationError,
  ResetUserNotFoundError
} = require("../exceptions/resetPassword");

const qAuth = q.authUser;

module.exports = async email => {
  const validUser = isValid(userReset, { email });
  if (!validUser.isValid) {
    throw new ResetValidationError(validUser);
  }
  const user = await sql.getFirst(qAuth.getByEmail, { email });
  if (!user) {
    throw new ResetUserNotFoundError();
  }
  const token = v4();
  const expiry = toMySQL(addDays(new Date(), config.passwordReset.expiration));
  await sql.execute(qAuth.createPasswordResetToken, {
    userId: user.id,
    token,
    expiry
  });
  sendPasswordReset({
    email: user.email,
    token
  });
  return true;
};
