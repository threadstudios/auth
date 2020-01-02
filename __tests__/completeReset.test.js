require("dotenv").config();
const { sql, q } = require("@threadws/puresql");
const { toMySQL, addDays } = require("@threadws/date");
const completeReset = require("../src/actions/completeReset");
const login = require("../src/actions/login");

const qAuth = q.authUser;
const token = "REDEEMABLE_PASSWORD_RESET";
const oldPassword = "cakeisalie";
const newPassword = "lieisacake";

beforeAll(async done => {
  await sql.execute(qAuth.register, {
    id: "TEST_RESET_USER_2",
    firstName: "Paul",
    lastName: "Westerdale",
    email: "password.reset@example.com",
    password: oldPassword,
    profile: "{}"
  });
  await sql.execute(qAuth.createPasswordResetToken, {
    userId: "TEST_RESET_USER_2",
    token,
    expiry: toMySQL(addDays(new Date(), 1))
  });
  done();
});

test("Should allow me to reset my password with a valid token", async done => {
  const reset = await completeReset({
    password: newPassword,
    token
  });
  expect(reset).toBe(true);
  const loginResult = login({
    email: "password.reset@example.com",
    password: newPassword
  });
  expect(loginResult).toBeDefined();
  done();
});
