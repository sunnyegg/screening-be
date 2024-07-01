const puppeteer = require("puppeteer");
const utils = require("../utils");
const logger = require("../utils/logger");
const puppeteerArgs = require("../configs/puppeteer");
const models = require("../models");

module.exports = {
  comment: async (urls, type, username, wss) => {
    try {
      const output = new Map();
      const mappedUrls = utils.CheckAndSplitUrls(urls);
      const browser = await puppeteer.launch(puppeteerArgs());

      for (let i = 0; i < mappedUrls.yt.length; i++) {
        const url = mappedUrls.yt[i];
        await models.youtube.CheckYoutubeComments(browser, url, output);
      }
      await browser.close();

      const sent = wss.emit(
        "screening",
        JSON.stringify({
          type,
          data: Object.fromEntries(output),
          username,
        })
      );

      logger("log", `${type}: ${sent}`);
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
  like: async (urls, type, username, wss) => {
    try {
      const output = new Map();
      const mappedUrls = utils.CheckAndSplitUrls(urls);
      const browser = await puppeteer.launch(puppeteerArgs());

      for (let i = 0; i < mappedUrls.yt.length; i++) {
        const url = mappedUrls.yt[i];
        await models.youtube.CheckYoutubeLikes(browser, url, output);
      }
      await browser.close();

      const sent = wss.emit(
        "screening",
        JSON.stringify({
          type,
          data: Object.fromEntries(output),
          username,
        })
      );

      logger("log", `${type}: ${sent}`);
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
  subscriber: async (urls, type, username, wss) => {
    try {
      const output = new Map();
      const mappedUrls = utils.CheckAndSplitUrls(urls);
      const browser = await puppeteer.launch(puppeteerArgs());

      for (let i = 0; i < mappedUrls.yt.length; i++) {
        const url = mappedUrls.yt[i];
        await models.youtube.CheckYoutubeSubscribers(browser, url, output);
      }
      await browser.close();

      const sent = wss.emit(
        "screening",
        JSON.stringify({
          type,
          data: Object.fromEntries(output),
          username,
        })
      );

      logger("log", `${type}: ${sent}`);
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
  view: async (urls, type, username, wss) => {
    try {
      const output = new Map();
      const mappedUrls = utils.CheckAndSplitUrls(urls);
      const browser = await puppeteer.launch(puppeteerArgs());

      for (let i = 0; i < mappedUrls.yt.length; i++) {
        const url = mappedUrls.yt[i];
        await models.youtube.CheckYoutubeViews(browser, url, output);
      }
      await browser.close();

      const sent = wss.emit(
        "screening",
        JSON.stringify({
          type,
          data: Object.fromEntries(output),
          username,
        })
      );

      logger("log", `${type}: ${sent}`);
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
