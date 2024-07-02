const utils = require("../utils");
const logger = require("../utils/logger");
const puppeteerArgs = require("../configs/puppeteer");
const models = require("../models");

module.exports = {
  comment: async (browser, output, urls, type, username, wss) => {
    try {
      const mappedUrls = utils.CheckAndSplitUrls(urls);

      for (let i = 0; i < mappedUrls.yt.length; i++) {
        const url = mappedUrls.yt[i];
        await models.youtube.CheckYoutubeComments(browser, url, output);
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
  like: async (browser, output, urls, type, username, wss) => {
    try {
      const mappedUrls = utils.CheckAndSplitUrls(urls);

      for (let i = 0; i < mappedUrls.yt.length; i++) {
        const url = mappedUrls.yt[i];
        await models.youtube.CheckYoutubeLikes(browser, url, output);
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
  subscriber: async (browser, output, urls, type, username, wss) => {
    try {
      const mappedUrls = utils.CheckAndSplitUrls(urls);

      for (let i = 0; i < mappedUrls.yt.length; i++) {
        const url = mappedUrls.yt[i];
        await models.youtube.CheckYoutubeSubscribers(browser, url, output);
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
  view: async (browser, output, urls, type, username, wss) => {
    try {
      const mappedUrls = utils.CheckAndSplitUrls(urls);

      for (let i = 0; i < mappedUrls.yt.length; i++) {
        const url = mappedUrls.yt[i];
        await models.youtube.CheckYoutubeViews(browser, url, output);
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
