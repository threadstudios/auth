const { isValid } = require("@threadws/validator");
const { sql, q } = require("@threadws/puresql");
const { addDays, toMySQL } = require("@threadws/date");
const bcrypt = require("bcrypt");
const v4 = require("uuid/v4");
const newUserModel = require("../model/newUser");
const { sendVerification } = require("../email");
const config = require("../config")();
const {
  RegistrationValidationError,
  RegistrationUserExistsError
} = require("../exceptions/register");

const qAuth = q.authUser;

module.exports = async userDetails => {
  const userValidation = isValid(newUserModel, userDetails);
  if (!userValidation.isValid) {
    throw new RegistrationValidationError(userValidation);
  }
  const userExists = await sql.getFirst(qAuth.getByEmail, {
    email: userDetails.email
  });
  if (userExists) {
    throw new RegistrationUserExistsError(userExists);
  }
  const password = await bcrypt.hash(
    userDetails.password,
    Number(process.env.SALT_ROUNDS)
  );
  const userId = v4();
  const user = await sql.combine(
    sql.execute(qAuth.register, {
      id: userId,
      ...userDetails,
      password,
      profile: "{}"
    }),
    () => sql.getFirst(qAuth.getById, { id: userId })
  );
  const verification = await sql.combine(
    sql.execute(qAuth.createVerification, {
      userId: user.id,
      email: user.email,
      token: v4(),
      expiry: toMySQL(addDays(new Date(), config.verificationExpiry))
    }),
    ({ insertId }) => sql.getFirst(qAuth.getVerificationById, { id: insertId })
  );
  await sendVerification({
    email: user.email,
    firstName: user.firstName,
    token: verification.token
  });
  return user;
};
