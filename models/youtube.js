const logger = require("../utils/logger");
const utils = require("../utils");

module.exports = {
  CheckYoutubeComments: async (browser, url, output) => {
    try {
      const page = await browser.newPage();
      await page.goto(url);
      await page.setViewport({ width: 1366, height: 768 });
      await page.waitForNetworkIdle();

      await page.evaluate(async () => {
        window.scrollBy(0, window.innerHeight / 2);
      });

      const element = await page.waitForSelector(
        "#count > yt-formatted-string > span:nth-child(1)"
      );

      const text = await element.evaluate((el) => el.textContent);
      const convertedText = utils.ConvertTextToNumber(text, "");

      output.set(url, convertedText);
    } catch (err) {
      logger("error", err.message);
      output.set(url, "error => " + err.message);
    }
  },
  CheckYoutubeLikes: async (browser, url, output) => {
    try {
      const page = await browser.newPage();
      await page.goto(url);
      await page.setViewport({ width: 1080, height: 1024 });
      await page.waitForNetworkIdle();

      const element = await page.waitForSelector(
        "#factoids > factoid-renderer:nth-child(1) > div > span.YtwFactoidRendererValue > span"
      );

      const text = await element.evaluate((el) => el.textContent);
      const convertedText = utils.DigitFormatter(text);

      output.set(url, convertedText);
    } catch (err) {
      logger("error", err.message);
      output.set(url, "error => " + err.message);
    }
  },
  CheckYoutubeSubscribers: async (browser, url, output) => {
    try {
      const page = await browser.newPage();
      await page.goto(url);
      await page.setViewport({ width: 1080, height: 1024 });
      await page.waitForNetworkIdle();

      const element = await page.waitForSelector("#subscriber-count");

      const text = await element.evaluate((el) => el.textContent);
      const convertedText = utils.DigitFormatter(
        text.replace("subscribers", "")
      );

      output.set(url, convertedText);
    } catch (err) {
      logger("error", err.message);
      output.set(url, "error => " + err.message);
    }
  },
  CheckYoutubeViews: async (browser, url, output) => {
    try {
      const page = await browser.newPage();
      await page.goto(url);
      await page.setViewport({ width: 1080, height: 1024 });
      await page.waitForNetworkIdle();

      await page.waitForSelector("#bottom-row", {
        timeout: 1000,
      });
      await page.click("#bottom-row");

      const element = await page.waitForSelector("#info > span:nth-child(1)");

      const text = await element.evaluate((el) => el.textContent);
      const convertedText = utils.ConvertTextToNumber(text, "views");

      output.set(url, convertedText);
    } catch (err) {
      logger("error", err.message);
      output.set(url, "error => " + err.message);
    }
  },
};
