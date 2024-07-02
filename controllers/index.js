const puppeteer = require("puppeteer");
const puppeteerArgs = require("../configs/puppeteer");
const logger = require("../utils/logger");
const types = require("../configs/types");
const { youtube, instagram } = require("../usecases");
const { IsIgLink, IsTiktokLink, IsYoutubeLink, Delay } = require("../utils");

module.exports = {
  screening: async (data, socketUser, wss) => {
    try {
      const { urls, type, username } = JSON.parse(data.toString());

      if (!Array.isArray(urls)) {
        throw new Error(`urls is not recognized`);
      }

      if (!urls.length) {
        throw new Error(`urls is empty`);
      }

      if (!types.screeningTypes().has(type)) {
        throw new Error(`screening type: ${type} - is not recognized`);
      }

      if (!username) {
        throw new Error("username is empty");
      }

      const instagramUrls = [];
      const tiktokUrls = [];
      const youtubeUrls = [];
      for (const u of urls) {
        if (IsIgLink(u)) instagramUrls.push(u);
        if (IsTiktokLink(u)) tiktokUrls.push(u);
        if (IsYoutubeLink(u)) youtubeUrls.push(u);
      }

      const output = new Map();
      const browser = await puppeteer.launch(puppeteerArgs());

      switch (type) {
        case "comment":
          if (youtubeUrls.length) {
            await youtube.comment(
              browser,
              output,
              youtubeUrls,
              type,
              username,
              wss
            );
          }
          break;

        case "like":
          if (instagramUrls.length) {
            await instagram.like(
              browser,
              output,
              instagramUrls,
              type,
              username,
              wss
            );
          }
          if (youtubeUrls.length) {
            await youtube.like(
              browser,
              output,
              youtubeUrls,
              type,
              username,
              wss
            );
          }
          break;

        case "subscriber":
          if (youtubeUrls.length) {
            await youtube.subscriber(
              browser,
              output,
              youtubeUrls,
              type,
              username,
              wss
            );
          }
          break;

        case "view":
          if (youtubeUrls.length) {
            await youtube.view(
              browser,
              output,
              youtubeUrls,
              type,
              username,
              wss
            );
          }
          break;

        default:
          break;
      }

      await Delay(1000);
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
      const { username } = JSON.parse(data.toString());
      if (username && socketUser[username]) {
        socketUser[username].send(
          JSON.stringify({
            type: "error",
            data: err.message,
          })
        );
      }
      logger("error", `error ${id}: ${err.message}`);
    }
  },
};
