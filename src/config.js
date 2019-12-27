const { AppException } = require("@threadws/exceptions");

class Config {
  constructor(params) {
    const required = ["verificationEmailTemplate", "verificationExpiry"].filter(
      req => {
        return !params[req];
      }
    );
    if (required.length) {
      throw new AppException({
        message: `Missing ${required.join(", ")} configuration for auth`
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
