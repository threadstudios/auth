const { sql, q } = require("@threadws/puresql");
const { format } = require("@threadws/date");
const {
  ResetAlreadyCompleteError,
  ResetNotFoundError,
  ResetTokenExpiredError,
  ResetValidationError
} = require("../exceptions/resetPassword");

const qAuth = q.authUser;

module.exports = async token => {
  if (!token) {
    throw new ResetValidationError();
  }
  const reset = await sql.getFirst(qAuth.getPasswordResetByToken, {
    token
  });
  if (!reset) {
    throw new ResetNotFoundError();
  }
  if (reset.success === 1) {
    throw new ResetAlreadyCompleteError();
  }
  const expiry = format(reset.expiry, "t");
  if (expiry < format(Date.now(), "t")) {
    throw new ResetTokenExpiredError();
  }
  return reset;
};
