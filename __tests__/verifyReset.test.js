require("dotenv").config();
const { sql, q } = require("@threadws/puresql");
const { toMySQL, addDays, subDays } = require("@threadws/date");
const verify = require("../src/actions/verifyReset");

const qAuth = q.authUser;
const openToken = "OPEN_TOKEN_TEST";
const expiredToken = "EXPIRED_TOKEN_TEST";
const usedToken = "ALREADY_USED_TOKEN_TEST";

beforeAll(async done => {
  await sql.execute(qAuth.register, {
    id: "TEST_RESET_USER",
    firstName: "Paul",
    lastName: "Westerdale",
    email: "test@example.com",
    password: "cakeisalie",
    profile: "{}"
  });
  await sql.execute(qAuth.createPasswordResetToken, {
    userId: "TEST_RESET_USER",
    token: openToken,
    expiry: toMySQL(addDays(new Date(), 1))
  });
  await sql.execute(qAuth.createPasswordResetToken, {
    userId: "TEST_RESET_USER",
    token: expiredToken,
    expiry: toMySQL(subDays(new Date(), 1))
  });
  await sql.execute(qAuth.createPasswordResetToken, {
    userId: "TEST_RESET_USER",
    token: usedToken,
    expiry: toMySQL(subDays(new Date(), 1))
  });
  await sql.execute(qAuth.setPasswordResetComplete, {
    token: usedToken
  });
  done();
});

test("Should verify a password reset token", async done => {
  const verifyResult = await verify(openToken);
  expect(verifyResult).toBeDefined();
  done();
});

test("Should throw if the verification token is expired", async done => {
  try {
    await verify(expiredToken);
  } catch (e) {
    expect(e.statusCode).toBe(400);
    expect(e.name).toBe("ResetTokenExpiredError");
    done();
  }
});

test("Should throw if not passed a token", async done => {
  try {
    await verify();
  } catch (e) {
    expect(e.statusCode).toBe(422);
    expect(e.name).toBe("ResetValidationError");
    done();
  }
});

test("Should throw if passed an invalid token", async done => {
  try {
    await verify("NOTAVALIDTOKEN");
  } catch (e) {
    expect(e.statusCode).toBe(404);
    expect(e.name).toBe("ResetNotFoundError");
    done();
  }
});

test("Should throw if the reset token has already been used", async done => {
  try {
    await verify(usedToken);
  } catch (e) {
    expect(e.statusCode).toBe(400);
    expect(e.name).toBe("ResetAlreadyCompleteError");
    done();
  }
});

afterAll(() => {
  sql.connection.end();
});
