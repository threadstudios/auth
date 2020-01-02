const { sql, q } = require("@threadws/puresql");
const { format } = require("@threadws/date");
const { VerifyTokenExpiredError } = require("../exceptions/verify");

const qAuth = q.authUser;

module.exports = async token => {
  const verification = await sql.getFirst(qAuth.getVerificationByToken, {
    token
  });
  if (verification.success === 1) {
    return true;
  }
  const expiry = format(verification.expiry, "t");
  if (expiry < format(Date.now(), "t")) {
    throw new VerifyTokenExpiredError();
  }
  await sql.execute(qAuth.setVerificationComplete, { id: verification.id });
  await sql.execute(qAuth.setUserVerified, { id: verification.userId });
  return true;
};
