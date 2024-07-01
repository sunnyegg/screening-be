const puppeteer = require("puppeteer");
const utils = require("../utils");
const wss = require("../configs/websocket");
const logger = require("../utils/logger");

module.exports = {
  comment: async (urls, type, username) => {
    try {
      const output = new Map();

      const browser = await puppeteer.launch({
        headless: false,
        // executablePath: "/usr/bin/google-chrome",
        args: [
          "--disable-gpu",
          "--disable-dev-shm-usage",
          "--disable-setuid-sandbox",
          "--no-sandbox",
        ],
        userDataDir: "./userData",
      });

      const mappedUrls = utils.CheckAndSplitUrls(urls);

      for (let i = 0; i < mappedUrls.yt.length; i++) {
        const url = mappedUrls.yt[i];
        await utils.CheckYoutubeComments(browser, url, output);
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
      logger("error", `${type}: ${err.message}`);
    }
  },
};
