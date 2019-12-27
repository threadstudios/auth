require("dotenv").config();
const config = require("../src/config")(require("../__fixtures__/config"));
const generateToken = require("../src/actions/generateToken");
const verifyToken = require("../src/actions/verifyToken");

test("Generates a valid JWT", () => {
  const jwt = generateToken("TEST_USER_ID");
  const token = verifyToken(jwt);
  expect(token.uid).toBe("TEST_USER_ID");
  expect(token.iss).toBe(config.jwt.issuer);
});

test("Requires a valid *signed* JWT", () => {
  const badVerify = () => {
    const dummyToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    verifyToken(dummyToken);
  };
  expect(badVerify).toThrow();
});
