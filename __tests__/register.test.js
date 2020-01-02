require("dotenv").config();
const { sql } = require("@threadws/puresql");
require("../src/config")(require("../__fixtures__/config"));
const register = require("../src/actions/register");

test("It throws if provided insuffecient information", async done => {
  const userDetails = {
    email: "paul@example.com",
    password: "thecakeisalie"
  };
  try {
    await register(userDetails);
  } catch (e) {
    expect(e.statusCode).toBe(422);
    expect(e.name).toBe("RegistrationValidationError");
    expect(e.details.isValid).toBe(false);
    done();
  }
});

test("It will create a user if the validation passes", async done => {
  const userDetails = {
    email: "paul@westerdale.me",
    password: "thecakeisalie",
    firstName: "Paul",
    lastName: "Westerdale"
  };
  const registerResult = await register(userDetails);
  expect(registerResult.id).toBeDefined();
  expect(registerResult.firstName).toBe(userDetails.firstName);
  done();
});

test("It throws if the user already exists", async done => {
  try {
    const userDetails = {
      email: "paul@westerdale.me",
      password: "thecakeisalie",
      firstName: "Paul",
      lastName: "Westerdale"
    };
    await register(userDetails);
  } catch (e) {
    expect(e.name).toBe("RegistrationUserExistsError");
    done();
  }
});

afterAll(() => {
  sql.connection.end();
});
