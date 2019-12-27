const { AppException } = require("@threadws/exceptions");
const { isValid } = require("@threadws/validator");

class Config {
  constructor(params) {
    const valid = [
      isValid(
        {
          emailTemplate: "isRequired",
          expiration: "isRequired"
        },
        params.verification
      ),
      isValid(
        {
          issuer: "isRequired"
        },
        params.jwt
      )
    ].reduce((acc, validity) => {
      if (!validity.isValid) {
        acc.push(...Object.keys(validity.errorFields));
      }
      return acc;
    }, []);
    if (valid.length) {
      throw new AppException({
        message: `Missing ${valid.join(", ")} configuration for auth`
      });
    }
    this.settings = { ...params };
  }
}

let configStore;

module.exports = config => {
  configStore = !configStore ? new Config(config) : configStore;
  return configStore.settings;
};
