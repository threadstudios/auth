const { sql, q } = require("@threadws/puresql");
const { isValid } = require("@threadws/validator");
const bcrypt = require("bcrypt");
const { ResetValidationError } = require("../exceptions/resetPassword");
const passwordReset = require("../model/passwordReset");
const verifyReset = require("./verifyReset");

const qAuth = q.authUser;

module.exports = async params => {
  const validReset = isValid(passwordReset, params);
  if (!validReset.isValid) {
    throw new ResetValidationError(validReset);
  }
  const { token, password } = params;
  const reset = await verifyReset(token);
  await sql.execute(qAuth.setPasswordResetComplete, { token });
  const newPassword = await bcrypt.hash(
    password,
    Number(process.env.SALT_ROUNDS)
  );
  await sql.execute(qAuth.setNewUserPassword, {
    password: newPassword,
    id: reset.userId
  });
  return true;
};
