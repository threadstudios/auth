const mailer = require("@threadws/mailer");
const config = require("./config")();

module.exports.sendVerification = params =>
  mailer.sendMail({
    variables: params,
    to: params.email,
    text: params.text,
    from: config.emailFrom,
    subject: config.verificationEmailSubject,
    template: config.verificationEmailTemplate
  });
