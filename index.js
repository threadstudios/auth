/* eslint-disable global-require */
const { Router } = require("express");
const { json } = require("body-parser");
const { mapExceptionToResponse } = require("@threadws/exceptions");
const { q } = require("@threadws/puresql");
const config = require("./src/config");

const serveError = (e, res) => {
  const { status, message, detail } = mapExceptionToResponse(e);
  res.status(status).send({
    message,
    detail
  });
};

module.exports = options => {
  config(options);
  q.addQueries("authUser", `${__dirname}/sql/authUser.sql`);
  const register = require("./src/actions/register");
  const verifyUser = require("./src/actions/verifyUser");

  const authRouter = new Router();

  authRouter.use(json());

  authRouter.put("/register", async (req, res) => {
    try {
      const registerResult = await register(req.body);
      res.send(registerResult);
    } catch (e) {
      serveError(e, res);
    }
  });

  authRouter.get("/verify/:token", async (req, res) => {
    try {
      const verifyResult = await verifyUser(req.params.token);
      res.send(verifyResult);
    } catch (e) {
      serveError(e, res);
    }
  });
  return authRouter;
};
