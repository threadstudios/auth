require("dotenv").config();
require("../src/config")(require("../__fixtures__/config"));
const register = require("../src/actions/register");
const reset = require("../src/actions/resetPassword");

beforeAll(async done => {
  await register({
    email: "resettest@example.com",
    password: "sosig",
    firstName: "Reset",
    lastName: "Test"
  });
  done();
});

test("It should reject if not passed an e-mail address", async done => {
  try {
    await reset("notAnEmail");
  } catch (e) {
    expect(e.name).toBe("ResetValidationError");
    done();
  }
});

test("It should reject if the user is not found", async done => {
  try {
    await reset("sosig@sos.ig");
  } catch (e) {
    expect(e.name).toBe("ResetUserNotFoundError");
    done();
  }
});

test("It should generate a redeemable token for the user", async done => {
  const result = await reset("resettest@example.com");
  expect(result).toBeTruthy();
  done();
});
