module.exports = {
  verification: {
    emailTemplate: `${__dirname}/../__fixtures__/verificationTemplate.njk`,
    expiration: 2
  },
  jwt: {
    issuer: "threadauth"
  },
  passwordReset: {
    emailSubject: "Password Reset",
    emailTemplate: `${__dirname}/../__fixtures__/verificationTemplate.njk`,
    expiration: 2
  }
};
