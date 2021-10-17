const Environment = require("jest-environment-node");

module.exports = class CustomTestEnvironment extends Environment {
  async setup() {
    await super.setup();
    if (typeof this.global.TextEncoder === "undefined") {
      const { TextEncoder } = require("util");
      this.global.TextEncoder = TextEncoder;
    }
  }
};

//this file was done to try fix problem with TexEncoder but does not work
