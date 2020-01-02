require("dotenv").config();
require("../src/config")(require("../__fixtures__/config"));
const register = require("../src/actions/register");
const login = require("../src/actions/login");

beforeAll(async done => {
  await register({
    email: "logintest@example.com",
    password: "cakeisalie",
    firstName: "Login",
    lastName: "Test"
  });
  done();
});

test("Errors if the data does not pass validation", async done => {
  try {
    await login({ email: "cake@example.com" });
  } catch (e) {
    expect(e.name).toBe("LoginValidationError");
    done();
  }
});

test("Errors if the user does not exist", async done => {
  try {
    await login({
      email: "cake@example.com",
      password: "lies"
    });
  } catch (e) {
    expect(e.name).toBe("LoginUserNotFoundError");
    done();
  }
});

test("Errors if the password is not correct", async done => {
  try {
    await login({
      email: "logintest@example.com",
      password: "lies"
    });
  } catch (e) {
    expect(e.name).toBe("LoginPasswordIncorrectError");
    done();
  }
});

test("Logs the user in correctly and returns the user ID", async done => {
  const loginResult = await login({
    email: "logintest@example.com",
    password: "cakeisalie"
  });
  expect(loginResult).toBeDefined();
  done();
});
