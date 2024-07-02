const utils = require("../utils");
const logger = require("../utils/logger");
const models = require("../models");

module.exports = {
  like: async (browser, output, urls, type, username, wss) => {
    try {
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        await models.instagram.CheckInstagramLikes(browser, url, output);
        wss.emit(
          "progress",
          JSON.stringify({
            type: "progress",
            data: 5,
            username,
          })
        );
      }
    } catch (err) {
      wss.emit(
        "usecases-error",
        JSON.stringify({
          message: err.message,
          username,
        })
      );
      logger("error", `${type}: ${err.message}`);
    }
  },
};
