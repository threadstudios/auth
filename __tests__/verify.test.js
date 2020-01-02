require("dotenv").config();
const { sql, q } = require("@threadws/puresql");
const { toMySQL, addDays, subDays } = require("@threadws/date");
const verify = require("../src/actions/verifyUser");

const qAuth = q.authUser;
const openToken = "OPEN_TOKEN_TEST";
const expiredToken = "EXPIRED_TOKEN_TEST";

beforeAll(async done => {
  await sql.execute(qAuth.register, {
    id: "TEST_VERIFY_USER",
    firstName: "Paul",
    lastName: "Westerdale",
    email: "test@example.com",
    password: "cakeisalie",
    profile: "{}"
  });
  await sql.execute(qAuth.createVerification, {
    userId: "TEST_VERIFY_USER",
    email: "test@example.com",
    token: openToken,
    expiry: toMySQL(addDays(new Date(), 1))
  });
  await sql.execute(qAuth.createVerification, {
    userId: "TEST_VERIFY_USER",
    email: "test@example.com",
    token: expiredToken,
    expiry: toMySQL(subDays(new Date(), 1))
  });
  done();
});

test("Should verify a token and set the associated user to be verified", async done => {
  const verifyResult = await verify(openToken);
  expect(verifyResult).toBe(true);
  const user = await sql.getFirst(qAuth.getById, { id: "TEST_VERIFY_USER" });
  expect(user.state).toBe("verified");
  done();
});

test("Should throw if the verification token is expired", async done => {
  try {
    await verify(expiredToken);
  } catch (e) {
    expect(e.statusCode).toBe(400);
    expect(e.name).toBe("VerifyTokenExpiredError");
    done();
  }
});

afterAll(() => {
  sql.connection.end();
});
